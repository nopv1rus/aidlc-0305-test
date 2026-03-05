# Unit 1: Backend API Server - Functional Design 질문

아래 질문에 답변해주세요. 각 질문의 [Answer]: 뒤에 선택지 알파벳을 입력해주세요.
선택지가 맞지 않으면 마지막 옵션(Other)을 선택하고 설명을 추가해주세요.

---

## Question 1
매장 식별자(Store Identifier) 자동 생성 규칙은 어떤 방식이 좋을까요?

A) 매장명 기반 slug 생성 (예: "맛있는치킨" → "masitneun-chicken")
B) 랜덤 영숫자 조합 (예: "STORE-A3F8K2")
C) 순차 번호 기반 (예: "STORE-001", "STORE-002")
D) Other (please describe after [Answer]: tag below)

[Answer]: 

---

## Question 2
주문 번호(Order Number) 생성 규칙은 어떤 방식이 좋을까요?

A) 매장별 일일 순차 번호 (예: 1, 2, 3... 매일 리셋)
B) 매장별 전체 순차 번호 (예: 1, 2, 3... 리셋 없음)
C) 타임스탬프 기반 (예: "20260305-001")
D) Other (please describe after [Answer]: tag below)

[Answer]: 

---

## Question 3
로그인 시도 제한(브루트포스 방지) 잠금 해제 시간은 얼마가 적당할까요?

A) 5분
B) 15분
C) 30분
D) 1시간
E) Other (please describe after [Answer]: tag below)

[Answer]: 

---

## Question 4
주문 취소 가능 조건에서, "완료" 상태의 주문도 취소 가능해야 할까요?

A) 아니오, 대기중/준비중 상태만 취소 가능 (현재 요구사항대로)
B) 예, 완료 상태도 취소 가능하되 별도 사유 입력 필요
C) Other (please describe after [Answer]: tag below)

[Answer]: 

---

## Question 5
이용 완료 시 주문 이력 이동 방식은 어떻게 할까요?

A) 별도 order_history 테이블로 데이터 복사 후 원본 삭제
B) orders 테이블에 유지하되 session 종료 상태로 마킹 (archived 플래그)
C) Other (please describe after [Answer]: tag below)

[Answer]: 

---

## Question 6
카테고리 관리에서, 카테고리도 CRUD가 필요할까요? 아니면 메뉴 등록 시 카테고리명을 직접 입력하는 방식일까요?

A) 카테고리 별도 CRUD (카테고리 먼저 등록 → 메뉴에서 선택)
B) 메뉴 등록 시 카테고리명 직접 입력 (자동 생성/매칭)
C) Other (please describe after [Answer]: tag below)

[Answer]: 

---

## Question 7
슈퍼 관리자 초기 계정은 어떻게 생성할까요?

A) 시스템 시작 시 환경변수 기반 자동 시드 (SUPER_ADMIN_USERNAME, SUPER_ADMIN_PASSWORD)
B) DB 마이그레이션 시 기본 계정 삽입
C) CLI 명령어로 생성
D) Other (please describe after [Answer]: tag below)

[Answer]: 

---

## Question 8
테이블 세션에서 "첫 주문 시 세션 시작"인데, QR코드 스캔 시점에는 세션이 없는 상태입니다. 세션 없이 메뉴 조회는 가능하되, 주문 시 세션을 자동 생성하는 방식이 맞을까요?

A) 맞습니다. QR 스캔 시 메뉴 조회만 가능, 첫 주문 시 세션 자동 생성
B) QR 스캔 시점에 세션을 미리 생성 (주문 없어도 세션 시작)
C) Other (please describe after [Answer]: tag below)

[Answer]: 

---
