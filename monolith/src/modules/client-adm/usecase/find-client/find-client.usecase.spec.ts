import FindClientUsecase from "./find-client.usecase"
import Client from "../../domain/client.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"

describe('FindClientUsecase test', () => {
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
  })

  const MockRepository = () => {
    return {
      add: jest.fn(),
      find: jest.fn().mockResolvedValue(client),
    }
  }

  it('should find a client', async () => {
    const clientRepository = MockRepository()
    const usecase = new FindClientUsecase(clientRepository)

    const input = {
      id: '1',
    }

    const result = await usecase.execute(input)

    expect(clientRepository.find).toHaveBeenCalled()
    expect(result.id).toBe('1')
    expect(result.name).toBe(client.name)
    expect(result.email).toBe(client.email)
    expect(result.document).toBe(client.document)
    expect(result.street).toBe(client.street)
    expect(result.number).toBe(client.number)
    expect(result.complement).toBe(client.complement)
    expect(result.city).toBe(client.city)
    expect(result.state).toBe(client.state)
    expect(result.zipCode).toBe(client.zipCode)
    expect(result.createdAt).toBe(client.createdAt)
    expect(result.updatedAt).toBe(client.updatedAt)
  })
})