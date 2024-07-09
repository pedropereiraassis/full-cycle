import { IRepository } from '../../shared/domain/repository/repository.interface'
import { UUID } from '../../shared/domain/value-objects/uuid.value-object'
import { Category } from './category.entity'

export interface ICategoryRepository extends IRepository<Category, UUID> {}
