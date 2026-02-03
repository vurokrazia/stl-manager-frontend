import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/test-utils'
import FoldersPage from './FoldersPage'

describe('FoldersPage', () => {
  describe('Renderizado de datos', () => {
    it('muestra el titulo "All Folders"', async () => {
      render(<FoldersPage />)
      expect(screen.getByText('All Folders')).toBeInTheDocument()
    })

    it('muestra los nombres de los folders en la tabla', async () => {
      render(<FoldersPage />)

      await waitFor(() => {
        expect(screen.getByText('(STAR WARS 3D MODELS) - BOBA FETT')).toBeInTheDocument()
        expect(screen.getByText('Functional Parts Collection')).toBeInTheDocument()
        expect(screen.getByText('Decorations & Dioramas')).toBeInTheDocument()
      })
    })

    it('muestra el conteo de archivos de cada folder', async () => {
      render(<FoldersPage />)

      await waitFor(() => {
        expect(screen.getByText('1 files')).toBeInTheDocument()
        expect(screen.getByText('12 files')).toBeInTheDocument()
        expect(screen.getByText('8 files')).toBeInTheDocument()
      })
    })

    it('muestra tags "Folder" en la columna Type', async () => {
      render(<FoldersPage />)

      await waitFor(() => {
        const folderTags = screen.getAllByText('Folder')
        expect(folderTags.length).toBeGreaterThan(0)
      })
    })

    it('muestra el input de busqueda', () => {
      render(<FoldersPage />)
      expect(screen.getByPlaceholderText('Search folders by name...')).toBeInTheDocument()
    })

    it('tiene la columna Name', async () => {
      render(<FoldersPage />)
      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    it('tiene la columna Path', async () => {
      render(<FoldersPage />)
      expect(screen.getByText('Path')).toBeInTheDocument()
    })

    it('tiene la columna Type', async () => {
      render(<FoldersPage />)
      expect(screen.getByText('Type')).toBeInTheDocument()
    })

    it('tiene la columna Categories', async () => {
      render(<FoldersPage />)
      expect(screen.getByText('Categories')).toBeInTheDocument()
    })

    it('muestra paginacion', async () => {
      render(<FoldersPage />)

      await waitFor(() => {
        expect(screen.getByText(/Total \d+ folders/)).toBeInTheDocument()
      })
    })
  })
})
