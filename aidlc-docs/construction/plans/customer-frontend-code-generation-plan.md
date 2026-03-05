# Code Generation Plan - Unit 2: Customer Frontend

## 유닛 컨텍스트

- **유닛**: Unit 2 - Customer Frontend
- **디렉토리**: `apps/customer/`
- **브랜치**: `feature-customer-fe`
- **스토리**: US-C01 ~ US-C19 (19개)
- **의존성**: Unit 1 Backend API (미완성 → Mock 데이터 사용)
- **참조**: `shared/types/` (Unit 1 생성, 현재 미존재 → 자체 타입 정의)

## 기술 스택

| 기술 | 버전 |
|------|------|
| React | 19.x |
| TypeScript | 5.x |
| Vite | 6.x |
| Zustand | 5.x |
| Tailwind CSS | 4.x |
| Axios | 1.x |
| React Router | 7.x |
| Heroicons | 2.x |
| Vitest + RTL | latest |
| Playwright | latest |
| pnpm | 9.x |

## 코드 생성 단계

---

### Step 1: 프로젝트 초기화 및 설정 파일
- [x] `apps/customer/package.json` — 의존성 정의
- [x] `apps/customer/tsconfig.json` — TypeScript 설정 (strict mode)
- [x] `apps/customer/vite.config.ts` — Vite 설정 (chunk 전략, proxy)
- [x] `apps/customer/tailwind.config.ts` — Tailwind 4 설정
- [x] `apps/customer/vitest.config.ts` — Vitest 설정 (jsdom, coverage)
- [x] `apps/customer/playwright.config.ts` — Playwright 설정 (모바일 에뮬레이션)
- [x] `apps/customer/index.html` — HTML 템플릿 (viewport, theme-color, safe-area)
- [x] `apps/customer/.env.development` — 환경변수 (VITE_USE_MOCK=true)
- [x] `apps/customer/.env.production` — 환경변수 (VITE_USE_MOCK=false)
- **관련 스토리**: 전체 (프로젝트 기반)

---

### Step 2: 글로벌 스타일 및 앱 진입점
- [x] `apps/customer/src/styles/globals.css` — Tailwind directives, 전역 CSS (touch-action, safe-area, reduced-motion, tabular-nums, content-visibility)
- [x] `apps/customer/src/main.tsx` — Vite 진입점
- [x] `apps/customer/src/vite-env.d.ts` — Vite 타입 선언
- **관련 스토리**: 전체 (앱 기반)

---

### Step 3: Shared - 유틸리티 및 에러 처리
- [x] `apps/customer/src/shared/utils/format.ts` — Intl.NumberFormat, Intl.DateTimeFormat 래퍼
- [x] `apps/customer/src/shared/utils/validation.ts` — 토큰 검증, 수량 검증
- [x] `apps/customer/src/shared/utils/storage.ts` — localStorage 래퍼 (try-catch, 버전 프리픽스)
- [x] `apps/customer/src/shared/errors/app-error.ts` — AppError 클래스
- [x] `apps/customer/src/shared/errors/error-codes.ts` — ErrorCode 타입
- **관련 스토리**: US-C01 (토큰 검증), US-C03 (금액 포맷), US-C12 (localStorage)

---

### Step 4: Shared - API 인프라
- [x] `apps/customer/src/shared/api/axios-instance.ts` — Axios 인스턴스 + 인터셉터 체인 (타임아웃 10초, Mock 전환)
- [x] `apps/customer/src/shared/api/error-handler.ts` — 에러 변환 파이프라인 (Axios Error → AppError)
- [x] `apps/customer/src/shared/api/retry.ts` — 지수 백오프 재시도 (GET만, 최대 3회)
- **관련 스토리**: US-C16 (에러 처리), US-C14 (주문 API)

---

### Step 5: Shared - 네트워크 상태 관리
- [x] `apps/customer/src/shared/network/network.store.ts` — NetworkStore (Zustand)
- [x] `apps/customer/src/shared/network/online-detector.ts` — navigator.onLine + 이벤트 리스닝
- [x] `apps/customer/src/shared/network/order-queue.ts` — 오프라인 주문 큐 매니저
- **관련 스토리**: US-C14 (오프라인 주문), US-C16 (네트워크 에러)

---

