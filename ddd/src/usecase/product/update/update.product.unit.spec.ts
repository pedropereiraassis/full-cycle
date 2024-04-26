import Product from '../../../domain/product/entity/product'
import UpdateProductUseCase from './update.product.usecase'

const product = new Product('123', 'TV', 100)

const input = {
  id: product.id,
  name: 'Television',
  price: 200
}

const MockRepository = () => {
  return {
    find: jest.fn().mockResolvedValue(product),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('Unit Test update product use case', () => {
  it('should update a product', async () => {
    const productRepository = MockRepository()
    const usecase = new UpdateProductUseCase(productRepository)

    const result = await usecase.execute(input)

    expect(result).toEqual(input)
  })

  it('should throw an error when name is missing', async () => {
    const productRepository = MockRepository()
    const productUpdateUseCase = new UpdateProductUseCase(productRepository)

    input.name = ''

    await expect(productUpdateUseCase.execute(input)).rejects.toThrow('Name is required')
  })
})