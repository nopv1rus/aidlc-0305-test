# 테이블오더 서비스 - 컴포넌트 의존성

## 의존성 매트릭스

| 컴포넌트 | 의존 대상 |
|----------|-----------|
| Customer App | Auth Module, Menu Module, Order Module, Session Module, SSE Module |
| Admin App | Auth Module, Store Module, Table Module, Menu Module, Order Module, Session Module, SSE Module, Admin Module |
| Auth Module | Store Module (매장 조회), Admin Module (계정 조회) |
| Store Module | (독립) |
| Table Module | Store Module (매장 검증) |
| Menu Module | Store Module (매장 검증) |
| Order Module | Store Module, Table Module, Session Module, Menu Module, SSE Module |
| Session Module | Table Module |
| SSE Module | (독립 - 이벤트 수신만) |
| Admin Module | Store Module, Auth Module |

## 의존성 다이어그램

```
+----------------+     +----------------+
| Customer App   |     | Admin App      |
+-------+--------+     +-------+--------+
        |                       |
        v                       v
+-------+--------+     +-------+--------+
| Auth Module    |<----| Admin Module   |
+-------+--------+     +-------+--------+
        |                       |
        v                       v
+-------+--------+     +-------+--------+
| Store Module   |<----| Table Module   |
+----------------+     +----------------+
        ^                       ^
        |                       |
+-------+--------+     +-------+--------+
| Menu Module    |     | Session Module |
+----------------+     +----------------+
        ^                       ^
        |                       |
        +-------+-------+------+
                |
        +-------+--------+
        | Order Module   |
        +-------+--------+
                |
                v
        +-------+--------+
        | SSE Module     |
        +----------------+
```

## 데이터 흐름

### 고객 → 서버 (주문 생성)
```
Customer App -> POST /api/orders
  -> Order Module.createOrder()
    -> Session Module.validateSession()
    -> Menu Module (가격 검증)
    -> DB INSERT (orders, order_items)
    -> SSE Module.emitNewOrder()
  <- { orderId, orderNumber, status }
```

### 서버 → 고객 (실시간 업데이트)
```
Customer App <- SSE /api/sse/customer/:storeId/:tableId
  <- { type: 'ORDER_STATUS_CHANGED', data: { orderId, status } }
```

### 서버 → 관리자 (실시간 업데이트)
```
Admin App <- SSE /api/sse/admin/:storeId
  <- { type: 'NEW_ORDER', data: { order } }
  <- { type: 'ORDER_STATUS_CHANGED', data: { orderId, status } }
```

## 모듈 초기화 순서

1. Store Module (독립, 기반 데이터)
2. Auth Module (Store 의존)
3. Table Module (Store 의존)
4. Menu Module (Store 의존)
5. Session Module (Table 의존)
6. SSE Module (독립)
7. Order Module (Store, Table, Session, Menu, SSE 의존)
8. Admin Module (Store, Auth 의존)
