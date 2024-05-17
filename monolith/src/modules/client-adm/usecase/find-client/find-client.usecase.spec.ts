import FindClientUsecase from "./find-client.usecase"
import Client from "../../domain/client.entity"
import Id from "../../../@shared/domain/value-object/id.value-object"

describe('FindClientUsecase test', () => {
  const client = new Client({
    id: new Id('1'),
    name: 'Client 1',
    email: 'client@email.com',
    address: 'Address 1',
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
    expect(result.address).toBe(client.address)
    expect(result.createdAt).toBe(client.createdAt)
    expect(result.updatedAt).toBe(client.updatedAt)
  })
})