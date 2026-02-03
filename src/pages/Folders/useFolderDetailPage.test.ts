import { describe, it, expect } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useFolderDetailPage } from './useFolderDetailPage'
import { createRouterWrapper } from '@/test/hook-test-utils'

const folderId = '47dc8890-45bd-4b45-bd26-329bc6fd04fb'

describe('useFolderDetailPage', () => {
  it('retorna folderData', async () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    await waitFor(() => {
      expect(result.current.folderData).toBeDefined()
    })
  })

  it('retorna categorias', async () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    await waitFor(() => {
      expect(result.current.categories.length).toBeGreaterThan(0)
    })
  })

  it('tiene estado inicial page = 1', () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    expect(result.current.page).toBe(1)
  })

  it('tiene estado inicial pageSize = 50', () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    expect(result.current.pageSize).toBe(50)
  })

  it('tiene estado inicial applyToSTL = true', () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    expect(result.current.applyToSTL).toBe(true)
  })

  it('tiene estado inicial applyToZIP = true', () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    expect(result.current.applyToZIP).toBe(true)
  })

  it('tiene estado inicial applyToRAR = true', () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    expect(result.current.applyToRAR).toBe(true)
  })

  it('tiene estado inicial applyToSubfolders = false', () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    expect(result.current.applyToSubfolders).toBe(false)
  })

  it('tiene funcion setSearchText', () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    expect(typeof result.current.setSearchText).toBe('function')
  })

  it('actualiza searchText', async () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    act(() => {
      result.current.setSearchText('test search')
    })

    expect(result.current.searchText).toBe('test search')
  })

  it('actualiza applyToSTL', async () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    act(() => {
      result.current.setApplyToSTL(false)
    })

    expect(result.current.applyToSTL).toBe(false)
  })

  it('tiene funcion handleFolderCategoryChange', () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    expect(typeof result.current.handleFolderCategoryChange).toBe('function')
  })

  it('tiene funcion handleSyncCategories', () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    expect(typeof result.current.handleSyncCategories).toBe('function')
  })

  it('tiene funcion handlePaginationChange', () => {
    const { result } = renderHook(() => useFolderDetailPage(), {
      wrapper: createRouterWrapper({
        route: `/folders/${folderId}`,
        path: '/folders/:id'
      })
    })

    expect(typeof result.current.handlePaginationChange).toBe('function')
  })
})
