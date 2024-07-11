import { SortDirection } from '../../../shared/domain/repository/search-params'
import { UUID } from '../../../shared/domain/value-objects/uuid.value-object'
import { InMemorySearchableRepository } from '../../../shared/infra/db/in-memory/in-memory.repository'
import { Category } from '../../domain/category.entity'

export class CategoryInMemoryRepository extends InMemorySearchableRepository<
  Category,
  UUID
> {
  sortableFields: string[] = ['name', 'created_at']

  protected async applyFilter(
    items: Category[],
    filter: string | null
  ): Promise<Category[]> {
    if (!filter) {
      return items
    }

    return items.filter((item) => {
      return item.name.toLowerCase().includes(filter.toLowerCase())
    })
  }

  getEntity(): new (...args: any[]) => Category {
    return Category
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ): Category[] {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc')
  }
}
