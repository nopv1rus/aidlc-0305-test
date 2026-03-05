import { formatCurrency } from '../utils/format'

interface PriceDisplayProps {
  amount: number
  className?: string
}

export function PriceDisplay({ amount, className = '' }: PriceDisplayProps) {
  return (
    <span className={`tabular-nums ${className}`} data-testid="price-display">
      {formatCurrency(amount)}
    </span>
  )
}
