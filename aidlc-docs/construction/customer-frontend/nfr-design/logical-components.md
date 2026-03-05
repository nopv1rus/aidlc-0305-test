# Logical Components - Unit 2: Customer Frontend

## 1. DDD 기반 프로젝트 디렉토리 구조

```
apps/customer/
+-- src/
|   +-- app/                          # 앱 진입점 및 설정
|   |   +-- App.tsx                   # 루트 컴포넌트
|   |   +-- AppProvider.tsx           # 전역 Provider (SSE, 네트워크 감지)
|   |   +-- router.tsx                # React Router 설정 (lazy routes)
|   |   +-- error-boundary.tsx        # 최상위 Error Boundary
|   |
|   +-- domains/                      # 도메인별 모듈 (DDD Bounded Context)
|   |   +-- session/                  # 세션 도메인
|   |   |   +-- model/
|   |   |   |   +-- session.types.ts  # SessionInfo, ValidateSessionResponse
|   |   |   +-- store/
|   |   |   |   +-- session.store.ts  # SessionStore (Zustand + persist)
|   |   |   +-- api/
|   |   |   |   +-- session.api.ts    # GET /api/sessions/validate
|   |   |   +-- hooks/
|   |   |   |   +-- useSession.ts     # 세션 관련 커스텀 훅
|   |   |   +-- components/
|   |   |       +-- TokenGuard.tsx    # 토큰 검증 가드
|   |   |       +-- SessionExpired.tsx # 세션 만료 화면
|   |   |
|   |   +-- menu/                     # 메뉴 도메인
|   |   |   +-- model/
|   |   |   |   +-- menu.types.ts     # Menu, Category, MenuBadge
|   |   |   +-- store/
|   |   |   |   +-- menu.store.ts     # MenuStore (Zustand)
|   |   |   +-- api/
|   |   |   |   +-- menu.api.ts       # GET /api/menus/{storeId}
|   |   |   +-- hooks/
|   |   |   |   +-- useMenuScroll.ts  # 카테고리 스크롤 연동 훅
|   |   |   +-- components/
|   |   |       +-- MenuPage.tsx
|   |   |       +-- CategoryTabBar.tsx
|   |   |       +-- MenuSectionList.tsx
|   |   |       +-- MenuSection.tsx
|   |   |       +-- MenuCard.tsx
|   |   |       +-- MenuDetailSheet.tsx
|   |   |
|   |   +-- cart/                     # 장바구니 도메인
|   |   |   +-- model/
|   |   |   |   +-- cart.types.ts     # CartItem
|   |   |   +-- store/
|   |   |   |   +-- cart.store.ts     # CartStore (Zustand + persist)
|   |   |   +-- hooks/
|   |   |   |   +-- useCartTotal.ts   # 금액 계산 훅
|   |   |   +-- components/
|   |   |       +-- CartFloatingBar.tsx
|   |   |       +-- CartBottomSheet.tsx
|   |   |       +-- CartItemRow.tsx
|   |   |
|   |   +-- order/                    # 주문 도메인
|   |   |   +-- model/
|   |   |   |   +-- order.types.ts    # Order, OrderStatus, OrderItem
|   |   |   +-- store/
|   |   |   |   +-- order.store.ts    # OrderStore (Zustand)
|   |   |   +-- api/
|   |   |   |   +-- order.api.ts      # POST /api/orders, GET /api/orders/session
|   |   |   +-- hooks/
|   |   |   |   +-- useOrderSubmit.ts # 주문 제출 로직 훅
|   |   |   +-- components/
|   |   |       +-- OrderConfirmPage.tsx
|   |   |       +-- OrderSuccessPage.tsx
|   |   |       +-- OrderHistoryPage.tsx
|   |   |       +-- OrderCard.tsx
|   |   |       +-- OrderStatusBadge.tsx
|   |   |       +-- OrderItemList.tsx
|   |   |       +-- CountdownRedirect.tsx
|   |   |
|   |   +-- sse/                      # SSE 도메인
|   |       +-- model/
|   |       |   +-- sse.types.ts      # SSEEvent, SSEEventType
|   |       +-- store/
|   |       |   +-- sse.store.ts      # SSEStore (Zustand)
|   |       +-- services/
|   |           +-- sse-manager.ts    # SSE 연결/재연결/이벤트 디스패치
|   |
|   +-- shared/                       # 도메인 횡단 공유 모듈
|   |   +-- ui/                       # 공통 UI 컴포넌트
|   |   |   +-- BottomSheet.tsx
|   |   |   +-- Button.tsx
|   |   |   +-- LoadingSpinner.tsx
|   |   |   +-- ErrorMessage.tsx
|   |   |   +-- ConfirmDialog.tsx
|   |   |   +-- Badge.tsx
|   |   |   +-- QuantityControl.tsx
|   |   |   +-- PriceDisplay.tsx
|   |   |   +-- EmptyState.tsx
|   |   |   +-- ConnectionBanner.tsx
|   |   |   +-- SkipLink.tsx
|   |   |   +-- PageSkeleton.tsx
|   |   |
|   |   +-- api/                      # API 인프라
|   |   |   +-- axios-instance.ts     # Axios 인스턴스 + 인터셉터
|   |   |   +-- error-handler.ts      # 에러 변환 파이프라인
|   |   |   +-- retry.ts             # 재시도 로직 (지수 백오프)
|   |   |
|   |   +-- network/                  # 네트워크 상태 관리
|   |   |   +-- network.store.ts      # NetworkStore (Zustand)
|   |   |   +-- online-detector.ts    # navigator.onLine + 이벤트 리스닝
|   |   |   +-- order-queue.ts        # 오프라인 주문 큐 매니저
|   |   |
|   |   +-- errors/                   # 에러 처리
|   |   |   +-- app-error.ts          # AppError 클래스
|   |   |   +-- error-codes.ts        # ErrorCode 타입
|   |   |   +-- PageErrorBoundary.tsx  # 페이지별 에러 바운더리
|   |   |
|   |   +-- hooks/                    # 공통 훅
|   |   |   +-- useNetworkStatus.ts   # 네트워크 상태 훅
|   |   |   +-- useScrollSync.ts      # 스크롤 동기화 훅
|   |   |
|   |   +-- utils/                    # 유틸리티
|   |   |   +-- format.ts            # Intl.NumberFormat, Intl.DateTimeFormat
|   |   |   +-- validation.ts        # 입력값 검증 (토큰, 수량)
|   |   |   +-- storage.ts           # localStorage 래퍼 (try-catch, 버전)
|   |   |
|   |   +-- layouts/                  # 레이아웃
|   |       +-- AppLayout.tsx         # Header + Outlet + CartFloatingBar
|   |       +-- Header.tsx            # 매장명 + 네비게이션 탭
|   |
|   +-- pages/                        # 라우트 진입점 (thin layer)
|   |   +-- MenuPage.tsx              # → domains/menu/components/MenuPage
|   |   +-- OrderConfirmPage.tsx      # → domains/order/components/OrderConfirmPage
|   |   +-- OrderSuccessPage.tsx      # → domains/order/components/OrderSuccessPage
|   |   +-- OrderHistoryPage.tsx      # → domains/order/components/OrderHistoryPage
|   |   +-- ErrorPage.tsx             # 에러 페이지
|   |
|   +-- styles/                       # 글로벌 스타일
|   |   +-- globals.css               # Tailwind directives + 전역 CSS
|   |
|   +-- main.tsx                      # Vite 진입점
|   +-- vite-env.d.ts                 # Vite 타입 선언
|
+-- public/                           # 정적 파일
+-- index.html                        # HTML 템플릿
+-- package.json
+-- vite.config.ts
+-- tsconfig.json
+-- tailwind.config.ts
+-- vitest.config.ts
+-- playwright.config.ts
```

