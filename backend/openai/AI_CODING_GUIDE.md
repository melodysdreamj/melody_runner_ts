# AI 코딩 가이드: OpenAI Integration

이 모듈은 **OpenAI API**를 사용하여 GPT 모델과 상호작용하는 기능을 제공합니다.
단순 채팅(`gpt_4o_mini`)부터 구조화된 출력(`gpt_4o_parsed`)까지 모델별/목적별로 세분화된 기능을 제공합니다.

## Features

*   **Official SDK**: `openai` 공식 Node.js 패키지 사용.
*   **Structured Output**: Zod를 사용한 JSON 스키마 강제 출력 지원 (`gpt_4o_parsed`).
*   **Model Specific**: 모델(GPT-4o Mini 등)별로 최적화된 호출 함수 제공.

## Function List

각 폴더(`Category` 또는 `ModelName`)의 `_.ts`에서 제공하는 주요 함수들입니다.

### 1. GPT-4o Mini (`gpt_4o_mini`)
*   `async requestGpt4oChat(question)`: 단순 질문에 대한 텍스트 응답을 반환합니다.

### 2. GPT-4o Parsed (`gpt_4o_parsed`)
*   `async requestGpt4oParsed(question)`: 지정된 JSON 스키마(Zod)에 맞춰 구조화된 데이터를 반환합니다. (내부 구현에 따라 스키마가 다를 수 있으므로 `_.ts` 확인 필요)

## Usage

### 1. 단순 채팅 (GPT-4o Mini)

```typescript
import { requestGpt4oChat } from "./gpt_4o_mini/_.ts";

const answer = await requestGpt4oChat("What is TypeScript?");
console.log(answer);
```

### 2. 구조화된 출력 (GPT-4o Parsed)

```typescript
import { requestGpt4oParsed } from "./gpt_4o_parsed/_.ts";

const result = await requestGpt4oParsed("Extract names: John, Sarah");
// Result type depends on the internal Zod schema (e.g., { names: ["John", "Sarah"] })
console.log(result);
```

### 환경 변수 설정 (.env)

```env
OPENAI_API_KEY=...
```
