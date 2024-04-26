import CreateProductUseCase from "./create.product.usecase"

const input = {
  name: 'TV',
  price: 100,
}

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('Unit Test create product use case', () => {
  it('should create a product', async () => {
    const productRepository = MockRepository()
    const productCreateUseCase = new CreateProductUseCase(productRepository)

    const output = {
      id: expect.any(String),
      name: input.name,
      price: input.price,
    }

    const result = await productCreateUseCase.execute(input)
    expect(result).toEqual(output)
  })

  it('should throw an error when name is missing', async () => {
    const productRepository = MockRepository()
    const productCreateUseCase = new CreateProductUseCase(productRepository)

    input.name = ''

    await expect(productCreateUseCase.execute(input)).rejects.toThrow('Name is required')
  })

  it('should throw an error when price is less than 0', async () => {
    const productRepository = MockRepository()
    const productCreateUseCase = new CreateProductUseCase(productRepository)

    input.name = 'TV'
    input.price = -1

    await expect(productCreateUseCase.execute(input)).rejects.toThrow('Price must be greater than 0')
  })
})