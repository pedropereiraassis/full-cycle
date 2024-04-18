import Customer from "../../customer/entity/customer"
import Order from "../entity/order"
import OrderItem from "../entity/orderItem"
import OrderService from "./order.service"

describe("Order service unit tests", () => {
  it("shouldplace an order", () => {
    const customer = new Customer("1", "Customer 1")
    const item1 = new OrderItem("1", "Item 1", 10, "1", 1)

    const order = OrderService.placeOrder(customer, [item1])

    expect(customer.rewardPoints).toBe(5)
    expect(order.total()).toBe(10)
  })

  it("should get total of all orders", () => {
    const item1 = new OrderItem("1", "Item 1", 100, "123", 1)
    const item2 = new OrderItem("2", "Item 2", 200, "123", 2)

    const order1 = new Order("1", "1", [item1])
    const order2 = new Order("2", "2", [item2])

    const total = OrderService.total([order1, order2])

    expect(total).toBe(500)
  })
})