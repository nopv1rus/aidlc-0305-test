# Functional Design Plan - Unit 2: Customer Frontend

## 유닛 개요
- **유닛**: Unit 2 - Customer Frontend (apps/customer/)
- **기술**: React + TypeScript
- **스토리**: US-C01 ~ US-C19 (고객 스토리 19개)
- **페르소나**: Jake (고객, 진상 고객 성향)
- **접속 방식**: QR코드 스캔 → 모바일 브라우저

---

## 설계 계획

### Part 1: 비즈니스 로직 모델
- [x] 1.1 고객 접속 플로우 (QR스캔 → 토큰 검증 → 세션 획득 → 메뉴 표시)
- [x] 1.2 메뉴 조회/탐색 로직 (카테고리 필터링, 정렬, 뱃지 표시)
- [x] 1.3 장바구니 관리 로직 (추가/삭제/수량조절/비우기/localStorage 동기화)
- [x] 1.4 주문 생성 플로우 (확인 → 전송 → 성공/실패 처리)
- [x] 1.5 주문 내역 조회 로직 (세션 기반 필터링, 실시간 상태 업데이트)
- [x] 1.6 SSE 클라이언트 로직 (연결/재연결/이벤트 처리)

### Part 2: 비즈니스 규칙
- [x] 2.1 세션 관리 규칙 (4시간 만료, 세션 공유, 세션 종료 처리)
- [x] 2.2 장바구니 규칙 (수량 제한, 금액 계산, localStorage 동기화)
- [x] 2.3 주문 생성 규칙 (빈 장바구니 방지, 세션 유효성 검증)
- [x] 2.4 에러 처리 규칙 (네트워크 오류, API 오류, 세션 만료)
- [x] 2.5 입력값 검증 규칙 (XSS 방지, 수량 범위)

### Part 3: 도메인 엔티티
- [x] 3.1 프론트엔드 도메인 모델 정의 (Menu, CartItem, Order, Session 등)
- [x] 3.2 상태 관리 모델 (앱 전역 상태, 페이지별 로컬 상태)
- [x] 3.3 API 요청/응답 타입 매핑

### Part 4: 프론트엔드 컴포넌트 설계
- [x] 4.1 컴포넌트 계층 구조 및 라우팅
- [x] 4.2 각 페이지 컴포넌트 Props/State 정의
- [x] 4.3 사용자 인터랙션 플로우
- [x] 4.4 API 통합 포인트 (어떤 컴포넌트가 어떤 API를 호출하는지)

---

## 명확화 질문

아래 질문에 답변해주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해주세요.

### Question 1
상태 관리 라이브러리로 무엇을 사용할까요?

A) React Context + useReducer (외부 라이브러리 없이)
B) Zustand (경량 상태 관리)
C) Redux Toolkit (대규모 상태 관리)
D) Jotai (원자적 상태 관리)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2
CSS/스타일링 방식은 어떻게 할까요?

A) Tailwind CSS (유틸리티 퍼스트)
B) CSS Modules (스코프드 CSS)
C) styled-components (CSS-in-JS)
D) Vanilla CSS / SCSS
E) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
HTTP 클라이언트로 무엇을 사용할까요?

A) Axios (인터셉터, 자동 변환 등 풍부한 기능)
B) fetch API (네이티브, 추가 의존성 없음)
C) ky (fetch 래퍼, 경량)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
라우팅 라이브러리로 무엇을 사용할까요?

A) React Router v6 (가장 널리 사용)
B) TanStack Router (타입 안전 라우팅)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
프로젝트 빌드 도구로 무엇을 사용할까요?

A) Vite (빠른 HMR, 모던 빌드)
B) Create React App (CRA, 전통적)
C) Next.js (SSR/SSG, 하지만 이 프로젝트는 SPA)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
메뉴 상세 정보 표시 방식은 어떻게 할까요?

A) 모달/바텀시트 (현재 페이지 위에 오버레이)
B) 별도 페이지로 이동 (라우팅)
C) 아코디언/확장 (카드 내에서 펼침)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
장바구니 UI 접근 방식은 어떻게 할까요?

A) 하단 고정 바 + 별도 장바구니 페이지 (배달앱 스타일)
B) 사이드 드로어 (슬라이드 패널)
C) 별도 탭/페이지만 (하단 네비게이션)
D) Other (please describe after [Answer]: tag below)

[Answer]: D 가장 사용자 경험이 좋은 UI 너가 한번 추천해봐.

### Question 8
주문 확정 전 수량 수정은 어디서 가능하게 할까요? (US-C13 관련)

A) 주문 확인 페이지에서 직접 수량 수정 가능
B) 장바구니 페이지로 돌아가서 수정 (주문 확인 페이지는 읽기 전용)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
카테고리 탐색 UX는 어떤 방식을 선호하나요?

A) 상단 고정 탭 바 + 스크롤 시 해당 섹션으로 이동 (한 페이지에 전체 메뉴, 탭 클릭 시 스크롤)
B) 상단 고정 탭 바 + 탭 선택 시 해당 카테고리만 필터링 표시
C) Other (please describe after [Answer]: tag below)

[Answer]: 가장 인기가 많고 사용자 경험이 좋은 걸로 너가 제안해봐.

### Question 10
Unit 1 (Backend API)가 아직 준비되지 않은 상태에서 개발 방식은?

A) MSW (Mock Service Worker)로 API Mock 후 개발, 나중에 실제 API로 전환
B) JSON 파일 기반 Mock 데이터로 개발
C) API 클라이언트 레이어에 Mock 모드 내장 (환경변수로 전환)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

