import { app, sequelize } from '../express'
import request from 'supertest'

describe('E2E test for customer', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should create a customer', async () => {
    const response = await request(app)
      .post('/customer')
      .send({
        name: 'John',
        address: {
          street: 'Street',
          city: 'City',
          number: 123,
          zip: '12345',
        }
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('John')
    expect(response.body.address.street).toBe('Street')
    expect(response.body.address.city).toBe('City')
    expect(response.body.address.number).toBe(123)
    expect(response.body.address.zip).toBe('12345')
  })

  it('should not create a customer', async () => {
    const response = await request(app)
      .post('/customer')
      .send({
        name: 'John',
      })

    expect(response.status).toBe(500)
  })

  it('should list all customers', async () => {
    const createResponse = await request(app)
      .post('/customer')
      .send({
        name: 'John',
        address: {
          street: 'Street',
          city: 'City',
          number: 123,
          zip: '12345',
        }
      })

    expect(createResponse.status).toBe(200)

    const createResponse2 = await request(app)
      .post('/customer')
      .send({
        name: 'Jane',
        address: {
          street: 'Street 2',
          city: 'City 2',
          number: 456,
          zip: '678910',
        }
      })

    expect(createResponse2.status).toBe(200)

    const listResponse = await request(app).get('/customer').send()
    expect(listResponse.status).toBe(200)
    expect(listResponse.body.customers.length).toBe(2)
    expect(listResponse.body.customers[0].name).toBe('John')
    expect(listResponse.body.customers[0].address.street).toBe('Street')
    expect(listResponse.body.customers[1].name).toBe('Jane')
    expect(listResponse.body.customers[1].address.street).toBe('Street 2')
  })
})