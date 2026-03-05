# 테이블오더 서비스 - 컴포넌트 메서드 정의

> 상세 비즈니스 규칙은 Functional Design(CONSTRUCTION)에서 정의됩니다.
> 여기서는 메서드 시그니처와 고수준 목적만 정의합니다.

---

## Auth Module

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| loginAdmin(storeIdentifier, password) | string, string | { accessToken, admin } | 매장 관리자 로그인 |
| loginSuperAdmin(username, password) | string, string | { accessToken, admin } | 슈퍼 관리자 로그인 |
| validateToken(token) | string | { admin, role } | JWT 토큰 검증 |
| validateTableToken(tableToken) | string | { store, table } | 테이블 토큰 검증 (고객 접속) |
| checkLoginAttempts(storeIdentifier) | string | boolean | 로그인 시도 제한 확인 |

## Store Module

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| createStore(name) | string | Store | 매장 등록 (식별자 자동 생성) |
| getStores() | - | Store[] | 전체 매장 목록 조회 |
| getStoreById(id) | string | Store | 매장 상세 조회 |

## Table Module

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| createTable(storeId, tableNumber) | string, number | Table | 테이블 등록 (토큰 자동 생성) |
| getTables(storeId) | string | Table[] | 매장 테이블 목록 조회 |
| getTableByToken(token) | string | Table | 토큰으로 테이블 조회 |
| generateQRCode(tableId) | string | Buffer (PNG) | 개별 QR코드 생성 |
| generateBulkQRCodes(tableIds) | string[] | Buffer (ZIP) | 일괄 QR코드 생성 |

## Menu Module

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| createMenu(storeId, menuData) | string, CreateMenuDto | Menu | 메뉴 등록 |
| updateMenu(menuId, menuData) | string, UpdateMenuDto | Menu | 메뉴 수정 |
| deleteMenu(menuId) | string | void | 메뉴 삭제 |
| getMenusByStore(storeId) | string | Menu[] | 매장 메뉴 목록 (카테고리별) |
| updateMenuOrder(storeId, orderData) | string, MenuOrderDto[] | void | 메뉴 노출 순서 변경 |
| updateMenuBadge(menuId, badge) | string, BadgeType | Menu | 메뉴 뱃지 설정 |

## Order Module

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| createOrder(storeId, tableId, sessionId, items) | string, string, string, OrderItemDto[] | Order | 주문 생성 |
| getOrdersBySession(sessionId) | string | Order[] | 세션별 주문 조회 |
| getOrdersByStore(storeId) | string | Order[] | 매장 전체 주문 조회 (활성) |
| updateOrderStatus(orderId, status) | string, OrderStatus | Order | 주문 상태 변경 |
| cancelOrder(orderId) | string | Order | 주문 취소 |
| getOrderHistory(storeId, filters) | string, HistoryFilterDto | OrderHistory[] | 과거 주문 내역 조회 |
| getOrderHistorySummary(storeId, filters) | string, HistoryFilterDto | HistorySummary | 전체 합산 내역 조회 |

## Session Module

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| getOrCreateSession(tableId) | string | TableSession | 세션 조회 또는 생성 |
| validateSession(sessionId) | string | boolean | 세션 유효성 검증 (4시간) |
| endSession(sessionId) | string | void | 세션 종료 (이용 완료) |
| getActiveSession(tableId) | string | TableSession or null | 활성 세션 조회 |

## SSE Module

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| subscribeCustomer(storeId, tableId) | string, string | Observable<SSEEvent> | 고객 SSE 구독 |
| subscribeAdmin(storeId) | string | Observable<SSEEvent> | 관리자 SSE 구독 |
| emitNewOrder(storeId, tableId, order) | string, string, Order | void | 신규 주문 이벤트 발행 |
| emitOrderStatusChange(storeId, tableId, order) | string, string, Order | void | 상태 변경 이벤트 발행 |

## Admin Module

| 메서드 | 입력 | 출력 | 목적 |
|--------|------|------|------|
| createStoreAdmin(storeIdentifier, password) | string, string | Admin | 매장 관리자 계정 생성 |
| getStoreAdmins() | - | Admin[] | 전체 관리자 목록 조회 |
| getStoreAdminsByStore(storeId) | string | Admin[] | 매장별 관리자 조회 |
