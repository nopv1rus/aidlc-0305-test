# Frontend Components - Unit 2: Customer Frontend

## 1. 컴포넌트 계층 구조 및 라우팅

### 라우팅 구조 (React Router v6)
```
/order/:tableToken              → MenuPage (기본 화면)
/order/:tableToken/confirm      → OrderConfirmPage
/order/:tableToken/success      → OrderSuccessPage
/order/:tableToken/history      → OrderHistoryPage
/order/:tableToken/error        → ErrorPage (유효하지 않은 토큰 등)
```

### 컴포넌트 트리
```
App
+-- AppProvider (Zustand stores 초기화, SSE 연결)
    +-- Router
        +-- TokenGuard (tableToken 검증 + 세션 초기화)
        |   +-- AppLayout
        |   |   +-- Header (매장명, 네비게이션)
        |   |   +-- <Outlet /> (페이지 컴포넌트)
        |   |   +-- CartFloatingBar (하단 고정 장바구니 바)
        |   |   +-- CartBottomSheet (장바구니 바텀시트)
        |   |
        |   +-- MenuPage
        |   |   +-- CategoryTabBar (상단 고정 카테고리 탭)
        |   |   +-- MenuSectionList
        |   |       +-- MenuSection (카테고리별 섹션)
        |   |           +-- MenuCard (개별 메뉴 카드)
        |   |   +-- MenuDetailSheet (메뉴 상세 바텀시트)
        |   |
        |   +-- OrderConfirmPage
        |   |   +-- OrderItemList (주문 항목 목록, 수량 수정 가능)
        |   |   +-- OrderSummary (총 금액)
        |   |   +-- OrderActions (주문 확정/돌아가기 버튼)
        |   |
        |   +-- OrderSuccessPage
        |   |   +-- OrderNumberDisplay (주문 번호)
        |   |   +-- CountdownRedirect (5초 카운트다운)
        |   |
        |   +-- OrderHistoryPage
        |       +-- OrderList
        |           +-- OrderCard (주문 카드)
        |               +-- OrderStatusBadge (상태 뱃지)
        |               +-- OrderItemSummary (메뉴 요약)
        |
        +-- ErrorPage (토큰 오류, 세션 만료 등)
```

### 공통 컴포넌트
```
components/common/
+-- BottomSheet          (바텀시트 컨테이너: 포커스 트랩, ESC 닫기, overscroll-behavior: contain)
+-- Button               (공통 버튼: focus-visible 스타일, hover 상태, touch-action: manipulation)
+-- LoadingSpinner       (로딩 인디케이터: aria-label="로딩 중", prefers-reduced-motion 대응)
+-- ErrorMessage         (에러 메시지: aria-live="assertive", 해결 방법 포함)
+-- ConfirmDialog        (확인 팝업: 포커스 트랩, ESC 닫기, 파괴적 액션 확인용)
+-- Badge                (뱃지 컴포넌트: aria-label로 뱃지 의미 전달)
+-- QuantityControl      (+/- 수량 조절: <button> 사용, aria-label, 최소 44px 터치)
+-- PriceDisplay         (금액 포맷팅: Intl.NumberFormat, tabular-nums)
+-- EmptyState           (빈 상태 표시: 의미 있는 메시지 + 안내)
+-- ConnectionBanner     (SSE 연결 상태: role="status", aria-live="polite")
+-- SkipLink             (스킵 링크: 메인 콘텐츠로 바로 이동)
```

---

## 2. 주요 페이지 컴포넌트 상세

### TokenGuard
```typescript
// 역할: tableToken 검증 + 세션/메뉴 초기화
// Props: children
// State: isInitialized, error
// 로직:
//   1. URL에서 tableToken 추출
//   2. 토큰 형식 검증 (정규식)
//   3. API로 세션 검증 + 매장/테이블 정보 획득
//   4. 메뉴 데이터 로드
//   5. SSE 연결 시작
//   6. 실패 시 ErrorPage로 리다이렉트
```

### MenuPage
```typescript
// 역할: 카테고리별 메뉴 목록 표시 (기본 화면)
// State:
//   - activeCategoryId: string (현재 활성 카테고리)
//   - selectedMenu: Menu | null (상세 보기 선택된 메뉴)
//   - isDetailOpen: boolean (메뉴 상세 바텀시트 열림 여부)
// API: MenuStore.categories (이미 로드됨)
// 인터랙션:
//   - 카테고리 탭 클릭 → 해당 섹션 스크롤
//   - 스크롤 → 현재 카테고리 탭 하이라이트
//   - 메뉴 카드 클릭 → 메뉴 상세 바텀시트 열기
//   - 장바구니 추가 → CartStore.addItem()
```

