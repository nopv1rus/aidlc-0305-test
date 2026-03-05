# Business Logic Model - Unit 2: Customer Frontend

## 1. 고객 접속 플로우 (US-C01, US-C02, US-C03)

```
QR코드 스캔
  |
  v
모바일 브라우저 열림: /order/{tableToken}
  |
  v
[App 초기화]
  |-- tableToken을 URL에서 추출
  |-- localStorage에서 기존 세션 정보 확인
  |
  v
[세션 판단]
  |-- 기존 세션 있음 + 유효(4시간 이내) → 세션 재사용
  |-- 기존 세션 없음 또는 만료 → API: GET /api/sessions/validate
  |     |-- 서버에 활성 세션 있음 → 세션 ID 수신, localStorage 저장
  |     |-- 서버에 활성 세션 없음 → 세션 미생성 상태 (첫 주문 시 생성)
  |
  v
[메뉴 로드]
  |-- API: GET /api/menus/{storeId}
  |-- 카테고리별 메뉴 데이터 수신
  |-- Zustand store에 저장
  |
  v
[메뉴 화면 표시]
  |-- 카테고리 탭 바 + 전체 메뉴 스크롤 뷰
  |-- localStorage에서 장바구니 복원
```

### 토큰 검증 실패 시
```
tableToken 유효하지 않음 (404 또는 401)
  |
  v
에러 페이지 표시: "유효하지 않은 QR코드입니다. 테이블의 QR코드를 다시 스캔해주세요."
  |-- 재시도 버튼 없음 (토큰 자체가 잘못됨)
  |-- 다른 페이지 접근 차단
```

---

## 2. 메뉴 조회/탐색 로직 (US-C04, US-C05, US-C06)

### 메뉴 데이터 구조
```
API 응답: GET /api/menus/{storeId}
{
  categories: [
    {
      id, name, sortOrder,
      menus: [
        { id, name, price, description, imageUrl, badge, sortOrder }
      ]
    }
  ]
}
```

### 탐색 로직
```
[메뉴 페이지 로드]
  |
  v
[카테고리 탭 바 렌더링] (상단 고정, 가로 스크롤)
  |-- 카테고리 sortOrder 기준 정렬
  |-- 현재 스크롤 위치에 해당하는 카테고리 탭 하이라이트
  |
  v
[전체 메뉴 섹션 렌더링] (한 페이지에 모든 카테고리)
  |-- 각 카테고리 섹션: 카테고리명 헤더 + 메뉴 카드 그리드
  |-- 메뉴 카드: 이미지, 메뉴명, 가격, 뱃지(있으면)
  |-- 이미지 없으면 플레이스홀더 표시
  |
  v
[카테고리 탭 클릭]
  |-- 해당 카테고리 섹션으로 스무스 스크롤
  |-- 탭 하이라이트 업데이트
  |
  v
[스크롤 이벤트]
  |-- IntersectionObserver로 현재 보이는 카테고리 감지
  |-- 해당 카테고리 탭 자동 하이라이트
  |-- 탭 바 자동 스크롤 (현재 탭이 보이도록)
```

### 메뉴 상세 (바텀시트)
```
[메뉴 카드 클릭]
  |
  v
[바텀시트 열림] (React.lazy + dynamic import로 지연 로드)
  |-- 메뉴 이미지 (큰 사이즈)
  |-- 메뉴명, 가격, 설명
  |-- 뱃지 표시 (시그니처/인기/신메뉴)
  |-- "장바구니 추가" 버튼 (수량 선택 포함)
  |
  v
[장바구니 추가 클릭]
  |-- 장바구니에 메뉴 추가 (기존 항목이면 수량 증가)
  |-- 바텀시트 닫힘
  |-- 하단 장바구니 바 업데이트
```

---

## 3. 장바구니 관리 로직 (US-C07 ~ US-C12)

### 장바구니 상태 흐름
```
[장바구니 Zustand Store]
  |
  |-- items: CartItem[] (menuId, name, price, quantity, imageUrl)
  |-- storeId: string
  |-- tableToken: string
  |
  |-- addItem(menu) → 기존 항목이면 quantity++, 없으면 추가
  |-- removeItem(menuId) → 해당 항목 삭제
  |-- updateQuantity(menuId, quantity) → 수량 변경, 0이면 삭제
  |-- clearCart() → 전체 비우기
  |-- getTotalAmount() → 합계 계산
  |-- getTotalCount() → 총 수량 계산
```

