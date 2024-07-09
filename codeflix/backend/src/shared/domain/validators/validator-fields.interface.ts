export type FieldErrors = {
  [field: string]: string[]
}

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldErrors | null
  validatedData: PropsValidated | null
  validate(data: any): boolean
}