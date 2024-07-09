import { EntityValidationError } from '../../domain/validators/validation-error'
import { ValidatorFields } from '../../domain/validators/validator-fields.class'
import { FieldErrors } from '../../domain/validators/validator-fields.interface'

type Expected =
  | {
      validator: ValidatorFields<any>
      data: any
    }
  | (() => any)

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldErrors) {
    if (typeof expected === 'function') {
      try {
        expected()
        return isValid()
      } catch (err) {
        const error = err as EntityValidationError
        return assertContainsErrorMessages(error.errors, received)
      }
    } else {
      const { validator, data } = expected
      const validated = validator.validate(data)

      if (validated) {
        return isValid()
      }

      return assertContainsErrorMessages(validator.errors!, received)
    }
  },
})

function assertContainsErrorMessages(
  expected: FieldErrors,
  received: FieldErrors
) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected)

  return isMatch
    ? isValid()
    : {
        pass: false,
        message: () =>
          `The validation errors not contains ${JSON.stringify(
            received
          )}. Current: ${JSON.stringify(expected)}`,
      }
}

function isValid() {
  return { pass: true, message: () => '' }
}
