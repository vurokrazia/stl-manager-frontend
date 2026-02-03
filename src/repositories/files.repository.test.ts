import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/test/mocks/handlers'
import { filesRepository } from './files.repository'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('FilesRepository', () => {
  describe('getFiles', () => {
    it('retorna lista de archivos', async () => {
      const result = await filesRepository.getFiles()

      expect(result.items).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
    })

    it('retorna total de archivos', async () => {
      const result = await filesRepository.getFiles()

      expect(result.total).toBeDefined()
      expect(typeof result.total).toBe('number')
    })

    it('filtra por tipo', async () => {
      const result = await filesRepository.getFiles({ type: 'stl' })

      expect(result.items.every(f => f.type === 'stl')).toBe(true)
    })

    it('filtra por busqueda', async () => {
      const result = await filesRepository.getFiles({ q: 'boba' })

      expect(result.items.length).toBeGreaterThan(0)
      expect(result.items.some(f => f.file_name.toLowerCase().includes('boba'))).toBe(true)
    })
  })

  describe('reclassifyFile', () => {
    it('retorna job_id', async () => {
      const result = await filesRepository.reclassifyFile('file-123')

      expect(result.job_id).toBeDefined()
    })
  })

  describe('updateCategories', () => {
    it('retorna file_id y categories', async () => {
      const result = await filesRepository.updateCategories('file-123', ['cat-1'])

      expect(result.file_id).toBeDefined()
      expect(result.categories).toBeDefined()
    })
  })
})
