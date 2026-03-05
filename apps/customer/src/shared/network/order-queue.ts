import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage'

interface QueuedOrder {
  id: string
  payload: {
    storeId: string
    tableId: string
    sessionId: string | null
    items: { menuId: string; quantity: number }[]
  }
  queuedAt: string
  retryCount: number
  status: 'pending' | 'sending' | 'failed'
}

const MAX_QUEUE_SIZE = 5

function getQueueKey(tableToken: string): string {
  return `orderQueue:v1:${tableToken}`
}

export function getQueuedOrders(tableToken: string): QueuedOrder[] {
  return getStorageItem<QueuedOrder[]>(getQueueKey(tableToken)) ?? []
}

export function enqueueOrder(
  tableToken: string,
  order: Omit<QueuedOrder, 'queuedAt' | 'retryCount' | 'status'>,
): void {
  const queue = getQueuedOrders(tableToken)
  const newQueue = [
    ...queue,
    { ...order, queuedAt: new Date().toISOString(), retryCount: 0, status: 'pending' as const },
  ].slice(-MAX_QUEUE_SIZE)
  setStorageItem(getQueueKey(tableToken), newQueue)
}

export function dequeueOrder(tableToken: string, orderId: string): void {
  const queue = getQueuedOrders(tableToken).filter((o) => o.id !== orderId)
  setStorageItem(getQueueKey(tableToken), queue)
}

export function clearOrderQueue(tableToken: string): void {
  removeStorageItem(getQueueKey(tableToken))
}
