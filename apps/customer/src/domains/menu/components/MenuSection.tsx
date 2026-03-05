import type { Category, Menu } from '../model/menu.types'
import { MenuCard } from './MenuCard'

interface MenuSectionProps {
  category: Category
  isFirstCategory: boolean
  onMenuClick: (menu: Menu) => void
  onAddToCart: (menu: Menu) => void
}

export function MenuSection({ category, isFirstCategory, onMenuClick, onAddToCart }: MenuSectionProps) {
  return (
    <section
      data-category-section
      data-category-id={category.id}
      className="menu-section px-4"
    >
      <h2 className="sticky top-[155px] z-10 bg-white py-3 text-base font-bold text-gray-900" style={{ scrollMarginTop: '7rem' }}>
        {category.name}
      </h2>
      <div className="divide-y divide-gray-100">
        {category.menus.map((menu, idx) => (
          <MenuCard
            key={menu.id}
            menu={menu}
            onMenuClick={onMenuClick}
            onAddToCart={onAddToCart}
            isFirstCategory={isFirstCategory}
            index={idx}
          />
        ))}
      </div>
    </section>
  )
}
