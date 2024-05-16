import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/facade.factory";

describe('StoreCatalogFacade test', () => {
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

  it('should find a product', async () => {
    const product = await ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Product 1 Description',
      salesPrice: 20,
    })

    const storeCatalogFacade = StoreCatalogFacadeFactory.create()

    const result = await storeCatalogFacade.findProduct({ id: '1' })

    expect(result).toBeDefined()
    expect(result.id).toBe(product.dataValues.id)
    expect(result.name).toBe(product.dataValues.name)
    expect(result.description).toBe(product.dataValues.description)
    expect(result.salesPrice).toBe(product.dataValues.salesPrice)
  })

  it('should find all products', async () => {
    await ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Product 1 Description',
      salesPrice: 20,
    })

    await ProductModel.create({
      id: '2',
      name: 'Product 2',
      description: 'Product 2 Description',
      salesPrice: 30,
    })

    const storeCatalogFacade = StoreCatalogFacadeFactory.create()

    const result = await storeCatalogFacade.findAllProducts()

    expect(result.products).toHaveLength(2)
    expect(result.products[0].id).toBe('1')
    expect(result.products[0].name).toBe('Product 1')
    expect(result.products[0].description).toBe('Product 1 Description')
    expect(result.products[0].salesPrice).toBe(20)
    expect(result.products[1].id).toBe('2')
    expect(result.products[1].name).toBe('Product 2')
    expect(result.products[1].description).toBe('Product 2 Description')
    expect(result.products[1].salesPrice).toBe(30)
  })
})