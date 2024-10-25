import { ValueObject } from "../value-object"

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super()
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly prop1: string, readonly prop2: string) {
    super()
  }
}

describe('ValueObject Unit Tests', () => {
  test('should be equals', () => {
    const valueObject1 = new StringValueObject('value')
    const valueObject2 = new StringValueObject('value')
    expect(valueObject1.equals(valueObject2)).toBeTruthy()

    const complexValueObject1 = new ComplexValueObject('prop1', 'prop2')
    const complexValueObject2 = new ComplexValueObject('prop1', 'prop2')
    expect(complexValueObject1.equals(complexValueObject2)).toBeTruthy()
  })

  test('should not be equals', () => {
    const valueObject1 = new StringValueObject('value')
    const valueObject2 = new StringValueObject('value2')
    expect(valueObject1.equals(valueObject2)).toBeFalsy()
    expect(valueObject1.equals(null as any)).toBeFalsy()
    expect(valueObject1.equals(undefined as any)).toBeFalsy()

    const complexValueObject1 = new ComplexValueObject('prop1', 'prop2')
    const complexValueObject2 = new ComplexValueObject('prop1', 'prop3')
    expect(complexValueObject1.equals(complexValueObject2)).toBeFalsy()
  })
})