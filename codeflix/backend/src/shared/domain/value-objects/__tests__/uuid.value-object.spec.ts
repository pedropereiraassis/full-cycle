import { validate as uuidValidate } from "uuid"
import { InvalidUUIDError, UUID } from "../uuid.value-object"

describe('UUUID ValueObject Unit Tests', () => {
  const validateSpy = jest.spyOn(UUID.prototype as any, 'validate')

  test('should throw error when uuid is invalid', () => {
    expect(() => {
      new UUID('invalid-uuid')
    }).toThrow(InvalidUUIDError)
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should create a valid uuid', () => {
    const uuid = new UUID()
    expect(uuid).toBeInstanceOf(UUID)
    expect(uuid.id).toBeDefined()
    expect(uuidValidate(uuid.id)).toBeTruthy()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should accept a valid uuid', () => {
    const uuid = new UUID('d2b6a9c3-2c7d-4e6a-8b3f-3b2d1b4e8e5f')
    expect(uuid).toBeInstanceOf(UUID)
    expect(uuid.id).toBe('d2b6a9c3-2c7d-4e6a-8b3f-3b2d1b4e8e5f')
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })
})