import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { httpService } from './http.service'

const BASE_URL = 'http://localhost:8081/v1'

const testHandlers = [
  http.get(`${BASE_URL}/test-get`, () => {
    return HttpResponse.json({ message: 'get success' })
  }),

  http.post(`${BASE_URL}/test-post`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ received: body })
  }),

  http.put(`${BASE_URL}/test-put`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ updated: body })
  }),

  http.patch(`${BASE_URL}/test-patch`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ patched: body })
  }),

  http.delete(`${BASE_URL}/test-delete`, () => {
    return HttpResponse.json({ deleted: true })
  }),

  http.get(`${BASE_URL}/test-error`, () => {
    return new HttpResponse(JSON.stringify({ error: 'Not Found' }), { status: 404 })
  }),
]

const server = setupServer(...testHandlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('HttpService', () => {
  describe('get', () => {
    it('realiza peticion GET y retorna datos', async () => {
      const result = await httpService.get<{ message: string }>('/test-get')

      expect(result.message).toBe('get success')
    })
  })

  describe('post', () => {
    it('realiza peticion POST con body', async () => {
      const result = await httpService.post<{ received: any }>('/test-post', { name: 'test' })

      expect(result.received).toEqual({ name: 'test' })
    })
  })

  describe('put', () => {
    it('realiza peticion PUT con body', async () => {
      const result = await httpService.put<{ updated: any }>('/test-put', { id: 1, name: 'updated' })

      expect(result.updated).toEqual({ id: 1, name: 'updated' })
    })
  })

  describe('patch', () => {
    it('realiza peticion PATCH con body', async () => {
      const result = await httpService.patch<{ patched: any }>('/test-patch', { field: 'value' })

      expect(result.patched).toEqual({ field: 'value' })
    })
  })

  describe('delete', () => {
    it('realiza peticion DELETE', async () => {
      const result = await httpService.delete<{ deleted: boolean }>('/test-delete')

      expect(result.deleted).toBe(true)
    })
  })

  describe('error handling', () => {
    it('rechaza promesa en error 404', async () => {
      await expect(httpService.get('/test-error')).rejects.toThrow()
    })
  })

  describe('getClient', () => {
    it('retorna instancia de axios', () => {
      const client = httpService.getClient()

      expect(client).toBeDefined()
      expect(typeof client.get).toBe('function')
      expect(typeof client.post).toBe('function')
    })
  })
})
