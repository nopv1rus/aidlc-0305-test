import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getOrderHistory, getOrderHistorySummary } from '@/api/orders'
import type { OrderHistory, HistorySummary } from '@/types'

export default function OrderHistoryPage() {
  const { admin } = useAuth()
  const [history, setHistory] = useState<OrderHistory[]>([])
  const [summary, setSummary] = useState<HistorySummary | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'summary'>('list')

  const storeId = admin?.storeId!

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }
      const [histRes, sumRes] = await Promise.all([
        getOrderHistory(storeId, params),
        getOrderHistorySummary(storeId, params),
      ])
      setHistory(histRes.data)
      setSummary(sumRes.data)
    } finally {
      setLoading(false)
    }
  }, [storeId, startDate, endDate])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>과거 주문 내역</h2>
        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(viewMode === 'list' ? styles.tabActive : {}) }} onClick={() => setViewMode('list')}>목록</button>
          <button style={{ ...styles.tab, ...(viewMode === 'summary' ? styles.tabActive : {}) }} onClick={() => setViewMode('summary')}>합산 조회</button>
        </div>
      </div>

      {/* 날짜 필터 */}
      <div style={styles.filterRow}>
        <input type="date" style={styles.dateInput} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <span style={{ color: '#999' }}>~</span>
        <input type="date" style={styles.dateInput} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button style={styles.searchBtn} onClick={load}>조회</button>
        <button style={styles.resetBtn} onClick={() => { setStartDate(''); setEndDate('') }}>초기화</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>로딩 중...</div>
      ) : viewMode === 'summary' ? (
        // 합산 조회
        <div>
          {summary && (
            <div style={styles.summaryBox}>
              <div style={styles.summaryTotal}>
                <span>전체 주문 수</span>
                <strong>{summary.totalOrders}건</strong>
              </div>
              <div style={styles.summaryTotal}>
                <span>전체 매출</span>
                <strong>₩{summary.totalAmount.toLocaleString()}</strong>
              </div>
            </div>
          )}
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>테이블</th>
                  <th style={styles.th}>주문 수</th>
                  <th style={styles.th}>매출</th>
                </tr>
              </thead>
              <tbody>
                {summary?.byTable.map((row) => (
                  <tr key={row.tableNumber} style={styles.tr}>
                    <td style={styles.td}>테이블 {row.tableNumber}</td>
                    <td style={styles.td}>{row.orderCount}건</td>
                    <td style={styles.td}>₩{row.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // 목록 조회
        <div>
          {history.length === 0 ? (
            <div style={styles.empty}>조회된 주문 내역이 없습니다.</div>
          ) : (
            history.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <span style={styles.orderNum}>#{order.orderNumber}</span>
                  <span style={styles.tableTag}>테이블 {order.tableNumber}</span>
                  <span style={styles.orderTime}>
                    {new Date(order.createdAt).toLocaleString('ko-KR')}
                  </span>
                  <span style={styles.orderAmount}>₩{order.totalAmount.toLocaleString()}</span>
                </div>
                <div style={styles.orderItems}>
                  {order.items.map((item) => (
                    <span key={item.id} style={styles.itemTag}>
                      {item.menuName} x{item.quantity}
                    </span>
                  ))}
                </div>
                {order.sessionEndedAt && (
                  <div style={styles.sessionEnd}>
                    이용 완료: {new Date(order.sessionEndedAt).toLocaleString('ko-KR')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { margin: 0, fontSize: 22 },
  tabs: { display: 'flex', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' },
  tab: { padding: '7px 18px', border: 'none', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#718096' },
  tabActive: { background: '#1a1a2e', color: '#fff' },
  filterRow: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 },
  dateInput: { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 },
  searchBtn: { background: '#4299e1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  resetBtn: { background: '#edf2f7', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  summaryBox: { display: 'flex', gap: 16, marginBottom: 20 },
  summaryTotal: { background: '#fff', borderRadius: 12, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 160 },
  tableWrapper: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f7fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#718096', fontWeight: 600 },
  tr: { borderTop: '1px solid #e2e8f0' },
  td: { padding: '12px 16px', fontSize: 14 },
  empty: { textAlign: 'center', color: '#999', padding: 60 },
  orderCard: { background: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  orderHeader: { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 },
  orderNum: { fontWeight: 700, fontSize: 14 },
  tableTag: { background: '#ebf8ff', color: '#2b6cb0', padding: '2px 8px', borderRadius: 4, fontSize: 12 },
  orderTime: { color: '#999', fontSize: 12 },
  orderAmount: { marginLeft: 'auto', fontWeight: 700 },
  orderItems: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  itemTag: { background: '#f7fafc', padding: '3px 8px', borderRadius: 4, fontSize: 12, color: '#4a5568' },
  sessionEnd: { marginTop: 8, fontSize: 12, color: '#999' },
}
