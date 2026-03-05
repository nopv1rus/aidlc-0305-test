# Business Rules - Unit 2: Customer Frontend

## 1. 세션 관리 규칙

### BR-S01: 세션 유효 시간
- 세션 최대 유효 시간: 4시간
- 클라이언트에서 세션 시작 시각을 localStorage에 저장
- 매 API 호출 전 클라이언트 측 세션 만료 체크 (서버도 별도 검증)
- 만료 시: 세션 정보 삭제, 장바구니 삭제, "세션이 만료되었습니다. QR코드를 다시 스캔해주세요." 표시

### BR-S02: 세션 공유
- 같은 tableToken으로 접속하는 모든 고객은 동일 테이블 세션 공유
- 장바구니는 각 브라우저의 localStorage에 독립 저장 (공유 안 됨)
- 주문은 누구나 생성 가능 (세션 내 권한 구분 없음)

### BR-S03: 세션 종료 처리
- 관리자가 이용 완료 처리 시 SSE로 SESSION_ENDED 이벤트 수신
- 수신 즉시: localStorage의 세션 정보 + 장바구니 삭제
- 세션 종료 안내 화면 표시: "이용이 완료되었습니다. 감사합니다."
- 이후 모든 API 호출 차단 (새 QR 스캔 필요)

### BR-S04: 세션 정보 저장
- localStorage 키: `session:v1:{tableToken}` (버전 프리픽스 적용)
- 저장 데이터: `{ sessionId, storeId, tableId, tableToken, startedAt }`
- 앱 초기화 시 localStorage에서 복원 후 유효성 검증
- localStorage 접근은 try-catch로 감싸기 (시크릿 모드/용량 초과 대응)

---

## 2. 장바구니 규칙

### BR-C01: 메뉴 추가
- 장바구니에 없는 메뉴 → 수량 1로 추가
- 장바구니에 있는 메뉴 → 수량 +1 증가
- 추가 시 메뉴의 현재 가격을 스냅샷으로 저장

### BR-C02: 수량 제한
- 최소 수량: 1 (0이 되면 자동 삭제)
- 최대 수량: 99 (UI에서 제한)
- 수량은 정수만 허용

### BR-C03: 금액 계산
- 항목별 소계 = 단가 × 수량
- 총 금액 = 모든 항목 소계의 합
- 금액 포맷팅: `Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })` 사용
- 소수점 없음 (정수 금액만)
- 금액 표시 영역에 `font-variant-numeric: tabular-nums` 적용

### BR-C04: 장바구니 비우기
- "장바구니 비우기" 클릭 시 확인 팝업 필수
- 확인 시 모든 항목 삭제 + localStorage 동기화
- 취소 시 아무 동작 없음

### BR-C05: localStorage 동기화
- 저장 키: `cart:v1:{tableToken}` (버전 프리픽스 적용)
- Zustand persist middleware로 자동 동기화
- 저장 데이터: `{ items: CartItem[], updatedAt }`
- 세션 만료 또는 이용 완료 시 삭제
- localStorage 접근은 try-catch로 감싸기 (시크릿 모드/용량 초과 대응)

### BR-C06: 장바구니 바 표시 규칙
- 장바구니 비어있음 → 하단 바 숨김
- 장바구니 1개 이상 → 하단 바 표시
- 표시 내용: "장바구니 {총수량}개 · ₩{총금액}"

---

## 3. 주문 생성 규칙

### BR-O01: 주문 전 검증
- 장바구니가 비어있으면 주문 불가 (버튼 비활성화)
- 세션이 유효하지 않으면 주문 불가 (세션 만료 안내)
- 주문 확정 버튼 클릭 후 중복 클릭 방지 (로딩 중 비활성화)

### BR-O02: 주문 요청 데이터
```
{
  storeId: string,
  tableId: string,
  sessionId: string,
  items: [
    { menuId: string, quantity: number }
  ]
}
```
- 가격은 서버에서 검증 (클라이언트 가격은 표시용)
- sessionId가 없으면 서버에서 자동 생성 (첫 주문)

### BR-O03: 주문 성공 처리
- 장바구니 전체 비우기 (localStorage 포함)
- 주문 성공 페이지 표시: 주문 번호 + "주문이 접수되었습니다"
- 5초 카운트다운 표시 후 메뉴 페이지로 자동 리다이렉트
- 카운트다운 중 "메뉴로 돌아가기" 버튼으로 즉시 이동 가능

