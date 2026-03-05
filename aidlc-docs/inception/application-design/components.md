# 테이블오더 서비스 - 컴포넌트 정의

## 시스템 개요

```
+------------------+     +------------------+     +------------------+
|  Customer App    |     |  Admin App       |     |  Super Admin     |
|  (React + TS)    |     |  (React + TS)    |     |  (Admin App내)   |
|  모바일 브라우저   |     |  데스크톱 브라우저  |     |  데스크톱 브라우저  |
+--------+---------+     +--------+---------+     +--------+---------+
         |                         |                         |
         +------------+------------+-------------------------+
                      |
                      v
         +---------------------------+
         |    NestJS Backend API     |
         |    (REST API + SSE)      |
         +---------------------------+
         | Auth Module              |
         | Store Module             |
         | Table Module             |
         | Menu Module              |
         | Order Module             |
         | Session Module           |
         | SSE Module               |
         | Admin Module             |
         +------------+-------------+
                      |
                      v
         +---------------------------+
         |      PostgreSQL DB        |
         +---------------------------+
```

---

## Frontend Components

### 1. Customer App (고객용 프론트엔드)
- **기술**: React + TypeScript
- **접속 방식**: QR코드 스캔 → 모바일 브라우저
- **책임**:
  - 메뉴 조회 및 탐색 (카테고리별)
  - 장바구니 관리 (localStorage 기반)
  - 주문 생성 및 전송
  - 주문 내역 조회
  - SSE를 통한 주문 상태 실시간 수신
  - 세션 관리 (4시간 만료)

**주요 페이지/컴포넌트**:
| 컴포넌트 | 책임 |
|----------|------|
| MenuPage | 카테고리별 메뉴 목록, 카드 레이아웃 |
| MenuDetailModal | 메뉴 상세 정보 (이름, 가격, 설명, 이미지) |
| CartPage | 장바구니 목록, 수량 조절, 총 금액 |
| OrderConfirmPage | 주문 최종 확인, 주문 확정 |
| OrderSuccessPage | 주문 번호 표시, 5초 후 리다이렉트 |
| OrderHistoryPage | 현재 세션 주문 내역, 실시간 상태 |
| CategoryTabs | 가로 스크롤 카테고리 탭 바 |
| CartBadge | 장바구니 아이콘 + 수량 뱃지 |

### 2. Admin App (관리자용 프론트엔드)
- **기술**: React + TypeScript
- **접속 방식**: 데스크톱 브라우저 로그인
- **책임**:
  - 매장 관리자 로그인/인증
  - 실시간 주문 모니터링 대시보드
  - 주문 상태 변경 및 취소
  - 테이블 관리 (등록, QR코드 생성)
  - 테이블 세션 관리 (이용 완료)
  - 메뉴 CRUD 관리
  - 과거 주문 내역 조회
  - 슈퍼 관리자 기능 (매장/계정 관리)

**주요 페이지/컴포넌트**:
| 컴포넌트 | 책임 |
|----------|------|
| LoginPage | 매장 식별자 + 비밀번호 로그인 |
| DashboardPage | 테이블별 카드 그리드, 실시간 주문 모니터링 |
| TableDetailModal | 테이블 주문 상세, 상태 변경, 취소 |
| TableManagementPage | 테이블 목록, 등록, QR코드 생성/다운로드 |
| MenuManagementPage | 메뉴 CRUD, 카테고리별 관리, 뱃지 설정 |
| OrderHistoryPage | 과거 주문 내역 (테이블별 + 전체 합산) |
| SuperAdminPage | 매장 등록, 관리자 계정 생성/관리 |

---

## Backend Components (NestJS Modules)

### 3. Auth Module
- **책임**: 인증/인가 처리
- **기능**:
  - 매장 관리자 로그인 (매장 식별자 + 비밀번호)
  - 슈퍼 관리자 로그인
  - JWT 토큰 발급/검증
  - 세션 관리 (관리자 16시간, 고객 4시간)
  - 로그인 시도 제한 (브루트포스 방지)
  - 테이블 토큰 검증 (고객 접속)

### 4. Store Module
- **책임**: 매장 데이터 관리
- **기능**:
  - 매장 등록 (식별자 자동 생성)
  - 매장 목록 조회
  - 매장 정보 관리
  - 멀티테넌트 데이터 격리

### 5. Table Module
- **책임**: 테이블 관리
- **기능**:
  - 테이블 등록 (토큰 자동 생성)
  - 테이블 목록/현황 조회
  - QR코드 생성 (개별 + 일괄)
  - 테이블 세션 시작/종료 (이용 완료)

### 6. Menu Module
- **책임**: 메뉴 데이터 관리
- **기능**:
  - 메뉴 CRUD (등록/수정/삭제/조회)
  - 카테고리 관리
  - 메뉴 노출 순서 조정
  - 메뉴 뱃지 설정 (시그니처/인기/신메뉴)
  - 입력값 검증

### 7. Order Module
- **책임**: 주문 처리
- **기능**:
  - 주문 생성 (장바구니 → 주문 변환)
  - 주문 상태 변경 (대기중→준비중→완료)
  - 주문 취소 (대기중/준비중만 가능)
  - 주문 내역 조회 (현재 세션 / 과거 이력)
  - 테이블별 총 주문액 계산
  - 이용 완료 시 주문 이력 이동

### 8. Session Module
- **책임**: 테이블 세션 라이프사이클 관리
- **기능**:
  - 세션 생성 (첫 주문 시)
  - 세션 유효성 검증 (4시간 만료)
  - 세션 종료 (이용 완료)
  - 동시 접속 세션 공유

### 9. SSE Module
- **책임**: 실시간 이벤트 전달
- **기능**:
  - SSE 연결 관리 (고객 + 관리자)
  - 신규 주문 이벤트 브로드캐스트
  - 주문 상태 변경 이벤트 전달
  - 매장별/테이블별 이벤트 필터링

### 10. Admin Module
- **책임**: 슈퍼 관리자 기능
- **기능**:
  - 매장 관리자 계정 생성
  - 매장 관리자 계정 목록 조회
  - 매장 등록/관리

---

## Database (PostgreSQL)

### 주요 테이블
| 테이블 | 설명 |
|--------|------|
| stores | 매장 정보 (id, name, identifier, created_at) |
| admins | 관리자 계정 (id, store_id, password_hash, role, created_at) |
| tables | 테이블 정보 (id, store_id, number, token, created_at) |
| categories | 메뉴 카테고리 (id, store_id, name, sort_order) |
| menus | 메뉴 정보 (id, store_id, category_id, name, price, description, image_url, badge, sort_order) |
| table_sessions | 테이블 세션 (id, table_id, store_id, started_at, ended_at, status) |
| orders | 주문 (id, store_id, table_id, session_id, order_number, status, total_amount, created_at) |
| order_items | 주문 항목 (id, order_id, menu_id, menu_name, quantity, unit_price) |
| order_history | 과거 주문 이력 (이용 완료 후 이동) |
