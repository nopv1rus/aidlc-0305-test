# NFR Design Patterns - Unit 2: Customer Frontend

## 1. 성능 패턴

### 1.1 번들 최적화 패턴

#### Route-Level Code Splitting
```
라우트별 React.lazy + Suspense로 페이지 단위 분리

App.tsx
  +-- React.lazy(() => import('./pages/MenuPage'))
  +-- React.lazy(() => import('./pages/OrderConfirmPage'))
  +-- React.lazy(() => import('./pages/OrderSuccessPage'))
  +-- React.lazy(() => import('./pages/OrderHistoryPage'))
  +-- React.lazy(() => import('./pages/ErrorPage'))
```
- 각 페이지는 별도 chunk로 빌드
- 초기 로드: MenuPage chunk만 로드 (기본 화면)
- Suspense fallback: 페이지 스켈레톤 컴포넌트

#### Component-Level Code Splitting
```
무거운 컴포넌트 지연 로드

React.lazy(() => import('./components/MenuDetailSheet'))
React.lazy(() => import('./components/CartBottomSheet'))
React.lazy(() => import('./components/ConfirmDialog'))
```
- 바텀시트/모달은 사용자 인터랙션 시점에 로드
- Preload: 메뉴 카드 hover/focus 시 MenuDetailSheet 프리로드

#### Vite Chunk 전략
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-state': ['zustand'],
        'vendor-http': ['axios'],
      }
    }
  }
}
```
- vendor chunk 분리로 캐싱 효율 극대화
- 라이브러리 업데이트 시 앱 코드 chunk는 캐시 유지

#### Tree-Shaking
- Heroicons: 개별 파일 import (`@heroicons/react/24/outline/ShoppingCartIcon`)
- Tailwind CSS: PurgeCSS로 미사용 클래스 제거 (Tailwind 4 기본 내장)

### 1.2 렌더링 최적화 패턴

#### Selective Subscription (Zustand)
```typescript
// 나쁜 예: 전체 store 구독 → 모든 변경에 리렌더
const { items, addItem } = useCartStore()

// 좋은 예: 필요한 값만 구독
const itemCount = useCartStore(state => state.items.length)
const addItem = useCartStore(state => state.addItem)
```

#### React.memo + Stable References
```typescript
// QuantityControl: 자주 변경되는 부모에서 사용
const QuantityControl = memo(function QuantityControl({ ... }) { ... })

// 콜백 안정화: functional setState
const updateQuantity = useCallback((menuId: string, qty: number) => {
  useCartStore.getState().updateQuantity(menuId, qty)
}, [])
```

#### Content Visibility (긴 메뉴 목록)
```css
.menu-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 300px;
}
```
- 카테고리 섹션 단위로 적용
- 화면 밖 섹션의 레이아웃/페인트 스킵

#### Derived State (렌더링 시 계산)
```typescript
// 나쁜 예: 별도 state로 관리
const [totalAmount, setTotalAmount] = useState(0)
useEffect(() => setTotalAmount(calc(items)), [items])

// 좋은 예: 렌더링 시 계산
const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
```

### 1.3 이미지 로딩 패턴

#### Progressive Image Loading
```
1단계: 스켈레톤 플레이스홀더 (CSS background)
2단계: 저해상도 블러 이미지 (선택적)
3단계: 실제 이미지 로드 완료 → 페이드인
```

#### Responsive Images
```html
<img
  srcset="menu-thumb-240.jpg 240w, menu-thumb-480.jpg 480w"
  sizes="(max-width: 480px) 45vw, 240px"
  width="240"
  height="240"
  loading="lazy"
  alt="메뉴명"
/>
```
- 첫 화면 이미지: `loading="eager"` + `fetchpriority="high"`
- 나머지: `loading="lazy"`

### 1.4 상태 관리 최적화 패턴

#### Store 분리 원칙
```
SessionStore  — 세션 정보 (변경 빈도: 낮음)
MenuStore     — 메뉴 데이터 (변경 빈도: 낮음, 초기 로드 후 고정)
CartStore     — 장바구니 (변경 빈도: 높음, persist)
OrderStore    — 주문 내역 (변경 빈도: 중간, SSE 업데이트)
SSEStore      — 연결 상태 (변경 빈도: 낮음)
UIStore       — UI 상태 (변경 빈도: 높음, 바텀시트/모달 열림 등)
NetworkStore  — 네트워크 상태 (변경 빈도: 낮음)
```
- 변경 빈도가 다른 데이터를 별도 store로 분리
- 높은 빈도 store 변경이 낮은 빈도 컴포넌트에 영향 주지 않음

#### Persist Middleware 패턴
```typescript
const useCartStore = create(
  persist(
    (set, get) => ({ ... }),
    {
      name: 'cart:v1:{tableToken}',
      storage: createJSONStorage(() => {
        try { return localStorage } catch { return sessionStorage }
      }),
      version: 1,
      migrate: (persisted, version) => { /* 스키마 마이그레이션 */ },
    }
  )
)
```

---

## 2. 네트워크 복원력 패턴

### 2.1 API 클라이언트 패턴

#### Axios Instance + Interceptor Chain
```
[요청 흐름]
요청 생성
  → Request Interceptor: 세션 토큰 주입
  → Request Interceptor: 네트워크 상태 확인 (오프라인이면 큐잉)
  → Axios 전송 (timeout: 10초)
  → Response Interceptor: 성공 → 데이터 반환
  → Response Interceptor: 401 → 세션 만료 처리
  → Response Interceptor: 네트워크 오류 → 자동 재시도 (GET만)
  → Response Interceptor: 기타 오류 → 에러 변환 후 throw
