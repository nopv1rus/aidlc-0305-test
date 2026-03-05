import { useLocation, useParams, Link } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { CountdownRedirect } from './CountdownRedirect'

export function OrderSuccessPage() {
  const location = useLocation()
  const { tableToken } = useParams<{ tableToken: string }>()
  const orderNumber = (location.state as { orderNumber?: string })?.orderNumber ?? ''

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center" data-testid="order-success-page">
      <CheckCircleIcon className="h-16 w-16 text-green-500" aria-hidden="true" />
      <h2 className="mt-4 text-xl font-bold text-gray-900">주문이 접수되었습니다</h2>
      {orderNumber ? (
        <p className="mt-2 text-lg tabular-nums font-semibold text-blue-600">{orderNumber}</p>
      ) : null}
      <div className="mt-6">
        <CountdownRedirect />
      </div>
      <Link
        to={`/order/${tableToken}`}
        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        data-testid="order-success-back-link"
      >
        메뉴로 돌아가기
      </Link>
    </div>
  )
}
