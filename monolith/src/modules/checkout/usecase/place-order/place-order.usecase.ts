import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/payment.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface
  private _productFacade: ProductAdmFacadeInterface
  private _catalogFacade: StoreCatalogFacadeInterface
  private _repository: CheckoutGateway
  private _invoiceFacade: InvoiceFacadeInterface
  private _paymentFacade: PaymentFacadeInterface

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    repository: CheckoutGateway,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface,
  ) {
    this._clientFacade = clientFacade
    this._productFacade = productFacade
    this._catalogFacade = catalogFacade
    this._repository = repository
    this._invoiceFacade = invoiceFacade
    this._paymentFacade = paymentFacade
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.findClient({ id: input.clientId })
    if (!client) {
      throw new Error('Client not found')
    }

    await this.validateProducts(input)

    const products = await Promise.all(
      input.products.map(async (inputProduct) => await this.getProduct(inputProduct.productId))
    )

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
    })

    const order = new Order({
      client: myClient,
      products,
    })

    const payment = await this._paymentFacade.processPayment({
      orderId: order.id.id,
      amount: order.total,
    })

    const invoice =
      payment.status === 'approved' ?
        await this._invoiceFacade.generateInvoice({
          name: client.name,
          document: client.document,
          street: client.street,
          number: client.number,
          complement: client.complement,
          city: client.city,
          state: client.state,
          zipCode: client.zipCode,
          items: products.map((product) => {
            return {
              id: product.id.id,
              name: product.name,
              price: (product.salesPrice || product.purchasePrice),
            }
          })
        }) : null

    payment.status === 'approved' && order.approved()
    await this._repository.addOrder(order)

    return {
      id: order.id.id,
      invoiceId: payment.status === 'approved' ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map(product => {
        return {
          productId: product.id.id,
        }
      })
    }
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error('No products selected')
    }

    for await (const inputProduct of input.products) {
      const product = await this._productFacade.checkStock({
        productId: inputProduct.productId
      })

      if (product.stock <= 0) {
        throw new Error(`Product ${inputProduct.productId} is not available in stock`)
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.findProduct({ id: productId })
    if (!product) {
      throw new Error(`Product not found`)
    }

    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
      purchasePrice: product.purchasePrice,
    }

    return new Product(productProps)
  }
}