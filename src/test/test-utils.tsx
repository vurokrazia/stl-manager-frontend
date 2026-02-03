import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'

// Create a new QueryClient for each test
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

interface AllProvidersProps {
  children: React.ReactNode
}

function AllProviders({ children }: AllProvidersProps) {
  const queryClient = createTestQueryClient()

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

interface RenderWithRouteOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string
  path?: string
}

function renderWithRoute(
  ui: ReactElement,
  { route = '/', path = '/', ...options }: RenderWithRouteOptions = {}
) {
  const queryClient = createTestQueryClient()

  return render(
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <Routes>
            <Route path={path} element={ui} />
          </Routes>
        </ConfigProvider>
      </QueryClientProvider>
    </MemoryRouter>,
    options
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { customRender as render, renderWithRoute }
