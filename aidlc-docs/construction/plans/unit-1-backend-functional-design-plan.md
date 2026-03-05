# Unit 1: Backend API Server - Functional Design Plan

## 개요
NestJS 백엔드 서버의 상세 비즈니스 로직, 도메인 엔티티, 비즈니스 규칙을 설계합니다.

---

## 실행 계획

### Phase 1: Domain Entities 설계
- [ ] 1.1 전체 엔티티 정의 (Store, Admin, Table, Category, Menu, TableSession, Order, OrderItem, OrderHistory)
- [ ] 1.2 엔티티 간 관계 정의 (1:N, N:1 관계 매핑)
- [ ] 1.3 각 엔티티 필드 상세 (타입, 제약조건, 기본값)
- [ ] 1.4 Enum 타입 정의 (OrderStatus, AdminRole, BadgeType, SessionStatus)

### Phase 2: Business Logic Model 설계
- [ ] 2.1 Auth Module 비즈니스 로직 (로그인 플로우, JWT 발급/검증, 테이블 토큰 검증, 브루트포스 방지)
- [ ] 2.2 Store Module 비즈니스 로직 (매장 등록, 식별자 자동 생성 규칙)
- [ ] 2.3 Table Module 비즈니스 로직 (테이블 등록, 토큰 생성, QR코드 생성)
- [ ] 2.4 Menu Module 비즈니스 로직 (CRUD, 카테고리 관리, 뱃지, 순서 조정)
- [ ] 2.5 Order Module 비즈니스 로직 (주문 생성, 상태 전이, 취소, 이력 이동)
- [ ] 2.6 Session Module 비즈니스 로직 (세션 생성/검증/종료, 4시간 만료)
- [ ] 2.7 SSE Module 비즈니스 로직 (이벤트 구독/발행, 매장/테이블별 필터링)
- [ ] 2.8 Admin Module 비즈니스 로직 (계정 생성, 매장 관리)

### Phase 3: Business Rules 설계
- [ ] 3.1 인증/인가 규칙 (JWT 만료, 역할 기반 접근 제어, 토큰 검증)
- [ ] 3.2 주문 상태 전이 규칙 (상태 머신 정의)
- [ ] 3.3 세션 관리 규칙 (생성 조건, 만료 처리, 종료 조건)
- [ ] 3.4 데이터 검증 규칙 (입력값 검증, 비즈니스 제약)
- [ ] 3.5 멀티테넌트 격리 규칙 (store_id 기반 데이터 접근 제어)
- [ ] 3.6 데이터 무결성 규칙 (트랜잭션, 동시성 처리)

---

## 산출물
1. `domain-entities.md` - 도메인 엔티티 상세 정의
2. `business-logic-model.md` - 모듈별 비즈니스 로직 상세
3. `business-rules.md` - 비즈니스 규칙 및 제약조건

## 질문 파일
- `aidlc-docs/construction/unit-1-backend/functional-design/functional-design-questions.md`
