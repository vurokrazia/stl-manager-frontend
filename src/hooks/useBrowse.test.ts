import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBrowse, useFolders, useFolder, useUpdateFolderCategories } from './useBrowse'
import { createWrapper } from '@/test/hook-test-utils'

describe('useBrowse', () => {
  it('retorna datos de folders', async () => {
    const { result } = renderHook(() => useBrowse(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toBeDefined()
  })
})

describe('useFolders', () => {
  it('retorna lista de folders', async () => {
    const { result } = renderHook(() => useFolders(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toBeDefined()
    expect(result.current.data?.items.length).toBeGreaterThan(0)
  })

  it('retorna total de folders', async () => {
    const { result } = renderHook(() => useFolders(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.total).toBe(3)
  })
})

describe('useFolder', () => {
  it('retorna detalles del folder', async () => {
    const folderId = '47dc8890-45bd-4b45-bd26-329bc6fd04fb'
    const { result } = renderHook(() => useFolder(folderId), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.folder).toBeDefined()
    expect(result.current.data?.folder.id).toBe(folderId)
  })

  it('retorna archivos del folder', async () => {
    const folderId = '47dc8890-45bd-4b45-bd26-329bc6fd04fb'
    const { result } = renderHook(() => useFolder(folderId), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.files).toBeDefined()
  })

  it('no hace fetch si id es vacio', async () => {
    const { result } = renderHook(() => useFolder(''), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})

describe('useUpdateFolderCategories', () => {
  it('tiene funcion mutate', () => {
    const { result } = renderHook(() => useUpdateFolderCategories(), { wrapper: createWrapper() })

    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('tiene estado isPending inicial false', () => {
    const { result } = renderHook(() => useUpdateFolderCategories(), { wrapper: createWrapper() })

    expect(result.current.isPending).toBe(false)
  })
})
