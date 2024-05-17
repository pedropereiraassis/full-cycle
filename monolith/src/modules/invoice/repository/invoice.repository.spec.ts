import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import Invoice from "../domain/invoice.entity";
import InvoiceRepository from "./invoice.repository";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItemModel from "./invoice-item.model";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceItem from "../domain/invoice-item.entity";

describe('InvoiceRepository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [InvoiceItemModel, InvoiceModel],
      sync: { force: true },
    });

    await sequelize.sync();
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it('should find a invoice', async () => {
    const invoice = await InvoiceModel.create({
      id: '1',
      name: 'Invoice 1',
      document: '123456789',
      address: {
        street: 'Street 1',
        number: '123',
        complement: 'Complement 1',
        city: 'City 1',
        state: 'State 1',
        zipCode: '12345678',
      },
      items: [
        {
          id: '1',
          name: 'Name 1',
          price: 10,
        },
        {
          id: '2',
          name: 'Name 2',
          price: 20,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      include: 'items'
    })

    const repository = new InvoiceRepository()
    const result = await repository.find(invoice.id)

    expect(result.id.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address.street).toEqual(invoice.address.street)
    expect(result.address.number).toEqual(invoice.address.number)
    expect(result.address.complement).toEqual(invoice.address.complement)
    expect(result.address.city).toEqual(invoice.address.city)
    expect(result.address.state).toEqual(invoice.address.state)
    expect(result.address.zipCode).toEqual(invoice.address.zipCode)
    expect(result.items[0].id.id).toEqual(invoice.items[0].id)
    expect(result.items[0].name).toEqual(invoice.items[0].name)
    expect(result.items[0].price).toEqual(invoice.items[0].price)
    expect(result.items[1].id.id).toEqual(invoice.items[1].id)
    expect(result.items[1].name).toEqual(invoice.items[1].name)
    expect(result.items[1].price).toEqual(invoice.items[1].price)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
  })

  it('should create a invoice', async () => {
    const address = new Address({
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345678',
    })

    const item1 = new InvoiceItem({
      id: new Id('1'),
      name: 'Item 1',
      price: 10,
    })

    const item2 = new InvoiceItem({
      id: new Id('2'),
      name: 'Item 2',
      price: 20,
    })

    const invoice = new Invoice({
      id: new Id('1'),
      name: 'Invoice 1',
      document: '123456789',
      address: address,
      items: [item1, item2],
    });

    const repository = new InvoiceRepository()
    await repository.add(invoice)

    const result = await InvoiceModel.findOne({ where: { id: invoice.id.id }, include: 'items' })

    expect(result.dataValues.id).toEqual(invoice.id.id)
    expect(result.dataValues.name).toEqual(invoice.name)
    expect(result.dataValues.document).toEqual(invoice.document)
    expect(result.dataValues.address.street).toEqual(invoice.address.street)
    expect(result.dataValues.address.number).toEqual(invoice.address.number)
    expect(result.dataValues.address.complement).toEqual(invoice.address.complement)
    expect(result.dataValues.address.city).toEqual(invoice.address.city)
    expect(result.dataValues.address.state).toEqual(invoice.address.state)
    expect(result.dataValues.address.zipCode).toEqual(invoice.address.zipCode)
    expect(result.dataValues.items[0].id).toEqual(invoice.items[0].id.id)
    expect(result.dataValues.items[0].name).toEqual(invoice.items[0].name)
    expect(result.dataValues.items[0].price).toEqual(invoice.items[0].price)
    expect(result.dataValues.items[1].id).toEqual(invoice.items[1].id.id)
    expect(result.dataValues.items[1].name).toEqual(invoice.items[1].name)
    expect(result.dataValues.items[1].price).toEqual(invoice.items[1].price)
    expect(result.dataValues.createdAt).toStrictEqual(invoice.createdAt)
    expect(result.dataValues.updatedAt).toStrictEqual(invoice.updatedAt)
  })
})