### localStorage 동기화
```
[Zustand middleware: persist]
  |-- 장바구니 변경 시 자동으로 localStorage에 저장
  |-- 키: cart:v1:{tableToken} (버전 프리픽스)
  |-- 앱 초기화 시 localStorage에서 자동 복원
  |-- 세션 만료 또는 이용 완료 시 localStorage 삭제
  |-- try-catch로 localStorage 접근 보호 (시크릿 모드/용량 초과)
```

### 하단 장바구니 바
```
[메뉴 페이지 하단 고정]
  |-- 장바구니 비어있으면: 숨김
  |-- 장바구니 있으면: "장바구니 N개 · ₩XX,XXX 원" 표시
  |-- 탭하면 바텀시트로 장바구니 목록 표시
  |     |-- 각 항목: 메뉴명, 단가, 수량(+/- 버튼), 소계
  |     |-- 하단: 총 금액 + "주문하기" 버튼
  |     |-- "장바구니 비우기" 버튼 (확인 팝업 후 실행)
```

---

## 4. 주문 생성 플로우 (US-C13 ~ US-C16)

```
[장바구니 바텀시트에서 "주문하기" 클릭]
  |
  v
[주문 확인 페이지] (/order/{tableToken}/confirm)
  |-- 전체 메뉴 목록, 수량(수정 가능), 단가, 소계
  |-- 총 금액
  |-- "주문 확정" 버튼 + "돌아가기" 버튼
  |-- 수량 변경 시 즉시 금액 재계산
  |
  v
["주문 확정" 클릭]
  |-- 버튼 비활성화 (중복 클릭 방지)
  |-- 로딩 표시
  |
  v
[API: POST /api/orders]
  |-- 요청: { storeId, tableId, sessionId, items: [{menuId, quantity}] }
  |
  +-- 성공 (201)
  |     |-- 주문 번호 수신
  |     |-- 장바구니 비우기 (localStorage 포함)
  |     |-- 주문 성공 페이지로 이동
  |     |-- 5초 카운트다운 후 메뉴 페이지로 자동 리다이렉트
  |
  +-- 실패 (4xx/5xx/네트워크)
        |-- 에러 메시지 표시 (사용자 친화적)
        |-- 장바구니 유지
        |-- "다시 시도" 버튼 활성화
        |-- 세션 만료(401) → 세션 만료 안내 + QR 재스캔 유도
```

---

## 5. 주문 내역 조회 로직 (US-C17, US-C18)

```
[주문 내역 페이지] (/order/{tableToken}/history)
  |
  v
[API: GET /api/orders/session/{sessionId}]
  |-- 현재 세션의 주문만 조회
  |
  v
[주문 목록 렌더링]
  |-- 주문 시간 역순 정렬 (최신 먼저)
  |-- 각 주문 카드:
  |     |-- 주문 번호
  |     |-- 주문 시각
  |     |-- 상태 뱃지 (대기중/준비중/완료/취소됨)
  |     |-- 메뉴 목록 (메뉴명 x 수량)
  |     |-- 주문 금액
  |
  v
[SSE 이벤트 수신 시]
  |-- ORDER_STATUS_CHANGED → 해당 주문 상태 즉시 업데이트
  |-- 페이지 새로고침 없이 반영
```

---

## 6. SSE 클라이언트 로직 (US-C19)

```
[앱 초기화 시 SSE 연결]
  |
  v
[EventSource 생성]
  |-- URL: /api/sse/customer/{storeId}/{tableId}
  |-- 연결 성공 → 이벤트 리스닝 시작
  |
  v
[이벤트 처리]
  |-- ORDER_STATUS_CHANGED
  |     |-- { orderId, status, updatedAt }
  |     |-- Zustand order store 업데이트
  |     |-- 주문 내역 페이지에 있으면 즉시 UI 반영
  |
  |-- SESSION_ENDED
  |     |-- 관리자가 이용 완료 처리
  |     |-- 세션 정보 삭제 (localStorage)
  |     |-- 장바구니 삭제 (localStorage)
  |     |-- 세션 종료 안내 화면 표시
  |
  v
[연결 끊김 처리]
  |-- EventSource 자동 재연결 (브라우저 기본 동작)
  |-- 재연결 실패 시 수동 재연결 (3초 간격, 최대 5회)
  |-- 최대 재시도 초과 → "연결이 끊어졌습니다" 배너 표시
  |-- 페이지 포커스 복귀 시 연결 상태 확인 및 재연결
```

