import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/test-utils'
import CategoriesPage from './CategoriesPage'

describe('CategoriesPage', () => {
  describe('Renderizado de datos', () => {
    it('muestra el titulo "Categories"', async () => {
      render(<CategoriesPage />)
      expect(screen.getByText('Categories')).toBeInTheDocument()
    })

    it('muestra el boton "Create Category"', () => {
      render(<CategoriesPage />)
      expect(screen.getByRole('button', { name: /Create Category/i })).toBeInTheDocument()
    })

    it('muestra los nombres de categorias en la tabla', async () => {
      render(<CategoriesPage />)

      await waitFor(() => {
        expect(screen.getByText('adapter')).toBeInTheDocument()
        expect(screen.getByText('anime')).toBeInTheDocument()
      })
    })

    it('tiene la columna Name', async () => {
      render(<CategoriesPage />)
      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    it('tiene la columna Created At', async () => {
      render(<CategoriesPage />)
      expect(screen.getByText('Created At')).toBeInTheDocument()
    })

    it('tiene la columna Actions', async () => {
      render(<CategoriesPage />)
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })

    it('muestra botones Edit para cada categoria', async () => {
      render(<CategoriesPage />)

      await waitFor(() => {
        const editButtons = screen.getAllByRole('button', { name: /Edit/i })
        expect(editButtons.length).toBeGreaterThan(0)
      })
    })

    it('muestra botones Delete para cada categoria', async () => {
      render(<CategoriesPage />)

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /Delete/i })
        expect(deleteButtons.length).toBeGreaterThan(0)
      })
    })
  })
})
