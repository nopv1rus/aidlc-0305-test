import { useCartStore } from '../store/cart.store'

export function useCartTotal() {
  const items = useCartStore((s) => s.items)
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { totalAmount, totalCount }
}
