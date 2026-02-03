import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/test-utils'
import Dashboard from './Dashboard'

describe('Dashboard', () => {
  describe('Renderizado inicial', () => {
    it('muestra el titulo "Dashboard"', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
      })
    })

    it('muestra el titulo "Recent Activity"', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      })
    })
  })

  describe('StatCards', () => {
    it('muestra la card "Total Files"', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText('Total Files')).toBeInTheDocument()
      })
    })

    it('muestra la card "STL Files"', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText('STL Files')).toBeInTheDocument()
      })
    })

    it('muestra la card "ZIP Files"', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText('ZIP Files')).toBeInTheDocument()
      })
    })

    it('muestra la card "Total Size"', async () => {
      render(<Dashboard />)
      await waitFor(() => {
        expect(screen.getByText('Total Size')).toBeInTheDocument()
      })
    })
  })

  describe('Estadisticas calculadas', () => {
    it('muestra el conteo total de archivos', async () => {
      render(<Dashboard />)
      // El mock tiene 3 archivos
      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument()
      })
    })

    it('muestra valores de conteo en las cards', async () => {
      render(<Dashboard />)
      // El mock tiene 1 archivo STL y 1 archivo ZIP
      await waitFor(() => {
        const allOnes = screen.getAllByText('1')
        expect(allOnes.length).toBeGreaterThanOrEqual(2) // STL y ZIP
      })
    })
  })
})
