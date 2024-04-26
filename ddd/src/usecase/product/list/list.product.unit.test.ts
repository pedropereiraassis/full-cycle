import Product from '../../../domain/product/entity/product'
import ProductFactory from '../../../domain/product/factory/product.factory'
import ListProductUseCase from './list.product.usecase'

const product1 = ProductFactory.create('TV', 100)
const product2 = ProductFactory.create('Fridge', 150)

const MockRepository = () => {
  return {
    find: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValue([product1, product2]),
  }
}

describe('Unit Test list product use case', () => {
  it('should list products', async () => {
    const productRepository = MockRepository()
    const usecase = new ListProductUseCase(productRepository)

    const result = await usecase.execute({})

    expect(result.products.length).toBe(2)
    expect(result.products[0].id).toBe(product1.id)
    expect(result.products[0].name).toBe(product1.name)
    expect(result.products[0].price).toBe(product1.price)
    expect(result.products[1].id).toBe(product2.id)
    expect(result.products[1].name).toBe(product2.name)
    expect(result.products[1].price).toBe(product2.price)
  })
})