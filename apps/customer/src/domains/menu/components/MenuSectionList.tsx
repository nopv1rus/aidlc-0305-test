import type { Category, Menu } from '../model/menu.types'
import { MenuSection } from './MenuSection'

interface MenuSectionListProps {
  categories: Category[]
  onMenuClick: (menu: Menu) => void
  onAddToCart: (menu: Menu) => void
}

export function MenuSectionList({ categories, onMenuClick, onAddToCart }: MenuSectionListProps) {
  return (
    <div data-testid="menu-section-list">
      {categories.map((cat, idx) => (
        <MenuSection
          key={cat.id}
          category={cat}
          isFirstCategory={idx === 0}
          onMenuClick={onMenuClick}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
