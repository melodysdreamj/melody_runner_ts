# AI 코딩 가이드: OpenRouter Integration

이 모듈은 **OpenRouter API**를 사용하여 전 세계의 다양한 LLM(Claude, GPT, Llama, Mistral 등)을 통합 호출하는 기능을 제공합니다.
OpenAI SDK 호환 방식을 사용하므로 사용법이 일관적입니다.

## Features

*   **Model Aggregator**: 하나의 API Key로 수십 개의 AI 모델 사용 가능.
*   **OpenAI SDK Compatible**: `baseURL`을 OpenRouter로 설정하여 쉽게 연동.
*   **Diverse Models**: Claude 3.5 Sonnet, Gemini 2.0, DeepSeek V3 등 최신 모델 지원.

## Function List

각 모델별 폴더(`ModelName`)의 `_.ts`에서 제공하는 함수입니다. 폴더명은 모델을 식별하기 쉽게 `snake_case`로 되어 있습니다.

### 주요 모델 (예시)
*   **Claude 3.5 Sonnet** (`claude_3_5_sonnet`): `requestOpenRouterClaude35Sonnet`
*   **Gemini 2.0 Flash** (`gemini_2_0_flash`): `requestOpenRouterGemini20Flash`
*   **DeepSeek V3** (`deepseek_v3`): `requestOpenRouterDeepseekV3`
*   **o3 Mini** (`o3_mini`): `requestOpenRouterO3Mini`

(더 많은 모델은 폴더 목록을 확인하세요.)

## Usage

### Claude 3.5 Sonnet 호출

```typescript
import { requestOpenRouterClaude35Sonnet } from "./claude_3_5_sonnet/_.ts";

const result = await requestOpenRouterClaude35Sonnet("Analyze this code...");
console.log(result);
```

### 환경 변수 설정 (.env)

```env
OPENROUTER_API_KEY=...
```
