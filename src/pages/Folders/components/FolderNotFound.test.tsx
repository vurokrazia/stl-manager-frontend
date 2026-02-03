import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/test-utils'
import { FolderNotFound } from './FolderNotFound'

describe('FolderNotFound', () => {
  const defaultProps = {
    retryCountdown: 0,
    onRetry: vi.fn(),
    onGoHome: vi.fn(),
  }

  it('muestra el titulo "Carpeta no encontrada"', () => {
    render(<FolderNotFound {...defaultProps} />)
    expect(screen.getByText('Carpeta no encontrada')).toBeInTheDocument()
  })

  it('muestra el subtitulo descriptivo', () => {
    render(<FolderNotFound {...defaultProps} />)
    expect(screen.getByText(/Lo sentimos, la carpeta que buscas no existe/)).toBeInTheDocument()
  })

  it('muestra boton "Volver a intentar"', () => {
    render(<FolderNotFound {...defaultProps} />)
    expect(screen.getByRole('button', { name: /Volver a intentar/i })).toBeInTheDocument()
  })

  it('muestra boton "Volver al inicio"', () => {
    render(<FolderNotFound {...defaultProps} />)
    expect(screen.getByRole('button', { name: /Volver al inicio/i })).toBeInTheDocument()
  })

  it('muestra countdown cuando retryCountdown > 0', () => {
    render(<FolderNotFound {...defaultProps} retryCountdown={15} />)
    expect(screen.getByText(/Volver a intentar \(15s\)/)).toBeInTheDocument()
  })

  it('deshabilita boton retry durante countdown', () => {
    render(<FolderNotFound {...defaultProps} retryCountdown={10} />)
    const retryButton = screen.getByRole('button', { name: /Volver a intentar/i })
    expect(retryButton).toBeDisabled()
  })

  it('habilita boton retry cuando countdown es 0', () => {
    render(<FolderNotFound {...defaultProps} retryCountdown={0} />)
    const retryButton = screen.getByRole('button', { name: /Volver a intentar/i })
    expect(retryButton).not.toBeDisabled()
  })

  it('llama onRetry cuando se hace click', async () => {
    const onRetry = vi.fn()
    render(<FolderNotFound {...defaultProps} onRetry={onRetry} />)

    const retryButton = screen.getByRole('button', { name: /Volver a intentar/i })
    await userEvent.click(retryButton)

    expect(onRetry).toHaveBeenCalled()
  })

  it('llama onGoHome cuando se hace click en Volver al inicio', async () => {
    const onGoHome = vi.fn()
    render(<FolderNotFound {...defaultProps} onGoHome={onGoHome} />)

    const homeButton = screen.getByRole('button', { name: /Volver al inicio/i })
    await userEvent.click(homeButton)

    expect(onGoHome).toHaveBeenCalled()
  })
})
