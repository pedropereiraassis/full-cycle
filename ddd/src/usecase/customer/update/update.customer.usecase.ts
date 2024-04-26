import CustomerRepositoryInterface from '../../../domain/customer/repository/customer-repostirory.interface'
import Address from '../../../domain/customer/value-object/address'
import { InputUpdateCustomerDTO, OutputUpdateCustomerDTO } from './update.customer.dto'

export default class UpdateCustomerUseCase {
  private customerRepository: CustomerRepositoryInterface

  constructor(customerRepository: CustomerRepositoryInterface) {
    this.customerRepository = customerRepository
  }

  async execute(input: InputUpdateCustomerDTO): Promise<OutputUpdateCustomerDTO> {
    const customer = await this.customerRepository.find(input.id)
    customer.changeName(input.name)
    customer.changeAddress(new Address(
      input.address.street,
      input.address.number,
      input.address.zip,
      input.address.city,
    ))

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