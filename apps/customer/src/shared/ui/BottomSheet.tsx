import { type ReactNode, useEffect, useRef, useCallback } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Focus trap
      if (e.key === 'Tab' && sheetRef.current) {
        const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]!
        const last = focusable[focusable.length - 1]!
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.classList.add('sheet-open')
      document.addEventListener('keydown', handleKeyDown)
      // Focus first focusable element
      requestAnimationFrame(() => {
        const first = sheetRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        first?.focus()
      })
    } else {
      document.body.classList.remove('sheet-open')
      previousFocusRef.current?.focus()
    }
    return () => {
      document.body.classList.remove('sheet-open')
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end bottom-sheet-overlay" data-testid="bottom-sheet">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white pb-[calc(1rem+var(--safe-area-bottom))] transition-transform duration-300"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Handle */}
        <div className="sticky top-0 z-10 flex justify-center bg-white pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-gray-300" aria-hidden="true" />
        </div>
        {/* Close button */}
        <div className="flex items-center justify-between px-4 pb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-full p-2 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500"
            data-testid="bottom-sheet-close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-4">{children}</div>
      </div>
    </div>
  )
}
