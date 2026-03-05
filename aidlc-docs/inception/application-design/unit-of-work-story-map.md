# 테이블오더 서비스 - Unit of Work Story Map

## 스토리-유닛 매핑 개요

모든 44개 스토리가 3개 유닛에 매핑됩니다.
- 각 스토리의 **백엔드 API** 부분은 Unit 1에 포함
- 각 스토리의 **프론트엔드 UI** 부분은 해당 유닛(Unit 2 또는 Unit 3)에 포함

---

## Unit 1: Backend API Server

**총 스토리**: 44개 (모든 스토리의 백엔드 API 부분)

| 스토리 ID | 스토리 제목 | 우선순위 | 백엔드 담당 모듈 |
|-----------|------------|:--------:|----------------|
| US-C01 | QR코드 스캔으로 주문 페이지 접속 | P0 | Auth, Session |
| US-C02 | 고객 세션 유지 | P0 | Session |
| US-C03 | 동시 접속 시 테이블 세션 공유 | P1 | Session |
| US-C04 | 카테고리별 메뉴 목록 조회 | P0 | Menu |
| US-C05 | 메뉴 상세 정보 확인 | P0 | Menu |
| US-C06 | 카테고리 간 빠른 이동 | P1 | Menu |
| US-C07 | 메뉴를 장바구니에 추가 | P0 | (프론트엔드 전용) |
| US-C08 | 장바구니 메뉴 수량 조절 | P0 | (프론트엔드 전용) |
| US-C09 | 장바구니에서 메뉴 삭제 | P0 | (프론트엔드 전용) |
| US-C10 | 장바구니 총 금액 실시간 확인 | P0 | (프론트엔드 전용) |
| US-C11 | 장바구니 비우기 | P1 | (프론트엔드 전용) |
| US-C12 | 장바구니 데이터 로컬 유지 | P1 | (프론트엔드 전용) |
| US-C13 | 주문 내역 최종 확인 | P0 | (프론트엔드 전용) |
| US-C14 | 주문 확정 및 전송 | P0 | Order, Session, Menu, SSE |
| US-C15 | 주문 성공 후 피드백 | P0 | Order |
| US-C16 | 주문 실패 시 에러 처리 | P0 | Order |
| US-C17 | 현재 세션 주문 목록 조회 | P0 | Order |
| US-C18 | 주문별 상세 정보 확인 | P0 | Order |
| US-C19 | 주문 상태 실시간 업데이트 수신 | P0 | SSE |
| US-A01 | 관리자 로그인 | P0 | Auth |
| US-A02 | 관리자 세션 유지 | P0 | Auth, Session |
| US-A03 | 로그인 시도 제한 | P1 | Auth |
| US-A04 | 테이블별 주문 대시보드 조회 | P0 | Order, Table |
| US-A05 | 신규 주문 실시간 수신 | P0 | SSE |
| US-A06 | 주문 상세 정보 확인 | P0 | Order |
| US-A07 | 주문 상태 변경 | P0 | Order, SSE |
| US-A08 | 테이블별 필터링 | P2 | Order, Table |
| US-A09 | 테이블 등록 | P0 | Table |
| US-A09-1 | 테이블 목록 조회 | P0 | Table |
| US-A10 | 테이블별 QR코드 생성 및 다운로드 | P0 | Table |
| US-A11 | 주문 취소 | P0 | Order, SSE |
| US-A12 | 테이블 이용 완료 처리 | P0 | Session, Order |
| US-A13 | 과거 주문 내역 조회 | P1 | Order |
| US-A14 | 메뉴 목록 조회 | P0 | Menu |
| US-A15 | 메뉴 등록 | P0 | Menu |
| US-A16 | 메뉴 수정 | P0 | Menu |
| US-A17 | 메뉴 삭제 | P0 | Menu |
| US-A18 | 메뉴 노출 순서 조정 | P2 | Menu |
| US-A19 | 메뉴 뱃지 설정 | P2 | Menu |
| US-S01 | 슈퍼 관리자 로그인 | P0 | Auth |
| US-S02 | 매장 관리자 계정 생성 | P0 | Admin, Auth |
| US-S03 | 매장 관리자 계정 목록 조회 | P1 | Admin |
| US-S04 | 매장 등록 | P0 | Store, Admin |
| US-S05 | 매장 목록 조회 | P1 | Store |

> **참고**: 장바구니 관련 스토리(US-C07~C13)는 localStorage 기반으로 프론트엔드 전용이지만, 주문 생성(US-C14) 시 백엔드 API를 호출합니다.

---

## Unit 2: Customer Frontend

**총 스토리**: 19개 (고객 스토리 전체의 프론트엔드 UI 부분)

