# 테이블오더 서비스 - Unit of Work 의존성 매트릭스

## 유닛 간 의존성 개요

```
+-------------------+
|  Unit 1: Backend  |  ← 기반 유닛 (먼저 merge)
|  server/, shared/ |
+--------+----------+
         |
    shared/types/ (API 타입 정의)
    REST API endpoints
    SSE endpoints
         |
    +----+----+
    |         |
    v         v
+---+------+ +------+---+
| Unit 2:  | | Unit 3:  |
| Customer | | Admin    |
| apps/    | | apps/    |
| customer/| | admin/   |
+----------+ +----------+
  (독립)       (독립)
```

---

## 의존성 매트릭스

| 의존 방향 | Unit 1 (Backend) | Unit 2 (Customer) | Unit 3 (Admin) |
|-----------|:----------------:|:------------------:|:--------------:|
| Unit 1 (Backend) | - | 없음 | 없음 |
| Unit 2 (Customer) | **의존** | - | 없음 |
| Unit 3 (Admin) | **의존** | 없음 | - |

- Unit 2 → Unit 1: REST API 호출, SSE 구독, shared/types 참조
- Unit 3 → Unit 1: REST API 호출, SSE 구독, shared/types 참조
- Unit 2 ↔ Unit 3: 상호 의존 없음 (완전 독립)

---

## 의존성 상세

### Unit 2 (Customer) → Unit 1 (Backend)

| 의존 유형 | 상세 |
|-----------|------|
| API 호출 | `GET /api/menus/:storeId` - 메뉴 목록 조회 |
| API 호출 | `GET /api/menus/:storeId/:menuId` - 메뉴 상세 조회 |
| API 호출 | `POST /api/orders` - 주문 생성 |
| API 호출 | `GET /api/orders/session/:sessionId` - 세션 주문 조회 |
| API 호출 | `GET /api/sessions/validate` - 세션 유효성 검증 |
| SSE 구독 | `GET /api/sse/customer/:storeId/:tableId` - 주문 상태 실시간 수신 |
| 타입 참조 | `shared/types/` - Menu, Order, Session 등 공유 타입 |

### Unit 3 (Admin) → Unit 1 (Backend)

| 의존 유형 | 상세 |
|-----------|------|
| API 호출 | `POST /api/auth/login` - 관리자 로그인 |
| API 호출 | `GET/POST/PUT/DELETE /api/menus/*` - 메뉴 CRUD |
| API 호출 | `GET/POST /api/tables/*` - 테이블 관리 |
| API 호출 | `GET /api/tables/:id/qrcode` - QR코드 생성 |
| API 호출 | `GET/PUT /api/orders/*` - 주문 조회/상태 변경 |
| API 호출 | `POST /api/sessions/:id/complete` - 이용 완료 |
| API 호출 | `GET /api/orders/history/*` - 과거 주문 내역 |
| API 호출 | `GET/POST /api/admin/stores/*` - 매장 관리 (슈퍼 관리자) |
| API 호출 | `GET/POST /api/admin/accounts/*` - 계정 관리 (슈퍼 관리자) |
| SSE 구독 | `GET /api/sse/admin/:storeId` - 신규 주문/상태 변경 실시간 수신 |
| 타입 참조 | `shared/types/` - 전체 공유 타입 |

---

## 파일/디렉토리 충돌 분석

| 파일/디렉토리 | Unit 1 | Unit 2 | Unit 3 | 충돌 위험 |
|--------------|:------:|:------:|:------:|:---------:|
| `server/` | 생성/수정 | - | - | 없음 |
| `shared/types/` | 생성/수정 | 읽기만 | 읽기만 | 없음 |
| `shared/constants/` | 생성/수정 | 읽기만 | 읽기만 | 없음 |
| `apps/customer/` | - | 생성/수정 | - | 없음 |
| `apps/admin/` | - | - | 생성/수정 | 없음 |
| `package.json` (루트) | 생성 | - | - | 없음 |
| `docker-compose.yml` | 생성 | - | - | 없음 |
| `tsconfig.json` (루트) | 생성 | - | - | 없음 |
| `.gitignore` | 생성 | - | - | 없음 |

**충돌 위험도: 없음** - 각 유닛이 완전히 분리된 디렉토리를 담당

---

## Merge 전략

### 순서
1. **Unit 1 (Backend)** → `main` 먼저 merge
   - 이유: shared/types와 API 엔드포인트가 Unit 2/3의 기반
2. **Unit 2 (Customer)** → `main` merge
   - Unit 1 merge 후 rebase하여 shared/types 참조 확인
3. **Unit 3 (Admin)** → `main` merge
   - Unit 1 merge 후 rebase하여 shared/types 참조 확인
   - Unit 2와 순서 무관 (상호 독립)

### 통합 테스트 시점
- Unit 1 단독 테스트: API 엔드포인트 + DB 마이그레이션
- Unit 1 + Unit 2 통합: 고객 주문 플로우 E2E
- Unit 1 + Unit 3 통합: 관리자 운영 플로우 E2E
- 전체 통합: 고객 주문 → 관리자 확인 → 상태 변경 → 고객 실시간 수신

---

## 개발 병렬화 가능성

| 조합 | 병렬 가능 | 조건 |
|------|:---------:|------|
| Unit 1 + Unit 2 | ⚠️ 제한적 | Unit 2는 API 스펙 확정 후 Mock 기반 개발 가능 |
| Unit 1 + Unit 3 | ⚠️ 제한적 | Unit 3는 API 스펙 확정 후 Mock 기반 개발 가능 |
| Unit 2 + Unit 3 | ✅ 완전 병렬 | 상호 의존 없음 |
| Unit 1 → Unit 2/3 | ✅ 권장 | Unit 1 완료 후 Unit 2/3 병렬 개발 |