```

#### 재시도 패턴 (GET 요청만)
```
실패 → 1초 대기 → 1차 재시도
  → 실패 → 2초 대기 → 2차 재시도
    → 실패 → 4초 대기 → 3차 재시도
      → 실패 → 에러 throw (사용자에게 표시)
```
- 지수 백오프: `delay = 1000 * 2^(attempt - 1)`
- POST/PUT/DELETE: 재시도 없음 (멱등성 보장 불가)
- 429 (Rate Limit): `Retry-After` 헤더 존중

### 2.2 오프라인 큐잉 패턴

#### Order Queue Manager
```
[오프라인 주문 플로우]
사용자 "주문 확정" 클릭
  → 네트워크 상태 확인
  → 오프라인 → 큐에 저장 (localStorage: orderQueue:v1:{tableToken})
  → "네트워크 복구 시 자동으로 주문이 전송됩니다" 안내
  → 온라인 복귀 이벤트 수신
  → 큐에서 주문 꺼내서 전송
  → 성공 → 큐에서 제거 + 성공 알림
  → 실패 → 큐 유지 + 에러 알림
```

#### 큐 데이터 구조
```typescript
interface QueuedOrder {
  id: string;              // 클라이언트 생성 UUID
  payload: CreateOrderRequest;
  queuedAt: string;        // ISO 8601
  retryCount: number;
  status: 'pending' | 'sending' | 'failed';
}
```
- 세션 만료 시 큐 자동 삭제
- 큐 최대 크기: 5건 (초과 시 가장 오래된 것 제거)

### 2.3 SSE 연결 관리 패턴

#### SSE Manager
```
[연결 생명주기]
앱 초기화
  → EventSource 생성 (/api/sse/customer/{storeId}/{tableId})
  → onopen: isConnected = true, retryCount = 0
  → onmessage: 이벤트 타입별 핸들러 디스패치
  → onerror: 
      → retryCount < 5: 3초 후 재연결
      → retryCount >= 5: ConnectionBanner 표시, 재연결 중단
  → visibilitychange (visible): 연결 상태 확인, 끊어졌으면 재연결
  → 세션 종료: EventSource.close()
```

#### 이벤트 디스패치 패턴
```typescript
// SSE 이벤트 → Zustand Store 업데이트
const eventHandlers: Record<SSEEventType, (data: unknown) => void> = {
  ORDER_STATUS_CHANGED: (data) => {
    const event = data as OrderStatusChangedEvent
    useOrderStore.getState().updateOrderStatus(event.orderId, event.status)
  },
  SESSION_ENDED: () => {
    useSessionStore.getState().clearSession()
    useCartStore.getState().clearCart()
    // 세션 종료 화면으로 이동
  },
}
```

---

## 3. 에러 처리 패턴

### 3.1 에러 바운더리 계층 구조

```
App (최상위 Error Boundary)
  |-- "예기치 않은 오류가 발생했습니다. 새로고침해주세요."
  |-- 새로고침 버튼
  |
  +-- TokenGuard (세션/토큰 에러 전용)
  |     |-- 토큰 무효 → ErrorPage
  |     |-- 세션 만료 → 세션 만료 안내
  |
  +-- PageErrorBoundary (페이지별)
        |-- 각 페이지 라우트를 감싸는 개별 바운더리
        |-- 한 페이지 에러가 다른 페이지에 영향 주지 않음
        |-- "이 페이지를 불러올 수 없습니다" + 메뉴로 돌아가기 버튼
```

### 3.2 전역 에러 핸들링 패턴

#### AppError 클래스
```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public userMessage: string,  // 사용자에게 표시할 메시지
    public retryable: boolean,   // 재시도 가능 여부
  ) { super(message) }
}

type ErrorCode =
  | 'NETWORK_ERROR'
  | 'SESSION_EXPIRED'
  | 'SESSION_INVALID'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'UNKNOWN'
```

#### 에러 변환 파이프라인
```
Axios Error
  → isNetworkError? → AppError('NETWORK_ERROR', retryable: true)
  → status 401?     → AppError('SESSION_EXPIRED', retryable: false)
  → status 429?     → AppError('RATE_LIMITED', retryable: true)
  → status 5xx?     → AppError('SERVER_ERROR', retryable: true)
  → 기타            → AppError('UNKNOWN', retryable: false)
```

---

## 4. 모바일 최적화 패턴

### 4.1 Touch Optimization
```css
/* 전역 적용 */
* { touch-action: manipulation; }
button, a, [role="button"] { min-height: 44px; min-width: 44px; }

/* 바텀시트/모달 */
.bottom-sheet { overscroll-behavior: contain; }
.modal-overlay { overscroll-behavior: contain; }
```

### 4.2 Safe Area
```css
/* 하단 고정 요소 */
.cart-floating-bar {
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

/* 전체 레이아웃 */
.app-layout {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### 4.3 Animation with Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* 바텀시트 슬라이드 */
.bottom-sheet-enter {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  /* transition: all 금지 */
}
```