| 스토리 ID | 스토리 제목 | 우선순위 | 주요 컴포넌트 |
|-----------|------------|:--------:|--------------|
| US-C01 | QR코드 스캔으로 주문 페이지 접속 | P0 | 라우팅, 토큰 파싱 |
| US-C02 | 고객 세션 유지 | P0 | 세션 관리 훅 |
| US-C03 | 동시 접속 시 테이블 세션 공유 | P1 | 세션 관리 훅 |
| US-C04 | 카테고리별 메뉴 목록 조회 | P0 | MenuPage, CategoryTabs |
| US-C05 | 메뉴 상세 정보 확인 | P0 | MenuDetailModal |
| US-C06 | 카테고리 간 빠른 이동 | P1 | CategoryTabs |
| US-C07 | 메뉴를 장바구니에 추가 | P0 | CartBadge, useCart 훅 |
| US-C08 | 장바구니 메뉴 수량 조절 | P0 | CartPage |
| US-C09 | 장바구니에서 메뉴 삭제 | P0 | CartPage |
| US-C10 | 장바구니 총 금액 실시간 확인 | P0 | CartPage |
| US-C11 | 장바구니 비우기 | P1 | CartPage |
| US-C12 | 장바구니 데이터 로컬 유지 | P1 | useCart 훅 (localStorage) |
| US-C13 | 주문 내역 최종 확인 | P0 | OrderConfirmPage |
| US-C14 | 주문 확정 및 전송 | P0 | OrderConfirmPage |
| US-C15 | 주문 성공 후 피드백 | P0 | OrderSuccessPage |
| US-C16 | 주문 실패 시 에러 처리 | P0 | 에러 핸들링 컴포넌트 |
| US-C17 | 현재 세션 주문 목록 조회 | P0 | OrderHistoryPage |
| US-C18 | 주문별 상세 정보 확인 | P0 | OrderHistoryPage |
| US-C19 | 주문 상태 실시간 업데이트 수신 | P0 | SSE 클라이언트 훅 |

---

## Unit 3: Admin Frontend

**총 스토리**: 25개 (매장 관리자 20개 + 슈퍼 관리자 5개의 프론트엔드 UI 부분)

| 스토리 ID | 스토리 제목 | 우선순위 | 주요 컴포넌트 |
|-----------|------------|:--------:|--------------|
| US-A01 | 관리자 로그인 | P0 | LoginPage |
| US-A02 | 관리자 세션 유지 | P0 | Auth 훅 |
| US-A03 | 로그인 시도 제한 | P1 | LoginPage (에러 표시) |
| US-A04 | 테이블별 주문 대시보드 조회 | P0 | DashboardPage |
| US-A05 | 신규 주문 실시간 수신 | P0 | DashboardPage, SSE 클라이언트 |
| US-A06 | 주문 상세 정보 확인 | P0 | TableDetailModal |
| US-A07 | 주문 상태 변경 | P0 | TableDetailModal |
| US-A08 | 테이블별 필터링 | P2 | DashboardPage |
| US-A09 | 테이블 등록 | P0 | TableManagementPage |
| US-A09-1 | 테이블 목록 조회 | P0 | TableManagementPage |
| US-A10 | 테이블별 QR코드 생성 및 다운로드 | P0 | TableManagementPage |
| US-A11 | 주문 취소 | P0 | TableDetailModal |
| US-A12 | 테이블 이용 완료 처리 | P0 | DashboardPage |
| US-A13 | 과거 주문 내역 조회 | P1 | OrderHistoryPage |
| US-A14 | 메뉴 목록 조회 | P0 | MenuManagementPage |
| US-A15 | 메뉴 등록 | P0 | MenuManagementPage |
| US-A16 | 메뉴 수정 | P0 | MenuManagementPage |
| US-A17 | 메뉴 삭제 | P0 | MenuManagementPage |
| US-A18 | 메뉴 노출 순서 조정 | P2 | MenuManagementPage |
| US-A19 | 메뉴 뱃지 설정 | P2 | MenuManagementPage |
| US-S01 | 슈퍼 관리자 로그인 | P0 | LoginPage (역할 분기) |
| US-S02 | 매장 관리자 계정 생성 | P0 | SuperAdminPage |
| US-S03 | 매장 관리자 계정 목록 조회 | P1 | SuperAdminPage |
| US-S04 | 매장 등록 | P0 | SuperAdminPage |
| US-S05 | 매장 목록 조회 | P1 | SuperAdminPage |

---

## 유닛별 스토리 요약

| 유닛 | 총 스토리 | P0 | P1 | P2 |
|------|:---------:|:--:|:--:|:--:|
| Unit 1 (Backend) | 44 (전체) | 33 | 8 | 3 |
| Unit 2 (Customer) | 19 | 15 | 4 | 0 |
| Unit 3 (Admin) | 25 | 18 | 4 | 3 |

> **참고**: Unit 1은 모든 스토리의 백엔드 부분을 담당하므로 44개 전체가 매핑됩니다. Unit 2/3는 각각 프론트엔드 UI 부분만 담당합니다.

---

## 스토리 커버리지 검증

- 전체 스토리: 44개
- Unit 1 매핑: 44개 ✅
- Unit 2 매핑: 19개 (US-C01 ~ US-C19) ✅
- Unit 3 매핑: 25개 (US-A01 ~ US-A19, US-A09-1, US-S01 ~ US-S05) ✅
- 미매핑 스토리: 0개 ✅
