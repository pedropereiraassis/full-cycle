import Address from '../../../../domain/customer/value-object/address';
import Customer from '../../../../domain/customer/entity/customer';
import CustomerRepositoryInterface from '../../../../domain/customer/repository/customer-repostirory.interface';
import CustomerModel from './customer.model';

export default class CustomerRepository implements CustomerRepositoryInterface {
  async create(customer: Customer): Promise<void> {
    await CustomerModel.create({
      id: customer.id,
      name: customer.name,
      street: customer.address.street,
      number: customer.address.number,
      zipcode: customer.address.zip,
      city: customer.address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
    })
  }

  async update(customer: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: customer.name,
        street: customer.address.street,
        number: customer.address.number,
        zipcode: customer.address.zip,
        city: customer.address.city,
        active: customer.isActive(),
        rewardPoints: customer.rewardPoints,
      },
      {
        where: {
          id: customer.id
        },
      }
    )
  }

  async find(id: string): Promise<Customer> {
    let customerModel
    try {
      customerModel = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      })
    } catch (err) {
      throw new Error('Customer not found')
    }
    const customer = new Customer(id, customerModel.name)
    const address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.zipcode,
      customerModel.city,
    )
    customer.changeAddress(address)

    return customer
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll()

    return customerModels.map((customerModel) => {
      let customer = new Customer(customerModel.id, customerModel.name)
      customer.addRewardPoints(customerModel.rewardPoints)
      const address = new Address(
        customerModel.street,
        customerModel.number,
        customerModel.zipcode,
        customerModel.city,
      )
      customer.changeAddress(address)

      if (customerModel.active) {
        customer.activate()
      }

      return customer
    })
  }
}