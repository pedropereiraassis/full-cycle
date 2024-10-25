import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { Category } from './category.entity'
import { ValidatorFields } from '../../shared/domain/validators/validator-fields.class'

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string | null

  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean

  constructor({ name, description, is_active }: Category) {
    this.name = name
    this.description = description
    this.is_active = is_active
  }
}

export class CategoryValidator extends ValidatorFields<CategoryRules> {
  validate(category: Category): boolean {
    return super.validate(new CategoryRules(category))
  }
}

export class CategoryValidatorFactory {
  static create(): CategoryValidator {
    return new CategoryValidator()
  }
}
