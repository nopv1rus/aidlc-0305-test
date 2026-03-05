import { useEffect, useRef, useCallback } from 'react'
import type { SSEEvent } from '@/types'

export function useSSE(storeId: string | undefined, onEvent: (event: SSEEvent) => void) {
  const esRef = useRef<EventSource | null>(null)
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  const connect = useCallback(() => {
    if (!storeId) return
    const token = localStorage.getItem('admin_token')
    esRef.current?.close()

    const es = new EventSource(`/api/sse/admin/${storeId}?token=${token}`)

    es.onmessage = (e) => {
      try {
        const parsed: SSEEvent = JSON.parse(e.data)
        onEventRef.current(parsed)
      } catch {}
    }

    es.onerror = () => {
      es.close()
      // 3초 후 재연결
      setTimeout(connect, 3000)
    }

    esRef.current = es
  }, [storeId])

  useEffect(() => {
    connect()
    return () => esRef.current?.close()
  }, [connect])
}
