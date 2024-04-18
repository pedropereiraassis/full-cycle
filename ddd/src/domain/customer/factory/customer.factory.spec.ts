import Address from "../value-object/address"
import CustomerFactory from "./customer.factory"

describe('Customer factory unit tests', () => {
  it('should create a customer', () => {
    const customer = CustomerFactory.create('Customer 1')

    expect(customer.id).toBeDefined()
    expect(customer.name).toBe('Customer 1')
    expect(customer.address).toBeUndefined()
    expect(customer.constructor.name).toBe('Customer')
  })

  it('should create a customer with an address', () => {
    const address = new Address('Street 1', 123, '456789-012', 'Manaus')
    const customer = CustomerFactory.createWithAddress('Customer 1', address)

    expect(customer.id).toBeDefined()
    expect(customer.name).toBe('Customer 1')
    expect(customer.address).toBe(address)
    expect(customer.constructor.name).toBe('Customer')
  })
})