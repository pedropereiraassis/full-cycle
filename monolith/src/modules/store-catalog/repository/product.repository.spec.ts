import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import ProductRepository from "./product.repository";

describe('ProductRepository test', () => {
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

  it('should find all products', async () => {
    const productProps1 = {
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      salesPrice: 100,
    }

    const productProps2 = {
      id: '2',
      name: 'Product 2',
      description: 'Product 2 description',
      salesPrice: 200,
    }

    await ProductModel.create({
      id: productProps1.id,
      name: productProps1.name,
      description: productProps1.description,
      salesPrice: productProps1.salesPrice,
    })

    await ProductModel.create({
      id: productProps2.id,
      name: productProps2.name,
      description: productProps2.description,
      salesPrice: productProps2.salesPrice,
    })

    const productRepository = new ProductRepository()
    const products = await productRepository.findAll()

    expect(products).toHaveLength(2)
    expect(products[0].id.id).toBe(productProps1.id)
    expect(products[0].name).toBe(productProps1.name)
    expect(products[0].description).toBe(productProps1.description)
    expect(products[0].salesPrice).toBe(productProps1.salesPrice)
    expect(products[1].id.id).toBe(productProps2.id)
    expect(products[1].name).toBe(productProps2.name)
    expect(products[1].description).toBe(productProps2.description)
    expect(products[1].salesPrice).toBe(productProps2.salesPrice)
  })

  it('should find a product', async () => {
    const productProps = {
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      salesPrice: 100,
    }

    await ProductModel.create({
      id: productProps.id,
      name: productProps.name,
      description: productProps.description,
      salesPrice: productProps.salesPrice,
    })

    const productRepository = new ProductRepository()
    const product = await productRepository.find(productProps.id)

    expect(product.id.id).toBe(productProps.id)
    expect(product.name).toBe(productProps.name)
    expect(product.description).toBe(productProps.description)
    expect(product.salesPrice).toBe(productProps.salesPrice)
  })
})