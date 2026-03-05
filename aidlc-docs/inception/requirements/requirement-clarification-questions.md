# 요구사항 명확화 - 추가 질문

답변 분석 중 모순이 감지되어 추가 질문이 필요합니다.

---

## Contradiction 1: 데이터베이스 선택 vs 규모/멀티테넌트

Q3에서 SQLite를 선택하셨고, Q6에서 대규모(다수 매장, 매장당 100개+ 테이블), Q11에서 멀티테넌트를 선택하셨습니다.

SQLite는 단일 파일 기반 DB로 동시 쓰기가 제한됩니다. 대규모 멀티테넌트 환경에서 다수 매장의 동시 주문 처리 시 병목이 발생할 수 있습니다.

### Clarification Question 1
대규모 멀티테넌트 환경을 고려할 때, 데이터베이스 선택을 어떻게 하시겠습니까?

A) PostgreSQL로 변경 - 대규모 동시 접속과 멀티테넌트에 적합
B) MySQL로 변경 - 대규모 환경에서 안정적
C) SQLite 유지 - MVP 단계에서는 SQLite로 시작하고, 규모 확장 시 PostgreSQL로 마이그레이션 (ORM 사용으로 전환 용이하게 설계)
D) Other (please describe after [Answer]: tag below)

[Answer]: A
