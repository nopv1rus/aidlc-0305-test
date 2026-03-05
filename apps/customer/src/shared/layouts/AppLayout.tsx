import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { SkipLink } from '../ui/SkipLink'
import { ConnectionBanner } from '../ui/ConnectionBanner'
import { useSSEStore } from '@/domains/sse/store/sse.store'
import { useNetworkStore } from '../network/network.store'

export function AppLayout() {
  const sseConnected = useSSEStore((s) => s.isConnected)
  const isOnline = useNetworkStore((s) => s.isOnline)

  return (
    <div className="mx-auto min-h-dvh max-w-[480px] bg-white" style={{ paddingLeft: 'var(--safe-area-left)', paddingRight: 'var(--safe-area-right)' }}>
      <SkipLink />
      {!isOnline ? (
        <div role="status" aria-live="polite" className="bg-red-500 px-4 py-2 text-center text-sm font-medium text-white">
          네트워크 연결이 끊어졌습니다
        </div>
      ) : null}
      <ConnectionBanner isConnected={sseConnected} />
      <Header />
      <main id="main-content" className="pb-24">
        <Outlet />
      </main>
    </div>
  )
}
