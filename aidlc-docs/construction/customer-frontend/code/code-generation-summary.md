# Code Generation Summary - Unit 2: Customer Frontend

## 개요
- **유닛**: Unit 2 - Customer Frontend
- **디렉토리**: `apps/customer/`
- **브랜치**: `feature-customer-fe`
- **생성 일시**: 2026-03-05
- **총 생성 파일**: 96개 (설정 9 + 소스 67 + 테스트 17 + Mock 4)

## 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.x | UI 프레임워크 |
| TypeScript | 5.x | 타입 안전성 |
| Vite | 6.x | 빌드 도구 |
| Zustand | 5.x | 상태 관리 |
| Tailwind CSS | 4.x | 스타일링 |
| Axios | 1.x | HTTP 클라이언트 |
| React Router | 7.x | 라우팅 |
| Heroicons | 2.x | 아이콘 |
| Vitest + RTL | latest | 단위/컴포넌트 테스트 |
| Playwright | latest | E2E 테스트 |

## 아키텍처 요약

DDD 기반 도메인 분리 구조. 5개 도메인(session, menu, cart, order, sse) + shared 모듈.

```
apps/customer/
├── src/
│   ├── app/           # App core (Provider, Router, ErrorBoundary)
│   ├── domains/       # DDD 도메인 모듈
│   │   ├── session/   # QR 세션 관리
│   │   ├── menu/      # 메뉴 조회/탐색
│   │   ├── cart/      # 장바구니 (localStorage persist)
│   │   ├── order/     # 주문 생성/내역
│   │   └── sse/       # 실시간 업데이트
│   ├── shared/        # 공통 모듈
│   │   ├── api/       # Axios 인스턴스, 에러 핸들러, 재시도
│   │   ├── errors/    # AppError, ErrorBoundary
│   │   ├── layouts/   # AppLayout, Header
│   │   ├── network/   # 네트워크 상태, 오프라인 큐
│   │   ├── ui/        # 공통 UI 컴포넌트 (12개)
│   │   └── utils/     # 포맷, 검증, 스토리지
│   ├── pages/         # 라우트 진입점
│   ├── mocks/         # Mock 데이터 (JSON + API 핸들러)
│   └── styles/        # 글로벌 CSS
├── e2e/               # Playwright E2E 테스트
└── [config files]     # Vite, TS, Tailwind, Vitest, Playwright 설정
```

## 생성 파일 목록

### 설정 파일 (9개)
| 파일 | 설명 |
|------|------|
| `package.json` | 의존성 정의 |
| `tsconfig.json` | TypeScript strict mode |
| `vite.config.ts` | Vite 빌드 + chunk 전략 |
| `tailwind.config.ts` | Tailwind 4 설정 |
| `vitest.config.ts` | Vitest + jsdom + coverage |
| `playwright.config.ts` | Playwright 모바일 에뮬레이션 |
| `index.html` | HTML 템플릿 (viewport, safe-area) |
| `.env.development` | VITE_USE_MOCK=true |
| `.env.production` | VITE_USE_MOCK=false |

### 앱 코어 (6개)
| 파일 | 설명 |
|------|------|
| `src/main.tsx` | Vite 진입점 |
| `src/vite-env.d.ts` | Vite 타입 선언 |
| `src/styles/globals.css` | Tailwind directives + 전역 스타일 |
| `src/app/App.tsx` | 루트 컴포넌트 |
| `src/app/AppProvider.tsx` | 전역 Provider |
| `src/app/router.tsx` | React Router (lazy routes) |
| `src/app/error-boundary.tsx` | 최상위 Error Boundary |

### Shared 모듈 (22개)
| 파일 | 설명 |
|------|------|
| `src/shared/utils/format.ts` | Intl.NumberFormat, DateTimeFormat |
| `src/shared/utils/validation.ts` | 토큰/수량 검증 |
| `src/shared/utils/storage.ts` | localStorage 래퍼 |
| `src/shared/errors/app-error.ts` | AppError 클래스 |
| `src/shared/errors/error-codes.ts` | ErrorCode 타입 |
| `src/shared/errors/PageErrorBoundary.tsx` | 페이지별 Error Boundary |
| `src/shared/api/axios-instance.ts` | Axios + 인터셉터 |
| `src/shared/api/error-handler.ts` | 에러 변환 파이프라인 |
| `src/shared/api/retry.ts` | 지수 백오프 재시도 |
| `src/shared/network/network.store.ts` | NetworkStore |
| `src/shared/network/online-detector.ts` | 온라인 감지 |
| `src/shared/network/order-queue.ts` | 오프라인 주문 큐 |
| `src/shared/ui/BottomSheet.tsx` | 바텀시트 |
| `src/shared/ui/Button.tsx` | 공통 버튼 |
| `src/shared/ui/LoadingSpinner.tsx` | 로딩 인디케이터 |
| `src/shared/ui/ErrorMessage.tsx` | 에러 메시지 |
| `src/shared/ui/ConfirmDialog.tsx` | 확인 팝업 |
| `src/shared/ui/Badge.tsx` | 뱃지 |
| `src/shared/ui/QuantityControl.tsx` | 수량 조절 |
| `src/shared/ui/PriceDisplay.tsx` | 금액 표시 |
| `src/shared/ui/EmptyState.tsx` | 빈 상태 |
| `src/shared/ui/ConnectionBanner.tsx` | SSE 연결 상태 |
| `src/shared/ui/SkipLink.tsx` | 스킵 링크 |
| `src/shared/ui/PageSkeleton.tsx` | 페이지 스켈레톤 |
| `src/shared/layouts/AppLayout.tsx` | 앱 레이아웃 |
| `src/shared/layouts/Header.tsx` | 헤더 |

