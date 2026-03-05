# Domain Entities - Unit 2: Customer Frontend

## 1. 프론트엔드 도메인 모델

### Menu (메뉴)
```typescript
interface Menu {
  id: string;
  name: string;
  price: number;          // 정수 (원)
  description: string;
  imageUrl: string | null;
  badge: MenuBadge | null;
  sortOrder: number;
  categoryId: string;
}

type MenuBadge = 'signature' | 'popular' | 'new';
```

### Category (카테고리)
```typescript
interface Category {
  id: string;
  name: string;
  sortOrder: number;
  menus: Menu[];
}
```

### CartItem (장바구니 항목)
```typescript
interface CartItem {
  menuId: string;
  name: string;
  price: number;          // 추가 시점의 가격 스냅샷
  quantity: number;        // 1 ~ 99
  imageUrl: string | null;
}
```

### Order (주문)
```typescript
interface Order {
  id: string;
  orderNumber: string;    // 표시용 주문 번호
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;       // ISO 8601
}

type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

interface OrderItem {
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
}
```

### Session (세션)
```typescript
interface SessionInfo {
  sessionId: string;
  storeId: string;
  tableId: string;
  tableToken: string;
  startedAt: string;       // ISO 8601
}
```

### SSE 이벤트
```typescript
interface SSEEvent {
  type: SSEEventType;
  data: unknown;
}

type SSEEventType = 'ORDER_STATUS_CHANGED' | 'SESSION_ENDED';

interface OrderStatusChangedEvent {
  orderId: string;
  status: OrderStatus;
  updatedAt: string;
}

interface SessionEndedEvent {
  sessionId: string;
  reason: 'completed';     // 이용 완료
}
```

---

## 2. 상태 관리 모델 (Zustand Stores)

### SessionStore (전역)
```typescript
interface SessionStore {
  // State
  session: SessionInfo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initSession: (tableToken: string) => Promise<void>;
  clearSession: () => void;
  isSessionValid: () => boolean;
}
```
- persist: localStorage (`session:v1:{tableToken}`)
- 앱 초기화 시 자동 복원 + 유효성 검증
- try-catch로 localStorage 접근 보호

### MenuStore (전역)
```typescript
interface MenuStore {
  // State
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMenus: (storeId: string) => Promise<void>;
  getMenuById: (menuId: string) => Menu | undefined;
}
```
- persist: 없음 (매번 API에서 로드)

### CartStore (전역)
```typescript
interface CartStore {
  // State
  items: CartItem[];

  // Actions (functional setState 패턴 사용 - stale closure 방지)
  addItem: (menu: Menu) => void;
  removeItem: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearCart: () => void;

  // Derived state (렌더링 시 계산 - useMemo 또는 Zustand selector 활용)
  getTotalAmount: () => number;
  getTotalCount: () => number;
}
```
- persist: localStorage (`cart:v1:{tableToken}`)
- try-catch로 localStorage 접근 보호 (시크릿 모드/용량 초과)
- Zustand selector로 구독 최적화: `useCartStore(state => state.items.length)` 패턴

### OrderStore (전역)
```typescript
interface OrderStore {
  // State
  orders: Order[];
  isSubmitting: boolean;
  submitError: string | null;

  // Actions
  createOrder: (items: CartItem[]) => Promise<Order>;
  fetchOrders: (sessionId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}
```
- persist: 없음 (API에서 로드, SSE로 업데이트)

### SSEStore (전역)
```typescript
interface SSEStore {
  // State
  isConnected: boolean;
  retryCount: number;

  // Actions
  connect: (storeId: string, tableId: string) => void;
  disconnect: () => void;
}
```

---

## 3. API 요청/응답 타입 매핑

### 세션 검증
```typescript
// GET /api/sessions/validate?tableToken={token}
// Response
interface ValidateSessionResponse {
  session: {
    id: string;
    storeId: string;
    tableId: string;
    startedAt: string;
  } | null;
  store: { id: string; name: string };
  table: { id: string; number: number };
}
```

### 메뉴 조회
```typescript
// GET /api/menus/{storeId}
// Response
interface GetMenusResponse {
  categories: Category[];
}
```

### 주문 생성
```typescript
// POST /api/orders
// Request
interface CreateOrderRequest {
  storeId: string;
  tableId: string;
  sessionId: string | null;  // null이면 서버에서 생성
  items: { menuId: string; quantity: number }[];
}

// Response (201)
interface CreateOrderResponse {
  id: string;
  orderNumber: string;
  sessionId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}
```

### 주문 내역 조회
```typescript
// GET /api/orders/session/{sessionId}
// Response
interface GetOrdersResponse {
  orders: Order[];
}
```

### 에러 응답 (공통)
```typescript
interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}
```

