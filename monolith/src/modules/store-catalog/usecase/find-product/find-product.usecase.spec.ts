import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import FindProductUseCase from "./find-product.usecase"

describe('FindProduct usecase test', () => {
  const product = new Product({
    id: new Id('1'),
    name: 'Product 1',
    description: 'Product 1 description',
    salesPrice: 100,
  })

  const MockRepository = () => {
    return {
      find: jest.fn().mockResolvedValue(product),
      findAll: jest.fn().mockResolvedValue([product]),
    }
  }

  it('should find a product', async () => {
    const productRepository = MockRepository()
    const findProductUseCase = new FindProductUseCase(productRepository)

    const input = { id: '1' }

    const product = await findProductUseCase.execute(input)

    expect(productRepository.find).toHaveBeenCalled()
    expect(product.id).toBe('1')
    expect(product.name).toBe('Product 1')
    expect(product.description).toBe('Product 1 description')
    expect(product.salesPrice).toBe(100)
  })
})