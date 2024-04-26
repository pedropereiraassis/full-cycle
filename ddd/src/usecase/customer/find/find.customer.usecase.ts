import CustomerRepositoryInterface from '../../../domain/customer/repository/customer-repostirory.interface'
import { InputFindCustomerDTO, OutputFindCustomerDTO } from './find.customer.dto'

export default class FindCustomerUseCase {
  private customerRepository: CustomerRepositoryInterface

  constructor(customerRepository: CustomerRepositoryInterface) {
    this.customerRepository = customerRepository
  }

  async execute(input: InputFindCustomerDTO): Promise<OutputFindCustomerDTO> {
    const customer = await this.customerRepository.find(input.id)

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