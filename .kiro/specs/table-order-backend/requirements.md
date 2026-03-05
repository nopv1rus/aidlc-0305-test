# Requirements Document

## Introduction

테이블오더 서비스의 백엔드(Unit1) 요구사항 정의서입니다. 고객용 API와 관리자용 API를 포함하며, 매장 내 테이블에서 고객이 직접 주문하고 관리자가 실시간으로 주문을 모니터링할 수 있는 REST API 서버를 정의합니다.

결제, 알림, 주방 연동, 외부 시스템 연동, OAuth/SNS 로그인, 2FA 등은 MVP 범위에서 제외합니다.

## Glossary

- **Backend**: 테이블오더 서비스의 서버 애플리케이션으로, REST API 및 SSE 엔드포인트를 제공하는 시스템
- **Table_Session**: 특정 테이블에 고객이 앉아 첫 주문을 시작한 시점부터 매장 이용 완료 처리까지의 논리적 단위
- **Admin**: 매장 운영자로, 관리자 인터페이스를 통해 매장을 관리하는 사용자
- **Customer_Tablet**: 테이블에 설치된 태블릿 장치로, 고객이 메뉴 조회 및 주문에 사용하는 클라이언트
- **Auth_Module**: 인증 및 세션 관리를 담당하는 백엔드 모듈
- **Order_Service**: 주문 생성, 조회, 삭제 및 상태 관리를 담당하는 백엔드 모듈
- **Menu_Service**: 메뉴 CRUD 및 카테고리별 조회를 담당하는 백엔드 모듈
- **Table_Service**: 테이블 초기 설정, 세션 관리, 과거 내역 조회를 담당하는 백엔드 모듈
- **SSE_Endpoint**: Server-Sent Events 프로토콜을 사용하여 실시간 주문 데이터를 관리자에게 푸시하는 엔드포인트
- **JWT**: JSON Web Token, 관리자 인증에 사용되는 토큰 기반 인증 방식
- **Order_History**: 테이블 세션 종료 후 과거 이력으로 보관되는 주문 데이터

## Requirements

### Requirement 1: 테이블 태블릿 인증

**User Story:** As a Customer_Tablet, I want 저장된 인증 정보로 자동 로그인하여, so that 고객이 별도 로그인 절차 없이 즉시 주문할 수 있다.

#### Acceptance Criteria

1. WHEN Customer_Tablet이 매장 식별자, 테이블 번호, 테이블 비밀번호를 포함한 로그인 요청을 전송하면, THE Auth_Module SHALL 인증 정보를 검증하고 유효한 세션 토큰을 반환한다.
2. IF 로그인 요청의 매장 식별자 또는 테이블 번호 또는 비밀번호가 유효하지 않으면, THEN THE Auth_Module SHALL HTTP 401 응답과 함께 구체적인 오류 메시지를 반환한다.
3. WHEN 유효한 세션 토큰이 포함된 요청을 수신하면, THE Auth_Module SHALL 해당 요청을 인증된 것으로 처리한다.
4. IF 세션 토큰이 만료되었거나 유효하지 않으면, THEN THE Auth_Module SHALL HTTP 401 응답을 반환하여 재인증을 요구한다.

### Requirement 2: 메뉴 조회 API

**User Story:** As a 고객, I want 카테고리별로 메뉴를 조회하여, so that 원하는 메뉴를 쉽게 찾고 선택할 수 있다.

#### Acceptance Criteria

1. WHEN 인증된 Customer_Tablet이 메뉴 조회 요청을 전송하면, THE Menu_Service SHALL 해당 매장의 전체 메뉴 목록을 카테고리별로 그룹화하여 반환한다.
2. THE Menu_Service SHALL 각 메뉴 항목에 메뉴명, 가격, 설명, 카테고리, 이미지 URL을 포함하여 반환한다.
3. THE Menu_Service SHALL 메뉴 목록을 카테고리 내 노출 순서에 따라 정렬하여 반환한다.
4. IF 해당 매장에 등록된 메뉴가 없으면, THEN THE Menu_Service SHALL 빈 목록을 반환한다.

### Requirement 3: 주문 생성 API

**User Story:** As a 고객, I want 선택한 메뉴를 주문으로 확정하여, so that 매장에 주문을 전달할 수 있다.

#### Acceptance Criteria

