import { useRef, useEffect, useCallback } from 'react'
import type { Category } from '../model/menu.types'

interface CategoryTabBarProps {
  categories: Category[]
  activeCategoryId: string
  onCategoryClick: (categoryId: string) => void
}

export function CategoryTabBar({ categories, activeCategoryId, onCategoryClick }: CategoryTabBarProps) {
  const tabListRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef<HTMLButtonElement>(null)

  // 활성 탭이 보이도록 자동 스크롤
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeCategoryId])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = categories.findIndex((c) => c.id === activeCategoryId)
      if (e.key === 'ArrowRight' && idx < categories.length - 1) {
        e.preventDefault()
        onCategoryClick(categories[idx + 1]!.id)
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault()
        onCategoryClick(categories[idx - 1]!.id)
      }
    },
    [categories, activeCategoryId, onCategoryClick],
  )

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label="메뉴 카테고리"
      className="sticky top-[105px] z-20 flex gap-1 overflow-x-auto border-b border-gray-100 bg-white px-4 py-2 scrollbar-none"
      onKeyDown={handleKeyDown}
      data-testid="category-tab-bar"
    >
      {categories.map((cat) => {
        const isActive = cat.id === activeCategoryId
        return (
          <button
            key={cat.id}
            ref={isActive ? activeTabRef : undefined}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onCategoryClick(cat.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            data-testid={`category-tab-${cat.id}`}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
