import { Sequelize } from 'sequelize-typescript'
import Product from '../../../domain/product/entity/product'
import UpdateProductUseCase from './update.product.usecase'
import ProductModel from '../../../infrasctructure/product/repository/sequelize/product.model'
import ProductRepository from '../../../infrasctructure/product/repository/sequelize/product.repository'

describe('Integration Test update product use case', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  const product = new Product('123', 'TV', 100)

  const input = {
    id: product.id,
    name: 'Television',
    price: 200,
  }

  it('should update a product', async () => {
    const productRepository = new ProductRepository()
    await productRepository.create(product)

    const usecase = new UpdateProductUseCase(productRepository)

    const result = await usecase.execute(input)

    expect(result).toEqual(input)
  })

  it('should throw an error when name is missing', async () => {
    const productRepository = new ProductRepository()
    await productRepository.create(product)

    const productUpdateUseCase = new UpdateProductUseCase(productRepository)

    input.name = ''

    await expect(productUpdateUseCase.execute(input)).rejects.toThrow('Name is required')
  })
})