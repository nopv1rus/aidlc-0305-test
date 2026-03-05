# 테이블오더 서비스 - 요구사항 명확화 질문

아래 질문들에 대해 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.
선택지가 맞지 않는 경우 마지막 옵션(Other)을 선택하고 설명을 추가해 주세요.

---

## Question 1
프론트엔드(고객용 + 관리자용) 기술 스택으로 어떤 것을 선호하시나요?

A) React + TypeScript
B) Vue.js + TypeScript
C) Next.js (React 기반 풀스택 프레임워크)
D) SvelteKit
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
백엔드 기술 스택으로 어떤 것을 선호하시나요?

A) Node.js + Express + TypeScript
B) Node.js + NestJS + TypeScript
C) Java + Spring Boot
D) Python + FastAPI
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL
C) MongoDB
D) SQLite (개발/소규모 매장용)
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
배포 환경은 어떻게 계획하고 계시나요?

A) AWS 클라우드 (EC2, RDS, S3 등)
B) 로컬 서버 / 온프레미스
C) Docker 컨테이너 기반 (Docker Compose)
D) 아직 미정 - 로컬 개발 환경만 우선 구축
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5
고객용 인터페이스와 관리자용 인터페이스를 어떻게 구성하시겠습니까?

A) 하나의 웹 애플리케이션에서 라우팅으로 분리 (모노리스 프론트엔드)
B) 별도의 웹 애플리케이션으로 분리 (고객용 앱 + 관리자용 앱)
C) 고객용은 모바일 웹, 관리자용은 데스크톱 웹으로 별도 구성
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 6
동시 접속 매장 수 및 테이블 수의 예상 규모는 어느 정도인가요?

A) 소규모 - 단일 매장, 테이블 20개 이하
B) 중규모 - 1~5개 매장, 매장당 테이블 50개 이하
C) 대규모 - 다수 매장, 매장당 테이블 100개 이상
D) MVP 단계에서는 단일 매장만 지원하고 추후 확장
E) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 7
메뉴 이미지 관리는 어떻게 하시겠습니까?

A) 외부 이미지 URL 직접 입력 (별도 이미지 호스팅 사용)
B) 서버에 이미지 파일 업로드 기능 구현
C) MVP에서는 이미지 URL만 지원, 추후 업로드 기능 추가
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 8
관리자 계정 관리는 어떻게 하시겠습니까?

A) 사전 설정된 단일 관리자 계정 (DB에 직접 등록)
B) 관리자 회원가입 기능 포함
C) 슈퍼 관리자가 하위 관리자 계정을 생성하는 방식
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 9
테이블 태블릿의 자동 로그인에서 "테이블 비밀번호"는 어떤 용도인가요?

A) 태블릿 초기 설정 시 관리자가 입력하는 인증 수단 (태블릿-테이블 매핑 확인용)
B) 고객이 테이블에 앉을 때 입력하는 인증 수단
C) 태블릿 분실/도난 시 보안을 위한 장치 잠금용
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10
주문 상태 실시간 업데이트(고객 화면)는 MVP에 포함하시겠습니까?

A) 예 - SSE 또는 WebSocket으로 고객 화면에서도 실시간 상태 업데이트
B) 아니오 - 고객은 페이지 새로고침으로 상태 확인 (관리자 화면만 SSE)
C) 고객 화면은 주기적 폴링(예: 30초)으로 구현
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 11
매장(Store) 데이터 모델에서 하나의 시스템이 여러 매장을 지원해야 하나요?

A) 예 - 멀티테넌트 구조로 여러 매장을 하나의 시스템에서 관리
B) 아니오 - 단일 매장 전용 시스템
C) MVP에서는 단일 매장, 추후 멀티테넌트 확장 가능한 구조
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 12
메뉴 관리 기능은 MVP에 포함하시겠습니까?

A) 예 - 관리자가 메뉴 CRUD(등록/수정/삭제/조회) 가능
B) 아니오 - DB에 직접 데이터 입력, 관리 UI는 추후 구현
C) 조회만 가능하고, 등록/수정/삭제는 추후 구현
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 13: Security Extensions
이 프로젝트에 보안 확장 규칙(SECURITY rules)을 적용하시겠습니까?

A) 예 - 모든 SECURITY 규칙을 blocking constraint로 적용 (프로덕션 수준 애플리케이션에 권장)
B) 아니오 - SECURITY 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
C) Other (please describe after [Answer]: tag below)

[Answer]: E - SECURITY-06(최소 권한 원칙)만 제외하고 나머지 14개 규칙 모두 적용. 로컬 서버 환경이라 클라우드 IAM 없으므로 SECURITY-06은 N/A.
