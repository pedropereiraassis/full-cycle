import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientAdmFacadeFactory from "../factory/facade.factory";

describe('ClientAdmFacade test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [ClientModel],
      sync: { force: true },
    });

    await sequelize.sync();
  })

  afterEach(async () => {
    await sequelize.close();
  })

  it('should create a client', async () => {
    const clientFacade = ClientAdmFacadeFactory.create()

    const input = {
      id: '1',
      name: 'Client 1',
      email: 'client@email.com',
      address: 'Client 1 Address',
    }

    await clientFacade.addClient(input)

    const client = await ClientModel.findOne({ where: { id: input.id } })

    expect(client).toBeDefined()
    expect(client.dataValues.id).toBe(input.id)
    expect(client.dataValues.name).toBe(input.name)
    expect(client.dataValues.email).toBe(input.email)
    expect(client.dataValues.address).toBe(input.address)
  })

  it('should find a client', async () => {
    const clientFacade = ClientAdmFacadeFactory.create()

    const inputCreate = {
      id: '1',
      name: 'Product 1',
      email: 'client@email.com',
      address: 'Client 1 Address',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await ClientModel.create(inputCreate)

    const inputFind = { id: '1' }

    const result = await clientFacade.findClient(inputFind)

    expect(result.id).toBe(inputCreate.id)
    expect(result.name).toBe(inputCreate.name)
    expect(result.email).toBe(inputCreate.email)
    expect(result.address).toBe(inputCreate.address)
    expect(result.createdAt).toStrictEqual(inputCreate.createdAt)
    expect(result.updatedAt).toStrictEqual(inputCreate.updatedAt)
  })
})