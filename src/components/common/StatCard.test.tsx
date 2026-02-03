import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/test/test-utils'
import StatCard from './StatCard'
import { FileOutlined } from '@ant-design/icons'

describe('StatCard', () => {
  it('renderiza el titulo', () => {
    render(<StatCard title="Total Files" value={100} />)
    expect(screen.getByText('Total Files')).toBeInTheDocument()
  })

  it('renderiza el valor numerico', () => {
    render(<StatCard title="Count" value={42} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renderiza el valor string', () => {
    render(<StatCard title="Size" value="1.5 GB" />)
    expect(screen.getByText('1.5 GB')).toBeInTheDocument()
  })

  it('renderiza con icono', () => {
    render(<StatCard title="Files" value={10} icon={<FileOutlined data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('aplica valueStyle personalizado', () => {
    render(<StatCard title="Test" value={5} valueStyle={{ color: '#ff0000' }} />)
    const valueElement = screen.getByText('5')
    expect(valueElement).toBeInTheDocument()
  })

  it('renderiza sin loading por defecto', () => {
    const { container } = render(<StatCard title="Test" value={1} />)
    expect(container.querySelector('.ant-card-loading-content')).not.toBeInTheDocument()
  })
})
