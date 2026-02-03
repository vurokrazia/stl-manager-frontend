import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/test/mocks/handlers'
import { scansRepository } from './scans.repository'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ScansRepository', () => {
  describe('createScan', () => {
    it('retorna scan_id', async () => {
      const result = await scansRepository.createScan()

      expect(result.scan_id).toBeDefined()
    })

    it('retorna status', async () => {
      const result = await scansRepository.createScan()

      expect(result.status).toBeDefined()
    })
  })

  describe('getScanById', () => {
    it('retorna scan con id', async () => {
      const result = await scansRepository.getScanById('scan-123')

      expect(result.id).toBe('scan-123')
    })

    it('retorna status del scan', async () => {
      const result = await scansRepository.getScanById('scan-123')

      expect(result.status).toBe('completed')
    })

    it('retorna progress', async () => {
      const result = await scansRepository.getScanById('scan-123')

      expect(result.progress).toBeDefined()
    })
  })

  describe('getScanPaths', () => {
    it('retorna array de paths', async () => {
      const result = await scansRepository.getScanPaths('scan-123')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it('cada path tiene root_path', async () => {
      const result = await scansRepository.getScanPaths('scan-123')

      result.forEach(path => {
        expect(path.root_path).toBeDefined()
      })
    })

    it('cada path tiene files_found', async () => {
      const result = await scansRepository.getScanPaths('scan-123')

      result.forEach(path => {
        expect(path.files_found).toBeDefined()
        expect(typeof path.files_found).toBe('number')
      })
    })
  })
})
