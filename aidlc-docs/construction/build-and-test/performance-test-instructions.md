# Performance Test Instructions - Unit 2: Customer Frontend

## Performance Requirements (NFR 기준)
- **FCP (First Contentful Paint)**: < 2.5s
- **LCP (Largest Contentful Paint)**: < 4s
- **TTI (Time to Interactive)**: < 5s
- **번들 크기**: 초기 로드 < 200KB (gzip)
- **이미지 로딩**: lazy loading 적용

## 번들 크기 분석

### 1. Build Analyzer 실행
```bash
cd apps/customer
npx vite build
```

### 2. 빌드 결과 확인 (2026-03-05 기준)
| 파일 | 크기 | gzip |
|------|------|------|
| index.html | 0.81 KB | 0.43 KB |
| index.css | 21.79 KB | 5.27 KB |
| vendor-react.js | 99.63 KB | 33.57 KB |
| vendor-http.js | 37.10 KB | 14.82 KB |
| vendor-state.js | 0.66 KB | 0.42 KB |
| index.js (app) | 200.44 KB | 63.93 KB |
| 페이지 chunks | ~27 KB | ~12 KB |

### 3. 번들 최적화 확인
- ✅ React/ReactDOM vendor chunk 분리
- ✅ Axios vendor chunk 분리
- ✅ Zustand vendor chunk 분리
- ✅ 페이지별 lazy loading (code splitting)
- ✅ 바텀시트 컴포넌트 dynamic import

## Lighthouse 성능 측정

### 1. 로컬 측정
```bash
# 프로덕션 빌드 후 preview 서버 실행
npx vite build && npx vite preview

# Chrome DevTools > Lighthouse 탭에서 측정
# 설정: Mobile, Performance 카테고리
```

### 2. 측정 항목
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- TTI (Time to Interactive)
- CLS (Cumulative Layout Shift)
- TBT (Total Blocking Time)

## 성능 최적화 체크리스트
- [x] Code splitting (React.lazy + Suspense)
- [x] Vendor chunk 분리 (react, axios, zustand)
- [x] CSS 최적화 (Tailwind purge)
- [x] 이미지 lazy loading (loading="lazy")
- [x] Zustand selector 최적화 (불필요한 리렌더 방지)
- [x] React.memo 적용 (QuantityControl, PriceDisplay 등)
- [x] reduced-motion 미디어 쿼리 적용
- [ ] 실제 디바이스 Lighthouse 측정 (Unit 1 완성 후)
