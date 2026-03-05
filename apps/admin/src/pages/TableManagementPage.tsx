import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getTables, createTable } from '@/api/tables'
import ConfirmModal from '@/components/ConfirmModal'
import { downloadQR, printQR, qrToDataURL } from '@/utils/qr'
import type { Table } from '@/types'

export default function TableManagementPage() {
  const { admin } = useAuth()
  const [tables, setTables] = useState<Table[]>([])
  const [newNumber, setNewNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null)
  const [qrPreviews, setQrPreviews] = useState<Record<string, string>>({}) // tableId → dataURL

  const storeId = admin?.storeId!

  const load = useCallback(async () => {
    const res = await getTables(storeId)
    setTables(res.data)
    setLoading(false)
    // 테이블 로드 후 QR 미리보기 생성
    const previews: Record<string, string> = {}
    await Promise.all(
      res.data.map(async (t) => {
        previews[t.id] = await qrToDataURL(t.token)
      })
    )
    setQrPreviews(previews)
  }, [storeId])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    const num = parseInt(newNumber)
    if (!num || num < 1) { setError('올바른 테이블 번호를 입력해주세요.'); return }
    if (tables.find((t) => t.number === num)) { setError('이미 존재하는 테이블 번호입니다.'); return }
    setError('')
    await createTable(storeId, num)
    setNewNumber('')
    load()
  }

  const handleDownloadQR = (table: Table) => downloadQR(table.token, table.number)

  const handlePrintQR = (table: Table) => printQR(table.token, table.number)

  const downloadBulkQR = async () => {
    const targetTables = selected.size > 0
      ? tables.filter((t) => selected.has(t.id))
      : tables
    // JSZip으로 묶어서 다운로드
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    await Promise.all(
      targetTables.map(async (t) => {
        const dataUrl = await qrToDataURL(t.token)
        const base64 = dataUrl.split(',')[1]
        zip.file(`table-${t.number}-qr.png`, base64, { base64: true })
      })
    )
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qrcodes.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>로딩 중...</div>

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>테이블 관리</h2>
        <button style={styles.bulkBtn} onClick={downloadBulkQR}>
          📥 QR 일괄 다운로드 {selected.size > 0 ? `(${selected.size}개)` : '(전체)'}
        </button>
      </div>

      {/* 테이블 등록 */}
      <div style={styles.addBox}>
        <input
          style={styles.input}
          type="number"
          placeholder="테이블 번호"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          min={1}
        />
        <button style={styles.addBtn} onClick={handleCreate}>+ 테이블 등록</button>
        {error && <span style={styles.error}>{error}</span>}
      </div>

      {/* 테이블 목록 */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}><input type="checkbox" onChange={(e) => {
                setSelected(e.target.checked ? new Set(tables.map(t => t.id)) : new Set())
              }} /></th>
              <th style={styles.th}>테이블 번호</th>
              <th style={styles.th}>세션 상태</th>
              <th style={styles.th}>총 주문액</th>
              <th style={styles.th}>QR코드</th>
            </tr>
          </thead>
          <tbody>
            {tables.sort((a, b) => a.number - b.number).map((table) => (
              <tr key={table.id} style={styles.tr}>
                <td style={styles.td}>
                  <input
                    type="checkbox"
                    checked={selected.has(table.id)}
                    onChange={() => toggleSelect(table.id)}
                  />
                </td>
                <td style={styles.td}><strong>테이블 {table.number}</strong></td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: table.activeSession ? '#c6f6d5' : '#e2e8f0',
                    color: table.activeSession ? '#276749' : '#718096',
                  }}>
                    {table.activeSession ? '이용 중' : '비어있음'}
                  </span>
                </td>
                <td style={styles.td}>
                  {table.totalAmount ? `₩${table.totalAmount.toLocaleString()}` : '-'}
                </td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {qrPreviews[table.id] && (
                      <img
                        src={qrPreviews[table.id]}
                        alt={`테이블 ${table.number} QR`}
                        style={{ width: 48, height: 48, borderRadius: 4, border: '1px solid #e2e8f0' }}
                      />
                    )}
                    <button style={styles.qrBtn} onClick={() => handleDownloadQR(table)}>
                      📥 다운로드
                    </button>
                    <button style={styles.qrBtn} onClick={() => handlePrintQR(table)}>
                      🖨️ 인쇄
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { margin: 0, fontSize: 22 },
  bulkBtn: {
    background: '#4299e1', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14,
  },
  addBox: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 },
  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, width: 160 },
  addBtn: {
    background: '#48bb78', color: '#fff', border: 'none',
    padding: '10px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14,
  },
  error: { color: '#e53e3e', fontSize: 13 },
  tableWrapper: { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f7fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 13, color: '#718096', fontWeight: 600 },
  tr: { borderTop: '1px solid #e2e8f0' },
  td: { padding: '14px 16px', fontSize: 14 },
  badge: { padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600 },
  qrBtn: {
    background: '#edf2f7', border: 'none', padding: '5px 10px',
    borderRadius: 6, cursor: 'pointer', fontSize: 12,
  },
}
