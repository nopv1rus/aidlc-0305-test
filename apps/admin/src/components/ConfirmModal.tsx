interface Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.message}>{message}</p>
        <div style={styles.buttons}>
          <button onClick={onCancel} style={styles.cancelBtn}>취소</button>
          <button onClick={onConfirm} style={styles.confirmBtn}>확인</button>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    background: '#fff', borderRadius: 12, padding: 28, minWidth: 300,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  message: { fontSize: 16, marginBottom: 24, textAlign: 'center', lineHeight: 1.6 },
  buttons: { display: 'flex', gap: 12, justifyContent: 'center' },
  cancelBtn: {
    padding: '8px 24px', borderRadius: 8, border: '1px solid #ddd',
    background: '#fff', cursor: 'pointer', fontSize: 14,
  },
  confirmBtn: {
    padding: '8px 24px', borderRadius: 8, border: 'none',
    background: '#e53e3e', color: '#fff', cursor: 'pointer', fontSize: 14,
  },
}
