import { Category } from '../category.entity'

describe('Category Unit Tests', () => {
  describe('constructor', () => {
    test('should create a category with default values', () => {
      const category = new Category({
        name: 'Movie'
      })

      expect(category.category_id).toBeUndefined()
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
        created_at
      })

      expect(category.category_id).toBeUndefined()
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

      expect(category.category_id).toBeUndefined()
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
    })

    test('should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description'
      })

      expect(category.category_id).toBeUndefined()
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.is_active).toBeTruthy()
      expect(category.created_at).toBeInstanceOf(Date)
    })

    test('should create a category with is_active false', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false
      })

      expect(category.category_id).toBeUndefined()
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBeFalsy()
      expect(category.created_at).toBeInstanceOf(Date)
    })
  })

  describe('update commands', () => {
    test('should change name', () => {
      const category = Category.create({
        name: 'Movie'
      })

      category.changeName('New Movie')

      expect(category.name).toBe('New Movie')
    })

    test('should change description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description'
      })

      category.changeDescription('New description')

      expect(category.description).toBe('New description')
    })

    test('should activate category', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false
      })

      category.activate()

      expect(category.is_active).toBeTruthy()
    })

    test('should deactivate category', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: true
      })

      category.deactivate()

      expect(category.is_active).toBeFalsy()
    })
  })
})