# 테이블오더 데이터베이스 구조

## 개요
- Database: `table_order`
- DBMS: PostgreSQL
- 총 7개 테이블

## ERD

```
stores ──┬── admins
         ├── store_tables ── orders ── order_items
         ├── menus
         └── (order_history)
```

---

## 테이블 상세

### 1. stores (매장)

| 컬럼 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, auto | 매장 고유 ID |
| storeCode | VARCHAR(50) | UNIQUE, NOT NULL | 매장 식별 코드 (예: STORE001) |
| name | VARCHAR(100) | NOT NULL | 매장명 |
| createdAt | TIMESTAMP | DEFAULT NOW() | 생성일시 |

---

### 2. admins (관리자)

| 컬럼 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, auto | 관리자 고유 ID |
| username | VARCHAR(50) | NOT NULL | 사용자명 |
| password | VARCHAR(255) | NOT NULL | 비밀번호 (bcrypt 해싱) |
| loginAttempts | INTEGER | DEFAULT 0 | 로그인 실패 횟수 |
| lockedUntil | TIMESTAMP | nullable | 계정 잠금 해제 시각 (5회 실패 시 15분 잠금) |
| storeId | UUID | FK → stores.id | 소속 매장 |
| createdAt | TIMESTAMP | DEFAULT NOW() | 생성일시 |

---

### 3. store_tables (테이블)

| 컬럼 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, auto | 테이블 고유 ID |
| tableNumber | INTEGER | NOT NULL, UNIQUE(storeId) | 테이블 번호 |
| password | VARCHAR(255) | NOT NULL | 태블릿 비밀번호 (bcrypt 해싱) |
| sessionId | VARCHAR(255) | nullable | 현재 세션 ID (첫 주문 시 자동 생성) |
| sessionStartedAt | TIMESTAMP | nullable | 세션 시작 시각 |
| storeId | UUID | FK → stores.id | 소속 매장 |
| createdAt | TIMESTAMP | DEFAULT NOW() | 생성일시 |

> sessionId가 null이면 빈 테이블 상태. 첫 주문 시 UUID가 자동 할당되고, 이용 완료 시 null로 리셋됩니다.

---

### 4. menus (메뉴)

| 컬럼 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, auto | 메뉴 고유 ID |
| name | VARCHAR(100) | NOT NULL | 메뉴명 |
| price | DECIMAL(10,0) | NOT NULL | 가격 (원) |
| description | TEXT | nullable | 메뉴 설명 |
| category | VARCHAR(50) | NOT NULL | 카테고리 (예: 찌개류, 구이류) |
| imageUrl | VARCHAR(500) | nullable | 메뉴 이미지 URL |
| sortOrder | INTEGER | DEFAULT 0 | 노출 순서 (낮을수록 먼저) |
| isAvailable | BOOLEAN | DEFAULT TRUE | 판매 가능 여부 |
| storeId | UUID | FK → stores.id | 소속 매장 |
| createdAt | TIMESTAMP | DEFAULT NOW() | 생성일시 |
| updatedAt | TIMESTAMP | DEFAULT NOW() | 수정일시 |

---

### 5. orders (주문)

| 컬럼 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, auto | 주문 고유 ID |
| orderNumber | INTEGER | NOT NULL | 매장 내 주문 순번 |
| status | ENUM | DEFAULT 'pending' | 주문 상태 |
| totalAmount | DECIMAL(10,0) | NOT NULL | 총 주문 금액 |
| sessionId | VARCHAR(255) | NOT NULL | 테이블 세션 ID |
| tableId | UUID | FK → store_tables.id | 주문 테이블 |
| storeId | UUID | FK → stores.id | 소속 매장 |
| orderedAt | TIMESTAMP | DEFAULT NOW() | 주문 시각 |

주문 상태값:
- `pending` : 대기중
- `preparing` : 준비중
- `completed` : 완료

---

### 6. order_items (주문 항목)

| 컬럼 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, auto | 항목 고유 ID |
| menuName | VARCHAR(100) | NOT NULL | 메뉴명 |
| quantity | INTEGER | NOT NULL | 수량 |
| unitPrice | DECIMAL(10,0) | NOT NULL | 단가 |
| subtotal | DECIMAL(10,0) | NOT NULL | 소계 (수량 × 단가) |
| orderId | UUID | FK → orders.id, CASCADE | 소속 주문 |

---

### 7. order_history (과거 주문 이력)

| 컬럼 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | UUID | PK, auto | 이력 고유 ID |
| orderNumber | INTEGER | NOT NULL | 주문 순번 |
| sessionId | VARCHAR(255) | NOT NULL | 세션 ID |
| storeId | UUID | NOT NULL | 매장 ID |
| tableNumber | INTEGER | NOT NULL | 테이블 번호 |
| totalAmount | DECIMAL(10,0) | NOT NULL | 총 금액 |
| items | JSONB | NOT NULL | 주문 항목 (아래 구조 참고) |
| status | VARCHAR(20) | NOT NULL | 종료 시점 주문 상태 |
| orderedAt | TIMESTAMP | NOT NULL | 원래 주문 시각 |
| completedAt | TIMESTAMP | NOT NULL | 이용 완료 처리 시각 |

items JSONB 구조:
```json
[
  {
    "menuName": "김치찌개",
    "quantity": 2,
    "unitPrice": 9000,
    "subtotal": 18000
  }
]
```

> 테이블 이용 완료(세션 종료) 시 orders → order_history로 이동되고, 해당 테이블의 현재 주문은 삭제됩니다.

---

## 인덱스

| 인덱스명 | 테이블 | 컬럼 | 용도 |
|---|---|---|---|
| idx_admins_store | admins | storeId | 매장별 관리자 조회 |
| idx_tables_store | store_tables | storeId | 매장별 테이블 조회 |
| idx_menus_store | menus | storeId | 매장별 메뉴 조회 |
| idx_menus_category | menus | storeId, category | 카테고리별 메뉴 조회 |
| idx_orders_session | orders | sessionId | 세션별 주문 조회 |
| idx_orders_store | orders | storeId | 매장별 주문 조회 |
| idx_order_items_order | order_items | orderId | 주문별 항목 조회 |
| idx_history_store | order_history | storeId | 매장별 이력 조회 |
| idx_history_completed | order_history | completedAt | 날짜별 이력 조회 |

---

## 세션 라이프사이클

```
1. 테이블 등록 (관리자) → store_tables 생성, sessionId = null
2. 고객 첫 주문 → sessionId = UUID 자동 생성, sessionStartedAt 기록
3. 추가 주문 → 같은 sessionId로 orders에 추가
4. 이용 완료 (관리자) → orders → order_history 이동, sessionId = null 리셋
5. 새 고객 첫 주문 → 새로운 sessionId 생성 (2번으로 반복)
```
