import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({ where: { id }, include: 'items' });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return new Invoice({
      id: new Id(invoice.dataValues.id),
      name: invoice.dataValues.name,
      document: invoice.dataValues.document,
      address: invoice.dataValues.address,
      items: invoice.dataValues.items.map((item: InvoiceItemModel) => {
        return new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        })
      }),
      createdAt: invoice.dataValues.createdAt,
      updatedAt: invoice.dataValues.updatedAt,
    })
  }

  async add(invoice: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item: InvoiceItem) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        }
      }),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    }, {
      include: 'items',
    });
  }
}