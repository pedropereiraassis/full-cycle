import { Sequelize } from "sequelize-typescript"
import CreateProductUseCase from "./create.product.usecase"
import ProductModel from "../../../infrasctructure/product/repository/sequelize/product.model"
import ProductRepository from "../../../infrasctructure/product/repository/sequelize/product.repository"

describe('Integration Test create product use case', () => {
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

  const input = {
    name: 'TV',
    price: 100,
  }

  it('should create a product', async () => {
    const productRepository = new ProductRepository()
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
    const productRepository = new ProductRepository()
    const productCreateUseCase = new CreateProductUseCase(productRepository)

    input.name = ''

    await expect(productCreateUseCase.execute(input)).rejects.toThrow('Name is required')
  })

  it('should throw an error when price is less than 0', async () => {
    const productRepository = new ProductRepository()
    const productCreateUseCase = new CreateProductUseCase(productRepository)

    input.name = 'TV'
    input.price = -10

    await expect(productCreateUseCase.execute(input)).rejects.toThrow('Price must be greater than 0')
  })
})