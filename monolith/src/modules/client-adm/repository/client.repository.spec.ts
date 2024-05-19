import { Sequelize } from "sequelize-typescript";
import ClientModel from "./client.model";
import Client from "../domain/client.entity";
import ClientRepository from "./client.repository";
import Id from "../../@shared/domain/value-object/id.value-object";

describe('ClientRepository test', () => {
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

  it('should find a client', async () => {
    const client = await ClientModel.create({
      id: '1',
      name: 'Client 1',
      email: 'client@email.com',
      document: '000',
      street: 'Street',
      number: '10',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '00000',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const repository = new ClientRepository()
    const result = await repository.find(client.id)

    expect(result.id.id).toEqual(client.id)
    expect(result.name).toEqual(client.name)
    expect(result.email).toEqual(client.email)
    expect(result.document).toEqual(client.document)
    expect(result.street).toEqual(client.street)
    expect(result.number).toEqual(client.number)
    expect(result.complement).toEqual(client.complement)
    expect(result.city).toEqual(client.city)
    expect(result.state).toEqual(client.state)
    expect(result.zipCode).toEqual(client.zipCode)
    expect(result.createdAt).toStrictEqual(client.createdAt)
    expect(result.updatedAt).toStrictEqual(client.updatedAt)
  })

  it('should create a client', async () => {
    const client = new Client({
      id: new Id('1'),
      name: 'Client 1',
      email: 'client@email.com',
      document: '000',
      street: 'Street',
      number: '10',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '00000',
    });

    const repository = new ClientRepository()
    await repository.add(client)

    const result = await ClientModel.findOne({ where: { id: client.id.id } })

    expect(result.id).toEqual(client.id.id)
    expect(result.name).toEqual(client.name)
    expect(result.email).toEqual(client.email)
    expect(result.document).toEqual(client.document)
    expect(result.street).toEqual(client.street)
    expect(result.number).toEqual(client.number)
    expect(result.complement).toEqual(client.complement)
    expect(result.city).toEqual(client.city)
    expect(result.state).toEqual(client.state)
    expect(result.zipCode).toEqual(client.zipCode)
    expect(result.createdAt).toStrictEqual(client.createdAt)
    expect(result.updatedAt).toStrictEqual(client.updatedAt)
  })
})