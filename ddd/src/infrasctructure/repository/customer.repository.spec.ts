import { Sequelize } from 'sequelize-typescript'
import Customer from '../../domain/entity/customer'
import CustomerRepository from './customer.repository'
import Address from '../../domain/entity/address'
import CustomerModel from '../db/sequelize/model/customer.model'

describe('Customer repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([CustomerModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.truncate()
    await sequelize.close()
  })

  it('should create a Customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')

    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.address = address

    await customerRepository.create(customer)
    const customerModel = await CustomerModel.findOne({ where: { id: '123' } })

    expect(customerModel.toJSON()).toStrictEqual({
      id: '123',
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipcode: address.zip,
      city: address.city,
    })
  })

  it('should update a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')

    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.address = address

    await customerRepository.create(customer)

    customer.changeName('Customer 2')
    await customerRepository.update(customer)
    const customerModel = await CustomerModel.findOne({ where: { id: '123' } })

    expect(customerModel.toJSON()).toStrictEqual({
      id: '123',
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipcode: address.zip,
      city: address.city,
    })
  })

  it('should find a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')

    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.address = address
    await customerRepository.create(customer)

    const foundCustomer = await customerRepository.find('123')

    expect(customer).toStrictEqual(foundCustomer)
  })

  it('should throw an error when customer is not found', async () => {
    const customerRepository = new CustomerRepository()

    expect(async () => {
      await customerRepository.find('456ABC')
    }).rejects.toThrow('Customer not found')
  })

  it('should find all customers', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')

    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.address = address

    await customerRepository.create(customer)

    const customer2 = new Customer('456', 'Customer 2')

    const address2 = new Address('Street 2', 2, 'Zipcode 2', 'City 2')
    customer2.address = address2

    await customerRepository.create(customer2)

    const customers = [customer, customer2]
    const foundCustomers = await customerRepository.findAll()

    expect(foundCustomers).toEqual(customers)
  })
})