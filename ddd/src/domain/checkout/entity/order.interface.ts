import OrderItem from "./orderItem";

export default interface OrderInterface {

  get id(): string
  get customerId(): string
  get items(): OrderItem[]
}