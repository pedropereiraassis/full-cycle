import { Sequelize } from "sequelize-typescript";
import ClientModel from "./client.model";
import ProductModel from "./product.model";
import OrderModel from "./order.model";
import CheckoutRepository from "./checkout.repository";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";

describe('CheckoutRepository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [
        ClientModel,
        ProductModel,
        OrderModel,
      ],
      sync: { force: true },
    });

    await sequelize.sync();
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it('should find an order', async () => {
    const order = await OrderModel.create({
      id: '1',
      status: 'pending',
      client: {
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
      },
      products: [
        {
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          salesPrice: 10,
        },
        {
          id: '2',
          name: 'Product 2',
          description: 'Description 2',
          salesPrice: 20,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      include: ['client', 'products']
    })

    const repository = new CheckoutRepository()
    const result = await repository.findOrder(order.id)

    expect(result.id.id).toEqual(order.id)
    expect(result.status).toEqual(order.status)
    expect(result.client.id.id).toEqual(order.client.id)
    expect(result.client.name).toEqual(order.client.name)
    expect(result.client.email).toEqual(order.client.email)
    expect(result.client.document).toEqual(order.client.document)
    expect(result.client.street).toEqual(order.client.street)
    expect(result.client.number).toEqual(order.client.number)
    expect(result.client.complement).toEqual(order.client.complement)
    expect(result.client.city).toEqual(order.client.city)
    expect(result.client.state).toEqual(order.client.state)
    expect(result.client.zipCode).toEqual(order.client.zipCode)
    expect(result.products[0].id.id).toEqual(order.products[0].id)
    expect(result.products[0].name).toEqual(order.products[0].name)
    expect(result.products[0].description).toEqual(order.products[0].description)
    expect(result.products[0].salesPrice).toEqual(order.products[0].salesPrice)
    expect(result.products[1].id.id).toEqual(order.products[1].id)
    expect(result.products[1].name).toEqual(order.products[1].name)
    expect(result.products[1].description).toEqual(order.products[1].description)
    expect(result.products[1].salesPrice).toEqual(order.products[1].salesPrice)
    expect(result.createdAt).toStrictEqual(order.createdAt)
    expect(result.updatedAt).toStrictEqual(order.updatedAt)
  })

  it('should create an order', async () => {
    const client = new Client({
      id: new Id('1'),
      name: 'Client 1',
      email: 'client@email.com',
      document: '000',
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345678',
    })

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const product1 = new Product({
      id: new Id('1'),
      name: 'Product 1',
      description: 'Description 1',
      salesPrice: 10,
    })

    const product2 = new Product({
      id: new Id('2'),
      name: 'Product 2',
      description: 'Description 2',
      salesPrice: 20,
    })

    await ProductModel.create({
      id: product1.id.id,
      name: product1.name,
      description: product1.description,
      salesPrice: product1.salesPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await ProductModel.create({
      id: product2.id.id,
      name: product2.name,
      description: product2.description,
      salesPrice: product2.salesPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const order = new Order({
      id: new Id('1'),
      client,
      products: [product1, product2],
      status: 'pending',
    })

    const repository = new CheckoutRepository()
    await repository.addOrder(order)

    const result = await OrderModel.findOne({ where: { id: order.id.id }, include: ['client', 'products'] })

    expect(result.dataValues.id).toEqual(order.id.id)
    expect(result.dataValues.status).toEqual(order.status)
    expect(result.dataValues.client.id).toEqual(order.client.id.id)
    expect(result.dataValues.client.name).toEqual(order.client.name)
    expect(result.dataValues.client.email).toEqual(order.client.email)
    expect(result.dataValues.client.document).toEqual(order.client.document)
    expect(result.dataValues.client.street).toEqual(order.client.street)
    expect(result.dataValues.client.number).toEqual(order.client.number)
    expect(result.dataValues.client.complement).toEqual(order.client.complement)
    expect(result.dataValues.client.city).toEqual(order.client.city)
    expect(result.dataValues.client.state).toEqual(order.client.state)
    expect(result.dataValues.client.zipCode).toEqual(order.client.zipCode)
    expect(result.dataValues.products[0].id).toEqual(order.products[0].id.id)
    expect(result.dataValues.products[0].name).toEqual(order.products[0].name)
    expect(result.dataValues.products[0].description).toEqual(order.products[0].description)
    expect(result.dataValues.products[0].salesPrice).toEqual(order.products[0].salesPrice)
    expect(result.dataValues.products[1].id).toEqual(order.products[1].id.id)
    expect(result.dataValues.products[1].name).toEqual(order.products[1].name)
    expect(result.dataValues.products[1].description).toEqual(order.products[1].description)
    expect(result.dataValues.products[1].salesPrice).toEqual(order.products[1].salesPrice)
    expect(result.dataValues.createdAt).toStrictEqual(order.createdAt)
    expect(result.dataValues.updatedAt).toStrictEqual(order.updatedAt)
  })
})