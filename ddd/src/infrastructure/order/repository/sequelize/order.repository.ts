import Order from '../../../../domain/checkout/entity/order'
import OrderItem from '../../../../domain/checkout/entity/orderItem'
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repostirory.interface'
import OrderItemModel from './order-item.model'
import OrderModel from './order.model'

export default class OrderRepository implements OrderRepositoryInterface {
  async create(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id,
        customer_id: order.customerId,
        total: order.total(),
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }]
      }
    )
  }

  async update(order: Order): Promise<void> {
    const sequelize = OrderModel.sequelize
    await sequelize.transaction(async (trx) => {
      await OrderItemModel.destroy({
        where: { order_id: order.id },
        transaction: trx,
      })
      const items = order.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: order.id,
      }))
      await OrderItemModel.bulkCreate(items, { transaction: trx })
      await OrderModel.update(
        { total: order.total() },
        { where: { id: order.id }, transaction: trx }
      )
    })
  }

  async find(id: string): Promise<Order> {
    let orderModel
    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        rejectOnEmpty: true,
        include: ['items'],
      })
    } catch (err) {
      throw new Error('Order not found')
    }
    const customer = new Order(
      id,
      orderModel.customer_id,
      orderModel.items.map((item) =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity,
        )
      )
    )

    return customer
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ['items'],
    })

    return orderModels.map((orderModel) => {
      const items = orderModel.items.map((item) =>
        new OrderItem(
          item.id,
          item.name, item.price,
          item.product_id,
          item.quantity
        )
      )

      return new Order(
        orderModel.id,
        orderModel.customer_id,
        items
      )
    })
  }
}