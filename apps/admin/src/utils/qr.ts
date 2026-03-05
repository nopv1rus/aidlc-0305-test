import QRCode from 'qrcode'

// 테이블 QR 코드가 가리킬 URL (실제 배포 시 환경변수로 교체)
const CUSTOMER_BASE_URL = import.meta.env.VITE_CUSTOMER_URL ?? 'http://localhost:3002'

export function getTableUrl(tableToken: string) {
  return `${CUSTOMER_BASE_URL}/order/${tableToken}`
}

/** Canvas element에 QR 코드를 그린다 */
export async function drawQRToCanvas(canvas: HTMLCanvasElement, token: string) {
  await QRCode.toCanvas(canvas, getTableUrl(token), {
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  })
}

/** QR 코드를 PNG Data URL로 반환 */
export async function qrToDataURL(token: string): Promise<string> {
  return QRCode.toDataURL(getTableUrl(token), {
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  })
}

/** QR 코드 PNG를 다운로드 */
export async function downloadQR(token: string, tableNumber: number) {
  const dataUrl = await qrToDataURL(token)
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = `table-${tableNumber}-qr.png`
  a.click()
}

/** QR 코드 인쇄 팝업 */
export async function printQR(token: string, tableNumber: number) {
  const dataUrl = await qrToDataURL(token)
  const win = window.open('', '_blank', 'width=400,height=500')
  if (!win) {
    alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.')
    return
  }
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>테이블 ${tableNumber}번 QR코드</title>
  <style>
    body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; }
    h2 { margin-bottom: 16px; font-size: 20px; }
    img { width: 280px; height: 280px; }
    p { margin-top: 12px; font-size: 13px; color: #555; word-break: break-all; text-align: center; max-width: 300px; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <h2>테이블 ${tableNumber}번</h2>
  <img src="${dataUrl}" alt="QR Code" />
  <p>${getTableUrl(token)}</p>
  <script>
    window.onload = function() { window.print(); }
  <\/script>
</body>
</html>`)
  win.document.close()
}