### BR-O04: 주문 실패 처리
- 장바구니 내용 유지 (삭제하지 않음)
- 에러 유형별 메시지 (문제 + 해결 방법 포함):
  - 네트워크 오류: "네트워크 연결을 확인해주세요. Wi-Fi 또는 데이터를 확인 후 다시 시도해주세요."
  - 세션 만료 (401): "세션이 만료되었습니다. QR코드를 다시 스캔해주세요."
  - 서버 오류 (5xx): "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
  - 기타 (4xx): "주문 처리 중 문제가 발생했습니다. 다시 시도해주세요."
- "다시 시도" 버튼 제공 (세션 만료 제외)
- 에러 메시지 표시 시 해당 영역에 포커스 이동 + `aria-live="assertive"`

---

## 4. 에러 처리 규칙

### BR-E01: 전역 에러 처리
- React Error Boundary로 예기치 않은 에러 캐치
- 에러 발생 시 사용자 친화적 폴백 UI 표시
- 내부 에러 정보(스택 트레이스 등) 사용자에게 노출 금지 (SECURITY-09)
- 콘솔 로그는 개발 환경에서만 출력

### BR-E02: API 에러 처리
- Axios 인터셉터에서 공통 에러 처리
- 401 (Unauthorized): 세션 만료 처리 → 세션 정보 삭제, 재스캔 안내
- 403 (Forbidden): "접근 권한이 없습니다."
- 404 (Not Found): "요청한 정보를 찾을 수 없습니다."
- 429 (Too Many Requests): "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
- 500+ (Server Error): "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
- 네트워크 오류: "네트워크 연결을 확인해주세요."

### BR-E03: SSE 연결 오류
- 연결 끊김 시 자동 재연결 (EventSource 기본 동작)
- 재연결 실패 시 3초 간격 수동 재시도 (최대 5회)
- 최대 재시도 초과: 상단 배너 "실시간 업데이트가 중단되었습니다. 새로고침해주세요."
- 페이지 포커스 복귀 시 연결 상태 확인

---

## 5. 입력값 검증 규칙 (SECURITY-05)

### BR-V01: 수량 입력 검증
- 타입: 정수만 허용
- 범위: 1 ~ 99
- 0 이하 입력 시 항목 삭제
- 100 이상 입력 시 99로 제한
- 소수점, 음수, 문자 입력 차단

### BR-V02: XSS 방지
- React의 기본 이스케이핑 활용 (JSX 자동 이스케이프)
- dangerouslySetInnerHTML 사용 금지
- 사용자 입력을 DOM에 직접 삽입하지 않음
- API 응답 데이터도 React를 통해 렌더링 (자동 이스케이프)

### BR-V03: URL 파라미터 검증
- tableToken: 영숫자 + 하이픈만 허용 (정규식: /^[a-zA-Z0-9-]+$/)
- 유효하지 않은 토큰 형식 → 에러 페이지 표시
- URL 인젝션 방지: 토큰을 URL 구성에 직접 사용하지 않고 인코딩

---

## 6. 접근성 규칙 (Web Interface Guidelines)

### BR-A01: 시맨틱 HTML 및 ARIA
- 모든 인터랙티브 요소는 시맨틱 태그 사용: `<button>` (액션), `<a>` (네비게이션)
- `<div onClick>` 또는 `<span onClick>` 사용 금지 → `<button>` 사용
- 아이콘 전용 버튼에 `aria-label` 필수 (예: 수량 +/- 버튼, 닫기 버튼)
- 장식용 아이콘에 `aria-hidden="true"` 적용
- 메뉴 이미지에 `alt` 속성 필수 (메뉴명 사용), 플레이스홀더 이미지는 `alt=""`
- 제목 태그 계층 구조 유지: `<h1>` (매장명) → `<h2>` (카테고리명) → `<h3>` (메뉴명)

### BR-A02: 키보드 접근성
- 모든 인터랙티브 요소에 키보드 핸들러 (`onKeyDown`/`onKeyUp`) 지원
- 바텀시트 열림 시 포커스 트랩 적용 (Tab 키로 바텀시트 밖 이동 방지)
- ESC 키로 바텀시트/모달 닫기
- 카테고리 탭 바: 좌우 화살표 키로 탭 이동

