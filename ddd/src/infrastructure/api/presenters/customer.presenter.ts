import { toXML } from 'jstoxml'
import { OutputListCustomerDTO } from '../../../usecase/customer/list/list.customer.dto';

export default class CustomerPresenter {
  static listXML(data: OutputListCustomerDTO): string {
    const xmlOption = {
      header: true,
      indent: ' ',
      newline: '\n',
      allowEmpty: true,
    }

    return toXML({
      customers: {
        customer: data.customers.map((customer) => ({
          id: customer.id,
          name: customer.name,
          address: {
            street: customer.address.street,
            number: customer.address.number,
            zip: customer.address.zip,
            city: customer.address.city,
          }
        }))
      }
    }, xmlOption)
  }
}