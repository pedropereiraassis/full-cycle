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
      document: '000',
      street: 'Street',
      number: '10',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '00000',
    }

    const result = await usecase.execute(input)

    expect(clientRepository.add).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(validate(result.id)).toBeTruthy()
    expect(result.name).toBe(input.name)
    expect(result.email).toBe(input.email)
    expect(result.document).toBe(input.document)
    expect(result.street).toBe(input.street)
    expect(result.number).toBe(input.number)
    expect(result.complement).toBe(input.complement)
    expect(result.city).toBe(input.city)
    expect(result.state).toBe(input.state)
    expect(result.zipCode).toBe(input.zipCode)
  })
})