1. WHEN 인증된 Customer_Tablet이 주문 메뉴 목록(메뉴 ID, 수량), 매장 식별 정보, 테이블 식별 정보를 포함한 주문 생성 요청을 전송하면, THE Order_Service SHALL 주문을 생성하고 주문 번호를 포함한 응답을 반환한다.
2. WHEN 주문이 생성되면, THE Order_Service SHALL 해당 주문의 상태를 "대기중"으로 설정한다.
3. WHEN 해당 테이블에 활성 Table_Session이 없는 상태에서 첫 주문이 생성되면, THE Order_Service SHALL 새로운 Table_Session을 자동으로 시작한다.
4. THE Order_Service SHALL 주문 생성 시 각 메뉴 항목의 단가와 수량을 기반으로 총 주문 금액을 계산하여 저장한다.
5. IF 주문 요청에 존재하지 않는 메뉴 ID가 포함되어 있으면, THEN THE Order_Service SHALL HTTP 400 응답과 함께 유효하지 않은 메뉴 ID를 명시한 오류 메시지를 반환한다.
6. IF 주문 요청의 수량이 1 미만이면, THEN THE Order_Service SHALL HTTP 400 응답과 함께 유효하지 않은 수량임을 명시한 오류 메시지를 반환한다.
7. WHEN 주문이 성공적으로 생성되면, THE Order_Service SHALL SSE_Endpoint를 통해 해당 매장의 관리자에게 신규 주문 이벤트를 전송한다.

### Requirement 4: 주문 내역 조회 API (고객용)

**User Story:** As a 고객, I want 현재 테이블 세션의 주문 내역을 조회하여, so that 주문 상태와 이력을 확인할 수 있다.

#### Acceptance Criteria

1. WHEN 인증된 Customer_Tablet이 주문 내역 조회 요청을 전송하면, THE Order_Service SHALL 현재 활성 Table_Session에 속한 주문 목록만 반환한다.
2. THE Order_Service SHALL 주문 목록을 주문 시간 순으로 정렬하여 반환한다.
3. THE Order_Service SHALL 각 주문에 주문 번호, 주문 시각, 주문 메뉴 및 수량, 주문 금액, 주문 상태(대기중/준비중/완료)를 포함하여 반환한다.
4. IF 현재 활성 Table_Session이 없으면, THEN THE Order_Service SHALL 빈 주문 목록을 반환한다.

### Requirement 5: 관리자 인증 API

**User Story:** As a Admin, I want 매장 관리 시스템에 안전하게 로그인하여, so that 매장 운영을 관리할 수 있다.

#### Acceptance Criteria

1. WHEN Admin이 매장 식별자, 사용자명, 비밀번호를 포함한 로그인 요청을 전송하면, THE Auth_Module SHALL 인증 정보를 검증하고 JWT 토큰을 반환한다.
2. THE Auth_Module SHALL JWT 토큰의 만료 시간을 16시간으로 설정한다.
3. THE Auth_Module SHALL Admin의 비밀번호를 bcrypt 알고리즘으로 해싱하여 저장한다.
4. IF Admin의 로그인 정보가 유효하지 않으면, THEN THE Auth_Module SHALL HTTP 401 응답과 함께 인증 실패 메시지를 반환한다.
5. IF JWT 토큰이 만료되었으면, THEN THE Auth_Module SHALL HTTP 401 응답을 반환하여 재로그인을 요구한다.
6. WHEN 인증된 Admin 요청을 수신하면, THE Auth_Module SHALL JWT 토큰의 유효성을 검증하고 매장 식별 정보를 추출하여 요청 컨텍스트에 포함한다.

### Requirement 6: 실시간 주문 모니터링 (SSE)

**User Story:** As a Admin, I want 신규 주문을 실시간으로 수신하여, so that 주문을 즉시 확인하고 처리할 수 있다.

#### Acceptance Criteria

1. WHEN 인증된 Admin이 SSE 연결을 요청하면, THE SSE_Endpoint SHALL 해당 매장에 대한 Server-Sent Events 스트림을 개설한다.
2. WHEN 해당 매장에 신규 주문이 생성되면, THE SSE_Endpoint SHALL 2초 이내에 주문 정보(테이블 번호, 주문 번호, 주문 시각, 주문 메뉴 및 수량, 총 금액)를 포함한 이벤트를 전송한다.
3. WHEN 주문 상태가 변경되면, THE SSE_Endpoint SHALL 변경된 주문 상태 정보를 포함한 이벤트를 전송한다.
4. IF SSE 연결이 끊어지면, THEN THE SSE_Endpoint SHALL 클라이언트의 재연결 요청을 수락하고 스트림을 재개한다.
5. WHEN Admin이 SSE 연결 시 초기 데이터를 요청하면, THE SSE_Endpoint SHALL 현재 활성 테이블별 주문 현황 요약을 전송한다.

### Requirement 7: 주문 상태 관리 API

**User Story:** As a Admin, I want 주문 상태를 변경하여, so that 주문 처리 진행 상황을 관리할 수 있다.

#### Acceptance Criteria

