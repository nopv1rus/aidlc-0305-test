# NFR Requirements - Unit 2: Customer Frontend

## 1. 성능 요구사항

### NFR-P01: 페이지 로드 성능
- **측정 기준**: 3G 네트워크 (1.6Mbps, 300ms RTT) 시뮬레이션
- **FCP (First Contentful Paint)**: < 2.5초
- **LCP (Largest Contentful Paint)**: < 4.0초
- **TTI (Time to Interactive)**: < 5.0초
- **CLS (Cumulative Layout Shift)**: < 0.1
- **측정 도구**: Lighthouse, Chrome DevTools Performance 탭
- **측정 시점**: 빌드 후 프로덕션 모드에서 측정

### NFR-P02: 런타임 성능
- **스크롤 성능**: 60fps 유지 (카테고리 탭 연동 스크롤 포함)
- **인터랙션 응답**: 사용자 액션 후 100ms 이내 시각적 피드백
- **애니메이션**: transform/opacity만 사용, 60fps 유지
- **메뉴 목록 렌더링**: 100개 이상 메뉴에서도 스크롤 버벅임 없음
  - `content-visibility: auto` CSS 적용
  - 필요 시 가상화 (virtua) 도입 검토

### NFR-P03: 번들 사이즈
- **초기 JS 번들**: < 200KB (gzip)
- **전체 JS 번들**: < 400KB (gzip, 모든 lazy chunk 포함)
- **코드 스플리팅 전략**:
  - Route-level splitting: 각 페이지 별도 chunk
  - Component-level splitting: 바텀시트 컴포넌트 React.lazy
  - 라이브러리 chunk 분리: vendor chunk (react, zustand, axios 등)
- **Tree-shaking**: Heroicons 개별 import, 미사용 코드 제거
- **측정 도구**: `vite-plugin-visualizer`로 번들 분석

### NFR-P04: 이미지 최적화
- **반응형 이미지**: `<img srcset>` + `sizes` 속성으로 디바이스별 최적 이미지 로드
- **Lazy loading**: 스크롤 아래 이미지 `loading="lazy"` 적용
- **CLS 방지**: 모든 `<img>`에 명시적 `width`/`height` 속성
- **첫 화면 이미지**: `fetchpriority="high"` 적용 (첫 번째 카테고리 메뉴 이미지)
- **플레이스홀더**: 이미지 로드 전 스켈레톤 또는 블러 플레이스홀더 표시

---

## 2. 가용성 및 안정성

### NFR-A01: 네트워크 불안정 대응
- **네트워크 상태 감지**: `navigator.onLine` + `online`/`offline` 이벤트 리스닝
- **오프라인 배너**: 네트워크 끊김 시 상단 배너 표시 ("네트워크 연결이 끊어졌습니다")
- **자동 재시도**: API 호출 실패 시 지수 백오프로 자동 재시도 (최대 3회)
  - 1차: 1초 후, 2차: 2초 후, 3차: 4초 후
  - 재시도 대상: GET 요청만 (POST는 사용자 명시적 재시도)
- **요청 큐잉**: 오프라인 상태에서 주문 시도 시 큐에 저장, 온라인 복귀 시 자동 전송
  - 큐 저장소: localStorage
  - 큐 만료: 세션 만료 시 함께 삭제
- **온라인 복귀**: 네트워크 복구 시 자동으로 메뉴 데이터 갱신 + SSE 재연결

### NFR-A02: 에러 복구 및 폴백
- **React Error Boundary**: 컴포넌트 트리 최상위 + 페이지별 개별 적용
- **폴백 UI**: 에러 발생 시 "문제가 발생했습니다. 새로고침해주세요." + 새로고침 버튼
- **Graceful degradation**: SSE 연결 실패 시 폴링 폴백 없이 수동 새로고침 안내
- **localStorage 실패**: try-catch로 보호, 실패 시 메모리 내 상태만 사용 (기능 유지)

### NFR-A03: SSE 연결 안정성
- **자동 재연결**: EventSource 기본 재연결 + 수동 재연결 (3초 간격, 최대 5회)
- **페이지 포커스 복귀**: `visibilitychange` 이벤트로 연결 상태 확인 및 재연결
- **연결 상태 표시**: ConnectionBanner로 연결 끊김 상태 사용자에게 알림
- **하트비트**: 서버 측 30초 간격 하트비트 이벤트로 연결 유지 확인