### Session 도메인 (6개)
| 파일 | 설명 |
|------|------|
| `src/domains/session/model/session.types.ts` | SessionInfo 타입 |
| `src/domains/session/store/session.store.ts` | SessionStore (persist) |
| `src/domains/session/api/session.api.ts` | 세션 검증 API |
| `src/domains/session/hooks/useSession.ts` | 세션 훅 |
| `src/domains/session/components/TokenGuard.tsx` | 토큰 검증 가드 |
| `src/domains/session/components/SessionExpired.tsx` | 세션 만료 화면 |

### Menu 도메인 (10개)
| 파일 | 설명 |
|------|------|
| `src/domains/menu/model/menu.types.ts` | Menu, Category 타입 |
| `src/domains/menu/store/menu.store.ts` | MenuStore |
| `src/domains/menu/api/menu.api.ts` | 메뉴 조회 API |
| `src/domains/menu/hooks/useMenuScroll.ts` | 카테고리 스크롤 연동 |
| `src/domains/menu/components/MenuPage.tsx` | 메뉴 페이지 |
| `src/domains/menu/components/CategoryTabBar.tsx` | 카테고리 탭 바 |
| `src/domains/menu/components/MenuSectionList.tsx` | 메뉴 섹션 리스트 |
| `src/domains/menu/components/MenuSection.tsx` | 카테고리별 섹션 |
| `src/domains/menu/components/MenuCard.tsx` | 메뉴 카드 |
| `src/domains/menu/components/MenuDetailSheet.tsx` | 메뉴 상세 바텀시트 |

### Cart 도메인 (6개)
| 파일 | 설명 |
|------|------|
| `src/domains/cart/model/cart.types.ts` | CartItem 타입 |
| `src/domains/cart/store/cart.store.ts` | CartStore (persist) |
| `src/domains/cart/hooks/useCartTotal.ts` | 금액 계산 훅 |
| `src/domains/cart/components/CartFloatingBar.tsx` | 하단 장바구니 바 |
| `src/domains/cart/components/CartBottomSheet.tsx` | 장바구니 바텀시트 |
| `src/domains/cart/components/CartItemRow.tsx` | 장바구니 항목 행 |

### Order 도메인 (11개)
| 파일 | 설명 |
|------|------|
| `src/domains/order/model/order.types.ts` | Order, OrderStatus 타입 |
| `src/domains/order/store/order.store.ts` | OrderStore |
| `src/domains/order/api/order.api.ts` | 주문 API |
| `src/domains/order/hooks/useOrderSubmit.ts` | 주문 제출 훅 |
| `src/domains/order/components/OrderConfirmPage.tsx` | 주문 확인 |
| `src/domains/order/components/OrderSuccessPage.tsx` | 주문 성공 |
| `src/domains/order/components/OrderHistoryPage.tsx` | 주문 내역 |
| `src/domains/order/components/OrderCard.tsx` | 주문 카드 |
| `src/domains/order/components/OrderStatusBadge.tsx` | 상태 뱃지 |
| `src/domains/order/components/OrderItemList.tsx` | 주문 항목 목록 |
| `src/domains/order/components/CountdownRedirect.tsx` | 카운트다운 리다이렉트 |

### SSE 도메인 (3개)
| 파일 | 설명 |
|------|------|
| `src/domains/sse/model/sse.types.ts` | SSEEvent 타입 |
| `src/domains/sse/store/sse.store.ts` | SSEStore |
| `src/domains/sse/services/sse-manager.ts` | SSE 연결/재연결 관리 |

### Pages (5개)
| 파일 | 설명 |
|------|------|
| `src/pages/MenuPage.tsx` | 메뉴 페이지 진입점 |
| `src/pages/OrderConfirmPage.tsx` | 주문 확인 진입점 |
| `src/pages/OrderSuccessPage.tsx` | 주문 성공 진입점 |
| `src/pages/OrderHistoryPage.tsx` | 주문 내역 진입점 |
| `src/pages/ErrorPage.tsx` | 에러 페이지 |

