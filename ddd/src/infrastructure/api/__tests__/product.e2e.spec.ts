import { app, sequelize } from '../express'
import request from 'supertest'

describe('E2E test for product', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should create a product', async () => {
    const response = await request(app)
      .post('/product')
      .send({
        name: 'TV',
        price: 100,
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('TV')
    expect(response.body.price).toBe(100)
  })

  it('should not create a product', async () => {
    const response = await request(app)
      .post('/product')
      .send({
        name: 'TV',
      })

    expect(response.status).toBe(500)
  })

  it('should list all products', async () => {
    const createResponse = await request(app)
      .post('/product')
      .send({
        name: 'TV',
        price: 100,
      })

    expect(createResponse.status).toBe(200)

    const createResponse2 = await request(app)
      .post('/product')
      .send({
        name: 'Fridge',
        price: 250,
      })

    expect(createResponse2.status).toBe(200)

    const listResponse = await request(app).get('/product').send()
    expect(listResponse.status).toBe(200)
    expect(listResponse.body.products.length).toBe(2)
    expect(listResponse.body.products[0].name).toBe('TV')
    expect(listResponse.body.products[0].price).toBe(100)
    expect(listResponse.body.products[1].name).toBe('Fridge')
    expect(listResponse.body.products[1].price).toBe(250)
  })
})