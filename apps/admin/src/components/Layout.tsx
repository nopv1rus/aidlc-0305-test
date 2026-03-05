import { ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Layout({ children }: { children: ReactNode }) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/', label: '📊 대시보드' },
    { path: '/tables', label: '🪑 테이블 관리' },
    { path: '/menus', label: '🍽️ 메뉴 관리' },
    { path: '/history', label: '📋 주문 내역' },
    ...(admin?.role === 'super_admin' ? [{ path: '/super', label: '⚙️ 슈퍼 관리자' }] : []),
  ]

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>🍴 테이블오더</div>
        <div style={styles.navLinks}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navLink,
                ...(location.pathname === item.path ? styles.navLinkActive : {}),
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          로그아웃
        </button>
      </nav>
      <main style={styles.main}>{children}</main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  nav: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#1a1a2e', color: '#fff', padding: '0 24px', height: 56,
  },
  navBrand: { fontWeight: 700, fontSize: 18, marginRight: 24, whiteSpace: 'nowrap' },
  navLinks: { display: 'flex', gap: 4, flex: 1 },
  navLink: {
    color: '#aaa', textDecoration: 'none', padding: '6px 14px',
    borderRadius: 6, fontSize: 14, transition: 'all 0.2s',
  },
  navLinkActive: { color: '#fff', background: '#16213e' },
  logoutBtn: {
    background: 'transparent', border: '1px solid #555', color: '#aaa',
    padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
  },
  main: { padding: 24 },
}
