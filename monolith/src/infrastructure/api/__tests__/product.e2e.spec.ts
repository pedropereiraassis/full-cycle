import { Umzug } from 'umzug'
import { app, sequelize } from '../express'
import request from 'supertest'
import { migrator } from '../../db/config-migrations/migrator'

describe('E2E test for product', () => {
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

  it('should create a product', async () => {
    const response = await request(app)
      .post('/products')
      .send({
        name: 'TV',
        description: 'TV 50 inches',
        purchasePrice: 100,
        stock: 10,
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('TV')
    expect(response.body.description).toBe('TV 50 inches')
    expect(response.body.purchasePrice).toBe(100)
  })
})