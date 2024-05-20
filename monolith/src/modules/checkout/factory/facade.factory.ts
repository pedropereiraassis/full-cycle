import ClientAdmFacadeFactory from "../../client-adm/factory/facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/facade.factory";
import PaymentFacadeFactory from "../../payment/factory/facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import CheckoutFacadeInterface from "../facade/checkout.facade.interface";
import CheckoutRepository from "../repository/checkout.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory {
  static create(): CheckoutFacadeInterface {
    const clientFacade = ClientAdmFacadeFactory.create()
    const productFacade = ProductAdmFacadeFactory.create()
    const catalogFacade = StoreCatalogFacadeFactory.create()
    const checkoutRepository = new CheckoutRepository()
    const invoiceFacade = InvoiceFacadeFactory.create()
    const paymentFacade = PaymentFacadeFactory.create()

    const placeOrderUseCase = new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      catalogFacade,
      checkoutRepository,
      invoiceFacade,
      paymentFacade,
    )

    const checkoutFacade = new CheckoutFacade({
      placeOrderUseCase: placeOrderUseCase
    });

    return checkoutFacade;
  }
}