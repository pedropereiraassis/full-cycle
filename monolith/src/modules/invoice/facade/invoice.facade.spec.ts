import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/facade.factory";
import InvoiceItemModel from "../repository/invoice-item.model";
import { validate } from "uuid";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";

describe('InvoiceFacade test', () => {
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

  it('should generate an invoice', async () => {
    const invoiceFacade = InvoiceFacadeFactory.create()

    const input = {
      name: 'Invoice 1',
      document: '123456789',
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345678',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 10,
        },
        {
          id: '2',
          name: 'Item 2',
          price: 20,
        }
      ]
    }

    const result = await invoiceFacade.generateInvoice(input)

    expect(validate(result.id)).toBeTruthy()
    expect(result.name).toBe(input.name)
    expect(result.document).toBe(input.document)
    expect(result.street).toBe(input.street)
    expect(result.number).toBe(input.number)
    expect(result.complement).toBe(input.complement)
    expect(result.city).toBe(input.city)
    expect(result.state).toBe(input.state)
    expect(result.zipCode).toBe(input.zipCode)
    expect(result.items[0].id).toBe(input.items[0].id)
    expect(result.items[0].name).toBe(input.items[0].name)
    expect(result.items[0].price).toBe(input.items[0].price)
    expect(result.items[1].id).toBe(input.items[1].id)
    expect(result.items[1].name).toBe(input.items[1].name)
    expect(result.items[1].price).toBe(input.items[1].price)
    expect(result.total).toBe(input.items[0].price + input.items[1].price)
  })

  it('should find an invoice', async () => {
    const invoiceFacade = InvoiceFacadeFactory.create()

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
    })

    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item: InvoiceItem) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        }
      }),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    }, {
      include: 'items',
    })

    const inputFind = { id: invoice.id.id }

    const result = await invoiceFacade.findInvoice(inputFind)

    expect(result.id).toBe(invoice.id.id)
    expect(result.name).toBe(invoice.name)
    expect(result.document).toBe(invoice.document)
    expect(result.address.street).toBe(invoice.address.street)
    expect(result.address.number).toBe(invoice.address.number)
    expect(result.address.complement).toBe(invoice.address.complement)
    expect(result.address.city).toBe(invoice.address.city)
    expect(result.address.state).toBe(invoice.address.state)
    expect(result.address.zipCode).toBe(invoice.address.zipCode)
    expect(result.items[0].id).toBe(invoice.items[0].id.id)
    expect(result.items[0].name).toBe(invoice.items[0].name)
    expect(result.items[0].price).toBe(invoice.items[0].price)
    expect(result.items[1].id).toBe(invoice.items[1].id.id)
    expect(result.items[1].name).toBe(invoice.items[1].name)
    expect(result.items[1].price).toBe(invoice.items[1].price)
    expect(result.total).toBe(item1.price + item2.price)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
  })
})