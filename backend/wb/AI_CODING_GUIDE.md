# AI 코딩 가이드: W&B Inference Integration

이 모듈은 **W&B (Weights & Biases) Inference API**를 사용하여 다양한 오픈소스 AI 모델과 상호작용하는 기능을 제공합니다.
`openai` SDK와 호환되는 API를 통해 Qwen 등의 고성능 모델을 쉽게 통합합니다.

## Features

*   **OpenAI Compatibility**: `openai` 공식 Node.js 패키지를 사용하여 W&B Inference 엔드포인트와 통신.
*   **Streaming Support**: 대규모 응답을 위한 스트리밍(Stream) 처리 기본 지원.
*   **Model Specific**: 모델(Qwen 3 235B 등)별로 최적화된 호출 함수 제공.

## Function List

각 폴더(`Category` 또는 `ModelName`)의 `_.ts`에서 제공하는 주요 함수들입니다.

### 1. Qwen/Qwen3-235B-A22B-Instruct-2507 (`qwen3_235b_instruct_2507`)
*   `async requestQwenChat(question: string, systemPrompt?: string)`: 질문에 대한 스트리밍 응답을 처리하고 전체 텍스트를 반환하거나, 스트림 객체를 반환합니다.

## Usage

### 1. 기본 채팅 (Qwen 3 235B)

```typescript
import { requestQwenChat } from "./qwen3_235b_instruct_2507/_.ts";

// 전체 응답 텍스트 받기 (Non-streaming wrapper)
const answer = await requestQwenChat("TypeScript의 장점은?");
console.log(answer);
```

### 환경 변수 설정 (.env)

```env
WANDB_API_KEY=...
```

## Implementation Notes
*   **Base URL**: `https://api.inference.wandb.ai/v1`
*   **Model ID**: `Qwen/Qwen3-235B-A22B-Instruct-2507`
