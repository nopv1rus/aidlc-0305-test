# 유닛별 AI 프롬프트

각 담당자가 AI에게 줄 프롬프트입니다. 해당 프롬프트를 복사해서 사용하세요.

---

## Unit 1: Backend API Server 담당자 프롬프트

```
나는 테이블오더 서비스의 Unit 1 (Backend API Server) 담당자야.
아래 파일들을 참조해서 AI-DLC 워크플로우의 CONSTRUCTION PHASE를 진행해줘.

## 참조 파일 (반드시 읽어)
- aidlc-docs/inception/requirements/requirements.md (전체 요구사항)
- aidlc-docs/inception/user-stories/stories.md (전체 스토리 44개)
- aidlc-docs/inception/application-design/components.md (컴포넌트 정의)
- aidlc-docs/inception/application-design/component-methods.md (메서드 시그니처)
- aidlc-docs/inception/application-design/services.md (서비스 플로우)
- aidlc-docs/inception/application-design/component-dependency.md (의존성)
- aidlc-docs/inception/application-design/unit-of-work.md (유닛 정의)
- aidlc-docs/inception/application-design/unit-of-work-dependency.md (유닛 간 의존성)
- aidlc-docs/inception/application-design/unit-of-work-story-map.md (스토리 매핑)

## 내 담당 범위
- 브랜치: unit-1/backend-api
- 디렉토리: server/, shared/, 루트 설정 파일 (package.json, docker-compose.yml, tsconfig.json)
- 기술: NestJS + TypeScript + PostgreSQL + SSE
- 모든 스토리(44개)의 백엔드 API 부분 담당

## 절대 건드리지 마
- apps/customer/ (Unit 2 담당)
- apps/admin/ (Unit 3 담당)

## 보안 규칙
- SECURITY-06만 제외, 나머지 14개 규칙 모두 적용
- 보안 규칙 상세: .kiro/aws-aidlc-rule-details/extensions/security/baseline/security-baseline.md

## 중요
- shared/types/에 프론트엔드(Unit 2, 3)가 참조할 공유 타입을 반드시 정의해줘
- API 엔드포인트 스펙을 명확하게 만들어줘 (Unit 2, 3가 이걸 보고 개발함)
- Functional Design → NFR Requirements → NFR Design → Code Generation 순서로 진행
```

---

## Unit 2: Customer Frontend 담당자 프롬프트

```
나는 테이블오더 서비스의 Unit 2 (Customer Frontend) 담당자야.
아래 파일들을 참조해서 AI-DLC 워크플로우의 CONSTRUCTION PHASE를 진행해줘.

## 참조 파일 (반드시 읽어)
- aidlc-docs/inception/requirements/requirements.md (전체 요구사항)
- aidlc-docs/inception/user-stories/stories.md (내 스토리: US-C01 ~ US-C19)
- aidlc-docs/inception/application-design/components.md (Customer App 컴포넌트)
- aidlc-docs/inception/application-design/unit-of-work.md (유닛 정의)
- aidlc-docs/inception/application-design/unit-of-work-dependency.md (Unit 1 API 의존성)
- aidlc-docs/inception/application-design/unit-of-work-story-map.md (내 스토리 매핑)

## 내 담당 범위
- 브랜치: unit-2/customer-app
- 디렉토리: apps/customer/
- 기술: React + TypeScript
- 스토리: US-C01 ~ US-C19 (고객 스토리 19개)의 프론트엔드 UI 부분

## 절대 건드리지 마
- server/ (Unit 1 담당)
- shared/ (Unit 1 담당, 읽기만 가능)
- apps/admin/ (Unit 3 담당)

## 보안 규칙
- SECURITY-06만 제외, 나머지 14개 규칙 모두 적용
- 프론트엔드 관련: SECURITY-04(보안 헤더), SECURITY-05(입력 검증/XSS), SECURITY-09(에러 노출 금지), SECURITY-10(의존성 고정), SECURITY-13(SRI)
- 보안 규칙 상세: .kiro/aws-aidlc-rule-details/extensions/security/baseline/security-baseline.md

## 중요
- 모바일 퍼스트 (QR코드 스캔 → 모바일 브라우저 접속)
- shared/types/의 공유 타입을 import해서 사용
- Unit 1 API가 아직 없으면 Mock으로 개발하고, merge 후 실제 API로 전환
- Functional Design → NFR Requirements → NFR Design → Code Generation 순서로 진행
```

---

## Unit 3: Admin Frontend 담당자 프롬프트

```
나는 테이블오더 서비스의 Unit 3 (Admin Frontend) 담당자야.
아래 파일들을 참조해서 AI-DLC 워크플로우의 CONSTRUCTION PHASE를 진행해줘.

## 참조 파일 (반드시 읽어)
- aidlc-docs/inception/requirements/requirements.md (전체 요구사항)
- aidlc-docs/inception/user-stories/stories.md (내 스토리: US-A01~US-A19, US-A09-1, US-S01~US-S05)
- aidlc-docs/inception/application-design/components.md (Admin App 컴포넌트)
- aidlc-docs/inception/application-design/unit-of-work.md (유닛 정의)
- aidlc-docs/inception/application-design/unit-of-work-dependency.md (Unit 1 API 의존성)
- aidlc-docs/inception/application-design/unit-of-work-story-map.md (내 스토리 매핑)

## 내 담당 범위
- 브랜치: unit-3/admin-app
- 디렉토리: apps/admin/
- 기술: React + TypeScript
- 스토리: US-A01~US-A19, US-A09-1 (매장 관리자 20개) + US-S01~US-S05 (슈퍼 관리자 5개) = 총 25개의 프론트엔드 UI 부분

## 절대 건드리지 마
- server/ (Unit 1 담당)
- shared/ (Unit 1 담당, 읽기만 가능)
- apps/customer/ (Unit 2 담당)

## 보안 규칙
- SECURITY-06만 제외, 나머지 14개 규칙 모두 적용
- 프론트엔드 관련: SECURITY-04(보안 헤더), SECURITY-05(입력 검증/XSS), SECURITY-09(에러 노출 금지), SECURITY-10(의존성 고정), SECURITY-13(SRI)
- 보안 규칙 상세: .kiro/aws-aidlc-rule-details/extensions/security/baseline/security-baseline.md

## 중요
- 데스크톱 최적화 (관리자는 PC에서 사용)
- 슈퍼 관리자 기능도 이 앱 안에 포함 (역할 기반 분기)
- shared/types/의 공유 타입을 import해서 사용
- Unit 1 API가 아직 없으면 Mock으로 개발하고, merge 후 실제 API로 전환
- Functional Design → NFR Requirements → NFR Design → Code Generation 순서로 진행
```
