import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { render } from '@/test/test-utils'
import ScanProgress from './ScanProgress'

describe('ScanProgress', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('no renderiza nada si scanId es null', () => {
    const { container } = render(<ScanProgress scanId={null} onClose={mockOnClose} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renderiza el modal cuando hay scanId', async () => {
    render(<ScanProgress scanId="scan-123" onClose={mockOnClose} />)
    await waitFor(() => {
      expect(screen.getByText('File Scan Progress')).toBeInTheDocument()
    })
  })

  it('muestra el estado completed', async () => {
    render(<ScanProgress scanId="scan-123" onClose={mockOnClose} />)
    await waitFor(() => {
      expect(screen.getByText('Scan Completed!')).toBeInTheDocument()
    })
  })

  it('muestra el conteo de archivos escaneados', async () => {
    render(<ScanProgress scanId="scan-123" onClose={mockOnClose} />)
    await waitFor(() => {
      expect(screen.getByText(/Successfully scanned 10 files!/)).toBeInTheDocument()
    })
  })

  it('muestra la seccion Scan Details cuando completado', async () => {
    render(<ScanProgress scanId="scan-123" onClose={mockOnClose} />)
    await waitFor(() => {
      expect(screen.getByText('Scan Details')).toBeInTheDocument()
    })
  })
})
