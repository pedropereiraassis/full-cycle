import Customer from '../../../domain/customer/entity/customer'
import Address from '../../../domain/customer/value-object/address'
import UpdateCustomerUseCase from './update.customer.usecase'

const customer = new Customer('123', 'John')
const address = new Address('Street', 123, 'Zip', 'City')
customer.changeAddress(address)

const input = {
  id: customer.id,
  name: 'John Updated',
  address: {
    street: 'Street Updated',
    city: 'City Updated',
    number: 1234  ,
    zip: 'Zip Updated'
  }
}

const MockRepository = () => {
  return {
    find: jest.fn().mockResolvedValue(customer),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('Unit Test update customer use case', () => {
  it('should update a customer', async () => {
    const customerRepository = MockRepository()
    const usecase = new UpdateCustomerUseCase(customerRepository)

    const result = await usecase.execute(input)

    expect(result).toEqual(input)
  })

  it('should throw an error when name is missing', async () => {
    const customerRepository = MockRepository()
    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository)

    input.name = ''

    await expect(customerUpdateUseCase.execute(input)).rejects.toThrow('Name is required')
  })
})