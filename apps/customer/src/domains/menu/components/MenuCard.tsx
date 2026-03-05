import { memo } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import type { Menu } from '../model/menu.types'
import { Badge } from '@/shared/ui/Badge'
import { PriceDisplay } from '@/shared/ui/PriceDisplay'

interface MenuCardProps {
  menu: Menu
  onMenuClick: (menu: Menu) => void
  onAddToCart: (menu: Menu) => void
  isFirstCategory?: boolean
  index?: number
}

export const MenuCard = memo(function MenuCard({ menu, onMenuClick, onAddToCart, isFirstCategory, index }: MenuCardProps) {
  const isAboveFold = isFirstCategory && (index ?? 0) < 4

  return (
    <div className="flex gap-3 py-3" data-testid={`menu-card-${menu.id}`}>
      <button
        type="button"
        onClick={() => onMenuClick(menu)}
        className="flex min-w-0 flex-1 gap-3 text-left focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
        aria-label={`${menu.name} 상세 보기`}
      >
        {menu.imageUrl ? (
          <img
            src={menu.imageUrl}
            alt={menu.name}
            width={80}
            height={80}
            loading={isAboveFold ? 'eager' : 'lazy'}
            fetchPriority={isAboveFold ? 'high' : undefined}
            className="h-20 w-20 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100" aria-hidden="true">
            <span className="text-2xl text-gray-300">🍽</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-medium text-gray-900">{menu.name}</h3>
            {menu.badge ? <Badge variant={menu.badge} /> : null}
          </div>
          {menu.description ? (
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{menu.description}</p>
          ) : null}
          <PriceDisplay amount={menu.price} className="mt-1 text-sm font-semibold text-gray-900" />
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onAddToCart(menu)
        }}
        aria-label={`${menu.name} 장바구니에 담기`}
        className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500"
        data-testid={`add-to-cart-${menu.id}`}
      >
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
})
