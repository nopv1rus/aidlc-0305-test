# 테이블오더 서비스 - Unit of Work 정의

## 분해 전략

**목표**: 3개 유닛으로 분해, 각 유닛은 별도 Git 브랜치에서 병렬 개발 후 merge
**핵심 원칙**: 파일/디렉토리 충돌 최소화를 위해 각 유닛이 서로 다른 디렉토리를 담당

---

## 프로젝트 디렉토리 구조 (모노레포)

```
table-order/
+-- apps/
|   +-- customer/          # Unit 2 전담
|   |   +-- src/
|   |   +-- package.json
|   +-- admin/             # Unit 3 전담
|   |   +-- src/
|   |   +-- package.json
+-- server/                # Unit 1 전담
|   +-- src/
|   |   +-- auth/
|   |   +-- store/
|   |   +-- table/
|   |   +-- menu/
|   |   +-- order/
|   |   +-- session/
|   |   +-- sse/
|   |   +-- admin/
|   |   +-- common/
|   |   +-- database/
|   +-- package.json
+-- shared/                # Unit 1에서 생성, Unit 2/3에서 참조만
|   +-- types/             # 공유 TypeScript 타입 정의
|   +-- constants/         # 공유 상수
+-- package.json           # 루트 (워크스페이스 설정)
+-- docker-compose.yml     # PostgreSQL 등
```

---

## Unit 1: Backend API Server (server/)

**브랜치**: `unit-1/backend-api`
**담당 디렉토리**: `server/`, `shared/`, 루트 설정 파일
**개발 순서**: 1번째 (다른 유닛의 기반)

### 책임
- NestJS 백엔드 전체 구현
- PostgreSQL 데이터베이스 스키마 및 마이그레이션
- REST API 엔드포인트 전체
- SSE 실시간 통신 서버
- 인증/인가 (JWT, 테이블 토큰)
- 멀티테넌트 데이터 격리
- 공유 타입 정의 (shared/)

### 포함 모듈
- Auth Module (로그인, JWT, 토큰 검증, 브루트포스 방지)
- Store Module (매장 CRUD, 식별자 자동 생성)
- Table Module (테이블 CRUD, 토큰 생성, QR코드 생성)
- Menu Module (메뉴 CRUD, 카테고리, 뱃지, 순서)
- Order Module (주문 생성/조회/상태변경/취소/이력)
- Session Module (세션 생성/검증/종료)
- SSE Module (이벤트 브로드캐스트)
- Admin Module (슈퍼 관리자 기능)
- Database Module (TypeORM/Prisma 설정, 마이그레이션)

### 포함 스토리
- 모든 스토리의 백엔드 API 부분

### 산출물
- `server/` 디렉토리 전체
- `shared/` 디렉토리 전체
- `docker-compose.yml` (PostgreSQL)
- 루트 `package.json` (워크스페이스 설정)

---

## Unit 2: Customer Frontend (apps/customer/)

**브랜치**: `unit-2/customer-app`
**담당 디렉토리**: `apps/customer/`
**개발 순서**: 2번째 (Unit 1 API에 의존)

### 책임
- 고객용 React 앱 전체 구현
- QR코드 스캔 → 모바일 브라우저 접속 처리
- 메뉴 조회/탐색 UI
- 장바구니 관리 (localStorage)
- 주문 생성/확인 UI
- 주문 내역 조회 UI
- SSE 클라이언트 (주문 상태 실시간 수신)
- 모바일 반응형 디자인

### 포함 스토리
- US-C01 ~ US-C19 (고객 스토리 전체 19개)

### 산출물
- `apps/customer/` 디렉토리 전체

---

## Unit 3: Admin Frontend (apps/admin/)

**브랜치**: `unit-3/admin-app`
**담당 디렉토리**: `apps/admin/`
**개발 순서**: 2번째 (Unit 1 API에 의존, Unit 2와 병렬 가능)

### 책임
- 관리자용 React 앱 전체 구현
- 매장 관리자 로그인/인증 UI
- 실시간 주문 모니터링 대시보드
- 주문 상태 변경/취소 UI
- 테이블 관리 UI (등록, QR코드 생성/다운로드)
- 테이블 세션 관리 UI (이용 완료)
- 메뉴 관리 UI (CRUD, 뱃지, 순서)
- 과거 주문 내역 조회 UI
- 슈퍼 관리자 UI (매장/계정 관리)
- SSE 클라이언트 (신규 주문 실시간 수신)
- 데스크톱 최적화 디자인

### 포함 스토리
- US-A01 ~ US-A19, US-A09-1 (매장 관리자 스토리 전체 20개)
- US-S01 ~ US-S05 (슈퍼 관리자 스토리 전체 5개)

### 산출물
- `apps/admin/` 디렉토리 전체

---

## 충돌 방지 전략

### 디렉토리 격리
| 유닛 | 전담 디렉토리 | 다른 유닛과 겹치는 파일 |
|------|--------------|----------------------|
| Unit 1 | `server/`, `shared/` | 없음 |
| Unit 2 | `apps/customer/` | 없음 |
| Unit 3 | `apps/admin/` | 없음 |

### 공유 의존성 관리
- `shared/types/` - Unit 1에서 생성, Unit 2/3에서 import만
- API 인터페이스 변경 시 Unit 1이 먼저 merge, 이후 Unit 2/3가 rebase

### 권장 merge 순서
1. Unit 1 (Backend) → main 먼저 merge
2. Unit 2 (Customer) → main merge (Unit 1 기반)
3. Unit 3 (Admin) → main merge (Unit 1 기반)
- Unit 2와 Unit 3는 서로 독립적이므로 순서 무관

### 루트 파일 충돌 방지
- 루트 `package.json`은 Unit 1에서 워크스페이스 설정 생성
- Unit 2/3는 각자 `apps/*/package.json`만 관리
- `.gitignore`, `tsconfig.json` 등 공통 설정은 Unit 1에서 생성
