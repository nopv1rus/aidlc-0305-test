import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { loginAdmin, loginSuperAdmin } from '@/api/auth'

export default function LoginPage() {
  const [mode, setMode] = useState<'store' | 'super'>('store')
  const [storeIdentifier, setStoreIdentifier] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = mode === 'store'
        ? await loginAdmin(storeIdentifier, password)
        : await loginSuperAdmin(username, password)
      login(res.data.accessToken, res.data.admin)
      navigate('/')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      if (msg?.includes('locked') || msg?.includes('잠금')) {
        setError('계정이 일시 잠금되었습니다. 잠시 후 다시 시도해주세요.')
      } else {
        setError('로그인 정보를 확인해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🍴 테이블오더 관리자</h1>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === 'store' ? styles.tabActive : {}) }}
            onClick={() => setMode('store')}
          >매장 관리자</button>
          <button
            style={{ ...styles.tab, ...(mode === 'super' ? styles.tabActive : {}) }}
            onClick={() => setMode('super')}
          >슈퍼 관리자</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'store' ? (
            <input
              style={styles.input}
              placeholder="매장 식별자"
              value={storeIdentifier}
              onChange={(e) => setStoreIdentifier(e.target.value)}
              required
            />
          ) : (
            <input
              style={styles.input}
              placeholder="사용자명"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            style={styles.input}
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#f0f2f5',
  },
  card: {
    background: '#fff', borderRadius: 16, padding: 40,
    width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
  },
  title: { textAlign: 'center', marginBottom: 28, fontSize: 22, color: '#1a1a2e' },
  tabs: { display: 'flex', marginBottom: 24, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' },
  tab: {
    flex: 1, padding: '10px 0', border: 'none', background: '#f7fafc',
    cursor: 'pointer', fontSize: 14, color: '#718096',
  },
  tabActive: { background: '#1a1a2e', color: '#fff' },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  input: {
    padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0',
    fontSize: 15, outline: 'none',
  },
  error: { color: '#e53e3e', fontSize: 13, margin: 0 },
  submitBtn: {
    padding: '13px', borderRadius: 8, border: 'none',
    background: '#1a1a2e', color: '#fff', fontSize: 15,
    cursor: 'pointer', fontWeight: 600,
  },
}
