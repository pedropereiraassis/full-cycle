import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repostirory.interface"
import { InputCreateCustomerDTO, OutputCreateCustomerDTO } from "./create.customer.dto"
import CustomerFactory from "../../../domain/customer/factory/customer.factory"
import Address from "../../../domain/customer/value-object/address"

export default class CreateCustomerUseCase {
  private customerRepository: CustomerRepositoryInterface

  constructor(customerRepository: CustomerRepositoryInterface) {
    this.customerRepository = customerRepository
  }

  async execute(input: InputCreateCustomerDTO): Promise<OutputCreateCustomerDTO> {
    const address = new Address(input.address.street, input.address.number, input.address.zip, input.address.city)
    const customer = CustomerFactory.createWithAddress(input.name, address)
    await this.customerRepository.create(customer)

    return {
      id: customer.id,
      name: customer.name,
      address: {
        street: customer.address.street,
        city: customer.address.city,
        number: customer.address.number,
        zip: customer.address.zip,
      }
    }
  }
}