### Step 6: Shared - 공통 UI 컴포넌트
- [x] `apps/customer/src/shared/ui/BottomSheet.tsx` — 바텀시트 (포커스 트랩, ESC, overscroll-behavior)
- [x] `apps/customer/src/shared/ui/Button.tsx` — 공통 버튼 (focus-visible, touch-action, hover)
- [x] `apps/customer/src/shared/ui/LoadingSpinner.tsx` — 로딩 인디케이터 (reduced-motion)
- [x] `apps/customer/src/shared/ui/ErrorMessage.tsx` — 에러 메시지 (aria-live, 해결 방법 포함)
- [x] `apps/customer/src/shared/ui/ConfirmDialog.tsx` — 확인 팝업 (포커스 트랩, 파괴적 액션)
- [x] `apps/customer/src/shared/ui/Badge.tsx` — 뱃지 (aria-label)
- [x] `apps/customer/src/shared/ui/QuantityControl.tsx` — 수량 조절 (+/- 버튼, 44px 터치, memo)
- [x] `apps/customer/src/shared/ui/PriceDisplay.tsx` — 금액 표시 (Intl.NumberFormat, tabular-nums)
- [x] `apps/customer/src/shared/ui/EmptyState.tsx` — 빈 상태 표시
- [x] `apps/customer/src/shared/ui/ConnectionBanner.tsx` — SSE 연결 상태 (role="status")
- [x] `apps/customer/src/shared/ui/SkipLink.tsx` — 스킵 링크
- [x] `apps/customer/src/shared/ui/PageSkeleton.tsx` — 페이지 스켈레톤
- **관련 스토리**: 전체 (공통 UI)

---

### Step 7: Shared - 레이아웃 및 에러 바운더리
- [x] `apps/customer/src/shared/layouts/AppLayout.tsx` — Header + Outlet + CartFloatingBar
- [x] `apps/customer/src/shared/layouts/Header.tsx` — 매장명 + 네비게이션 탭 (Link)
- [x] `apps/customer/src/shared/errors/PageErrorBoundary.tsx` — 페이지별 에러 바운더리
- **관련 스토리**: US-C01 (레이아웃), US-C16 (에러 처리)

---

### Step 8: Session 도메인
- [x] `apps/customer/src/domains/session/model/session.types.ts` — SessionInfo, ValidateSessionResponse
- [x] `apps/customer/src/domains/session/store/session.store.ts` — SessionStore (Zustand + persist)
- [x] `apps/customer/src/domains/session/api/session.api.ts` — GET /api/sessions/validate
- [x] `apps/customer/src/domains/session/hooks/useSession.ts` — 세션 관련 커스텀 훅
- [x] `apps/customer/src/domains/session/components/TokenGuard.tsx` — 토큰 검증 가드
- [x] `apps/customer/src/domains/session/components/SessionExpired.tsx` — 세션 만료 화면
- **관련 스토리**: US-C01 (QR 접속), US-C02 (세션 유지), US-C03 (동시 접속)

---

### Step 9: Menu 도메인
- [x] `apps/customer/src/domains/menu/model/menu.types.ts` — Menu, Category, MenuBadge
- [x] `apps/customer/src/domains/menu/store/menu.store.ts` — MenuStore (Zustand)
- [x] `apps/customer/src/domains/menu/api/menu.api.ts` — GET /api/menus/{storeId}
- [x] `apps/customer/src/domains/menu/hooks/useMenuScroll.ts` — 카테고리 스크롤 연동 훅 (IntersectionObserver)
- [x] `apps/customer/src/domains/menu/components/MenuPage.tsx` — 메뉴 페이지
- [x] `apps/customer/src/domains/menu/components/CategoryTabBar.tsx` — 카테고리 탭 바 (role="tablist", 키보드)
- [x] `apps/customer/src/domains/menu/components/MenuSectionList.tsx` — 메뉴 섹션 리스트
- [x] `apps/customer/src/domains/menu/components/MenuSection.tsx` — 카테고리별 섹션
- [x] `apps/customer/src/domains/menu/components/MenuCard.tsx` — 메뉴 카드 (이미지, 뱃지, 담기 버튼)
- [x] `apps/customer/src/domains/menu/components/MenuDetailSheet.tsx` — 메뉴 상세 바텀시트 (React.lazy)
- **관련 스토리**: US-C04 (메뉴 목록), US-C05 (메뉴 상세), US-C06 (카테고리 이동)

---

