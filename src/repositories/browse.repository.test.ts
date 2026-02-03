import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/test/mocks/handlers'
import { browseRepository } from './browse.repository'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('BrowseRepository', () => {
  describe('listBrowse', () => {
    it('retorna lista de items', async () => {
      const result = await browseRepository.listBrowse()

      expect(result.items).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
    })

    it('retorna total', async () => {
      const result = await browseRepository.listBrowse()

      expect(result.total).toBeDefined()
      expect(typeof result.total).toBe('number')
    })
  })

  describe('listFolders', () => {
    it('retorna lista de folders', async () => {
      const result = await browseRepository.listFolders()

      expect(result.items).toBeDefined()
      expect(Array.isArray(result.items)).toBe(true)
    })

    it('cada folder tiene id y name', async () => {
      const result = await browseRepository.listFolders()

      result.items.forEach(folder => {
        expect(folder.id).toBeDefined()
        expect(folder.name).toBeDefined()
      })
    })

    it('filtra por busqueda', async () => {
      const result = await browseRepository.listFolders(1, 20, 'BOBA')

      expect(result.items.some(f => f.name.includes('BOBA'))).toBe(true)
    })
  })

  describe('getFolder', () => {
    it('retorna folder con detalles', async () => {
      const folderId = '47dc8890-45bd-4b45-bd26-329bc6fd04fb'
      const result = await browseRepository.getFolder(folderId)

      expect(result.folder).toBeDefined()
      expect(result.folder.id).toBe(folderId)
    })

    it('retorna files del folder', async () => {
      const folderId = '47dc8890-45bd-4b45-bd26-329bc6fd04fb'
      const result = await browseRepository.getFolder(folderId)

      expect(result.files).toBeDefined()
      expect(Array.isArray(result.files)).toBe(true)
    })

    it('retorna subfolders', async () => {
      const folderId = '47dc8890-45bd-4b45-bd26-329bc6fd04fb'
      const result = await browseRepository.getFolder(folderId)

      expect(result.subfolders).toBeDefined()
      expect(Array.isArray(result.subfolders)).toBe(true)
    })
  })

  describe('updateFolderCategories', () => {
    it('retorna categories actualizadas', async () => {
      const result = await browseRepository.updateFolderCategories('folder-1', ['cat-1'])

      expect(result.categories).toBeDefined()
    })
  })
})
