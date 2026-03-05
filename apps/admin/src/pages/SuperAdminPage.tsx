import { useState, useEffect, useCallback } from 'react'
import {
  getStores, createStore, deleteStore,
  getStoreAdmins, createStoreAdmin, deleteStoreAdmin,
} from '@/api/admin'
import { getTables } from '@/api/tables'
import ConfirmModal from '@/components/ConfirmModal'
import type { Store, Admin } from '@/types'

type Tab = 'stores' | 'accounts'

interface StoreWithTableCount extends Store {
  tableCount: number
}

export default function SuperAdminPage() {
  const [tab, setTab] = useState<Tab>('stores')
  const [stores, setStores] = useState<StoreWithTableCount[]>([])
  const [accounts, setAccounts] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)

  // 매장 등록 폼
  const [storeName, setStoreName] = useState('')
  const [storeSubmitting, setStoreSubmitting] = useState(false)

  // 계정 생성 폼
  const [selectedStoreId, setSelectedStoreId] = useState('')
  const [accountIdentifier, setAccountIdentifier] = useState('')
  const [accountPassword, setAccountPassword] = useState('')
  const [accountSubmitting, setAccountSubmitting] = useState(false)

  // 필터
  const [storeFilter, setStoreFilter] = useState('')
  const [accountFilter, setAccountFilter] = useState('')

  // 피드백
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null)
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null)

  const showFeedback = (msg: string, ok = true) => {
    setFeedback({ msg, ok })
    setTimeout(() => setFeedback(null), 3500)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [storeRes, accountRes] = await Promise.all([getStores(), getStoreAdmins()])
      // 각 매장의 테이블 수 병렬 조회
      const storesWithCount: StoreWithTableCount[] = await Promise.all(
        storeRes.data.map(async (s) => {
          try {
            const tableRes = await getTables(s.id)
            return { ...s, tableCount: tableRes.data.length }
          } catch {
            return { ...s, tableCount: 0 }
          }
        })
      )
      setStores(storesWithCount)
      setAccounts(accountRes.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // ── 매장 등록 ──────────────────────────────────────────
  const handleCreateStore = async () => {
    if (!storeName.trim()) { showFeedback('매장명을 입력해주세요.', false); return }
    setStoreSubmitting(true)
    try {
      const res = await createStore(storeName.trim())
      setStoreName('')
      showFeedback(`매장 등록 완료! 식별자: ${res.data.identifier}`)
      load()
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      showFeedback(msg ?? '매장 등록에 실패했습니다.', false)
    } finally {
      setStoreSubmitting(false)
    }
  }

  // ── 매장 삭제 ──────────────────────────────────────────
  const handleDeleteStore = (store: StoreWithTableCount) => {
    setConfirm({
      message: `"${store.name}" 매장을 삭제하시겠습니까?\n연결된 계정과 데이터도 함께 삭제됩니다.`,
      onConfirm: async () => {
        try {
          await deleteStore(store.id)
          showFeedback(`"${store.name}" 매장이 삭제되었습니다.`)
          load()
        } catch {
          showFeedback('매장 삭제에 실패했습니다.', false)
        } finally {
          setConfirm(null)
        }
      },
    })
  }

  // ── 계정 생성 ──────────────────────────────────────────
  const handleCreateAccount = async () => {
    if (!selectedStoreId) { showFeedback('매장을 선택해주세요.', false); return }
    if (!accountIdentifier.trim()) { showFeedback('식별자를 입력해주세요.', false); return }
    if (accountPassword.length < 4) { showFeedback('비밀번호는 4자 이상이어야 합니다.', false); return }
    setAccountSubmitting(true)
    try {
      await createStoreAdmin(selectedStoreId, accountIdentifier.trim(), accountPassword)
      setSelectedStoreId(''); setAccountIdentifier(''); setAccountPassword('')
      showFeedback('관리자 계정이 생성되었습니다.')
      load()
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      showFeedback(msg ?? '계정 생성에 실패했습니다.', false)
    } finally {
      setAccountSubmitting(false)
    }
  }

  // ── 계정 삭제 ──────────────────────────────────────────
  const handleDeleteAccount = (account: Admin) => {
    const store = stores.find((s) => s.id === account.storeId)
    setConfirm({
      message: `"${account.storeIdentifier}" 계정을 삭제하시겠습니까?${store ? `\n(${store.name})` : ''}`,
      onConfirm: async () => {
        try {
          await deleteStoreAdmin(account.id)
          showFeedback('계정이 삭제되었습니다.')
          load()
        } catch {
          showFeedback('계정 삭제에 실패했습니다.', false)
        } finally {
          setConfirm(null)
        }
      },
    })
  }

  // ── 필터 ──────────────────────────────────────────────
  const filteredStores = storeFilter
    ? stores.filter((s) =>
        s.name.includes(storeFilter) || s.identifier.includes(storeFilter)
      )
    : stores

  const filteredAccounts = accountFilter
    ? accounts.filter((a) => {
        const store = stores.find((s) => s.id === a.storeId)
        return (
          a.storeIdentifier?.includes(accountFilter) ||
          store?.name.includes(accountFilter) ||
          store?.identifier.includes(accountFilter)
        )
      })
    : accounts

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>로딩 중...</div>

  return (
    <div>
      <h2 style={s.title}>⚙️ 슈퍼 관리자</h2>

      {feedback && (
        <div style={{ ...s.feedback, background: feedback.ok ? '#f0fff4' : '#fff5f5', color: feedback.ok ? '#276749' : '#e53e3e', borderColor: feedback.ok ? '#c6f6d5' : '#fed7d7' }}>
          {feedback.ok ? '✅' : '❌'} {feedback.msg}
        </div>
      )}

      {/* 탭 */}
      <div style={s.tabs}>
        <button style={{ ...s.tab, ...(tab === 'stores' ? s.tabActive : {}) }} onClick={() => setTab('stores')}>
          🏪 매장 관리 ({stores.length})
        </button>
        <button style={{ ...s.tab, ...(tab === 'accounts' ? s.tabActive : {}) }} onClick={() => setTab('accounts')}>
          👤 계정 관리 ({accounts.filter(a => a.role === 'store_admin').length})
        </button>
      </div>

      {/* ── 매장 관리 탭 ── */}
      {tab === 'stores' && (
        <div>
          {/* 등록 폼 */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>새 매장 등록</h3>
            <div style={s.formRow}>
              <input
                style={s.input}
                placeholder="매장명 *"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateStore()}
              />
              <button style={s.primaryBtn} onClick={handleCreateStore} disabled={storeSubmitting}>
                {storeSubmitting ? '등록 중...' : '+ 등록'}
              </button>
            </div>
            <p style={s.hint}>매장 식별자는 매장명 기반으로 자동 생성됩니다.</p>
          </div>

          {/* 검색 */}
          <div style={s.filterRow}>
            <input
              style={s.filterInput}
              placeholder="🔍 매장명 / 식별자 검색"
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
            />
            <span style={s.countLabel}>{filteredStores.length}개 매장</span>
          </div>

          {/* 목록 */}
          <div style={s.tableWrapper}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>매장명</th>
                  <th style={s.th}>식별자</th>
                  <th style={s.th}>테이블 수</th>
                  <th style={s.th}>등록일</th>
                  <th style={s.th}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.length === 0 ? (
                  <tr><td colSpan={5} style={s.empty}>등록된 매장이 없습니다.</td></tr>
                ) : (
                  filteredStores.map((store) => (
                    <tr key={store.id} style={s.tr}>
                      <td style={s.td}><strong>{store.name}</strong></td>
                      <td style={s.td}><code style={s.code}>{store.identifier}</code></td>
                      <td style={s.td}>
                        <span style={s.countBadge}>{store.tableCount}개</span>
                      </td>
                      <td style={s.td}>{new Date(store.createdAt).toLocaleDateString('ko-KR')}</td>
                      <td style={s.td}>
                        <button style={s.dangerBtn} onClick={() => handleDeleteStore(store)}>
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 계정 관리 탭 ── */}
      {tab === 'accounts' && (
        <div>
          {/* 생성 폼 */}
          <div style={s.card}>
            <h3 style={s.cardTitle}>매장 관리자 계정 생성</h3>
            <div style={s.formGrid}>
              <select
                style={s.select}
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
              >
                <option value="">매장 선택 *</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} ({store.identifier})
                  </option>
                ))}
              </select>
              <input
                style={s.input}
                placeholder="로그인 식별자 *"
                value={accountIdentifier}
                onChange={(e) => setAccountIdentifier(e.target.value)}
              />
              <input
                style={s.input}
                type="password"
                placeholder="초기 비밀번호 * (4자 이상)"
                value={accountPassword}
                onChange={(e) => setAccountPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateAccount()}
              />
              <button style={s.primaryBtn} onClick={handleCreateAccount} disabled={accountSubmitting}>
                {accountSubmitting ? '생성 중...' : '+ 생성'}
              </button>
            </div>
          </div>

          {/* 검색 */}
          <div style={s.filterRow}>
            <input
              style={s.filterInput}
              placeholder="🔍 식별자 / 매장명 검색"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            />
            <span style={s.countLabel}>{filteredAccounts.filter(a => a.role === 'store_admin').length}개 계정</span>
          </div>

          {/* 목록 */}
          <div style={s.tableWrapper}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>식별자</th>
                  <th style={s.th}>역할</th>
                  <th style={s.th}>연결 매장</th>
                  <th style={s.th}>생성일</th>
                  <th style={s.th}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length === 0 ? (
                  <tr><td colSpan={5} style={s.empty}>계정이 없습니다.</td></tr>
                ) : (
                  filteredAccounts.map((account) => {
                    const store = stores.find((st) => st.id === account.storeId)
                    const isSuperAdmin = account.role === 'super_admin'
                    return (
                      <tr key={account.id} style={s.tr}>
                        <td style={s.td}>
                          <code style={s.code}>{account.storeIdentifier ?? '-'}</code>
                        </td>
                        <td style={s.td}>
                          <span style={{
                            ...s.roleBadge,
                            background: isSuperAdmin ? '#faf089' : '#ebf8ff',
                            color: isSuperAdmin ? '#744210' : '#2b6cb0',
                          }}>
                            {isSuperAdmin ? '슈퍼 관리자' : '매장 관리자'}
                          </span>
                        </td>
                        <td style={s.td}>
                          {store
                            ? <span>{store.name} <span style={{ color: '#999', fontSize: 12 }}>({store.identifier})</span></span>
                            : <span style={{ color: '#999' }}>-</span>
                          }
                        </td>
                        <td style={s.td}>{new Date(account.createdAt).toLocaleDateString('ko-KR')}</td>
                        <td style={s.td}>
                          {isSuperAdmin ? (
                            <span style={{ color: '#999', fontSize: 12 }}>삭제 불가</span>
                          ) : (
                            <button style={s.dangerBtn} onClick={() => handleDeleteAccount(account)}>
                              삭제
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  title: { margin: '0 0 20px', fontSize: 22 },
  feedback: { padding: '12px 16px', borderRadius: 8, border: '1px solid', marginBottom: 16, fontSize: 14 },
  tabs: { display: 'flex', marginBottom: 20, border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', width: 'fit-content' },
  tab: { padding: '9px 22px', border: 'none', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#718096' },
  tabActive: { background: '#1a1a2e', color: '#fff' },
  card: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { margin: '0 0 14px', fontSize: 15, fontWeight: 600 },
  formRow: { display: 'flex', gap: 10, alignItems: 'center' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'center' },
  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, width: '100%', boxSizing: 'border-box' },
  select: { padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, background: '#fff', cursor: 'pointer' },
  primaryBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap' },
  dangerBtn: { background: '#fff5f5', color: '#e53e3e', border: '1px solid #fed7d7', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
  hint: { margin: '8px 0 0', fontSize: 12, color: '#999' },
  filterRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  filterInput: { padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, width: 260 },
  countLabel: { fontSize: 13, color: '#718096' },
  tableWrapper: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f7fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#718096', fontWeight: 600 },
  tr: { borderTop: '1px solid #e2e8f0' },
  td: { padding: '12px 16px', fontSize: 14 },
  empty: { padding: '32px 16px', textAlign: 'center', color: '#999', fontSize: 14 },
  code: { background: '#f7fafc', padding: '2px 6px', borderRadius: 4, fontSize: 13, fontFamily: 'monospace' },
  roleBadge: { padding: '3px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 },
  countBadge: { background: '#ebf8ff', color: '#2b6cb0', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 },
}
