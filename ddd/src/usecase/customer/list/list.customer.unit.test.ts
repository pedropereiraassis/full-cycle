import Customer from '../../../domain/customer/entity/customer'
import CustomerFactory from '../../../domain/customer/factory/customer.factory'
import Address from '../../../domain/customer/value-object/address'
import ListCustomerUseCase from './list.customer.usecase'

const address1 = new Address('Street', 123, 'Zip', 'City')
const customer1 = CustomerFactory.createWithAddress('John', address1)
const address2 = new Address('Street 2', 456, 'Zip 2', 'City 2')
const customer2 = CustomerFactory.createWithAddress('Jane', address2)

const MockRepository = () => {
  return {
    find: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue([customer1, customer2]),
  }
}

describe('Unit Test list customer use case', () => {
  it('should list customers', async () => {
    const customerRepository = MockRepository()
    const usecase = new ListCustomerUseCase(customerRepository)

    const result = await usecase.execute({})

    expect(result.customers.length).toBe(2)
    expect(result.customers[0].id).toBe(customer1.id)
    expect(result.customers[0].name).toBe(customer1.name)
    expect(result.customers[0].address.street).toBe(customer1.address.street)
    expect(result.customers[1].id).toBe(customer2.id)
    expect(result.customers[1].name).toBe(customer2.name)
    expect(result.customers[1].address.street).toBe(customer2.address.street)
  })
})