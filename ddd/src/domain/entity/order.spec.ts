import Order from "./order"
import OrderItem from "./orderItem"

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", [])
    }).toThrow("Id is required")
  })

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", [])
    }).toThrow("CustomerId is required")
  })

  it("should throw error when item qty is 0", () => {
    expect(() => {
      let order = new Order("1", "123", [])
    }).toThrow("Items are required")
  })

  it("should calculate total", () => {
    const item1 = new OrderItem("1", "Item 1", 100, "1", 2)
    const order1 = new Order("123", "1", [item1])

    const total1 = order1.total()
    expect(total1).toBe(200)

    const item2 = new OrderItem("2", "Item 2", 150, "2", 2)
    const order2 = new Order("123", "1", [item1, item2])

    const total2 = order2.total()
    expect(total2).toBe(500)
  })

  it("should throw error when item quantity is less or equal 0", () => {
    expect(() => {
      const item = new OrderItem("1", "Item 1", 100, "1", 0)
    }).toThrow("Quantity must be greater than 0")
  })
})