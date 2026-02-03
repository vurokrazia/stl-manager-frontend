import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/test-utils'
import ScanResults from './ScanResults'

describe('ScanResults', () => {
  it('muestra la tabla de resultados', async () => {
    render(<ScanResults scanId="scan-123" />)
    await waitFor(() => {
      expect(screen.getByText('Scanned Path')).toBeInTheDocument()
    })
  })

  it('tiene columna Files Found', async () => {
    render(<ScanResults scanId="scan-123" />)
    await waitFor(() => {
      expect(screen.getByText('Files Found')).toBeInTheDocument()
    })
  })

  it('tiene columna New Files', async () => {
    render(<ScanResults scanId="scan-123" />)
    await waitFor(() => {
      expect(screen.getByText('New Files')).toBeInTheDocument()
    })
  })

  it('tiene columna Folders Found', async () => {
    render(<ScanResults scanId="scan-123" />)
    await waitFor(() => {
      expect(screen.getByText('Folders Found')).toBeInTheDocument()
    })
  })

  it('tiene columna New Folders', async () => {
    render(<ScanResults scanId="scan-123" />)
    await waitFor(() => {
      expect(screen.getByText('New Folders')).toBeInTheDocument()
    })
  })

  it('muestra los paths escaneados', async () => {
    render(<ScanResults scanId="scan-123" />)
    await waitFor(() => {
      expect(screen.getByText('Z:\\Models\\Collection')).toBeInTheDocument()
      expect(screen.getByText('Z:\\Vehicles\\Parts')).toBeInTheDocument()
    })
  })

  it('muestra la fila de totales', async () => {
    render(<ScanResults scanId="scan-123" />)
    await waitFor(() => {
      expect(screen.getByText('Totals')).toBeInTheDocument()
    })
  })

  it('calcula el total de archivos encontrados', async () => {
    render(<ScanResults scanId="scan-123" />)
    // 50 + 30 = 80
    await waitFor(() => {
      expect(screen.getByText('80')).toBeInTheDocument()
    })
  })
})
