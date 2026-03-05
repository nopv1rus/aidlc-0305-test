import { RouterProvider } from 'react-router-dom'
import { AppErrorBoundary } from './error-boundary'
import { AppProvider } from './AppProvider'
import { router } from './router'

export function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </AppErrorBoundary>
  )
}
