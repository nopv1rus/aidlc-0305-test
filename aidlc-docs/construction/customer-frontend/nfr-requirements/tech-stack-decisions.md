# Tech Stack Decisions - Unit 2: Customer Frontend

## 확정 기술 스택

| 영역 | 기술 | 버전 | 선정 근거 |
|------|------|------|----------|
| 프레임워크 | React | 19.x | 요구사항 확정 |
| 언어 | TypeScript | 5.x | 타입 안전성, DX |
| 빌드 도구 | Vite | 6.x | 빠른 HMR, 모던 빌드 |
| 상태 관리 | Zustand | 5.x | 경량, 보일러플레이트 최소 |
| 스타일링 | Tailwind CSS | 4.x | 유틸리티 퍼스트, 모바일 최적화 |
| HTTP 클라이언트 | Axios | 1.x | 인터셉터, 자동 변환 |
| 라우팅 | React Router | 7.x | 가장 널리 사용, 안정적 |
| 아이콘 | Heroicons | 2.x | Tailwind 공식, 경량 |
| 단위/컴포넌트 테스트 | Vitest + RTL | latest | Vite 네이티브, 빠른 실행 |
| E2E 테스트 | Playwright | latest | 모바일 에뮬레이션, 크로스 브라우저 |
| 패키지 매니저 | pnpm | 9.x | 모노레포 워크스페이스, 빠른 설치 |

---

## 라이브러리 선정 상세

### Heroicons (아이콘)
- **선정 근거**: Tailwind CSS 공식 아이콘 라이브러리, 디자인 일관성
- **사용 방식**: 개별 파일 import (barrel file import 금지)
  ```typescript
  // 올바른 사용
  import { ShoppingCartIcon } from '@heroicons/react/24/outline'
  // 금지
  import { ShoppingCartIcon } from '@heroicons/react'
  ```
- **아이콘 스타일**: `outline` (24px) 기본, 강조 시 `solid` (24px)
- **번들 영향**: 개별 import로 트리쉐이킹 보장, 아이콘당 ~1KB

### Vitest (테스트 러너)
- **선정 근거**: Vite 네이티브 통합, Jest 호환 API, 빠른 실행
- **설정**: `vitest.config.ts` (Vite 설정 공유)
- **환경**: jsdom (브라우저 API 시뮬레이션)
- **커버리지**: v8 provider

### React Testing Library (컴포넌트 테스트)
- **선정 근거**: 사용자 관점 테스트, 접근성 쿼리 기본 제공
- **쿼리 우선순위**: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- **user-event**: `@testing-library/user-event`로 실제 사용자 인터랙션 시뮬레이션

### Playwright (E2E 테스트)
- **선정 근거**: 모바일 에뮬레이션 내장, 크로스 브라우저 지원
- **디바이스 프로필**: iPhone 14, Pixel 7 (모바일 에뮬레이션)
- **테스트 대상 브라우저**: Chromium, WebKit (Safari)

---

## 개발 도구

| 도구 | 용도 |
|------|------|
| ESLint | 코드 린팅 (eslint-config-react-app 기반) |
| Prettier | 코드 포맷팅 |
| vite-plugin-visualizer | 번들 사이즈 분석 |
| TypeScript strict mode | 타입 안전성 강화 |

---

## 의존성 관리 원칙

### 버전 관리
- `pnpm-lock.yaml` 반드시 커밋
- 의존성 버전: 정확한 버전 또는 `^` (minor 업데이트 허용)
- `latest` 태그 사용 금지

### 보안
- `pnpm audit` 정기 실행 (CI/CD 포함)
- 취약점 발견 시 즉시 패치 또는 대체 라이브러리 검토
- 미사용 의존성 정기 제거

### 번들 사이즈 관리
- 새 의존성 추가 시 번들 영향 분석 필수
- `bundlephobia.com`으로 사전 확인
- 대안이 있으면 경량 라이브러리 우선 선택
