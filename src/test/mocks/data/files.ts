import type { STLFile, FilesListResponse } from '@/types/models'

export const mockFiles: STLFile[] = [
  {
    id: 'dda48f88-0c4f-422c-8015-0968732c35f6',
    path: 'Z:\\Vehuicles\\GM - Star Wars\\(STAR WARS 3D MODELS) - BOBA FETT\\boba_fett.rar',
    file_name: 'boba_fett.rar',
    type: 'rar',
    size: 520952765,
    modified_at: '2021-07-05T08:12:48-06:00',
    categories: [{ id: '76b8c03b-87d1-4ee5-9038-bea69bb0aee3', name: 'uncategorized', created_at: '2026-01-17T06:18:01Z' }],
    created_at: '2026-01-17T06:26:28Z',
    updated_at: '2026-01-22T05:22:10Z',
  },
  {
    id: 'cf7d9a52-8192-4eb2-b136-29deef3fe568',
    path: 'Z:\\Models\\bracket.stl',
    file_name: 'bracket.stl',
    type: 'stl',
    size: 512000,
    modified_at: '2024-01-02T00:00:00Z',
    categories: [{ id: 'cat-1', name: 'mechanical_part', created_at: '2026-01-17T06:18:01Z' }],
    created_at: '2026-01-17T06:27:30Z',
    updated_at: '2026-01-22T05:23:44Z',
  },
  {
    id: '4f786478-a089-400f-94bd-fe82d8d28f00',
    path: 'Z:\\Models\\collection.zip',
    file_name: 'model_collection.zip',
    type: 'zip',
    size: 5242880,
    modified_at: '2023-02-05T07:19:52-06:00',
    categories: [],
    created_at: '2026-01-17T06:26:28Z',
    updated_at: '2026-01-22T05:22:10Z',
  },
]

export const mockFilesResponse: FilesListResponse = {
  items: mockFiles,
  total: mockFiles.length,
  page: 1,
  page_size: 20,
}
