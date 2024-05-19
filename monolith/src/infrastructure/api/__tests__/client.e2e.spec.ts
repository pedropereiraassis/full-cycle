import { app, sequelize } from '../express'
import request from 'supertest'

describe('E2E test for client', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should create a client', async () => {
    const response = await request(app)
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

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('John')
    expect(response.body.email).toBe('john@email.com')
    expect(response.body.document).toBe('123456789')
    expect(response.body.street).toBe('Street')
  })
})