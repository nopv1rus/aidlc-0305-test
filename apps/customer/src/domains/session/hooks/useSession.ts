import { useSessionStore } from '../store/session.store'

export function useSession() {
  const session = useSessionStore((s) => s.session)
  const storeName = useSessionStore((s) => s.storeName)
  const tableNumber = useSessionStore((s) => s.tableNumber)
  const isSessionValid = useSessionStore((s) => s.isSessionValid)

  return { session, storeName, tableNumber, isSessionValid }
}
