import ProductFactory from "./product.factory"

describe('Product factory unit tests', () => {
  it('should create a product type a', () => {
    const product = ProductFactory.create('Product 1', 1)

    expect(product.id).toBeDefined()
    expect(product.name).toBe('Product 1')
    expect(product.price).toBe(1)
    expect(product.constructor.name).toBe('Product')
  })
})