### CategoryTabBar
```typescript
// 역할: 상단 고정 카테고리 탭 바 (가로 스크롤)
// Props:
//   - categories: Category[]
//   - activeCategoryId: string
//   - onCategoryClick: (categoryId: string) => void
// 동작:
//   - 활성 카테고리 시각적 강조 (배경색/밑줄)
//   - 활성 탭이 보이도록 탭 바 자동 스크롤
//   - 터치 친화적 탭 크기 (최소 44px 높이)
// 접근성:
//   - role="tablist", 각 탭 role="tab"
//   - aria-selected로 활성 탭 표시
//   - 좌우 화살표 키로 탭 이동 (onKeyDown)
//   - focus-visible 스타일 적용
```

### MenuCard
```typescript
// 역할: 개별 메뉴 카드
// Props:
//   - menu: Menu
//   - onMenuClick: (menu: Menu) => void
//   - onAddToCart: (menu: Menu) => void
// 표시:
//   - 이미지 (없으면 플레이스홀더, alt="" 장식용)
//   - 메뉴명
//   - 가격 (Intl.NumberFormat으로 포맷팅)
//   - 뱃지 (있으면)
//   - "담기" <button> (aria-label="메뉴명 장바구니에 담기")
// 크기: 터치 친화적 (최소 44x44px 터치 영역)
// 이미지: 명시적 width/height, loading="lazy" (스크롤 아래)
// 접근성: 카드 클릭은 <button>, "담기"도 <button>
```

### MenuDetailSheet
```typescript
// 역할: 메뉴 상세 정보 바텀시트
// Props:
//   - menu: Menu | null
//   - isOpen: boolean
//   - onClose: () => void
//   - onAddToCart: (menu: Menu, quantity: number) => void
// State:
//   - quantity: number (기본 1)
// 표시:
//   - 큰 이미지 (alt=메뉴명, 명시적 width/height)
//   - 메뉴명, 가격, 설명
//   - 뱃지
//   - 수량 선택 (+/- <button> with aria-label)
//   - "장바구니 추가 · ₩XX,XXX" 버튼
// 접근성:
//   - 열림 시 포커스 트랩 (Tab 키 바텀시트 내 순환)
//   - ESC 키로 닫기
//   - overscroll-behavior: contain (배경 스크롤 방지)
//   - 닫기 버튼 aria-label="닫기"
// 애니메이션:
//   - 슬라이드 업: transform + opacity만 사용
//   - prefers-reduced-motion 존중
```

### CartFloatingBar
```typescript
// 역할: 메뉴 페이지 하단 고정 장바구니 바
// State: CartStore (items, getTotalAmount, getTotalCount)
// 표시:
//   - 장바구니 비어있으면 숨김 (조건부 렌더링: 삼항 연산자)
//   - "장바구니 {N}개 · ₩{총금액}" 텍스트
// 인터랙션:
//   - <button>으로 구현 (탭 → CartBottomSheet 열기)
// 레이아웃:
//   - padding-bottom: env(safe-area-inset-bottom) 적용
//   - touch-action: manipulation
// 접근성:
//   - aria-label="장바구니 열기, N개 항목"
//   - 장바구니 변경 시 aria-live="polite" 알림
```

### CartBottomSheet
```typescript
// 역할: 장바구니 바텀시트
// Props:
//   - isOpen: boolean
//   - onClose: () => void
// State: CartStore
// 표시:
//   - 장바구니 항목 목록 (메뉴명, 단가, 수량 +/-, 소계)
//   - 총 금액 (font-variant-numeric: tabular-nums)
//   - "주문하기" <button> → OrderConfirmPage로 <Link> 이동
//   - "장바구니 비우기" <button> (확인 팝업 - 파괴적 액션)
// 인터랙션:
//   - 수량 변경 → CartStore.updateQuantity()
//   - 항목 삭제 → CartStore.removeItem()
//   - 비우기 → ConfirmDialog → CartStore.clearCart()
// 접근성:
//   - 포커스 트랩 + ESC 닫기
//   - overscroll-behavior: contain
//   - 수량 +/- 버튼: aria-label="수량 증가"/"수량 감소"
//   - 삭제 버튼: aria-label="메뉴명 삭제"
```

