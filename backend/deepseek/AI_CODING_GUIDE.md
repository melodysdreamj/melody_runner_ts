# AI 코딩 가이드: DeepSeek Integration

이 모듈은 **DeepSeek API**를 사용하여 고성능 LLM인 DeepSeek 모델(`V3`, `R1` 등)을 호출하는 기능을 제공합니다.
OpenAI SDK 호환 방식을 사용하여 구현되었습니다.

## Features

*   **OpenAI SDK Compatible**: `openai` 라이브러리를 사용하되 `baseURL`을 DeepSeek로 변경하여 호출.
*   **Cost Effective**: 저렴한 비용으로 고성능 추론 제공.
*   **Reasoning Model**: `R1` 모델을 통해 추론(Reasoning) 능력 활용 가능.

## Function List

각 모델별 폴더(`ModelName`)의 `_.ts`에서 제공하는 함수입니다.

### 1. DeepSeek V3 (`v3`)
*   `async requestDeepseekV3Chat(question)`: 범용 채팅 모델(V3) 호출.

### 2. DeepSeek R1 (`r1`)
*   `async requestDeepseekR1Chat(question)`: 추론 특화 모델(R1) 호출.

## Usage

### DeepSeek V3 호출

```typescript
import { requestDeepseekV3Chat } from "./v3/_.ts";

const result = await requestDeepseekV3Chat("Write a merge sort in Python");
console.log(result);
```

### DeepSeek R1 호출 (Reasoning)

```typescript
import { requestDeepseekR1Chat } from "./r1/_.ts";

const result = await requestDeepseekR1Chat("Solve this logic puzzle...");
console.log(result);
```

### 환경 변수 설정 (.env)

```env
DEEPSEEK_API_KEY=...
```
