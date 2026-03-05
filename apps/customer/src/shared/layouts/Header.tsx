import { NavLink } from 'react-router-dom'
import { useSessionStore } from '@/domains/session/store/session.store'

export function Header() {
  const storeName = useSessionStore((s) => s.session?.storeId ? '테이블오더' : '테이블오더')

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900 truncate min-w-0">{storeName}</h1>
      </div>
      <nav className="flex border-t border-gray-100" aria-label="메인 네비게이션">
        <NavLink
          to="."
          end
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-sm font-medium transition-colors duration-150 ${
              isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`
          }
          data-testid="nav-menu"
        >
          메뉴
        </NavLink>
        <NavLink
          to="history"
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-sm font-medium transition-colors duration-150 ${
              isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`
          }
          data-testid="nav-history"
        >
          주문내역
        </NavLink>
      </nav>
    </header>
  )
}
