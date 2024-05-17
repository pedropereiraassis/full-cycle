import { validate } from "uuid"
import AddClientUsecase from "./add-client.usecase"

describe('AddClientUsecase test', () => {
  const MockRepository = () => {
    return {
      add: jest.fn(),
      find: jest.fn(),
    }
  }

  it('should add a client', async () => {
    const clientRepository = MockRepository()
    const usecase = new AddClientUsecase(clientRepository)

    const input = {
      name: 'Client 1',
      email: 'client@email.com',
      address: 'Address 1',
    }

    const result = await usecase.execute(input)

    expect(clientRepository.add).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(validate(result.id)).toBeTruthy()
    expect(result.name).toBe(input.name)
    expect(result.email).toBe(input.email)
    expect(result.address).toBe(input.address)
  })
})