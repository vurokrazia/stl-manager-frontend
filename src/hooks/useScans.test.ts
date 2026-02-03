import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useScan, useScanStatus, useScanPaths, useCreateScan } from './useScans'
import { createWrapper } from '@/test/hook-test-utils'

describe('useScan', () => {
  it('retorna datos del scan', async () => {
    const { result } = renderHook(() => useScan('scan-123'), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.status).toBe('completed')
  })

  it('no hace fetch si enabled es false', async () => {
    const { result } = renderHook(() => useScan('scan-123', false), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('no hace fetch si id es vacio', async () => {
    const { result } = renderHook(() => useScan(''), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})

describe('useScanStatus', () => {
  it('es alias de useScan', async () => {
    const { result } = renderHook(() => useScanStatus('scan-123'), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.status).toBe('completed')
  })
})

describe('useScanPaths', () => {
  it('retorna paths del scan', async () => {
    const { result } = renderHook(() => useScanPaths('scan-123'), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data?.length).toBe(2)
  })

  it('incluye root_path en cada item', async () => {
    const { result } = renderHook(() => useScanPaths('scan-123'), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.[0].root_path).toBeDefined()
  })

  it('no hace fetch si enabled es false', async () => {
    const { result } = renderHook(() => useScanPaths('scan-123', false), { wrapper: createWrapper() })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})

describe('useCreateScan', () => {
  it('tiene funcion mutate', () => {
    const { result } = renderHook(() => useCreateScan(), { wrapper: createWrapper() })

    expect(result.current.mutate).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('tiene estado isPending inicial false', () => {
    const { result } = renderHook(() => useCreateScan(), { wrapper: createWrapper() })

    expect(result.current.isPending).toBe(false)
  })
})