### BR-A03: 실시간 업데이트 접근성
- SSE로 주문 상태 변경 시 `aria-live="polite"` 영역에 알림
- 장바구니 추가/삭제 시 `aria-live="polite"`로 변경 사항 안내
- 에러 메시지 표시 시 `aria-live="assertive"` 적용
- ConnectionBanner (SSE 연결 상태)에 `role="status"` 적용

### BR-A04: 포커스 상태
- 모든 인터랙티브 요소에 `focus-visible` 스타일 적용 (ring 또는 outline)
- `outline: none` 단독 사용 금지 → 반드시 대체 포커스 스타일 제공
- `:focus-visible` 사용 (`:focus` 대신, 클릭 시 포커스 링 방지)
- 바텀시트 등 복합 컨트롤에 `:focus-within` 적용

---

## 7. 터치 및 모바일 인터랙션 규칙

### BR-T01: 터치 최적화
- 모든 터치 대상 최소 크기: 44×44px (WCAG 2.5.8)
- `touch-action: manipulation` 적용 (더블탭 줌 지연 방지)
- `-webkit-tap-highlight-color` 의도적으로 설정
- 바텀시트/모달에 `overscroll-behavior: contain` 적용 (배경 스크롤 방지)
- `autoFocus` 모바일에서 사용 자제 (키보드 자동 팝업 방지)

### BR-T02: Safe Area
- 전체 레이아웃에 `env(safe-area-inset-*)` 적용 (노치/홈 인디케이터 대응)
- 하단 고정 바(CartFloatingBar)에 `padding-bottom: env(safe-area-inset-bottom)` 필수

---

## 8. 애니메이션 규칙

### BR-AN01: 모션 접근성
- `prefers-reduced-motion` 미디어 쿼리 존중 (축소 변형 제공 또는 비활성화)
- `transform`/`opacity`만 애니메이션 (compositor-friendly, GPU 가속)
- `transition: all` 사용 금지 → 속성 명시적 나열 (예: `transition: transform 0.2s, opacity 0.2s`)
- 바텀시트 슬라이드, 장바구니 바 표시/숨김 등 모든 애니메이션에 적용
- 애니메이션은 사용자 입력에 의해 중단 가능해야 함

---

## 9. 타이포그래피 및 콘텐츠 규칙

### BR-TY01: 텍스트 표기
- 말줄임표: `...` 대신 `…` (유니코드 ellipsis) 사용
- 로딩 상태 텍스트: `"로딩 중…"`, `"주문 처리 중…"` (말줄임표로 끝남)
- 숫자 열/비교에 `font-variant-numeric: tabular-nums` 적용 (금액, 수량 정렬)
- 긴 텍스트 처리: `truncate`, `line-clamp-*`, 또는 `break-words` 적용
- Flex 자식 요소에 `min-w-0` 적용 (텍스트 truncation 허용)
- 빈 상태 처리: 빈 문자열/배열에 대해 깨진 UI 렌더링 방지

### BR-TY02: 숫자/금액 포맷팅
- 금액 포맷팅: `Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })` 사용
- 날짜/시간 포맷팅: `Intl.DateTimeFormat('ko-KR')` 사용 (하드코딩 포맷 금지)
- 숫자 표기: "8개" (숫자 사용, "여덟개" 아님)

---

## 10. 이미지 규칙

### BR-IMG01: 이미지 최적화
- `<img>` 태그에 명시적 `width`/`height` 속성 필수 (CLS 방지)
- 스크롤 아래 이미지: `loading="lazy"` 적용
- 첫 화면 메뉴 이미지: `fetchpriority="high"` 또는 eager loading
- 이미지 없는 메뉴: 플레이스홀더 이미지 표시 (`alt=""` 장식용)

---

## 11. 네비게이션 및 상태 규칙

### BR-NAV01: URL 상태 동기화
- Header 탭(메뉴/주문내역)은 `<a>`/`<Link>` 사용 (Cmd/Ctrl+클릭, 중간 클릭 지원)
- 장바구니 비우기 등 파괴적 액션은 확인 모달 필수 (즉시 실행 금지)

### BR-NAV02: 다크 모드 대응
- `<meta name="theme-color">` 페이지 배경색과 일치
- 향후 다크 모드 지원 시 `color-scheme: dark` 적용 고려

