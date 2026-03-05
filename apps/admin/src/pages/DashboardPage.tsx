import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSSE } from '@/hooks/useSSE'
import { getOrdersByStore, updateOrderStatus, cancelOrder } from '@/api/orders'
import { getTables, completeSession } from '@/api/tables'
import ConfirmModal from '@/components/ConfirmModal'
import type { Order, Table, OrderStatus, SSEEvent } from '@/types'

interface TableCard {
  table: Table
  orders: Order[]
  totalAmount: number
  isNew: boolean
}

export default function DashboardPage() {
  const { admin } = useAuth()
  const [tableCards, setTableCards] = useState<TableCard[]>([])
  const [selectedTable, setSelectedTable] = useState<TableCard | null>(null)
  const [filterNum, setFilterNum] = useState('')
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null)
  const [loading, setLoading] = useState(true)

  const storeId = admin?.storeId

  const loadData = useCallback(async () => {
    if (!storeId) return
    try {
      const [tablesRes, ordersRes] = await Promise.all([
        getTables(storeId),
        getOrdersByStore(storeId),
      ])
      const tables = tablesRes.data
      const orders = ordersRes.data

      const cards: TableCard[] = tables.map((table) => {
        const tableOrders = orders.filter((o) => o.tableId === table.id && o.status !== 'cancelled')
        const total = tableOrders.reduce((sum, o) => sum + o.totalAmount, 0)
        return { table, orders: tableOrders, totalAmount: total, isNew: false }
      })
      setTableCards(cards)
    } finally {
      setLoading(false)
    }
  }, [storeId])

  useEffect(() => { loadData() }, [loadData])

  // SSE 이벤트 처리
  const handleSSE = useCallback((event: SSEEvent) => {
    if (event.type === 'NEW_ORDER') {
      const order = event.data as Order
      setTableCards((prev) =>
        prev.map((card) => {
          if (card.table.id !== order.tableId) return card
          const exists = card.orders.find((o) => o.id === order.id)
          const newOrders = exists ? card.orders : [...card.orders, order]
          return {
            ...card,
            orders: newOrders,
            totalAmount: newOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0),
            isNew: true,
          }
        })
      )
      // 3초 후 강조 해제
      setTimeout(() => {
        setTableCards((prev) =>
          prev.map((card) =>
            card.table.id === order.tableId ? { ...card, isNew: false } : card
          )
        )
      }, 3000)
    } else if (event.type === 'ORDER_STATUS_CHANGED') {
      const { orderId, status, tableId } = event.data as { orderId: string; status: OrderStatus; tableId: string }
      setTableCards((prev) =>
        prev.map((card) => {
          if (card.table.id !== tableId) return card
          const newOrders = card.orders.map((o) => o.id === orderId ? { ...o, status } : o)
          return {
            ...card,
            orders: newOrders,
            totalAmount: newOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0),
          }
        })
      )
    }
  }, [])

  useSSE(storeId, handleSSE)

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status)
    loadData()
    if (selectedTable) {
      setSelectedTable((prev) =>
        prev ? {
          ...prev,
          orders: prev.orders.map((o) => o.id === orderId ? { ...o, status } : o),
        } : null
      )
    }
  }

  const handleCancel = (orderId: string) => {
    setConfirm({
      message: '주문을 취소하시겠습니까?',
      onConfirm: async () => {
        await cancelOrder(orderId)
        setConfirm(null)
        loadData()
        if (selectedTable) {
          setSelectedTable((prev) =>
            prev ? {
              ...prev,
              orders: prev.orders.map((o) => o.id === orderId ? { ...o, status: 'cancelled' } : o),
            } : null
          )
        }
      },
    })
  }

  const handleComplete = (card: TableCard) => {
    const sessionId = card.table.activeSession?.id
    if (!sessionId) return
    setConfirm({
      message: `테이블 ${card.table.number}번 이용 완료 처리하시겠습니까?\n주문 내역이 과거 이력으로 이동됩니다.`,
      onConfirm: async () => {
        await completeSession(sessionId)
        setConfirm(null)
        setSelectedTable(null)
        loadData()
      },
    })
  }

  const filtered = filterNum
    ? tableCards.filter((c) => String(c.table.number).includes(filterNum))
    : tableCards

  const statusLabel: Record<OrderStatus, string> = {
    pending: '대기중', preparing: '준비중', completed: '완료', cancelled: '취소됨',
  }
  const statusColor: Record<OrderStatus, string> = {
    pending: '#f6ad55', preparing: '#63b3ed', completed: '#68d391', cancelled: '#fc8181',
  }
  const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    pending: 'preparing', preparing: 'completed',
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>로딩 중...</div>

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>주문 대시보드</h2>
        <input
          style={styles.filter}
          placeholder="테이블 번호 검색"
          value={filterNum}
          onChange={(e) => setFilterNum(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>등록된 테이블이 없습니다. 테이블 관리에서 추가해주세요.</div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((card) => (
            <div
              key={card.table.id}
              style={{
                ...styles.card,
                ...(card.isNew ? styles.cardNew : {}),
                ...(card.orders.length > 0 ? styles.cardActive : {}),
              }}
              onClick={() => setSelectedTable(card)}
            >
              <div style={styles.cardHeader}>
                <span style={styles.tableNum}>테이블 {card.table.number}</span>
                {card.isNew && <span style={styles.newBadge}>NEW</span>}
              </div>
              <div style={styles.totalAmount}>
                {card.totalAmount > 0 ? `₩${card.totalAmount.toLocaleString()}` : '주문 없음'}
              </div>
              {card.orders.slice(-2).map((o) => (
                <div key={o.id} style={styles.orderPreview}>
                  <span style={{ color: statusColor[o.status], fontSize: 11 }}>
                    [{statusLabel[o.status]}]
                  </span>{' '}
                  {o.orderNumber}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 테이블 상세 모달 */}
      {selectedTable && (
        <div style={styles.overlay} onClick={() => setSelectedTable(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>테이블 {selectedTable.table.number}번 주문 상세</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedTable.table.activeSession && (
                  <button
                    style={styles.completeBtn}
                    onClick={() => handleComplete(selectedTable)}
                  >이용 완료</button>
                )}
                <button style={styles.closeBtn} onClick={() => setSelectedTable(null)}>✕</button>
              </div>
            </div>

            <div style={styles.modalTotal}>
              총 주문액: ₩{selectedTable.totalAmount.toLocaleString()}
            </div>

            {selectedTable.orders.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>주문 없음</p>
            ) : (
              selectedTable.orders.map((order) => (
                <div key={order.id} style={styles.orderCard}>
                  <div style={styles.orderCardHeader}>
                    <span style={styles.orderNum}>#{order.orderNumber}</span>
                    <span style={{ color: statusColor[order.status], fontWeight: 600 }}>
                      {statusLabel[order.status]}
                    </span>
                    <span style={styles.orderTime}>
                      {new Date(order.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={styles.orderItems}>
                    {order.items.map((item) => (
                      <div key={item.id} style={styles.orderItem}>
                        <span>{item.menuName} x{item.quantity}</span>
                        <span>₩{(item.unitPrice * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div style={styles.orderFooter}>
                    <span style={styles.orderTotal}>₩{order.totalAmount.toLocaleString()}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {nextStatus[order.status] && (
                        <button
                          style={styles.statusBtn}
                          onClick={() => handleStatusChange(order.id, nextStatus[order.status]!)}
                        >
                          → {statusLabel[nextStatus[order.status]!]}
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'preparing') && (
                        <button
                          style={styles.cancelBtn}
                          onClick={() => handleCancel(order.id)}
                        >취소</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
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

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title: { margin: 0, fontSize: 22 },
  filter: { padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, width: 180 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
  card: {
    background: '#fff', borderRadius: 12, padding: 16, cursor: 'pointer',
    border: '2px solid transparent', transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardActive: { borderColor: '#bee3f8' },
  cardNew: { borderColor: '#f6ad55', background: '#fffaf0', animation: 'pulse 1s ease-in-out' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tableNum: { fontWeight: 700, fontSize: 16 },
  newBadge: {
    background: '#f6ad55', color: '#fff', fontSize: 10,
    padding: '2px 6px', borderRadius: 4, fontWeight: 700,
  },
  totalAmount: { fontSize: 18, fontWeight: 700, color: '#2d3748', marginBottom: 8 },
  orderPreview: { fontSize: 12, color: '#718096', marginTop: 2 },
  empty: { textAlign: 'center', color: '#999', padding: 60, fontSize: 16 },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modal: {
    background: '#fff', borderRadius: 16, padding: 24, width: 520,
    maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTotal: { background: '#f7fafc', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontWeight: 700 },
  completeBtn: {
    background: '#48bb78', color: '#fff', border: 'none',
    padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
  },
  closeBtn: {
    background: 'transparent', border: 'none', fontSize: 18,
    cursor: 'pointer', color: '#718096', padding: '4px 8px',
  },
  orderCard: { border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 10 },
  orderCardHeader: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 },
  orderNum: { fontWeight: 700, fontSize: 14 },
  orderTime: { color: '#999', fontSize: 12, marginLeft: 'auto' },
  orderItems: { marginBottom: 8 },
  orderItem: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4a5568', padding: '2px 0' },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  orderTotal: { fontWeight: 700, fontSize: 15 },
  statusBtn: {
    background: '#4299e1', color: '#fff', border: 'none',
    padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
  },
  cancelBtn: {
    background: '#fc8181', color: '#fff', border: 'none',
    padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
  },
}
