import { UUID } from '../../../shared/domain/value-objects/uuid.value-object'
import { Category } from '../category.entity'

describe('Category Unit Tests', () => {
  let validateSpy: jest.SpyInstance

  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate')
  })

  describe('constructor', () => {
    test('should create a category with default values', () => {
      const category = new Category({
        name: 'Movie',
      })

      expect(category.category_id).toBeInstanceOf(UUID)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
    })

    test('should create a category with all values', () => {
      const created_at = new Date()
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
        is_active: false,
        created_at,
      })

      expect(category.category_id).toBeInstanceOf(UUID)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.is_active).toBeFalsy()
      expect(category.created_at).toBe(created_at)
    })
  })

  describe('create command', () => {
    test('should create a category', () => {
      const category = Category.create({
        name: 'Movie',
      })

      expect(category.category_id).toBeInstanceOf(UUID)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description',
      })

      expect(category.category_id).toBeInstanceOf(UUID)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('should create a category with is_active false', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false,
      })

      expect(category.category_id).toBeInstanceOf(UUID)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeFalsy()
      expect(category.created_at).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('category_id field', () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new UUID() },
    ]

    test.each(arrange)('category_id = %j', ({ category_id }) => {
      const category = new Category({
        name: 'Movie',
        category_id: category_id as any,
      })

      expect(category.category_id).toBeInstanceOf(UUID)

      if (category_id instanceof UUID) {
        expect(category.category_id).toBe(category_id)
      }
    })
  })

  describe('update commands', () => {
    test('should change name', () => {
      const category = Category.create({
        name: 'Movie',
      })

      category.changeName('New Movie')

      expect(category.name).toBe('New Movie')
      expect(validateSpy).toHaveBeenCalledTimes(2)
    })

    test('should change description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description',
      })

      category.changeDescription('New description')

      expect(category.description).toBe('New description')
      expect(validateSpy).toHaveBeenCalledTimes(2)
    })

    test('should activate category', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false,
      })

      category.activate()

      expect(category.is_active).toBeTruthy()
    })

    test('should deactivate category', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: true,
      })

      category.deactivate()

      expect(category.is_active).toBeFalsy()
    })
  })
})

describe('Category Validator', () => {
  describe('create command', () => {
    test('should throw error with invalid name', () => {
      expect(() =>
        Category.create({ name: null as any })
      ).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() => Category.create({ name: '' })).containsErrorMessages({
        name: ['name should not be empty'],
      })

      expect(() => Category.create({ name: 5 as any })).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() =>
        Category.create({ name: 't'.repeat(256) })
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })

    test('should throw error with invalid description', () => {
      expect(() =>
        Category.create({ description: 5 } as any)
      ).containsErrorMessages({
        description: ['description must be a string'],
      })
    })

    test('should throw error with invalid is_active', () => {
      expect(() =>
        Category.create({ is_active: 5 } as any)
      ).containsErrorMessages({
        is_active: ['is_active must be a boolean value'],
      })
    })
  })
})
