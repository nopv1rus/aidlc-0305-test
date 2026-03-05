# QR코드 기반 고객 접속 - 명확화 질문

태블릿 → QR코드 모바일 접속으로 변경에 따른 추가 질문입니다.
[Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.

---

## Question 1
QR코드에 어떤 정보를 담을 건가요?

A) 매장ID + 테이블번호를 URL 파라미터로 포함 (예: https://order.example.com?store=abc&table=3)
B) 테이블별 고유 토큰을 URL에 포함 (예: https://order.example.com/t/abc123xyz)
C) 매장 URL만 포함하고, 테이블 번호는 고객이 직접 입력
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
QR코드 생성 및 관리는 어떻게 하시겠습니까?

A) 관리자 화면에서 테이블별 QR코드 자동 생성 및 다운로드/인쇄 기능 제공
B) 외부 QR코드 생성기로 URL을 직접 만들어서 사용 (시스템에서 QR 생성 기능 불필요)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
기존 "테이블 태블릿 자동 로그인" 기능이 QR코드 방식으로 바뀌면, 테이블 비밀번호 개념은 어떻게 하시겠습니까?

A) 제거 - QR코드 URL 자체가 인증 수단이므로 별도 비밀번호 불필요
B) 유지 - QR코드 스캔 후 테이블 비밀번호를 한 번 입력해야 주문 가능 (무단 접속 방지)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
고객이 QR코드로 접속한 세션의 유효 시간은 어떻게 하시겠습니까?

A) 시간 제한 없음 - 관리자가 테이블 이용 완료 처리할 때까지 유효
B) 일정 시간 후 만료 (예: 2시간) - 만료 시 QR코드 재스캔 필요
C) 브라우저 탭을 닫으면 세션 종료 - 재접속 시 QR코드 재스캔
D) Other (please describe after [Answer]: tag below)

[Answer]: D - 최대 4시간 후 만료, 만료 시 QR코드 재스캔 필요

## Question 5
같은 테이블에서 여러 고객이 동시에 QR코드를 스캔하면 어떻게 처리하시겠습니까?

A) 모두 같은 테이블 세션을 공유 - 누구나 주문 가능, 장바구니는 각자 별도
B) 첫 번째 접속자만 주문 가능, 나머지는 메뉴 조회만 가능
C) 모두 독립적으로 주문 가능 - 각자의 주문이 같은 테이블에 합산
D) Other (please describe after [Answer]: tag below)

[Answer]: A