---

## 2. 도메인 모듈 구조 원칙

### 각 도메인 모듈 내부 구조
```
domains/{domain-name}/
+-- model/        # 타입 정의 (인터페이스, 타입, 상수)
+-- store/        # Zustand Store (상태 + 액션)
+-- api/          # API 호출 함수 (Axios 사용)
+-- hooks/        # 도메인 전용 커스텀 훅
+-- components/   # 도메인 전용 UI 컴포넌트
+-- services/     # 도메인 전용 서비스 로직 (선택적)
```

### 의존성 규칙
```
[의존성 방향: 위에서 아래로만]

pages/          → domains/, shared/
domains/        → shared/ (다른 domain 직접 참조 금지)
shared/ui/      → (의존성 없음, 순수 UI)
shared/api/     → shared/errors/
shared/network/ → shared/api/, shared/errors/
shared/hooks/   → shared/ 내부만
shared/utils/   → (의존성 없음, 순수 함수)
```

### 도메인 간 통신
```
도메인 간 직접 import 금지
  → SSE 이벤트 → Zustand Store 직접 업데이트 (sse-manager.ts에서)
  → 도메인 간 데이터 필요 시 → 상위 컴포넌트에서 props로 전달
  → 또는 shared/hooks/에서 여러 store 조합
```

