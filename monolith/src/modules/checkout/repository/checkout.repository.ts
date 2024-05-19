import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItemModel from "./product.model";
import CheckoutGateway from "../gateway/checkout.gateway";
import Order from "../domain/order.entity";
import OrderModel from "./order.model";
import Client from "../domain/client.entity";
import ProductModel from "./product.model";
import Product from "../domain/product.entity";

export default class CheckoutRepository implements CheckoutGateway {
  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({ where: { id }, include: ['client', 'products'] });

    if (!order) {
      throw new Error('Order not found');
    }

    return new Order({
      id: new Id(order.dataValues.id),
      status: order.dataValues.status,
      client: new Client({
        id: new Id(order.dataValues.client.id),
        name: order.dataValues.client.name,
        email: order.dataValues.client.email,
        document: order.dataValues.client.document,
        street: order.dataValues.client.street,
        number: order.dataValues.client.number,
        complement: order.dataValues.client.complement,
        city: order.dataValues.client.city,
        state: order.dataValues.client.state,
        zipCode: order.dataValues.client.zipCode,
      }),
      products: order.dataValues.products.map((product: ProductModel) => {
        return new Product({
          id: new Id(product.dataValues.id),
          name: product.dataValues.name,
          description: product.dataValues.description,
          salesPrice: product.dataValues.salesPrice,
        })
      }),
      createdAt: order.dataValues.createdAt,
      updatedAt: order.dataValues.updatedAt,
    })
  }

  async addOrder(order: Order): Promise<void> {
    const createdOrder = await OrderModel.create({
      id: order.id.id,
      status: order.status,
      clientId: order.client.id.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });

    await createdOrder.addProducts(order.products.map(product => product.id.id));
  }
}