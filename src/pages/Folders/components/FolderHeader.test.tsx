import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test/test-utils'
import { FolderHeader } from './FolderHeader'

const mockFolder = {
  id: 'folder-1',
  name: 'Test Folder',
  path: 'Z:\\Test\\Path',
  file_count: 10,
  categories: [],
  created_at: '2026-01-17T06:26:28Z',
  updated_at: '2026-01-17T06:26:28Z',
}

const mockCategories = [
  { id: 'cat-1', name: 'Category 1', createdAt: '2026-01-17T06:18:01Z' },
  { id: 'cat-2', name: 'Category 2', createdAt: '2026-01-17T06:18:01Z' },
]

const defaultProps = {
  folder: mockFolder,
  folderCategories: [],
  systemCategories: mockCategories,
  applyToSTL: true,
  applyToZIP: true,
  applyToRAR: true,
  applyToSubfolders: false,
  isUpdating: false,
  isCategoriesLoading: false,
  onCategoryChange: vi.fn(),
  onSync: vi.fn(),
  onApplyToSTLChange: vi.fn(),
  onApplyToZIPChange: vi.fn(),
  onApplyToRARChange: vi.fn(),
  onApplyToSubfoldersChange: vi.fn(),
}

describe('FolderHeader', () => {
  it('muestra el nombre del folder en el titulo', () => {
    render(<FolderHeader {...defaultProps} />)
    expect(screen.getByText('Folder: Test Folder')).toBeInTheDocument()
  })

  it('muestra el path del folder', () => {
    render(<FolderHeader {...defaultProps} />)
    expect(screen.getByText('Z:\\Test\\Path')).toBeInTheDocument()
  })

  it('muestra el label Path:', () => {
    render(<FolderHeader {...defaultProps} />)
    expect(screen.getByText('Path:')).toBeInTheDocument()
  })

  it('muestra el label Folder Categories:', () => {
    render(<FolderHeader {...defaultProps} />)
    expect(screen.getByText('Folder Categories:')).toBeInTheDocument()
  })

  it('muestra checkbox STL files', () => {
    render(<FolderHeader {...defaultProps} />)
    expect(screen.getByText('STL files')).toBeInTheDocument()
  })

  it('muestra checkbox ZIP files', () => {
    render(<FolderHeader {...defaultProps} />)
    expect(screen.getByText('ZIP files')).toBeInTheDocument()
  })

  it('muestra checkbox RAR files', () => {
    render(<FolderHeader {...defaultProps} />)
    expect(screen.getByText('RAR files')).toBeInTheDocument()
  })

  it('muestra checkbox Subfolders', () => {
    render(<FolderHeader {...defaultProps} />)
    expect(screen.getByText('Subfolders')).toBeInTheDocument()
  })

  it('muestra boton Sync', () => {
    render(<FolderHeader {...defaultProps} />)
    expect(screen.getByRole('button', { name: /Sync/i })).toBeInTheDocument()
  })

  it('llama onSync cuando se hace click en Sync', async () => {
    const onSync = vi.fn()
    render(<FolderHeader {...defaultProps} folderCategories={mockCategories} onSync={onSync} />)

    const syncButton = screen.getByRole('button', { name: /Sync/i })
    await userEvent.click(syncButton)

    expect(onSync).toHaveBeenCalled()
  })

  it('deshabilita Sync si no hay categorias', () => {
    render(<FolderHeader {...defaultProps} folderCategories={[]} />)
    const syncButton = screen.getByRole('button', { name: /Sync/i })
    expect(syncButton).toBeDisabled()
  })

  it('muestra checkboxes checked segun props', () => {
    render(<FolderHeader {...defaultProps} applyToSTL={true} applyToZIP={false} />)

    const stlCheckbox = screen.getByRole('checkbox', { name: /STL files/i })
    const zipCheckbox = screen.getByRole('checkbox', { name: /ZIP files/i })

    expect(stlCheckbox).toBeChecked()
    expect(zipCheckbox).not.toBeChecked()
  })
})
