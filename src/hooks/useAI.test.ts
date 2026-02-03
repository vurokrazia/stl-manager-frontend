import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAIStatus } from './useAI'
import { createWrapper } from '@/test/hook-test-utils'

describe('useAIStatus', () => {
  it('retorna estado de AI', async () => {
    const { result } = renderHook(() => useAIStatus(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
  })

  it('retorna enabled como boolean', async () => {
    const { result } = renderHook(() => useAIStatus(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.enabled).toBe(true)
  })

  it('retorna provider', async () => {
    const { result } = renderHook(() => useAIStatus(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.provider).toBe('ollama')
  })

  it('retorna model', async () => {
    const { result } = renderHook(() => useAIStatus(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.model).toBe('llama2')
  })
})
