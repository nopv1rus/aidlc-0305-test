# E2E Test Instructions - Unit 2: Customer Frontend

## Test Framework
- **Runner**: Playwright 1.49+
- **Browser**: Chromium (Mobile Chrome 에뮬레이션)
- **Viewport**: 390x844 (iPhone 14 기준)

## Prerequisites
```bash
# Playwright 브라우저 설치
npx playwright install chromium
```

## E2E 테스트 파일

| 파일 | 시나리오 | 테스트 수 |
|------|----------|:---------:|
| `e2e/order-flow.spec.ts` | 메뉴 → 장바구니 → 주문 → 성공 | 4 |
| `e2e/menu-browse.spec.ts` | 카테고리 이동, 메뉴 상세 | 3 |
| `e2e/session.spec.ts` | 토큰 검증, 세션 만료 | 3 |
| `e2e/error-scenarios.spec.ts` | 네트워크 에러, 404 | 3 |

## 실행 방법

### 1. 전체 E2E 테스트 실행
```bash
cd apps/customer
npm run test:e2e
# 또는
npx playwright test
```

### 2. 특정 파일만 실행
```bash
npx playwright test e2e/order-flow.spec.ts
```

### 3. UI 모드 (디버깅)
```bash
npx playwright test --ui
```

### 4. 테스트 리포트 확인
```bash
npx playwright show-report
```

## 현재 상태
- E2E 테스트는 Mock 데이터 기반으로 작성됨
- 실제 Backend API 연동 후 `VITE_USE_MOCK=false`로 전환하여 재실행 필요
- Playwright 설정에 모바일 에뮬레이션 (iPhone 14) 적용됨

## 실행 전 확인사항
- [ ] `npx playwright install chromium` 실행 완료
- [ ] 개발 서버 실행 중 (`npm run dev`)
- [ ] `.env.development`에 `VITE_USE_MOCK=true` 설정
