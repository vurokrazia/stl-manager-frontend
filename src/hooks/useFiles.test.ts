import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFiles, useFile, useReclassifyFile, useUpdateCategories } from './useFiles'
import { createWrapper } from '@/test/hook-test-utils'

describe('useFiles', () => {
  it('retorna datos de archivos', async () => {
    const { result } = renderHook(() => useFiles(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toBeDefined()
    expect(result.current.data?.items.length).toBe(3)
  })

  it('retorna total de archivos', async () => {
    const { result } = renderHook(() => useFiles(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.total).toBe(3)
  })

  it('filtra por tipo', async () => {
    const { result } = renderHook(() => useFiles({ type: 'stl' }), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items.every(f => f.type === 'stl')).toBe(true)
  })
})

describe('useFile', () => {
  it('no hace fetch si enabled es false', async () => {
    const { result } = renderHook(() => useFile('file-1', false), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})

describe('useReclassifyFile', () => {
  it('tiene funcion mutate', () => {
    const { result } = renderHook(() => useReclassifyFile(), { wrapper: createWrapper() })

    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('tiene estado isPending inicial false', () => {
    const { result } = renderHook(() => useReclassifyFile(), { wrapper: createWrapper() })

    expect(result.current.isPending).toBe(false)
  })
})

describe('useUpdateCategories', () => {
  it('tiene funcion mutate', () => {
    const { result } = renderHook(() => useUpdateCategories(), { wrapper: createWrapper() })

    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('tiene estado isPending inicial false', () => {
    const { result } = renderHook(() => useUpdateCategories(), { wrapper: createWrapper() })

    expect(result.current.isPending).toBe(false)
  })
})
