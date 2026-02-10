# AI 코딩 가이드: Google Gemini Integration

이 모듈은 **Google Generative AI SDK**를 사용하여 Gemini 모델을 호출하는 기능을 제공합니다.
텍스트 생성(`flash_2_0`) 및 JSON 구조화 출력(`flash_2_0_json`) 등 다양한 모드를 지원합니다.

## Features

*   **Official SDK**: `@google/generative-ai` 사용.
*   **JSON Mode**: JSON MIME Type 설정을 통해 확실한 JSON 출력 보장 (`flash_2_0_json`).
*   **Latest Models**: Gemini 2.0 Flash 등 최신 모델 지원.

## Function List

각 모델별 폴더의 `_.ts`에서 제공하는 함수입니다.

### 1. Gemini 2.0 Flash (`flash_2_0`)
*   `async requestGemini20Flash(prompt)`: 일반 텍스트 생성.

### 2. Gemini 2.0 Flash JSON (`flash_2_0_json`)
*   `async requestGemini20FlashJson(prompt)`: JSON 형식 문자열 반환.

## Usage

### 일반 텍스트 생성

```typescript
import { requestGemini20Flash } from "./flash_2_0/_.ts";

const text = await requestGemini20Flash("Tell me a joke");
console.log(text);
```

### JSON 생성

```typescript
import { requestGemini20FlashJson } from "./flash_2_0_json/_.ts";

const jsonString = await requestGemini20FlashJson("List 5 fruits in JSON format");
console.log(JSON.parse(jsonString));
```

### 환경 변수 설정 (.env)

```env
GEMINI_API_KEY=...
```
