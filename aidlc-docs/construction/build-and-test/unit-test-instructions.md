# Unit Test Execution - Unit 2: Customer Frontend

## Test Framework
- **Runner**: Vitest 3.x
- **Environment**: jsdom
- **Assertion**: Vitest globals + @testing-library/jest-dom
- **Component Testing**: @testing-library/react + @testing-library/user-event
- **Coverage**: @vitest/coverage-v8

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
cd apps/customer
npm run test
# 또는
npx vitest run
```

### 2. Watch Mode (개발 중)
```bash
npm run test:watch
```

### 3. Coverage Report
```bash
npm run test:coverage
# 또는
npx vitest run --coverage
```

## Test Results (2026-03-05 실행 기준)

### Summary
- **Total Test Files**: 13
- **Total Tests**: 56
- **Passed**: 56
- **Failed**: 0
- **Duration**: ~1.2s

### Test File Details

| 테스트 파일 | 테스트 수 | 상태 |
|-------------|:---------:|:----:|
| `shared/utils/format.test.ts` | 4 | ✅ |
| `shared/utils/validation.test.ts` | 10 | ✅ |
| `shared/utils/storage.test.ts` | 4 | ✅ |
| `shared/ui/QuantityControl.test.tsx` | 5 | ✅ |
| `shared/ui/PriceDisplay.test.tsx` | 3 | ✅ |
| `shared/ui/BottomSheet.test.tsx` | 4 | ✅ |
| `domains/cart/store/cart.store.test.ts` | 9 | ✅ |
| `domains/cart/components/CartFloatingBar.test.tsx` | 2 | ✅ |
| `domains/session/store/session.store.test.ts` | 4 | ✅ |
| `domains/order/store/order.store.test.ts` | 3 | ✅ |
| `domains/order/components/OrderConfirmPage.test.tsx` | 2 | ✅ |
| `domains/menu/store/menu.store.test.ts` | 3 | ✅ |
| `domains/menu/components/MenuCard.test.tsx` | 3 | ✅ |

### Coverage Target
- **Lines**: 80% (threshold 설정됨)
- **Report Location**: `coverage/` 디렉토리 (HTML, LCOV, text)

## Fix Failing Tests
1. `npx vitest run` 실행하여 실패 테스트 확인
2. 에러 메시지에서 파일 경로와 라인 번호 확인
3. 코드 수정 후 `npx vitest run` 재실행
4. 전체 통과 확인