### Step 10: Cart 도메인
- [x] `apps/customer/src/domains/cart/model/cart.types.ts` — CartItem
- [x] `apps/customer/src/domains/cart/store/cart.store.ts` — CartStore (Zustand + persist, functional setState)
- [x] `apps/customer/src/domains/cart/hooks/useCartTotal.ts` — 금액 계산 훅
- [x] `apps/customer/src/domains/cart/components/CartFloatingBar.tsx` — 하단 고정 장바구니 바 (safe-area)
- [x] `apps/customer/src/domains/cart/components/CartBottomSheet.tsx` — 장바구니 바텀시트 (React.lazy)
- [x] `apps/customer/src/domains/cart/components/CartItemRow.tsx` — 장바구니 항목 행
- **관련 스토리**: US-C07 (추가), US-C08 (수량), US-C09 (삭제), US-C10 (금액), US-C11 (비우기), US-C12 (로컬 유지)

---

### Step 11: Order 도메인
- [x] `apps/customer/src/domains/order/model/order.types.ts` — Order, OrderStatus, OrderItem, CreateOrderRequest/Response
- [x] `apps/customer/src/domains/order/store/order.store.ts` — OrderStore (Zustand)
- [x] `apps/customer/src/domains/order/api/order.api.ts` — POST /api/orders, GET /api/orders/session
- [x] `apps/customer/src/domains/order/hooks/useOrderSubmit.ts` — 주문 제출 로직 훅
- [x] `apps/customer/src/domains/order/components/OrderConfirmPage.tsx` — 주문 확인 (수량 수정, 확정)
- [x] `apps/customer/src/domains/order/components/OrderSuccessPage.tsx` — 주문 성공 (카운트다운)
- [x] `apps/customer/src/domains/order/components/OrderHistoryPage.tsx` — 주문 내역 (SSE 실시간)
- [x] `apps/customer/src/domains/order/components/OrderCard.tsx` — 주문 카드
- [x] `apps/customer/src/domains/order/components/OrderStatusBadge.tsx` — 상태 뱃지
- [x] `apps/customer/src/domains/order/components/OrderItemList.tsx` — 주문 항목 목록
- [x] `apps/customer/src/domains/order/components/CountdownRedirect.tsx` — 카운트다운 리다이렉트
- **관련 스토리**: US-C13 (확인), US-C14 (확정), US-C15 (성공), US-C16 (실패), US-C17 (목록), US-C18 (상세), US-C19 (실시간)

---

### Step 12: SSE 도메인
- [x] `apps/customer/src/domains/sse/model/sse.types.ts` — SSEEvent, SSEEventType
- [x] `apps/customer/src/domains/sse/store/sse.store.ts` — SSEStore (Zustand)
- [x] `apps/customer/src/domains/sse/services/sse-manager.ts` — SSE 연결/재연결/이벤트 디스패치
- **관련 스토리**: US-C19 (실시간 업데이트)

---

### Step 13: 앱 코어 (Provider, Router, Error Boundary)
- [x] `apps/customer/src/app/App.tsx` — 루트 컴포넌트 (Error Boundary 래핑)
- [x] `apps/customer/src/app/AppProvider.tsx` — 전역 Provider (네트워크 감지, SSE 초기화)
- [x] `apps/customer/src/app/router.tsx` — React Router 설정 (lazy routes, PageErrorBoundary)
- [x] `apps/customer/src/app/error-boundary.tsx` — 최상위 Error Boundary
- **관련 스토리**: US-C01 (라우팅), US-C16 (에러 처리)

---

### Step 14: Pages (라우트 진입점) 및 에러 페이지
- [x] `apps/customer/src/pages/MenuPage.tsx` — 메뉴 페이지 진입점
- [x] `apps/customer/src/pages/OrderConfirmPage.tsx` — 주문 확인 진입점
- [x] `apps/customer/src/pages/OrderSuccessPage.tsx` — 주문 성공 진입점
- [x] `apps/customer/src/pages/OrderHistoryPage.tsx` — 주문 내역 진입점
- [x] `apps/customer/src/pages/ErrorPage.tsx` — 에러 페이지
- **관련 스토리**: 전체 (라우팅)

---

### Step 15: Mock 데이터
- [x] `apps/customer/src/mocks/categories.json` — 카테고리 + 메뉴 목록 (3개 카테고리, 12개 메뉴)
- [x] `apps/customer/src/mocks/orders.json` — 주문 내역 샘플 (4개 주문, 각 상태별)
- [x] `apps/customer/src/mocks/session.json` — 세션 검증 응답 샘플
- [x] `apps/customer/src/mocks/mock-api.ts` — Mock API 핸들러 (VITE_USE_MOCK 전환)
- **관련 스토리**: 전체 (개발용 Mock)

---

