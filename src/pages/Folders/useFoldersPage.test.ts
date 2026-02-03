import { describe, it, expect } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useFoldersPage } from './useFoldersPage'
import { createRouterWrapper } from '@/test/hook-test-utils'

describe('useFoldersPage', () => {
  it('retorna folders', async () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    await waitFor(() => {
      expect(result.current.folders.length).toBeGreaterThan(0)
    })
  })

  it('retorna total de folders', async () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    await waitFor(() => {
      expect(result.current.total).toBe(3)
    })
  })

  it('retorna categorias', async () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    await waitFor(() => {
      expect(result.current.categories.length).toBeGreaterThan(0)
    })
  })

  it('tiene estado inicial page = 1', () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    expect(result.current.page).toBe(1)
  })

  it('tiene estado inicial pageSize = 20', () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    expect(result.current.pageSize).toBe(20)
  })

  it('tiene estado inicial searchText vacio', () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    expect(result.current.searchText).toBe('')
  })

  it('tiene funcion setSearchText', () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    expect(typeof result.current.setSearchText).toBe('function')
  })

  it('actualiza searchText', async () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    act(() => {
      result.current.setSearchText('test')
    })

    expect(result.current.searchText).toBe('test')
  })

  it('tiene funcion handlePaginationChange', () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    expect(typeof result.current.handlePaginationChange).toBe('function')
  })

  it('tiene funcion handleCategoryChange', () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    expect(typeof result.current.handleCategoryChange).toBe('function')
  })

  it('tiene funcion handleFolderClick', () => {
    const { result } = renderHook(() => useFoldersPage(), {
      wrapper: createRouterWrapper({ route: '/all-folders', path: '/all-folders' })
    })

    expect(typeof result.current.handleFolderClick).toBe('function')
  })
})
