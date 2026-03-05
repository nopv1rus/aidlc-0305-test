# 테이블오더 백엔드

NestJS 기반 테이블오더 서비스 백엔드 API

## 사전 요구사항

- Node.js 18+
- Docker & Docker Compose
- npm

## 설치

```bash
npm install
```

## 데이터베이스 실행

프로젝트 루트에서 Docker Compose로 PostgreSQL을 실행합니다.

```bash
# 프로젝트 루트 디렉토리에서
docker compose up -d
```

PostgreSQL이 `localhost:5432`에서 실행되며, `table_order` 데이터베이스가 자동 생성됩니다.

## 서버 실행

```bash
# 개발 모드 (watch)
npm run start:dev

# 프로덕션 빌드
npm run build
npm run start:prod
```

서버가 `http://0.0.0.0:3000`에서 실행되며, 같은 네트워크의 다른 기기에서 IP로 접근 가능합니다.

- API 문서 (Swagger): `http://<IP>:3000/api-docs`

## 유닛 테스트

각 서비스 모듈별로 유닛테스트가 작성되어 있습니다.

```bash
# 전체 유닛 테스트 실행
npm run test

# 특정 서비스 테스트만 실행
npx jest --testPathPattern=auth.service.spec
npx jest --testPathPattern=menu.service.spec
npx jest --testPathPattern=order.service.spec
npx jest --testPathPattern=store.service.spec
npx jest --testPathPattern=table.service.spec
npx jest --testPathPattern=sse.service.spec

# watch 모드 (파일 변경 시 자동 재실행)
npm run test:watch

# 커버리지 리포트
npm run test:cov
```

### 테스트 파일 위치

테스트 파일은 각 서비스 파일과 같은 디렉토리에 `*.spec.ts` 패턴으로 위치합니다.

```
src/modules/
├── auth/
│   ├── auth.service.ts
│   └── auth.service.spec.ts      # 관리자 등록/로그인, 테이블 로그인, 계정 잠금
├── menu/
│   ├── menu.service.ts
│   └── menu.service.spec.ts      # 메뉴 CRUD, 정렬 순서
├── order/
│   ├── order.service.ts
│   └── order.service.spec.ts     # 주문 생성/조회/상태변경/삭제, SSE 이벤트
├── store/
│   ├── store.service.ts
│   └── store.service.spec.ts     # 매장 생성/조회
├── table/
│   ├── table.service.ts
│   └── table.service.spec.ts     # 테이블 생성/조회, 세션 완료, 주문 히스토리
└── sse/
    ├── sse.service.ts
    └── sse.service.spec.ts       # SSE 이벤트 발행/구독 필터링
```

## 환경 변수

`.env` 파일에서 설정합니다.

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `DB_HOST` | PostgreSQL 호스트 | `localhost` |
| `DB_PORT` | PostgreSQL 포트 | `5432` |
| `DB_USERNAME` | DB 사용자명 | `postgres` |
| `DB_PASSWORD` | DB 비밀번호 | `postgres` |
| `DB_DATABASE` | DB 이름 | `table_order` |
| `JWT_SECRET` | JWT 시크릿 키 | - |
| `JWT_EXPIRES_IN` | JWT 만료 시간 | `16h` |
| `PORT` | 서버 포트 | `3000` |

## 네트워크 접근 (같은 WiFi)

서버와 DB 모두 `0.0.0.0`으로 바인딩되어 있어 같은 네트워크의 다른 기기에서 접근 가능합니다.

### DB 호스트 IP (테스트용)

현재 DB가 실행되는 호스트 IP: `172.24.66.134`

각자 백엔드를 로컬에서 실행하되, DB는 위 IP의 PostgreSQL을 공유해서 사용합니다.

#### 팀원 설정 방법

`.env` 파일에서 `DB_HOST`만 변경하면 됩니다.

```env
# 본인이 DB를 직접 실행하는 경우
DB_HOST=localhost

# 팀원의 DB를 사용하는 경우
DB_HOST=172.24.66.134
```

#### 프론트엔드에서 백엔드 호출

각자 로컬 백엔드를 실행하는 경우:
```
http://localhost:3000
```

다른 팀원의 백엔드를 직접 호출하는 경우:
```
http://172.24.66.134:3000
```

### IP 확인 방법

```bash
# macOS
ipconfig getifaddr en0
```

> WiFi 재접속 시 IP가 변경될 수 있으니 확인 후 `.env`를 업데이트해주세요.
