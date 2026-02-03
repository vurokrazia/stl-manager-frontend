import { http, HttpResponse } from 'msw'
import { mockFoldersResponse } from './data/folders'
import { mockFilesResponse } from './data/files'
import { mockCategoriesResponse, mockCategories } from './data/categories'

const BASE_URL = 'http://localhost:8081/v1'

export const handlers = [
  // Browse endpoint (different from folders)
  http.get(`${BASE_URL}/browse`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('q')

    let items = mockFoldersResponse.items
    if (search) {
      items = items.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    return HttpResponse.json({
      items,
      total: items.length,
    })
  }),

  // Folders endpoints
  http.get(`${BASE_URL}/folders`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('q')

    let items = mockFoldersResponse.items
    if (search) {
      items = items.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    return HttpResponse.json({
      items,
      total: items.length,
    })
  }),

  http.get(`${BASE_URL}/folders/:id`, ({ params }) => {
    const folder = mockFoldersResponse.items.find(f => f.id === params.id)
    if (!folder) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json({
      folder,
      subfolders: [],
      files: mockFilesResponse.items.slice(0, 2),
      categories: mockCategories,
      pagination: { total: 2, page: 1, page_size: 50, total_pages: 1 },
    })
  }),

  http.patch(`${BASE_URL}/folders/:id/categories`, async ({ request }) => {
    const body = await request.json() as { category_ids: string[] }
    const categories = body.category_ids.map(id =>
      mockCategories.find(c => c.id === id)
    ).filter(Boolean)
    return HttpResponse.json({ categories })
  }),

  // Files endpoints
  http.get(`${BASE_URL}/files`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('q')
    const type = url.searchParams.get('type')

    let items = mockFilesResponse.items
    if (search) {
      items = items.filter(f =>
        f.file_name.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (type) {
      items = items.filter(f => f.type === type)
    }

    return HttpResponse.json({
      items,
      total: items.length,
      page: 1,
      page_size: 20,
    })
  }),

  http.post(`${BASE_URL}/files/:id/reclassify`, () => {
    return HttpResponse.json({ job_id: 'job-123' })
  }),

  http.patch(`${BASE_URL}/files/:id/categories`, async ({ request }) => {
    const body = await request.json() as { category_ids: string[] }
    const categories = body.category_ids.map(id =>
      mockCategories.find(c => c.id === id)
    ).filter(Boolean)
    return HttpResponse.json({ file_id: 'file-1', categories })
  }),

  // Categories endpoints
  http.get(`${BASE_URL}/categories`, () => {
    return HttpResponse.json(mockCategoriesResponse)
  }),

  http.post(`${BASE_URL}/categories`, async ({ request }) => {
    const body = await request.json() as { name: string }
    return HttpResponse.json({
      id: 'cat-new',
      name: body.name,
      created_at: new Date().toISOString(),
    })
  }),

  http.put(`${BASE_URL}/categories/:id`, async ({ request, params }) => {
    const body = await request.json() as { name: string }
    return HttpResponse.json({
      id: params.id,
      name: body.name,
      created_at: '2026-01-17T06:18:01Z',
    })
  }),

  http.delete(`${BASE_URL}/categories/:id`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // AI Status endpoint
  http.get(`${BASE_URL}/ai/status`, () => {
    return HttpResponse.json({
      enabled: true,
      provider: 'ollama',
      model: 'llama2',
    })
  }),

  // Scan endpoints
  http.post(`${BASE_URL}/scan`, () => {
    return HttpResponse.json({
      scan_id: 'scan-123',
      status: 'pending',
    })
  }),

  http.post(`${BASE_URL}/scans`, () => {
    return HttpResponse.json({
      scan_id: 'scan-123',
      status: 'pending',
    })
  }),

  http.get(`${BASE_URL}/scans/:id`, ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      status: 'completed',
      progress: { Int32: 100, Valid: true },
      found: { Int32: 10, Valid: true },
      processed: { Int32: 10, Valid: true },
      error: { String: '', Valid: false },
      paths: ['/path/to/files'],
      created_at: '2026-01-17T06:26:28Z',
      updated_at: '2026-01-17T06:26:28Z',
    })
  }),

  http.get(`${BASE_URL}/scans/:id/paths`, () => {
    return HttpResponse.json([
      {
        id: 'path-1',
        scan_id: 'scan-123',
        root_path: 'Z:\\Models\\Collection',
        files_found: 50,
        files_inserted: 25,
        folders_found: 10,
        folders_inserted: 5,
      },
      {
        id: 'path-2',
        scan_id: 'scan-123',
        root_path: 'Z:\\Vehicles\\Parts',
        files_found: 30,
        files_inserted: 15,
        folders_found: 5,
        folders_inserted: 3,
      },
    ])
  }),
]
