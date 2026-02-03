import type { Category, CategoriesListResponse } from '@/types/models'

export const mockCategories: Category[] = [
  { id: '190e474d-fa39-44f6-ad52-32cd6247a992', name: 'adapter', created_at: '2026-01-17T06:18:01Z' },
  { id: 'f0dfd6f4-d472-4830-bbbc-83899b617427', name: 'anime', created_at: '2026-01-17T06:18:01Z' },
  { id: 'be99f493-7aa8-45ca-b047-a19123cd78de', name: 'calibration', created_at: '2026-01-17T06:18:01Z' },
  { id: 'f8df857c-9f7c-4f8d-ba47-ba15fea93cd1', name: 'character', created_at: '2026-01-17T06:18:01Z' },
  { id: '578be5a5-aafb-4e54-90f7-7da40190231f', name: 'diorama', created_at: '2026-01-17T06:18:01Z' },
  { id: 'c26c89c6-ce02-4b25-84fb-7b9faf6f7129', name: 'figurine', created_at: '2026-01-17T06:18:01Z' },
]

export const mockCategoriesResponse: CategoriesListResponse = {
  items: mockCategories,
  total: mockCategories.length,
  page: 1,
  page_size: 100,
  total_pages: 1,
}
