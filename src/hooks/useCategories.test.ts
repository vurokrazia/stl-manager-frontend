import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from './useCategories'
import { createWrapper } from '@/test/hook-test-utils'

describe('useCategories', () => {
  it('retorna datos de categorias', async () => {
    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toBeDefined()
  })

  it('retorna lista de categorias', async () => {
    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items.length).toBeGreaterThan(0)
  })

  it('incluye categoria adapter', async () => {
    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const hasAdapter = result.current.data?.items.some(c => c.name === 'adapter')
    expect(hasAdapter).toBe(true)
  })
})

describe('useCreateCategory', () => {
  it('tiene funcion mutate', () => {
    const { result } = renderHook(() => useCreateCategory(), { wrapper: createWrapper() })

    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('tiene estado isPending inicial false', () => {
    const { result } = renderHook(() => useCreateCategory(), { wrapper: createWrapper() })

    expect(result.current.isPending).toBe(false)
  })
})

describe('useUpdateCategory', () => {
  it('tiene funcion mutate', () => {
    const { result } = renderHook(() => useUpdateCategory(), { wrapper: createWrapper() })

    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('tiene estado isPending inicial false', () => {
    const { result } = renderHook(() => useUpdateCategory(), { wrapper: createWrapper() })

    expect(result.current.isPending).toBe(false)
  })
})

describe('useDeleteCategory', () => {
  it('tiene funcion mutate', () => {
    const { result } = renderHook(() => useDeleteCategory(), { wrapper: createWrapper() })

    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('tiene estado isPending inicial false', () => {
    const { result } = renderHook(() => useDeleteCategory(), { wrapper: createWrapper() })

    expect(result.current.isPending).toBe(false)
  })
})
