import { useEffect, type ReactNode } from 'react'
import { initOnlineDetector } from '@/shared/network/online-detector'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    const cleanup = initOnlineDetector()
    return cleanup
  }, [])

  return <>{children}</>
}
