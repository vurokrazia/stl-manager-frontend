import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
})

export function createWrapper() {
  const queryClient = createTestQueryClient()
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

interface RouterWrapperOptions {
  route?: string
  path?: string
}

export function createRouterWrapper(options: RouterWrapperOptions = {}) {
  const { route = '/', path = '/' } = options
  const queryClient = createTestQueryClient()

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path={path} element={children} />
          </Routes>
        </QueryClientProvider>
      </MemoryRouter>
    )
  }
}
