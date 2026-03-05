import { useEffect, useRef, useState, useCallback } from 'react'

export function useMenuScroll(categoryIds: string[]) {
  const [activeCategoryId, setActiveCategoryId] = useState(categoryIds[0] ?? '')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-category-id')
            if (id) setActiveCategoryId(id)
            break
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 },
    )

    const sections = document.querySelectorAll('[data-category-section]')
    sections.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [categoryIds])

  const scrollToCategory = useCallback((categoryId: string) => {
    isScrollingRef.current = true
    setActiveCategoryId(categoryId)

    const el = document.querySelector(`[data-category-id="${categoryId}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    setTimeout(() => {
      isScrollingRef.current = false
    }, 800)
  }, [])

  return { activeCategoryId, scrollToCategory }
}
