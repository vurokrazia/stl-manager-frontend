import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/test-utils'
import App from './App'

describe('App', () => {
  describe('Layout', () => {
    it('renderiza MainLayout con titulo', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('STL Manager')).toBeInTheDocument()
      })
    })

    it('renderiza menu de navegacion', async () => {
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Browse')).toBeInTheDocument()
        expect(screen.getByText('All Files')).toBeInTheDocument()
        expect(screen.getByText('Categories')).toBeInTheDocument()
      })
    })
  })

  describe('Routing - Dashboard', () => {
    it('muestra Dashboard en ruta raiz', async () => {
      render(<App />)

      await waitFor(() => {
        // Dashboard muestra StatCards
        expect(screen.getByText('Total Files')).toBeInTheDocument()
      })
    })
  })
})
