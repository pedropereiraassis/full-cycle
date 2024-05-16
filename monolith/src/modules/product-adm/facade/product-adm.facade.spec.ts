import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductAdmFacadeFactory from "../factory/facade.factory";

describe('ProductAdmFacade test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [ProductModel],
      sync: { force: true },
    });

    await sequelize.sync();
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it('should create a product', async () => {
    const productFacade = ProductAdmFacadeFactory.create()

    const input = {
      id: '1',
      name: 'Product 1',
      description: 'Product 1 Description',
      purchasePrice: 10,
      stock: 10,
    }

    await productFacade.addProduct(input)

    const product = await ProductModel.findOne({ where: { id: input.id } })
    expect(product).toBeDefined()
    expect(product.id).toBe(input.id)
    expect(product.name).toBe(input.name)
    expect(product.description).toBe(input.description)
    expect(product.purchasePrice).toBe(input.purchasePrice)
    expect(product.stock).toBe(input.stock)
  })

  it('should check stock of a product', async () => {
    const productFacade = ProductAdmFacadeFactory.create()

    const inputProduct = {
      id: '1',
      name: 'Product 1',
      description: 'Product 1 Description',
      purchasePrice: 10,
      stock: 10,
    }

    await productFacade.addProduct(inputProduct)

    const inputStock = { productId: '1' }

    const result = await productFacade.checkStock(inputStock)

    expect(result.productId).toBe(inputProduct.id)
    expect(result.stock).toBe(inputProduct.stock)
  })
})