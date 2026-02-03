import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '@/test/mocks/handlers'
import { aiRepository } from './ai.repository'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('AIRepository', () => {
  describe('getStatus', () => {
    it('retorna enabled', async () => {
      const result = await aiRepository.getStatus()

      expect(result.enabled).toBeDefined()
      expect(typeof result.enabled).toBe('boolean')
    })

    it('retorna enabled como true', async () => {
      const result = await aiRepository.getStatus()

      expect(result.enabled).toBe(true)
    })
  })
})
