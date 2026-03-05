import { useEffect, useState, type ReactNode } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { isValidTableToken } from '@/shared/utils/validation'
import { useSessionStore } from '../store/session.store'
import { useMenuStore } from '@/domains/menu/store/menu.store'
import { useSSEStore } from '@/domains/sse/store/sse.store'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'

interface TokenGuardProps {
  children: ReactNode
}

export function TokenGuard({ children }: TokenGuardProps) {
  const { tableToken } = useParams<{ tableToken: string }>()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  const initSession = useSessionStore((s) => s.initSession)
  const fetchMenus = useMenuStore((s) => s.fetchMenus)
  const session = useSessionStore((s) => s.session)
  const connectSSE = useSSEStore((s) => s.connect)

  useEffect(() => {
    if (!tableToken || !isValidTableToken(tableToken)) {
      setErrorMsg('유효하지 않은 QR코드입니다. 테이블의 QR코드를 다시 스캔해주세요.')
      setStatus('error')
      return
    }

    let cancelled = false

    async function init() {
      try {
        await initSession(tableToken!)
        const storeId = useSessionStore.getState().session?.storeId
        if (storeId && !cancelled) {
          await fetchMenus(storeId)
          const tableId = useSessionStore.getState().session?.tableId
          if (tableId) connectSSE(storeId, tableId)
        }
        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) {
          setErrorMsg(useSessionStore.getState().error ?? '초기화에 실패했습니다. QR코드를 다시 스캔해주세요.')
          setStatus('error')
        }
      }
    }

    init()
    return () => { cancelled = true }
  }, [tableToken, initSession, fetchMenus, connectSSE])

  if (status === 'loading') {
    return <LoadingSpinner message="매장 정보를 불러오는 중…" />
  }

  if (status === 'error' || !session) {
    return <Navigate to={`/order/${tableToken ?? ''}/error`} state={{ message: errorMsg }} replace />
  }

  return <>{children}</>
}