### OrderConfirmPage
```typescript
// 역할: 주문 최종 확인 + 수량 수정 + 주문 확정
// State:
//   - CartStore (items)
//   - OrderStore (isSubmitting, submitError)
// 표시:
//   - 주문 항목 목록 (수량 수정 가능, QuantityControl 사용)
//   - 총 금액 (font-variant-numeric: tabular-nums)
//   - "주문 확정" <button> + "돌아가기" <button>
// 인터랙션:
//   - 수량 변경 → CartStore.updateQuantity()
//   - 주문 확정 → OrderStore.createOrder() → 성공 시 OrderSuccessPage
//   - 돌아가기 → navigate(-1)
// 접근성:
//   - 주문 확정 버튼: 요청 시작 전까지 활성 상태 유지, 요청 중 spinner 표시
//   - 에러 발생 시 에러 메시지에 포커스 이동 + aria-live="assertive"
//   - 에러 메시지에 해결 방법 포함 (문제만 표시 금지)
// API: POST /api/orders
```

### OrderSuccessPage
```typescript
// 역할: 주문 성공 피드백 + 자동 리다이렉트
// Props (route state): orderNumber: string
// State:
//   - countdown: number (5부터 카운트다운)
// 표시:
//   - 체크 아이콘 (aria-hidden="true") + "주문이 접수되었습니다"
//   - 주문 번호
//   - "{N}초 후 메뉴 화면으로 이동합니다" (tabular-nums)
//   - "메뉴로 돌아가기" <Link> (네비게이션이므로 <a> 사용)
// 로직:
//   - 5초 카운트다운 후 메뉴 페이지로 자동 이동
//   - 버튼 클릭 시 즉시 이동
// 접근성:
//   - 카운트다운 aria-live="polite" (매초 업데이트 안내)
//   - prefers-reduced-motion 시 카운트다운 애니메이션 비활성화
```

### OrderHistoryPage
```typescript
// 역할: 현재 세션 주문 내역 조회
// State:
//   - OrderStore (orders)
//   - isLoading
// 표시:
//   - 주문 목록 (시간 역순, Intl.DateTimeFormat으로 시각 포맷팅)
//   - 각 주문: 번호, 시각, 상태 뱃지, 메뉴 요약, 금액 (tabular-nums)
//   - 빈 상태: EmptyState 컴포넌트 ("아직 주문 내역이 없습니다")
//   - 로딩 상태: "주문 내역을 불러오는 중…" (말줄임표)
// API: GET /api/orders/session/{sessionId}
// SSE: ORDER_STATUS_CHANGED → 실시간 상태 업데이트 (aria-live="polite")
```

---

## 3. 사용자 인터랙션 플로우

### 플로우 1: QR스캔 → 메뉴 탐색 → 장바구니 추가
```
QR스캔 → /order/{token} → TokenGuard 초기화
  → MenuPage 표시
  → 카테고리 탭 탐색 (스크롤 연동)
  → 메뉴 카드의 "담기" 버튼 클릭
  → 장바구니에 추가 + 하단 바 업데이트
  (또는)
  → 메뉴 카드 클릭 → 상세 바텀시트
  → 수량 선택 → "장바구니 추가" 클릭
  → 바텀시트 닫힘 + 하단 바 업데이트
```

### 플로우 2: 장바구니 → 주문 확정
```
하단 장바구니 바 탭 → 장바구니 바텀시트 열림
  → 수량 조절 / 항목 삭제
  → "주문하기" 클릭 → OrderConfirmPage
  → 최종 확인 (수량 수정 가능)
  → "주문 확정" 클릭 → API 호출
  → 성공 → OrderSuccessPage (5초 후 메뉴로)
  → 실패 → 에러 메시지 + 재시도
```

### 플로우 3: 주문 내역 확인
```
Header의 "주문내역" 탭 클릭 → OrderHistoryPage
  → 주문 목록 표시 (시간 역순)
  → SSE로 상태 변경 실시간 반영
  → "메뉴" 탭 클릭 → MenuPage로 복귀
```

---

## 4. API 통합 포인트

| 컴포넌트 | API 엔드포인트 | 시점 |
|----------|---------------|------|
| TokenGuard | GET /api/sessions/validate?tableToken={token} | 앱 초기화 |
| TokenGuard | GET /api/menus/{storeId} | 앱 초기화 |
| OrderConfirmPage | POST /api/orders | 주문 확정 클릭 |
| OrderHistoryPage | GET /api/orders/session/{sessionId} | 페이지 진입 |
| SSEStore | GET /api/sse/customer/{storeId}/{tableId} | 앱 초기화 (EventSource) |

---

## 5. React Best Practices 적용 원칙

### 번들 최적화 (Section 2)
- 바텀시트 컴포넌트(MenuDetailSheet, CartBottomSheet)는 `React.lazy` + `Suspense`로 동적 임포트
- 아이콘 라이브러리 사용 시 barrel file import 금지, 개별 파일에서 직접 import
- OrderHistoryPage, OrderConfirmPage는 route-level code splitting 적용

