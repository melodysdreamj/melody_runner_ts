# 백엔드 모듈 제작 가이드 (Backend Module Creation Guide)

이 문서는 `backend` 디렉토리에 새로운 모듈을 추가할 때 따라야 할 **표준 절차와 규칙**을 정의합니다.
백엔드 모듈은 크게 **데이터베이스형(Persistence)**과 **함수형(Functional/API)**으로 나뉩니다.

---

## 1. 모듈 유형 (Module Types)

| 유형 | 설명 | 예시 |
| :--- | :--- | :--- |
| **데이터베이스형 (DB)** | 데이터를 저장, 조회, 관리하는 영속성 계층 | PostgreSQL, DynamoDB, MariaDB, Qdrant |
| **함수형 (Functional)** | 외부 API 호출, 유틸리티 로직, AI 모델 연동 | OpenAI, DeepL, Hashing, S3/R2 |

> **검증 전략**: 두 유형 모두 `note/_.ts` 연습장에서 **실제 실행**으로 검증합니다.

---

## 2. 공통 표준 구조 (Common Structure)

모든 백엔드 모듈은 아래의 폴더 구조를 따릅니다.

```
backend/<module_name>/
├── AI_CODING_GUIDE.md     <-- [필수] 해당 모듈의 "헌법" (Local Laws)
├── <feature>/             <-- 기능 단위 폴더 (예: user, chat)
│   ├── _.ts               <-- 진입점 (Entry Point)
│   └── note/
│       └── _.ts           <-- [필수] 실행 연습장 (Playground = 검증)
```

---

## 3. 데이터베이스형 모듈 제작 가이드 (DB Type)

### 단계별 절차
1.  **폴더 생성**: `backend/<db_name>` (예: `backend/redis`)
2.  **가이드 작성 (`AI_CODING_GUIDE.md`)**:
    *   기존 `postgresql` 또는 `client-dynamodb` 가이드를 복사하여 수정합니다.
    *   **필수 포함**: 데이터 모델링 규칙, 직렬화(`toDataString`, `fromDataString`) 규칙.
3.  **검증 (`note/_.ts`)**:
    *   실제 DB에 연결하여 **CRUD** 동작을 눈으로 확인합니다.

---

## 4. 함수형 모듈 제작 가이드 (Functional Type)

### 단계별 절차
1.  **폴더 생성**: `backend/<service_name>` (예: `backend/slack_notifier`)
2.  **가이드 작성 (`AI_CODING_GUIDE.md`)**:
    *   **"사용 설명서(Manual)"** 작성을 목표로 합니다. 단순한 파일 구조 나열은 지양합니다.
    *   **Function List**: 이 모듈이 `export` 하는 핵심 함수들과 그 역할을 나열해야 합니다.
    *   **Usage**: 각 함수를 사용하는 방법(파라미터, 반환값)을 예제 코드(`note/_.ts` 활용)와 함께 주석처럼 달아둡니다.
    *   **Features**: 이 모듈이 제공하는 구체적인 기능과 목적을 서술합니다.
3.  **검증 (`note/_.ts`)**:
    *   실제 API를 호출하여 응답이 올바른지 눈으로 확인합니다.

---

## 5. 실행 연습장 (`note/_.ts`)

**`note/_.ts`는 모든 모듈의 검증 수단**입니다. 실제 서비스(DB든 API든)에 연결하여 동작을 눈으로 확인합니다.
*   반드시 `IIFE` 패턴과 `process.exit(0)`를 사용하여 깔끔하게 종료되어야 합니다.

```typescript
// note/_.ts pattern
import dotenv from "dotenv";
import { myFunction } from "../_";

dotenv.config();

;(async () => {
    console.log("Start Playground...");
    const res = await myFunction();
    console.log("Result:", res);
    process.exit(0);
})();
```

> **필수**: `note/_.ts`는 독립 실행 진입점이므로 반드시 `dotenv.config()`를 호출해야 합니다.
> Backend 구현 파일(`_.ts`)에서는 `dotenv.config()` 호출이 **금지**됩니다. 자세한 내용은 [RULES.md](../RULES.md)의 §4를 참고하세요.
