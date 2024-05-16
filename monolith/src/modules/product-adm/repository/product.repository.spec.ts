import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
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

  it('should create a product', async () => {
    const productProps = {
      id: new Id('1'),
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    }
    const product = new Product(productProps)
    const productRepository = new ProductRepository();
    await productRepository.add(product)

    const productDb = await ProductModel.findOne({ where: { id: product.id.id } })

    expect(productProps.id.id).toBe(productDb.dataValues.id)
    expect(productProps.name).toBe(productDb.dataValues.name)
    expect(productProps.description).toBe(productDb.dataValues.description)
    expect(productProps.purchasePrice).toBe(productDb.dataValues.purchasePrice)
    expect(productProps.stock).toBe(productDb.dataValues.stock)
  })

  it('should find a product', async () => {
    const productProps = {
      id: new Id('1'),
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    }
    await ProductModel.create({
      id: productProps.id.id,
      name: productProps.name,
      description: productProps.description,
      purchasePrice: productProps.purchasePrice,
      stock: productProps.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const productRepository = new ProductRepository();
    const product = await productRepository.find(productProps.id.id)

    expect(productProps.id.id).toBe(product.id.id)
    expect(productProps.name).toBe(product.name)
    expect(productProps.description).toBe(product.description)
    expect(productProps.purchasePrice).toBe(product.purchasePrice)
    expect(productProps.stock).toBe(product.stock)
  })
})