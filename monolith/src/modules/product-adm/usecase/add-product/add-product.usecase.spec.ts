import AddProductUseCase from "./add-product.usecase"

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  }
}

describe('Add Product use case unit test', () => {
  it('should add a product', async () => {
    const productRepository = MockRepository()
    const useCase = new AddProductUseCase(productRepository)
    const input = {
      name: 'product',
      description: 'description',
      purchasePrice: 100,
      stock: 10,
    }

    const result = await useCase.execute(input)

    expect(productRepository.add).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toBe(input.name)
    expect(result.description).toBe(input.description)
    expect(result.purchasePrice).toBe(input.purchasePrice)
    expect(result.stock).toBe(input.stock)
  })
})