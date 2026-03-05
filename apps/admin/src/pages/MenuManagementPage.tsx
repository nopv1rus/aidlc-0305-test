import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getMenus, getCategories, createMenu, updateMenu, deleteMenu, updateMenuBadge, updateMenuOrder, createCategory } from '@/api/menus'
import ConfirmModal from '@/components/ConfirmModal'
import type { Menu, Category, BadgeType } from '@/types'

const BADGE_OPTIONS: { value: BadgeType; label: string }[] = [
  { value: 'none', label: '없음' },
  { value: 'signature', label: '🌟 시그니처' },
  { value: 'popular', label: '🔥 인기' },
  { value: 'new', label: '✨ 신메뉴' },
]

const BADGE_STYLE: Record<BadgeType, React.CSSProperties> = {
  none: {},
  signature: { background: '#faf089', color: '#744210' },
  popular: { background: '#fed7d7', color: '#742a2a' },
  new: { background: '#c6f6d5', color: '#22543d' },
}

interface MenuForm {
  name: string; price: string; description: string
  categoryId: string; imageUrl: string; badge: BadgeType
}

const emptyForm: MenuForm = { name: '', price: '', description: '', categoryId: '', imageUrl: '', badge: 'none' }

export default function MenuManagementPage() {
  const { admin } = useAuth()
  const [menus, setMenus] = useState<Menu[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [form, setForm] = useState<MenuForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null)
  const [newCatName, setNewCatName] = useState('')
  const [formError, setFormError] = useState('')
  const [dragId, setDragId] = useState<string | null>(null)

  const storeId = admin?.storeId!

  const load = useCallback(async () => {
    const [menuRes, catRes] = await Promise.all([getMenus(storeId), getCategories(storeId)])
    setMenus(menuRes.data)
    setCategories(catRes.data)
  }, [storeId])

  useEffect(() => { load() }, [load])

  const validate = () => {
    if (!form.name.trim()) return '메뉴명을 입력해주세요.'
    if (!form.price || Number(form.price) < 0) return '올바른 가격을 입력해주세요.'
    if (!form.categoryId) return '카테고리를 선택해주세요.'
    return ''
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setFormError(err); return }
    setFormError('')
    const data = {
      name: form.name, price: Number(form.price), description: form.description,
      categoryId: form.categoryId, imageUrl: form.imageUrl, badge: form.badge, sortOrder: 0,
    }
    if (editingId) {
      await updateMenu(editingId, data)
    } else {
      await createMenu(storeId, data)
    }
    setForm(emptyForm); setEditingId(null); setShowForm(false)
    load()
  }

  const handleEdit = (menu: Menu) => {
    setForm({
      name: menu.name, price: String(menu.price), description: menu.description || '',
      categoryId: menu.categoryId, imageUrl: menu.imageUrl || '', badge: menu.badge,
    })
    setEditingId(menu.id)
    setShowForm(true)
  }

  const handleDelete = (menuId: string, name: string) => {
    setConfirm({
      message: `"${name}" 메뉴를 삭제하시겠습니까?`,
      onConfirm: async () => { await deleteMenu(menuId); setConfirm(null); load() },
    })
  }

  const handleBadge = async (menuId: string, badge: BadgeType) => {
    await updateMenuBadge(menuId, badge)
    load()
  }

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return
    await createCategory(storeId, newCatName.trim())
    setNewCatName('')
    load()
  }

  // 드래그 앤 드롭 순서 변경
  const handleDragStart = (id: string) => setDragId(id)
  const handleDrop = async (targetId: string) => {
    if (!dragId || dragId === targetId) return
    const filtered = menus.filter((m) => selectedCat === 'all' || m.categoryId === selectedCat)
    const dragIdx = filtered.findIndex((m) => m.id === dragId)
    const targetIdx = filtered.findIndex((m) => m.id === targetId)
    const reordered = [...filtered]
    const [moved] = reordered.splice(dragIdx, 1)
    reordered.splice(targetIdx, 0, moved)
    const orderData = reordered.map((m, i) => ({ menuId: m.id, sortOrder: i }))
    await updateMenuOrder(storeId, orderData)
    setDragId(null)
    load()
  }

  const displayMenus = selectedCat === 'all'
    ? menus
    : menus.filter((m) => m.categoryId === selectedCat)

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>메뉴 관리</h2>
        <button style={styles.addBtn} onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true) }}>
          + 메뉴 추가
        </button>
      </div>

      {/* 카테고리 탭 */}
      <div style={styles.catRow}>
        <div style={styles.catTabs}>
          <button
            style={{ ...styles.catTab, ...(selectedCat === 'all' ? styles.catTabActive : {}) }}
            onClick={() => setSelectedCat('all')}
          >전체</button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              style={{ ...styles.catTab, ...(selectedCat === cat.id ? styles.catTabActive : {}) }}
              onClick={() => setSelectedCat(cat.id)}
            >{cat.name}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={styles.catInput}
            placeholder="새 카테고리"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button style={styles.catAddBtn} onClick={handleAddCategory}>추가</button>
        </div>
      </div>

      {/* 메뉴 폼 */}
      {showForm && (
        <div style={styles.formBox}>
          <h3 style={{ margin: '0 0 16px' }}>{editingId ? '메뉴 수정' : '메뉴 추가'}</h3>
          <div style={styles.formGrid}>
            <input style={styles.input} placeholder="메뉴명 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={styles.input} type="number" placeholder="가격 *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} min={0} />
            <select style={styles.input} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">카테고리 선택 *</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select style={styles.input} value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value as BadgeType })}>
              {BADGE_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
            <input style={styles.input} placeholder="이미지 URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <input style={styles.input} placeholder="설명" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          {formError && <p style={styles.error}>{formError}</p>}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button style={styles.saveBtn} onClick={handleSubmit}>{editingId ? '수정 완료' : '등록'}</button>
            <button style={styles.cancelFormBtn} onClick={() => setShowForm(false)}>취소</button>
          </div>
        </div>
      )}

      {/* 메뉴 목록 */}
      <div style={styles.menuGrid}>
        {displayMenus.sort((a, b) => a.sortOrder - b.sortOrder).map((menu) => (
          <div
            key={menu.id}
            style={styles.menuCard}
            draggable
            onDragStart={() => handleDragStart(menu.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(menu.id)}
          >
            <div style={styles.menuCardTop}>
              {menu.imageUrl
                ? <img src={menu.imageUrl} alt={menu.name} style={styles.menuImg} />
                : <div style={styles.menuImgPlaceholder}>🍽️</div>
              }
              <div style={styles.menuInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={styles.menuName}>{menu.name}</span>
                  {menu.badge !== 'none' && (
                    <span style={{ ...styles.badgeTag, ...BADGE_STYLE[menu.badge] }}>
                      {BADGE_OPTIONS.find((b) => b.value === menu.badge)?.label}
                    </span>
                  )}
                </div>
                <span style={styles.menuPrice}>₩{menu.price.toLocaleString()}</span>
                <span style={styles.menuCat}>{menu.categoryName}</span>
              </div>
            </div>
            <div style={styles.menuActions}>
              <select
                style={styles.badgeSelect}
                value={menu.badge}
                onChange={(e) => handleBadge(menu.id, e.target.value as BadgeType)}
              >
                {BADGE_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
              <button style={styles.editBtn} onClick={() => handleEdit(menu)}>수정</button>
              <button style={styles.deleteBtn} onClick={() => handleDelete(menu.id, menu.name)}>삭제</button>
            </div>
          </div>
        ))}
      </div>

      {confirm && (
        <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { margin: 0, fontSize: 22 },
  addBtn: { background: '#48bb78', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  catRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 },
  catTabs: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  catTab: { padding: '6px 14px', borderRadius: 20, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 13 },
  catTabActive: { background: '#1a1a2e', color: '#fff', borderColor: '#1a1a2e' },
  catInput: { padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, width: 120 },
  catAddBtn: { background: '#4299e1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  formBox: { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  input: { padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 },
  error: { color: '#e53e3e', fontSize: 13, margin: '4px 0 0' },
  saveBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  cancelFormBtn: { background: '#edf2f7', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 },
  menuCard: { background: '#fff', borderRadius: 12, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'grab' },
  menuCardTop: { display: 'flex', gap: 12, marginBottom: 10 },
  menuImg: { width: 60, height: 60, borderRadius: 8, objectFit: 'cover' },
  menuImgPlaceholder: { width: 60, height: 60, borderRadius: 8, background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 },
  menuInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: 3 },
  menuName: { fontWeight: 700, fontSize: 15 },
  menuPrice: { color: '#2d3748', fontWeight: 600 },
  menuCat: { color: '#999', fontSize: 12 },
  badgeTag: { fontSize: 11, padding: '2px 6px', borderRadius: 4, fontWeight: 600 },
  menuActions: { display: 'flex', gap: 6, alignItems: 'center' },
  badgeSelect: { flex: 1, padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 },
  editBtn: { background: '#4299e1', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
  deleteBtn: { background: '#fc8181', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 },
}
