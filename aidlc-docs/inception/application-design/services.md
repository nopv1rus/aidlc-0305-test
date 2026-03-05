# 테이블오더 서비스 - 서비스 레이어 정의

## 서비스 오케스트레이션 패턴

### 1. 고객 주문 플로우
```
고객 QR스캔
  -> Auth Module: validateTableToken()
  -> Session Module: getOrCreateSession()
  -> Menu Module: getMenusByStore()
  -> [고객이 메뉴 탐색 및 장바구니 관리 (클라이언트)]
  -> Order Module: createOrder()
  -> SSE Module: emitNewOrder() -> 관리자 대시보드 실시간 반영
```

### 2. 관리자 주문 상태 변경 플로우
```
관리자 상태 변경 클릭
  -> Auth Module: validateToken() (JWT 검증)
  -> Order Module: updateOrderStatus()
  -> SSE Module: emitOrderStatusChange() -> 고객 화면 실시간 반영
```

### 3. 관리자 주문 취소 플로우
```
관리자 취소 클릭
  -> Auth Module: validateToken()
  -> Order Module: cancelOrder() (대기중/준비중만 가능)
  -> SSE Module: emitOrderStatusChange() -> 고객 화면 반영
```

### 4. 테이블 이용 완료 플로우
```
관리자 이용 완료 클릭
  -> Auth Module: validateToken()
  -> Session Module: endSession()
  -> Order Module: moveOrdersToHistory()
  -> SSE Module: emitSessionEnd() -> 고객 세션 종료
```

### 5. 슈퍼 관리자 매장 등록 플로우
```
슈퍼 관리자 매장 등록
  -> Auth Module: validateToken() (슈퍼 관리자 권한 확인)
  -> Store Module: createStore() (식별자 자동 생성)
```

### 6. 슈퍼 관리자 계정 생성 플로우
```
슈퍼 관리자 계정 생성
  -> Auth Module: validateToken() (슈퍼 관리자 권한 확인)
  -> Admin Module: createStoreAdmin() (bcrypt 해싱)
```

---

## 서비스 간 통신 패턴

| 패턴 | 사용처 | 설명 |
|------|--------|------|
| 동기 REST API | 프론트엔드 ↔ 백엔드 | 모든 CRUD 작업 |
| SSE (Server-Sent Events) | 백엔드 → 프론트엔드 | 실시간 주문/상태 업데이트 |
| 모듈 내부 호출 | NestJS 모듈 간 | DI를 통한 서비스 주입 |

## 인증/인가 전략

| 대상 | 인증 방식 | 세션 시간 |
|------|-----------|-----------|
| 고객 | 테이블 토큰 (URL 기반) | 4시간 |
| 매장 관리자 | JWT (매장 식별자 + 비밀번호) | 16시간 |
| 슈퍼 관리자 | JWT (사용자명 + 비밀번호) | 16시간 |

## 멀티테넌트 격리 전략

- 모든 데이터 테이블에 `store_id` 컬럼
- 모든 쿼리에 `store_id` 필터 적용
- 매장 관리자는 자기 매장 데이터만 접근 가능
- 슈퍼 관리자는 전체 매장 접근 가능
