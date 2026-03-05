import { useState, lazy, Suspense } from 'react'
import { useMenuStore } from '../store/menu.store'
import { useCartStore } from '@/domains/cart/store/cart.store'
import { useMenuScroll } from '../hooks/useMenuScroll'
import { CategoryTabBar } from './CategoryTabBar'
import { MenuSectionList } from './MenuSectionList'
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner'
import { ErrorMessage } from '@/shared/ui/ErrorMessage'
import { CartFloatingBar } from '@/domains/cart/components/CartFloatingBar'
import type { Menu } from '../model/menu.types'

const MenuDetailSheet = lazy(() =>
  import('./MenuDetailSheet').then((m) => ({ default: m.MenuDetailSheet })),
)

export function MenuPage() {
  const categories = useMenuStore((s) => s.categories)
  const isLoading = useMenuStore((s) => s.isLoading)
  const error = useMenuStore((s) => s.error)
  const addItem = useCartStore((s) => s.addItem)

  const categoryIds = categories.map((c) => c.id)
  const { activeCategoryId, scrollToCategory } = useMenuScroll(categoryIds)

  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleMenuClick = (menu: Menu) => {
    setSelectedMenu(menu)
    setIsDetailOpen(true)
  }

  const handleAddToCart = (menu: Menu) => {
    addItem(menu)
  }

  const handleDetailAddToCart = (menu: Menu, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      addItem(menu)
    }
  }

  if (isLoading) return <LoadingSpinner message="메뉴를 불러오는 중…" />
  if (error) return <ErrorMessage message={error} />

  return (
    <>
      <CategoryTabBar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryClick={scrollToCategory}
      />
      <MenuSectionList
        categories={categories}
        onMenuClick={handleMenuClick}
        onAddToCart={handleAddToCart}
      />
      <CartFloatingBar />
      <Suspense fallback={null}>
        <MenuDetailSheet
          menu={selectedMenu}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onAddToCart={handleDetailAddToCart}
        />
      </Suspense>
    </>
  )
}
