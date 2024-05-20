import { Sequelize } from "sequelize-typescript";
import { validate } from "uuid";
import ClientCheckoutModel from "../repository/client.model";
import ProductCheckoutModel from "../repository/product.model";
import OrderModel from "../repository/order.model";
import OrderProductModel from "../repository/order-product.model";
import CheckoutFacadeFactory from "../factory/facade.factory";
import { PlaceOrderFacadeInputDto } from "./checkout.facade.interface";
import ClientModel from "../../client-adm/repository/client.model";
import ProductAdmModel from "../../product-adm/repository/product.model";
import ProductCatalogModel from "../../store-catalog/repository/product.model";
import { Umzug } from "umzug";
import { migrator } from "../../../infrastructure/db/config-migrations/migrator";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import TransactionModel from "../../payment/repository/transaction.model";

describe('CheckoutFacade test', () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [
        ClientModel,
        InvoiceItemModel,
        InvoiceModel,
        TransactionModel,
        ProductAdmModel,
        ProductCatalogModel,
        OrderModel,
        ClientCheckoutModel,
        ProductCheckoutModel,
        OrderProductModel,
        ClientModel,
      ],
    });
    migration = migrator(sequelize)
    await migration.up()
  })

  afterAll(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it('should place an order', async () => {
    const checkoutFacade = CheckoutFacadeFactory.create()

    await ProductCheckoutModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 10,
    })

    await ProductCheckoutModel.create({
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      salesPrice: 20,
    })

    await ClientCheckoutModel.create({
      id: '1',
      name: 'Client 1',
      email: 'client@email.com',
      document: '123456789',
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345678',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const input: PlaceOrderFacadeInputDto = {
      clientId: '1',
      products: [
        { productId: '1' },
        { productId: '2' },
      ],
    }

    const result = await checkoutFacade.placeOrder(input)

    expect(validate(result.id)).toBe(true)
    expect(validate(result.invoiceId)).toBe(true)
    expect(result.status).toBe('approved')
    expect(result.total).toBe(30)
    expect(result.products.length).toBe(2)
    expect(result.products[0].productId).toBe('1')
    expect(result.products[1].productId).toBe('2')
  })
})