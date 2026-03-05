# Integration Test Instructions - Unit 2: Customer Frontend

## Purpose
Unit 2 (Customer Frontend)는 단독 프론트엔드 앱으로, Unit 1 (Backend API)이 아직 미완성 상태입니다.
현재 Mock 데이터 기반으로 동작하므로, 통합 테스트는 Unit 1 완성 후 실행합니다.

## 현재 상태
- **Backend API**: Unit 1 미완성 → Mock 데이터 사용 (`VITE_USE_MOCK=true`)
- **통합 테스트 실행 가능 시점**: Unit 1 Backend API 완성 후

## 통합 테스트 시나리오

### Scenario 1: Session API 통합
- **Description**: QR 토큰으로 세션 검증 API 호출
- **Endpoint**: `GET /api/sessions/validate?token={tableToken}`
- **Setup**: Backend API 서버 실행, 유효한 테이블 토큰 준비
- **Expected**: SessionInfo 반환 (storeId, tableId, storeName, tableName, expiresAt)

### Scenario 2: Menu API 통합
- **Description**: 매장 메뉴 목록 조회
- **Endpoint**: `GET /api/menus/{storeId}`
- **Setup**: Backend API 서버 실행, 메뉴 데이터 시딩
- **Expected**: 카테고리별 메뉴 목록 반환

### Scenario 3: Order API 통합
- **Description**: 주문 생성 및 조회
- **Endpoints**: `POST /api/orders`, `GET /api/orders/session/{sessionId}`
- **Setup**: Backend API 서버 실행, 유효한 세션
- **Expected**: 주문 생성 성공, 주문 내역 조회 가능

### Scenario 4: SSE 통합
- **Description**: 주문 상태 실시간 업데이트
- **Endpoint**: `GET /api/sse/orders?sessionId={sessionId}`
- **Setup**: Backend API 서버 실행, 주문 생성 후 상태 변경
- **Expected**: SSE 이벤트로 주문 상태 변경 수신

## Mock → 실제 API 전환 방법

### 1. 환경변수 변경
```bash
# .env.development
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Backend API 서버 실행
```bash
cd server
npm run dev
```

### 3. 통합 테스트 실행
```bash
cd apps/customer
VITE_USE_MOCK=false npx playwright test
```

## 통합 테스트 체크리스트
- [ ] Backend API 서버 정상 실행 확인
- [ ] 세션 검증 API 연동 확인
- [ ] 메뉴 조회 API 연동 확인
- [ ] 주문 생성/조회 API 연동 확인
- [ ] SSE 실시간 업데이트 연동 확인
- [ ] 에러 시나리오 (네트워크 끊김, 타임아웃, 401/404/500) 확인
