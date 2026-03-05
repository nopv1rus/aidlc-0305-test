# NFR Requirements Plan - Unit 2: Customer Frontend

## 유닛 개요
- **유닛**: Unit 2 - Customer Frontend (apps/customer/)
- **기술**: React + TypeScript + Vite + Zustand + Tailwind CSS + Axios
- **접속 방식**: QR코드 스캔 → 모바일 브라우저 (모바일 퍼스트)
- **Functional Design**: 완료 (React Best Practices + Web Interface Guidelines 반영)

---

## NFR 평가 계획

### Part 1: 성능 요구사항
- [x] 1.1 페이지 로드 성능 (FCP, LCP, TTI 목표치)
- [x] 1.2 런타임 성능 (스크롤, 애니메이션, 인터랙션 응답 시간)
- [x] 1.3 번들 사이즈 목표 및 코드 스플리팅 전략
- [x] 1.4 이미지 최적화 전략

### Part 2: 가용성 및 안정성
- [x] 2.1 오프라인/네트워크 불안정 대응 전략
- [x] 2.2 에러 복구 및 폴백 전략
- [x] 2.3 SSE 연결 안정성 요구사항

### Part 3: 브라우저 호환성 및 모바일 최적화
- [x] 3.1 지원 브라우저/OS 범위
- [x] 3.2 모바일 디바이스 최적화 (뷰포트, 터치, Safe Area)
- [x] 3.3 반응형 디자인 브레이크포인트

### Part 4: 보안 요구사항 (프론트엔드)
- [x] 4.1 클라이언트 측 보안 (XSS, CSRF, 토큰 관리)
- [x] 4.2 의존성 보안 관리

### Part 5: 테스트 요구사항
- [x] 5.1 테스트 전략 및 커버리지 목표
- [x] 5.2 테스트 도구 선정

### Part 6: 기술 스택 세부 결정
- [x] 6.1 추가 라이브러리 선정 (아이콘, 유틸리티 등)

---

## 명확화 질문

아래 질문에 답변해주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해주세요.

### Question 1
모바일 페이지 로드 성능 목표를 어느 수준으로 설정할까요? (3G 네트워크 기준)

A) 엄격 — FCP < 1.5s, LCP < 2.5s, TTI < 3.5s (고성능 목표)
B) 표준 — FCP < 2.5s, LCP < 4.0s, TTI < 5.0s (일반적 모바일 웹 수준)
C) 유연 — 특별한 수치 목표 없이 체감 성능 위주로 최적화
D) Other (please describe after [Answer]: tag below)

[Answer]: 표준

### Question 2
초기 번들 사이즈 목표를 어떻게 설정할까요?

A) 엄격 — 초기 JS 번들 < 100KB (gzip), 전체 < 200KB
B) 표준 — 초기 JS 번들 < 200KB (gzip), 전체 < 400KB
C) 유연 — 번들 사이즈보다 기능 완성도 우선
D) Other (please describe after [Answer]: tag below)

[Answer]: 표준

### Question 3
오프라인/네트워크 불안정 상황에서 어느 수준까지 대응할까요?

A) Service Worker + 캐싱으로 오프라인에서도 메뉴 조회 가능 (PWA 수준)
B) 네트워크 오류 시 사용자 친화적 에러 메시지 + 재시도 버튼 (기본 대응)
C) 네트워크 상태 감지 + 자동 재시도 + 큐잉 (중간 수준)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 4
지원할 최소 브라우저/OS 범위는?

A) 최신 2개 버전만 (Chrome, Safari, Samsung Internet — 모바일 위주)
B) 최신 3개 버전 + iOS 15+, Android 10+ (넓은 범위)
C) 가능한 넓게 (ES5 폴리필 포함, 구형 기기 지원)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
테스트 전략은 어느 수준으로 할까요?

A) 단위 테스트 위주 (비즈니스 로직, Store, 유틸리티 함수)
B) 단위 + 컴포넌트 테스트 (React Testing Library로 주요 컴포넌트)
C) 단위 + 컴포넌트 + E2E 테스트 (Playwright/Cypress로 주요 플로우)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 6
테스트 커버리지 목표는?

A) 80% 이상 (높은 품질 보장)
B) 60% 이상 (핵심 로직 중심)
C) 커버리지 수치보다 핵심 플로우 테스트 완성도 우선
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
아이콘 라이브러리로 무엇을 사용할까요?

A) Lucide React (경량, 트리쉐이킹 우수)
B) Heroicons (Tailwind 공식 아이콘)
C) React Icons (다양한 아이콘 세트 통합)
D) 아이콘 없이 텍스트/이모지로 대체
E) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 8
메뉴 이미지 최적화 전략은?

A) 서버에서 리사이즈된 이미지 제공 (썸네일 + 원본 분리)
B) 클라이언트에서 `<img>` srcset/sizes로 반응형 이미지
C) 이미지 최적화 없이 원본 그대로 사용 (MVP 수준)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