### Mock 데이터 (4개)
| 파일 | 설명 |
|------|------|
| `src/mocks/categories.json` | 카테고리 + 메뉴 (3카테고리, 12메뉴) |
| `src/mocks/orders.json` | 주문 내역 샘플 (4주문) |
| `src/mocks/session.json` | 세션 검증 응답 |
| `src/mocks/mock-api.ts` | Mock API 핸들러 |

### 단위 테스트 (7개)
| 파일 | 대상 |
|------|------|
| `src/shared/utils/format.test.ts` | 포맷 유틸 |
| `src/shared/utils/validation.test.ts` | 검증 유틸 |
| `src/shared/utils/storage.test.ts` | localStorage 래퍼 |
| `src/domains/cart/store/cart.store.test.ts` | CartStore |
| `src/domains/session/store/session.store.test.ts` | SessionStore |
| `src/domains/order/store/order.store.test.ts` | OrderStore |
| `src/domains/menu/store/menu.store.test.ts` | MenuStore |

### 컴포넌트 테스트 (6개)
| 파일 | 대상 |
|------|------|
| `src/shared/ui/QuantityControl.test.tsx` | 수량 조절 |
| `src/shared/ui/PriceDisplay.test.tsx` | 금액 표시 |
| `src/shared/ui/BottomSheet.test.tsx` | 바텀시트 |
| `src/domains/menu/components/MenuCard.test.tsx` | 메뉴 카드 |
| `src/domains/cart/components/CartFloatingBar.test.tsx` | 장바구니 바 |
| `src/domains/order/components/OrderConfirmPage.test.tsx` | 주문 확인 |

### E2E 테스트 (4개)
| 파일 | 시나리오 |
|------|----------|
| `e2e/order-flow.spec.ts` | 메뉴 → 장바구니 → 주문 → 성공 |
| `e2e/menu-browse.spec.ts` | 카테고리 이동, 상세 보기 |
| `e2e/session.spec.ts` | 토큰 검증, 만료 |
| `e2e/error-scenarios.spec.ts` | 에러 시나리오 |

## 스토리 트레이서빌리티

| 스토리 ID | 설명 | 구현 파일 |
|-----------|------|----------|
| US-C01 | QR 접속/세션 | TokenGuard, router, SessionStore |
| US-C02 | 세션 유지 | SessionStore (persist), useSession |
| US-C03 | 동시 접속 | SessionStore (세션 공유) |
| US-C04 | 메뉴 목록 | MenuPage, CategoryTabBar, MenuSectionList |
| US-C05 | 메뉴 상세 | MenuDetailSheet, MenuCard |
| US-C06 | 카테고리 이동 | CategoryTabBar, useMenuScroll |
| US-C07 | 장바구니 추가 | CartStore.addItem, CartFloatingBar |
| US-C08 | 수량 변경 | CartStore.updateQuantity, QuantityControl |
| US-C09 | 항목 삭제 | CartStore.removeItem, CartItemRow |
| US-C10 | 금액 계산 | CartStore.getTotalAmount, PriceDisplay |
| US-C11 | 장바구니 비우기 | CartStore.clearCart, ConfirmDialog |
| US-C12 | 로컬 유지 | CartStore (persist middleware) |
| US-C13 | 주문 확인 | OrderConfirmPage, OrderItemList |
| US-C14 | 주문 확정 | OrderStore.createOrder, order-queue |
| US-C15 | 주문 성공 | OrderSuccessPage, CountdownRedirect |
| US-C16 | 에러 처리 | AppError, error-handler, PageErrorBoundary |
| US-C17 | 주문 내역 | OrderHistoryPage, OrderCard |
| US-C18 | 주문 상세 | OrderCard, OrderItemList |
| US-C19 | 실시간 업데이트 | sse-manager, SSEStore |

## 적용된 설계 원칙

- **Vercel React Best Practices**: dynamic import, functional setState, Zustand selector 최적화, localStorage 버전 프리픽스
- **Web Interface Guidelines**: 시맨틱 HTML, ARIA 속성, 키보드 네비게이션, 포커스 트랩, 44px 터치 타겟, Safe Area, reduced-motion, Intl.NumberFormat
- **Security Baseline**: XSS 방지 (React 기본), 입력값 검증, 에러 메시지 정보 노출 방지 (SECURITY-06 제외)
- **DDD 구조**: 도메인별 격리, 단방향 의존성, shared 모듈 공유
- **Automation Friendly**: 모든 인터랙티브 요소에 `data-testid` 속성 적용
