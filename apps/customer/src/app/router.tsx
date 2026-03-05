import { createBrowserRouter, Navigate, useSearchParams } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from '@/shared/layouts/AppLayout'
import { TokenGuard } from '@/domains/session/components/TokenGuard'
import { PageErrorBoundary } from '@/shared/errors/PageErrorBoundary'
import { PageSkeleton } from '@/shared/ui/PageSkeleton'

/** 루트 경로에서 ?token= 쿼리 파라미터를 읽어 /order/{token} 으로 리다이렉트 */
function RootRedirect() {
  const [params] = useSearchParams()
  const token = params.get('token')
  if (token) {
    return <Navigate to={`/order/${token}`} replace />
  }
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-lg font-semibold text-gray-900">테이블 QR코드를 스캔해주세요</p>
      <p className="mt-2 text-sm text-gray-500">QR코드를 통해 메뉴를 확인하고 주문할 수 있습니다.</p>
    </div>
  )
}

const MenuPage = lazy(() =>
  import('@/domains/menu/components/MenuPage').then((m) => ({ default: m.MenuPage })),
)
const OrderConfirmPage = lazy(() =>
  import('@/domains/order/components/OrderConfirmPage').then((m) => ({ default: m.OrderConfirmPage })),
)
const OrderSuccessPage = lazy(() =>
  import('@/domains/order/components/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })),
)
const OrderHistoryPage = lazy(() =>
  import('@/domains/order/components/OrderHistoryPage').then((m) => ({ default: m.OrderHistoryPage })),
)
const ErrorPage = lazy(() =>
  import('@/pages/ErrorPage').then((m) => ({ default: m.ErrorPage })),
)

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/order/:tableToken',
    element: (
      <TokenGuard>
        <AppLayout />
      </TokenGuard>
    ),
    children: [
      {
        index: true,
        element: (
          <PageErrorBoundary>
            <SuspenseWrapper>
              <MenuPage />
            </SuspenseWrapper>
          </PageErrorBoundary>
        ),
      },
      {
        path: 'confirm',
        element: (
          <PageErrorBoundary>
            <SuspenseWrapper>
              <OrderConfirmPage />
            </SuspenseWrapper>
          </PageErrorBoundary>
        ),
      },
      {
        path: 'success',
        element: (
          <PageErrorBoundary>
            <SuspenseWrapper>
              <OrderSuccessPage />
            </SuspenseWrapper>
          </PageErrorBoundary>
        ),
      },
      {
        path: 'history',
        element: (
          <PageErrorBoundary>
            <SuspenseWrapper>
              <OrderHistoryPage />
            </SuspenseWrapper>
          </PageErrorBoundary>
        ),
      },
    ],
  },
  {
    path: '/order/:tableToken/error',
    element: (
      <SuspenseWrapper>
        <ErrorPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '*',
    element: <RootRedirect />,
  },
])