---

## 3. 모듈 의존성 다이어그램

```
[pages/]
  |
  +---> [domains/session/] -----> [shared/api/]
  |         |                         |
  |         +---> [shared/errors/] <--+
  |
  +---> [domains/menu/] -------> [shared/api/]
  |         |
  |         +---> [shared/ui/]
  |         +---> [shared/hooks/]
  |
  +---> [domains/cart/] -------> [shared/utils/]
  |         |
  |         +---> [shared/ui/]
  |
  +---> [domains/order/] ------> [shared/api/]
  |         |
  |         +---> [shared/ui/]
  |         +---> [shared/network/] → [shared/api/]
  |
  +---> [domains/sse/] --------> [domains/order/store] (예외: SSE 이벤트 디스패치)
            |                     [domains/session/store]
            +---> [shared/network/]
```

### SSE 도메인 예외 설명
- `sse-manager.ts`는 다른 도메인의 store를 직접 업데이트
- 이는 이벤트 기반 통신의 특성상 허용되는 예외
- `useOrderStore.getState()`, `useSessionStore.getState()` 패턴 사용
- 컴포넌트 레벨이 아닌 서비스 레벨에서만 허용

---

## 4. Mock 데이터 구조 (개발용)

```
apps/customer/
+-- src/
|   +-- mocks/                        # JSON 파일 Mock 데이터
|   |   +-- categories.json           # 카테고리 + 메뉴 목록
|   |   +-- orders.json               # 주문 내역 샘플
|   |   +-- session.json              # 세션 검증 응답 샘플
|   |   +-- mock-api.ts               # Mock API 핸들러 (환경변수로 전환)
```

### Mock 전환 패턴
```typescript
// shared/api/axios-instance.ts
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

// 각 도메인 api/ 파일에서
export const fetchMenus = useMock
  ? async () => (await import('../../mocks/categories.json')).default
  : async (storeId: string) => axiosInstance.get(`/api/menus/${storeId}`)
```
- `VITE_USE_MOCK=true`: JSON 파일에서 데이터 로드
- `VITE_USE_MOCK=false`: 실제 API 호출
- 나중에 MSW로 전환 시 mock-api.ts만 교체

---

## 5. 테스트 디렉토리 구조

```
apps/customer/
+-- src/
|   +-- domains/
|   |   +-- cart/
|   |   |   +-- store/
|   |   |   |   +-- cart.store.ts
|   |   |   |   +-- cart.store.test.ts    # 단위 테스트 (co-located)
|   |   |   +-- components/
|   |   |       +-- CartFloatingBar.tsx
|   |   |       +-- CartFloatingBar.test.tsx  # 컴포넌트 테스트
|   |   +-- ...
|   +-- shared/
|       +-- utils/
|           +-- format.ts
|           +-- format.test.ts            # 유틸리티 단위 테스트
|
+-- e2e/                                  # E2E 테스트 (Playwright)
|   +-- order-flow.spec.ts               # 주문 플로우 E2E
|   +-- menu-browse.spec.ts              # 메뉴 탐색 E2E
|   +-- session.spec.ts                  # 세션 관리 E2E
|   +-- error-scenarios.spec.ts          # 에러 시나리오 E2E
```

### 테스트 파일 배치 원칙
- 단위/컴포넌트 테스트: 소스 파일 옆에 co-located (`.test.ts`/`.test.tsx`)
- E2E 테스트: 프로젝트 루트 `e2e/` 디렉토리
- 테스트 유틸리티: `src/test-utils/` (render wrapper, mock factory 등)
