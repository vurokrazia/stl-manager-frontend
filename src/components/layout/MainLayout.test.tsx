import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/test-utils'
import MainLayout from './MainLayout'

describe('MainLayout', () => {
  describe('Renderizado inicial', () => {
    it('renderiza el titulo "STL Manager"', () => {
      render(<MainLayout><div>Content</div></MainLayout>)
      expect(screen.getByText('STL Manager')).toBeInTheDocument()
    })

    it('renderiza el titulo "3D Print Files Manager"', () => {
      render(<MainLayout><div>Content</div></MainLayout>)
      expect(screen.getByText('3D Print Files Manager')).toBeInTheDocument()
    })

    it('renderiza el children', () => {
      render(<MainLayout><div>Test Content</div></MainLayout>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
  })

  describe('Menu de navegacion', () => {
    it('muestra el menu item Dashboard', () => {
      render(<MainLayout><div>Content</div></MainLayout>)
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('muestra el menu item Browse', () => {
      render(<MainLayout><div>Content</div></MainLayout>)
      expect(screen.getByText('Browse')).toBeInTheDocument()
    })

    it('muestra el menu item All Folders', () => {
      render(<MainLayout><div>Content</div></MainLayout>)
      expect(screen.getByText('All Folders')).toBeInTheDocument()
    })

    it('muestra el menu item All Files', () => {
      render(<MainLayout><div>Content</div></MainLayout>)
      expect(screen.getByText('All Files')).toBeInTheDocument()
    })

    it('muestra el menu item Categories', () => {
      render(<MainLayout><div>Content</div></MainLayout>)
      expect(screen.getByText('Categories')).toBeInTheDocument()
    })
  })

  describe('Header', () => {
    it('muestra el boton Scan Files', () => {
      render(<MainLayout><div>Content</div></MainLayout>)
      expect(screen.getByRole('button', { name: /Scan Files/i })).toBeInTheDocument()
    })

    it('muestra el estado de AI', async () => {
      render(<MainLayout><div>Content</div></MainLayout>)
      await waitFor(() => {
        expect(screen.getByText(/AI On|AI Off/)).toBeInTheDocument()
      })
    })
  })
})
