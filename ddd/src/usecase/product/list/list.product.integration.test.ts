import { Sequelize } from 'sequelize-typescript'
import Product from '../../../domain/product/entity/product'
import ProductFactory from '../../../domain/product/factory/product.factory'
import ListProductUseCase from './list.product.usecase'
import ProductModel from '../../../infrasctructure/product/repository/sequelize/product.model'
import ProductRepository from '../../../infrasctructure/product/repository/sequelize/product.repository'

describe('Integration Test list product use case', () => {
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

  const product1 = ProductFactory.create('TV', 100)
  const product2 = ProductFactory.create('Fridge', 150)

  it('should list products', async () => {
    const productRepository = new ProductRepository()
    await productRepository.create(product1)
    await productRepository.create(product2)

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