---

## 3. 브라우저 호환성 및 모바일 최적화

### NFR-B01: 지원 브라우저
- **Chrome**: 최신 2개 버전 (Android + Desktop)
- **Safari**: 최신 2개 버전 (iOS + macOS)
- **Samsung Internet**: 최신 2개 버전
- **Vite 빌드 타겟**: `es2020` (모던 브라우저만)
- **Browserslist**: `last 2 Chrome versions, last 2 Safari versions, last 2 Samsung versions`
- **폴리필**: 불필요 (모던 브라우저만 지원)

### NFR-B02: 모바일 디바이스 최적화
- **뷰포트 설정**: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - `user-scalable=no` 사용 금지 (접근성 위반)
  - `maximum-scale=1` 사용 금지
- **터치 최적화**:
  - 모든 터치 대상 최소 44×44px
  - `touch-action: manipulation` (더블탭 줌 지연 방지)
  - `-webkit-tap-highlight-color` 의도적 설정
- **Safe Area**: `env(safe-area-inset-*)` 적용 (노치/홈 인디케이터)
- **스크롤**: `overscroll-behavior: contain` (바텀시트/모달)
- **키보드**: 가상 키보드 표시 시 레이아웃 깨짐 방지

### NFR-B03: 반응형 디자인
- **모바일 퍼스트**: 기본 스타일은 모바일 (320px~)
- **브레이크포인트**: 모바일 전용 앱이므로 단일 레이아웃
  - 최소 너비: 320px (iPhone SE)
  - 최대 너비: 480px (대형 모바일)
  - 480px 초과: 중앙 정렬 + max-width 제한
- **가로 모드**: 지원하되 세로 모드 최적화 우선

---

## 4. 보안 요구사항

### NFR-S01: 클라이언트 측 보안
- **XSS 방지**: React 자동 이스케이프 활용, `dangerouslySetInnerHTML` 금지
- **토큰 관리**: tableToken은 URL에서만 사용, localStorage에 세션 정보 저장
  - 민감 정보(비밀번호, API 키 등) localStorage 저장 금지
- **HTTPS 전용**: 프로덕션에서 HTTP 접근 차단 (서버 측 리다이렉트)
- **CSP 헤더**: 서버에서 Content-Security-Policy 설정 (프론트엔드는 준수)
- **CORS**: API 서버에서 허용 origin 제한 (프론트엔드 도메인만)

### NFR-S02: 의존성 보안
- **Lock file**: `pnpm-lock.yaml` 커밋 필수
- **취약점 스캔**: `pnpm audit` CI/CD 파이프라인에 포함
- **미사용 의존성**: 정기적 제거
- **의존성 출처**: npm 공식 레지스트리만 사용

---

## 5. 테스트 요구사항

### NFR-T01: 테스트 전략
- **단위 테스트**: Zustand Store, 유틸리티 함수, 비즈니스 로직
- **컴포넌트 테스트**: React Testing Library로 주요 컴포넌트 렌더링/인터랙션
- **E2E 테스트**: Playwright로 핵심 사용자 플로우
  - QR 접속 → 메뉴 탐색 → 장바구니 추가 → 주문 확정
  - 주문 내역 조회
  - 세션 만료 처리
  - 에러 시나리오

### NFR-T02: 커버리지 목표
- **전체 커버리지**: 80% 이상 (라인 기준)
- **Store 로직**: 90% 이상
- **유틸리티 함수**: 95% 이상
- **컴포넌트**: 70% 이상 (주요 인터랙션 중심)
- **E2E**: 핵심 플로우 100% 커버

### NFR-T03: 테스트 도구
- **단위/컴포넌트**: Vitest + React Testing Library + jsdom
- **E2E**: Playwright (모바일 에뮬레이션)
- **커버리지 리포트**: Vitest coverage (v8 provider)
- **Mock**: MSW (Mock Service Worker) — JSON 파일 mock에서 전환 시 활용