### 클라이언트 데이터 관리 (Section 4)
- 스크롤 이벤트 리스너에 `{ passive: true }` 적용 (CategoryTabBar 스크롤 연동)
- localStorage 접근은 try-catch 필수 + 버전 프리픽스 (`session:v1:`, `cart:v1:`)
- Zustand selector로 필요한 state만 구독하여 불필요한 리렌더 방지

### 리렌더 최적화 (Section 5)
- 총 금액, 총 수량 등 derived state는 별도 state로 관리하지 않고 렌더링 시 계산
- CartStore action에 functional setState 패턴 적용 (stale closure 방지)
- QuantityControl 등 자주 변경되는 컴포넌트는 `React.memo` 적용
- 이벤트 핸들러 내에서 side effect 처리 (useEffect 남용 방지)

### 렌더링 성능 (Section 6)
- 메뉴 목록에 `content-visibility: auto` CSS 적용 (긴 메뉴 목록 최적화)
- 조건부 렌더링 시 `&&` 대신 삼항 연산자 사용 (0/NaN 렌더링 방지)
- 장바구니 바 표시/숨김에 조건부 렌더링 적용 (CartFloatingBar)

### JavaScript 성능 (Section 7)
- 메뉴 ID 기반 조회 시 Map 자료구조 활용 (O(1) lookup)
- 배열 정렬 시 `.toSorted()` 사용 (원본 불변성 보장)
- 금액 포맷팅 등 반복 호출 함수는 모듈 레벨 캐싱 적용

---

## 6. Web Interface Guidelines 적용 원칙

### 접근성 (Accessibility)
- 시맨틱 HTML 우선: `<button>` (액션), `<a>`/`<Link>` (네비게이션), `<div onClick>` 금지
- 아이콘 전용 버튼: `aria-label` 필수 (수량 +/-, 닫기, 삭제 등)
- 장식용 아이콘: `aria-hidden="true"`, 장식용 이미지: `alt=""`
- 제목 계층: `<h1>` → `<h2>` → `<h3>` 순서 유지
- 비동기 업데이트: `aria-live="polite"` (SSE 상태 변경, 장바구니 변경)
- 에러 알림: `aria-live="assertive"` (즉시 전달 필요)
- SkipLink 컴포넌트로 메인 콘텐츠 바로가기 제공
- 카테고리 섹션 헤딩에 `scroll-margin-top` 적용

### 포커스 상태 (Focus States)
- 모든 인터랙티브 요소: `focus-visible:ring-*` 스타일 적용
- `outline: none` 단독 사용 절대 금지
- `:focus-visible` 사용 (`:focus` 대신)
- 바텀시트/모달: `:focus-within` 그룹 포커스

### 애니메이션 (Animation)
- `prefers-reduced-motion` 미디어 쿼리 존중
- `transform`/`opacity`만 애니메이션 (GPU 가속)
- `transition: all` 금지 → 속성 명시적 나열
- 모든 애니메이션 사용자 입력으로 중단 가능

### 타이포그래피 (Typography)
- `…` (유니코드) 사용, `...` 금지
- 로딩 텍스트: `"로딩 중…"`, `"주문 처리 중…"`
- 금액/수량 열: `font-variant-numeric: tabular-nums`
- 긴 텍스트: `truncate`/`line-clamp-*`/`break-words`
- Flex 자식: `min-w-0` (truncation 허용)

### 이미지 (Images)
- `<img>`: 명시적 `width`/`height` 필수 (CLS 방지)
- 스크롤 아래: `loading="lazy"`
- 첫 화면: `fetchpriority="high"`

### 터치 및 모바일 (Touch & Mobile)
- 터치 대상 최소 44×44px
- `touch-action: manipulation` (더블탭 줌 방지)
- 바텀시트/모달: `overscroll-behavior: contain`
- Safe area: `env(safe-area-inset-*)` 적용
- `autoFocus` 모바일 사용 자제

### 숫자/날짜 포맷팅 (i18n)
- 금액: `Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })`
- 날짜/시간: `Intl.DateTimeFormat('ko-KR')` (하드코딩 금지)

### 네비게이션 (Navigation)
- 네비게이션은 `<a>`/`<Link>` (Cmd/Ctrl+클릭 지원)
- 파괴적 액션: 확인 모달 필수 (즉시 실행 금지)
- `<meta name="theme-color">` 페이지 배경색 일치

### Anti-patterns 금지 목록
- `user-scalable=no` / `maximum-scale=1` (줌 비활성화 금지)
- `transition: all`
- `outline: none` (대체 포커스 없이)
- `<div onClick>` (→ `<button>` 사용)
- 라벨 없는 폼 입력
- `aria-label` 없는 아이콘 버튼
- 하드코딩 날짜/숫자 포맷 (→ `Intl.*` 사용)
- 크기 없는 `<img>` 태그