1. WHEN 인증된 Admin이 주문 상태 변경 요청을 전송하면, THE Order_Service SHALL 해당 주문의 상태를 요청된 값(대기중/준비중/완료)으로 변경한다.
2. WHEN 주문 상태가 변경되면, THE Order_Service SHALL SSE_Endpoint를 통해 상태 변경 이벤트를 전송한다.
3. IF 존재하지 않는 주문 번호로 상태 변경 요청이 전송되면, THEN THE Order_Service SHALL HTTP 404 응답과 함께 오류 메시지를 반환한다.

### Requirement 8: 테이블 관리 API

**User Story:** As a Admin, I want 테이블을 설정하고 세션을 관리하여, so that 테이블별 고객 이용을 효율적으로 운영할 수 있다.

#### Acceptance Criteria

1. WHEN 인증된 Admin이 테이블 번호와 테이블 비밀번호를 포함한 테이블 초기 설정 요청을 전송하면, THE Table_Service SHALL 해당 매장에 테이블을 등록한다.
2. WHEN 인증된 Admin이 특정 주문의 삭제 요청을 전송하면, THE Order_Service SHALL 해당 주문을 삭제하고 테이블의 총 주문액을 재계산한다.
3. WHEN 주문이 삭제되면, THE Order_Service SHALL SSE_Endpoint를 통해 주문 삭제 이벤트를 전송한다.
4. WHEN 인증된 Admin이 테이블 이용 완료 요청을 전송하면, THE Table_Service SHALL 해당 Table_Session을 종료하고 세션 내 주문 내역을 Order_History로 이동한다.
5. WHEN Table_Session이 종료되면, THE Table_Service SHALL 해당 테이블의 현재 주문 목록과 총 주문액을 0으로 초기화한다.
6. WHEN Table_Session이 종료되면, THE Table_Service SHALL SSE_Endpoint를 통해 테이블 초기화 이벤트를 전송한다.
7. IF 존재하지 않는 테이블 번호로 요청이 전송되면, THEN THE Table_Service SHALL HTTP 404 응답과 함께 오류 메시지를 반환한다.

### Requirement 9: 과거 주문 내역 조회 API

**User Story:** As a Admin, I want 테이블별 과거 주문 내역을 조회하여, so that 이전 고객의 주문 이력을 확인할 수 있다.

#### Acceptance Criteria

1. WHEN 인증된 Admin이 특정 테이블의 과거 주문 내역 조회 요청을 전송하면, THE Table_Service SHALL 해당 테이블의 Order_History 목록을 시간 역순으로 반환한다.
2. THE Table_Service SHALL 각 Order_History 항목에 주문 번호, 주문 시각, 메뉴 목록, 총 금액, 매장 이용 완료 시각을 포함하여 반환한다.
3. WHEN 날짜 필터 파라미터가 포함된 요청을 수신하면, THE Table_Service SHALL 해당 날짜 범위에 해당하는 Order_History만 반환한다.
4. IF 해당 테이블에 과거 주문 내역이 없으면, THEN THE Table_Service SHALL 빈 목록을 반환한다.

### Requirement 10: 메뉴 CRUD API

**User Story:** As a Admin, I want 메뉴를 등록, 수정, 삭제하여, so that 매장 메뉴를 동적으로 관리할 수 있다.

#### Acceptance Criteria

1. WHEN 인증된 Admin이 메뉴명, 가격, 설명, 카테고리, 이미지 URL을 포함한 메뉴 등록 요청을 전송하면, THE Menu_Service SHALL 새 메뉴를 등록하고 생성된 메뉴 정보를 반환한다.
2. WHEN 인증된 Admin이 메뉴 수정 요청을 전송하면, THE Menu_Service SHALL 해당 메뉴의 정보를 업데이트하고 수정된 메뉴 정보를 반환한다.
3. WHEN 인증된 Admin이 메뉴 삭제 요청을 전송하면, THE Menu_Service SHALL 해당 메뉴를 삭제한다.
4. WHEN 인증된 Admin이 메뉴 노출 순서 변경 요청을 전송하면, THE Menu_Service SHALL 해당 메뉴의 카테고리 내 노출 순서를 업데이트한다.
5. IF 메뉴 등록 또는 수정 요청에 필수 필드(메뉴명, 가격, 카테고리)가 누락되면, THEN THE Menu_Service SHALL HTTP 400 응답과 함께 누락된 필드를 명시한 오류 메시지를 반환한다.
6. IF 메뉴 등록 또는 수정 요청의 가격이 0 미만이면, THEN THE Menu_Service SHALL HTTP 400 응답과 함께 유효하지 않은 가격임을 명시한 오류 메시지를 반환한다.
7. IF 존재하지 않는 메뉴 ID로 수정 또는 삭제 요청이 전송되면, THEN THE Menu_Service SHALL HTTP 404 응답과 함께 오류 메시지를 반환한다.
