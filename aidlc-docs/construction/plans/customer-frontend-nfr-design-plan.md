# NFR Design Plan - Unit 2: Customer Frontend

## 유닛 개요
- **유닛**: Unit 2 - Customer Frontend (apps/customer/)
- **NFR Requirements**: 완료 (성능, 가용성, 브라우저 호환성, 보안, 테스트)
- **핵심 NFR**: 모바일 성능 최적화, 네트워크 불안정 대응, 80% 테스트 커버리지

---

## NFR 설계 계획

### Part 1: 성능 패턴
- [x] 1.1 번들 최적화 패턴 (코드 스플리팅, 트리쉐이킹, chunk 전략)
- [x] 1.2 렌더링 최적화 패턴 (메모이제이션, 가상화, content-visibility)
- [x] 1.3 이미지 로딩 패턴 (lazy loading, srcset, 플레이스홀더)
- [x] 1.4 상태 관리 최적화 패턴 (selector, derived state)

### Part 2: 네트워크 복원력 패턴
- [x] 2.1 API 클라이언트 패턴 (인터셉터, 재시도, 타임아웃)
- [x] 2.2 오프라인 큐잉 패턴 (주문 큐, 동기화)
- [x] 2.3 SSE 연결 관리 패턴 (재연결, 하트비트, 폴백)

### Part 3: 에러 처리 패턴
- [x] 3.1 에러 바운더리 계층 구조
- [x] 3.2 전역 에러 핸들링 패턴

### Part 4: 논리적 컴포넌트 구조
- [x] 4.1 프로젝트 디렉토리 구조
- [x] 4.2 모듈 의존성 구조

---

## 명확화 질문

### Question 1
API 요청 타임아웃을 어떻게 설정할까요?

A) 전역 10초 타임아웃 (모든 요청 동일)
B) 요청 유형별 차등 — GET: 10초, POST: 15초, SSE: 타임아웃 없음
C) AI 추천에 맡김
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
프로젝트 디렉토리 구조는 어떤 패턴을 선호하나요?

A) Feature-based (기능별 폴더: features/menu/, features/cart/, features/order/)
B) Layer-based (계층별 폴더: components/, stores/, hooks/, utils/, api/)
C) Hybrid (공통은 계층별, 페이지별 기능은 기능별)
D) Other (please describe after [Answer]: tag below)

[Answer]: 바이브 코딩에 최적화 해서 예를 들면 DDD


