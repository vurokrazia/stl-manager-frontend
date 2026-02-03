import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/test-utils'
import BrowsePage from './BrowsePage'

describe('BrowsePage', () => {
  describe('Renderizado de datos', () => {
    it('muestra el titulo "Browse Folders"', async () => {
      render(<BrowsePage />)
      expect(screen.getByText('Browse Folders')).toBeInTheDocument()
    })

    it('muestra los nombres de los folders en la tabla', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getByText('(STAR WARS 3D MODELS) - BOBA FETT')).toBeInTheDocument()
      })
    })

    it('muestra el conteo de archivos de cada folder', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        expect(screen.getByText('1 files')).toBeInTheDocument()
      })
    })

    it('muestra tags "Folder" en la columna Type', async () => {
      render(<BrowsePage />)

      await waitFor(() => {
        const folderTags = screen.getAllByText('Folder')
        expect(folderTags.length).toBeGreaterThan(0)
      })
    })

    it('muestra el input de busqueda', () => {
      render(<BrowsePage />)
      expect(screen.getByPlaceholderText('Search folders by name...')).toBeInTheDocument()
    })

    it('tiene la columna Name', async () => {
      render(<BrowsePage />)
      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    it('tiene la columna Type', async () => {
      render(<BrowsePage />)
      expect(screen.getByText('Type')).toBeInTheDocument()
    })

    it('tiene la columna Categories', async () => {
      render(<BrowsePage />)
      expect(screen.getByText('Categories')).toBeInTheDocument()
    })
  })
})
