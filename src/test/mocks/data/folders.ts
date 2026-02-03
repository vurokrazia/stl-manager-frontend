import type { Folder, FoldersListResponse } from '@/types/models'

export const mockFolders: Folder[] = [
  {
    id: '47dc8890-45bd-4b45-bd26-329bc6fd04fb',
    name: '(STAR WARS 3D MODELS) - BOBA FETT',
    path: 'Z:\\Vehuicles\\GM - Star Wars\\(STAR WARS 3D MODELS) - BOBA FETT',
    file_count: 1,
    categories: [],
    created_at: '2026-01-17T06:26:28Z',
    updated_at: '2026-01-17T06:26:28Z',
  },
  {
    id: 'a09eb928-b9cd-4ddb-b306-b755470c111f',
    name: 'Functional Parts Collection',
    path: 'Z:\\Vehuicles\\GM - Star Wars\\Star Wars Legion\\Functional Parts',
    file_count: 12,
    categories: [{ id: 'cat-1', name: 'mechanical_part', created_at: '2026-01-17T06:18:01Z' }],
    created_at: '2026-01-17T06:27:30Z',
    updated_at: '2026-01-17T06:27:30Z',
  },
  {
    id: 'fd0b5290-2b9f-4573-b8c5-3dd1f05155b4',
    name: 'Decorations & Dioramas',
    path: 'Z:\\Vehuicles\\GM - Star Wars\\Decorations',
    file_count: 8,
    categories: [{ id: 'cat-2', name: 'diorama', created_at: '2026-01-17T06:18:01Z' }],
    created_at: '2026-01-17T06:26:28Z',
    updated_at: '2026-01-17T06:26:28Z',
  },
]

export const mockFoldersResponse: FoldersListResponse = {
  items: mockFolders,
  total: mockFolders.length,
}
