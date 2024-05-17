import FindInvoiceUsecase from "./find-invoice.usecase"
import Invoice from "../../domain/invoice.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Address from "../../../@shared/domain/value-object/address.value-object"
import InvoiceItem from "../../domain/invoice-item.entity"

describe('FindInvoiceUsecase test', () => {
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

  const MockRepository = () => {
    return {
      add: jest.fn(),
      find: jest.fn().mockResolvedValue(invoice),
    }
  }

  it('should find a invoice', async () => {
    const invoiceRepository = MockRepository()
    const usecase = new FindInvoiceUsecase(invoiceRepository)

    const input = {
      id: '1',
    }

    const result = await usecase.execute(input)

    expect(invoiceRepository.find).toHaveBeenCalled()
    expect(result.id).toBe('1')
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