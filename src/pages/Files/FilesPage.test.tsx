import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/test-utils'
import FilesPage from './FilesPage'

describe('FilesPage', () => {
  describe('Renderizado de datos', () => {
    it('muestra el titulo "Files"', async () => {
      render(<FilesPage />)
      expect(screen.getByText('Files')).toBeInTheDocument()
    })

    it('muestra los nombres de archivos en la tabla', async () => {
      render(<FilesPage />)

      await waitFor(() => {
        expect(screen.getByText('boba_fett.rar')).toBeInTheDocument()
      })
    })

    it('muestra el tipo de archivo STL', async () => {
      render(<FilesPage />)

      await waitFor(() => {
        expect(screen.getByText('STL')).toBeInTheDocument()
      })
    })

    it('muestra el tipo de archivo ZIP', async () => {
      render(<FilesPage />)

      await waitFor(() => {
        expect(screen.getByText('ZIP')).toBeInTheDocument()
      })
    })

    it('muestra el tipo de archivo RAR', async () => {
      render(<FilesPage />)

      await waitFor(() => {
        expect(screen.getByText('RAR')).toBeInTheDocument()
      })
    })

    it('tiene la columna File Name', async () => {
      render(<FilesPage />)
      expect(screen.getByText('File Name')).toBeInTheDocument()
    })

    it('tiene la columna Type', async () => {
      render(<FilesPage />)
      expect(screen.getByText('Type')).toBeInTheDocument()
    })

    it('tiene la columna Size', async () => {
      render(<FilesPage />)
      expect(screen.getByText('Size')).toBeInTheDocument()
    })

    it('tiene la columna Categories', async () => {
      render(<FilesPage />)
      expect(screen.getByText('Categories')).toBeInTheDocument()
    })

    it('tiene la columna Actions', async () => {
      render(<FilesPage />)
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })

    it('muestra el input de busqueda', () => {
      render(<FilesPage />)
      expect(screen.getByPlaceholderText('Search files...')).toBeInTheDocument()
    })
  })
})
