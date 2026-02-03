import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRoute } from '@/test/test-utils'
import FolderDetailPage from './FolderDetailPage'

describe('FolderDetailPage', () => {
  const folderId = '47dc8890-45bd-4b45-bd26-329bc6fd04fb'

  describe('Renderizado de datos', () => {
    it('muestra breadcrumbs', async () => {
      renderWithRoute(<FolderDetailPage />, {
        route: `/folders/${folderId}`,
        path: '/folders/:id',
      })

      await waitFor(() => {
        // Home icon should be present
        expect(document.querySelector('.anticon-home')).toBeInTheDocument()
      })
    })

    it('muestra el card de Contents', async () => {
      renderWithRoute(<FolderDetailPage />, {
        route: `/folders/${folderId}`,
        path: '/folders/:id',
      })

      await waitFor(() => {
        expect(screen.getByText('Contents')).toBeInTheDocument()
      })
    })

    it('muestra input de busqueda', async () => {
      renderWithRoute(<FolderDetailPage />, {
        route: `/folders/${folderId}`,
        path: '/folders/:id',
      })

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search files and folders...')).toBeInTheDocument()
      })
    })

    it('muestra filtro por tipo', async () => {
      renderWithRoute(<FolderDetailPage />, {
        route: `/folders/${folderId}`,
        path: '/folders/:id',
      })

      await waitFor(() => {
        expect(screen.getByText('Filter by type')).toBeInTheDocument()
      })
    })

    it('muestra filtro por categoria', async () => {
      renderWithRoute(<FolderDetailPage />, {
        route: `/folders/${folderId}`,
        path: '/folders/:id',
      })

      await waitFor(() => {
        expect(screen.getByText('Filter by category')).toBeInTheDocument()
      })
    })

    it('tiene la columna Name', async () => {
      renderWithRoute(<FolderDetailPage />, {
        route: `/folders/${folderId}`,
        path: '/folders/:id',
      })

      await waitFor(() => {
        expect(screen.getByText('Name')).toBeInTheDocument()
      })
    })

    it('tiene la columna Type', async () => {
      renderWithRoute(<FolderDetailPage />, {
        route: `/folders/${folderId}`,
        path: '/folders/:id',
      })

      await waitFor(() => {
        expect(screen.getByText('Type')).toBeInTheDocument()
      })
    })

    it('tiene la columna Size', async () => {
      renderWithRoute(<FolderDetailPage />, {
        route: `/folders/${folderId}`,
        path: '/folders/:id',
      })

      await waitFor(() => {
        expect(screen.getByText('Size')).toBeInTheDocument()
      })
    })

    it('tiene la columna Categories', async () => {
      renderWithRoute(<FolderDetailPage />, {
        route: `/folders/${folderId}`,
        path: '/folders/:id',
      })

      await waitFor(() => {
        expect(screen.getByText('Categories')).toBeInTheDocument()
      })
    })

    it('muestra archivos del folder', async () => {
      renderWithRoute(<FolderDetailPage />, {
        route: `/folders/${folderId}`,
        path: '/folders/:id',
      })

      await waitFor(() => {
        // Mock returns first 2 files
        expect(screen.getByText('boba_fett.rar')).toBeInTheDocument()
      })
    })
  })
})
