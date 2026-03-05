# Build Instructions - Unit 2: Customer Frontend

## Prerequisites
- **Build Tool**: Vite 6.x
- **Runtime**: Node.js 20+ (LTS)
- **Package Manager**: npm 11+ (또는 pnpm 9+)
- **Environment Variables**: `.env.development` (개발), `.env.production` (프로덕션)

## Build Steps

### 1. Install Dependencies
```bash
cd apps/customer
npm install
```

### 2. Configure Environment
```bash
# 개발 환경 (Mock 데이터 사용)
# .env.development 파일이 자동 적용됨
# VITE_USE_MOCK=true
# VITE_API_BASE_URL=http://localhost:3000

# 프로덕션 환경
# .env.production 파일 적용
# VITE_USE_MOCK=false
# VITE_API_BASE_URL=실제 API URL로 변경 필요
```

### 3. TypeScript Type Check
```bash
npx tsc --noEmit
```

### 4. Build for Production
```bash
npx vite build
# 또는
npm run build
```

### 5. Verify Build Success
- **Expected Output**: `✓ built in ~500ms`
- **Build Artifacts**: `dist/` 디렉토리
  - `dist/index.html` — HTML 진입점
  - `dist/assets/*.js` — JavaScript 번들 (vendor-react, vendor-http, vendor-state, 페이지별 chunk)
  - `dist/assets/*.css` — CSS 번들
- **번들 크기 기준**: 메인 번들 < 200KB (gzip 기준 < 65KB)

### 6. Preview Production Build
```bash
npx vite preview
# http://localhost:4173 에서 확인
```

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: node_modules 미설치 또는 버전 불일치
- **Solution**: `rm -rf node_modules && npm install`

### Build Fails with TypeScript Errors
- **Cause**: 타입 불일치
- **Solution**: `npx tsc --noEmit`으로 에러 확인 후 수정

### Tailwind CSS 미적용
- **Cause**: `@tailwindcss/vite` 플러그인 미설치
- **Solution**: `npm install @tailwindcss/vite tailwindcss` 확인