### Step 16: 단위 테스트 (Store + Utils)
- [x] `apps/customer/src/shared/utils/format.test.ts` — 포맷 유틸 테스트
- [x] `apps/customer/src/shared/utils/validation.test.ts` — 검증 유틸 테스트
- [x] `apps/customer/src/shared/utils/storage.test.ts` — localStorage 래퍼 테스트
- [x] `apps/customer/src/domains/cart/store/cart.store.test.ts` — CartStore 테스트
- [x] `apps/customer/src/domains/session/store/session.store.test.ts` — SessionStore 테스트
- [x] `apps/customer/src/domains/order/store/order.store.test.ts` — OrderStore 테스트
- [x] `apps/customer/src/domains/menu/store/menu.store.test.ts` — MenuStore 테스트
- **관련 스토리**: 전체 (품질 보증)

---

### Step 17: 컴포넌트 테스트
- [x] `apps/customer/src/shared/ui/QuantityControl.test.tsx` — 수량 조절 테스트
- [x] `apps/customer/src/shared/ui/PriceDisplay.test.tsx` — 금액 표시 테스트
- [x] `apps/customer/src/shared/ui/BottomSheet.test.tsx` — 바텀시트 테스트 (포커스 트랩, ESC)
- [x] `apps/customer/src/domains/menu/components/MenuCard.test.tsx` — 메뉴 카드 테스트
- [x] `apps/customer/src/domains/cart/components/CartFloatingBar.test.tsx` — 장바구니 바 테스트
- [x] `apps/customer/src/domains/order/components/OrderConfirmPage.test.tsx` — 주문 확인 테스트
- **관련 스토리**: 전체 (품질 보증)

---

### Step 18: E2E 테스트 설정
- [x] `apps/customer/e2e/order-flow.spec.ts` — 주문 플로우 E2E (메뉴 → 장바구니 → 주문 → 성공)
- [x] `apps/customer/e2e/menu-browse.spec.ts` — 메뉴 탐색 E2E (카테고리 이동, 상세 보기)
- [x] `apps/customer/e2e/session.spec.ts` — 세션 관리 E2E (토큰 검증, 만료)
- [x] `apps/customer/e2e/error-scenarios.spec.ts` — 에러 시나리오 E2E
- **관련 스토리**: 전체 (품질 보증)

---

### Step 19: 코드 생성 요약 문서
- [x] `aidlc-docs/construction/customer-frontend/code/code-generation-summary.md` — 생성된 파일 목록, 스토리 매핑, 아키텍처 요약

---

## 스토리 트레이서빌리티 매트릭스

| 스토리 ID | 구현 Step | 주요 파일 |
|-----------|:---------:|----------|
| US-C01 | 8, 13, 14 | TokenGuard, router, SessionStore |
| US-C02 | 8 | SessionStore (persist), useSession |
| US-C03 | 8 | SessionStore (세션 공유 로직) |
| US-C04 | 9 | MenuPage, CategoryTabBar, MenuSectionList |
| US-C05 | 9 | MenuDetailSheet, MenuCard |
| US-C06 | 9 | CategoryTabBar, useMenuScroll |
| US-C07 | 10 | CartStore.addItem, CartFloatingBar |
| US-C08 | 10 | CartStore.updateQuantity, QuantityControl |
| US-C09 | 10 | CartStore.removeItem, CartItemRow |
| US-C10 | 10 | CartStore.getTotalAmount, PriceDisplay |
| US-C11 | 10 | CartStore.clearCart, ConfirmDialog |
| US-C12 | 10 | CartStore (persist middleware) |
| US-C13 | 11 | OrderConfirmPage, OrderItemList |
| US-C14 | 11, 5 | OrderStore.createOrder, order-queue |
| US-C15 | 11 | OrderSuccessPage, CountdownRedirect |
| US-C16 | 3, 4, 7, 11 | AppError, error-handler, PageErrorBoundary |
| US-C17 | 11 | OrderHistoryPage, OrderCard |
| US-C18 | 11 | OrderCard, OrderItemSummary |
| US-C19 | 12 | sse-manager, SSEStore |

## 총 파일 수 예상

| 카테고리 | 파일 수 |
|----------|:-------:|
| 설정 파일 | 9 |
| 스타일/진입점 | 3 |
| Shared 모듈 | 22 |
| Session 도메인 | 6 |
| Menu 도메인 | 10 |
| Cart 도메인 | 6 |
| Order 도메인 | 11 |
| SSE 도메인 | 3 |
| App 코어 | 4 |
| Pages | 5 |
| Mock 데이터 | 4 |
| 단위 테스트 | 7 |
| 컴포넌트 테스트 | 6 |
| E2E 테스트 | 4 |
| 문서 | 1 |
| **합계** | **101** |
