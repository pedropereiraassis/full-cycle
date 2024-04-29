import { Sequelize } from 'sequelize-typescript'
import Customer from '../../../domain/customer/entity/customer'
import Address from '../../../domain/customer/value-object/address'
import UpdateCustomerUseCase from './update.customer.usecase'
import CustomerModel from '../../../infrastructure/customer/repository/sequelize/customer.model'
import CustomerRepository from '../../../infrastructure/customer/repository/sequelize/customer.repository'

describe('Integration Test update customer use case', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([CustomerModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  const customer = new Customer('123', 'John')
  const address = new Address('Street', 123, 'Zip', 'City')
  customer.changeAddress(address)

  const input = {
    id: customer.id,
    name: 'John Updated',
    address: {
      street: 'Street Updated',
      city: 'City Updated',
      number: 1234,
      zip: 'Zip Updated'
    }
  }

  it('should update a customer', async () => {
    const customerRepository = new CustomerRepository()
    await customerRepository.create(customer)

    const usecase = new UpdateCustomerUseCase(customerRepository)

    const result = await usecase.execute(input)

    expect(result).toEqual(input)
  })

  it('should throw an error when name is missing', async () => {
    const customerRepository = new CustomerRepository()
    await customerRepository.create(customer)

    const customerUpdateUseCase = new UpdateCustomerUseCase(customerRepository)

    input.name = ''

    await expect(customerUpdateUseCase.execute(input)).rejects.toThrow('Name is required')
  })
})