import { Umzug } from 'umzug'
import { app, sequelize } from '../express'
import request from 'supertest'
import { migrator } from '../../db/config-migrations/migrator'

describe('E2E test for checkout', () => {
  let migration: Umzug<any>

  beforeAll(async () => {
    migration = migrator(sequelize)
    await migration.up()
  })

  afterAll(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it('should checkout', async () => {
    const createClientResponse = await request(app)
      .post('/clients')
      .send({
        name: 'John',
        email: 'john@email.com',
        document: '123456789',
        street: 'Street',
        number: '123',
        complement: 'Complement',
        city: 'City',
        state: 'State',
        zipCode: '12345',
      })

    const createProductResponse1 = await request(app)
      .post('/products')
      .send({
        name: 'Product 1',
        description: 'Description 1',
        purchasePrice: 100,
        stock: 10,
      })

    const createProductResponse2 = await request(app)
      .post('/products')
      .send({
        name: 'Product 2',
        description: 'Description 2',
        purchasePrice: 200,
        stock: 20,
      })

    const response = await request(app)
      .post('/checkout')
      .send({
        clientId: createClientResponse.body.id,
        products: [
          {
            productId: createProductResponse1.body.id,
          },
          {
            productId: createProductResponse2.body.id,
          },
        ],
      })

    expect(response.status).toBe(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.invoiceId).toBeDefined()
    expect(response.body.status).toBeDefined()
    expect(response.body.total).toBeDefined()
    expect(response.body.products).toHaveLength(2)
    expect(response.body.products[0].productId).toBe(createProductResponse1.body.id)
    expect(response.body.products[1].productId).toBe(createProductResponse2.body.id)
  })
})