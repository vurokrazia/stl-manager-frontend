import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/test/mocks/handlers'
import { categoriesRepository } from './categories.repository'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('CategoriesRepository', () => {
  describe('getCategories', () => {
    it('retorna lista de categorias', async () => {
      const result = await categoriesRepository.getCategories()

      expect(result.items).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
    })

    it('cada categoria tiene id y name', async () => {
      const result = await categoriesRepository.getCategories()

      result.items.forEach(cat => {
        expect(cat.id).toBeDefined()
        expect(cat.name).toBeDefined()
      })
    })
  })

  describe('createCategory', () => {
    it('retorna categoria creada con id', async () => {
      const result = await categoriesRepository.createCategory({ name: 'Nueva Categoria' })

      expect(result.id).toBeDefined()
      expect(result.name).toBe('Nueva Categoria')
    })
  })

  describe('updateCategory', () => {
    it('retorna categoria actualizada', async () => {
      const result = await categoriesRepository.updateCategory('cat-1', { name: 'Updated' })

      expect(result.id).toBe('cat-1')
      expect(result.name).toBe('Updated')
    })
  })

  describe('deleteCategory', () => {
    it('no lanza error', async () => {
      await expect(categoriesRepository.deleteCategory('cat-1')).resolves.not.toThrow()
    })
  })
})
