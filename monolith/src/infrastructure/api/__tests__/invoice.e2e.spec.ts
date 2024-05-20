import { Umzug } from 'umzug'
import { app, sequelize } from '../express'
import request from 'supertest'
import { migrator } from '../../db/config-migrations/migrator'

describe('E2E test for invoice', () => {
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

  it('should get invoice', async () => {
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

    const checkoutResponse = await request(app)
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

    const response = await request(app)
      .get(`/invoice/${checkoutResponse.body.invoiceId}`)
    
    expect(response.status).toBe(200)
    expect(response.body.id).toBe(checkoutResponse.body.invoiceId)
    expect(response.body.name).toBe('John')
    expect(response.body.document).toBe('123456789')
    expect(response.body.address.street).toBe('Street')
    expect(response.body.address.number).toBe('123')
    expect(response.body.address.complement).toBe('Complement')
    expect(response.body.address.city).toBe('City')
    expect(response.body.address.state).toBe('State')
    expect(response.body.address.zipCode).toBe('12345')
    expect(response.body.items.length).toBe(2)
    expect(response.body.items[0].id).toBe(createProductResponse1.body.id)
    expect(response.body.items[0].name).toBe('Product 1')
    expect(response.body.items[0].price).toBe(100)
    expect(response.body.items[1].id).toBe(createProductResponse2.body.id)
    expect(response.body.items[1].name).toBe('Product 2')
    expect(response.body.items[1].price).toBe(200)
    expect(response.body.total).toBe(300)
    expect(response.body.createdAt).toBeDefined()
  })
})