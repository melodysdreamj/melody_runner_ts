# AI 코딩 가이드: Cloudflare AI Gateway

이 모듈은 **Cloudflare AI Gateway**를 경유하여 다양한 AI Provider(Google, OpenAI, Anthropic 등)의 모델을 통합 호출하는 기능을 제공합니다.
각 모델은 독립적인 함수로 구현되어 있으며, Cloudflare Gateway를 통해 로깅, 캐싱, 속도 제한 등의 이점을 활용합니다.

## Features

*   **Gateway Integration**: Cloudflare AI Gateway 경유를 통해 비용 절감 및 모니터링.
*   **Multi-Provider Support**: Google Gemini, OpenAI GPT 등 다양한 Provider 지원.
*   **Dedicated Functions**: 각 모델별로 독립된 폴더와 진입점(`_.ts`)을 제공하여 명확한 관리.

## Function List

각 모델별 폴더(`Provider`_`Category`_`ModelName`) 내의 `_.ts` 파일에서 호출 함수를 export 합니다.
현재 사용 가능한 주요 모델(예시)은 다음과 같습니다:

1.  `google_ai_gemini_20_flash` -> `requestCloudflareGatewayGemini20Flash(prompt)`
2.  `openrouter_gemini_20_flash` -> `requestOpenRouterGemini20Flash(prompt)`
3.  `wb_qwen3_235b_instruct_2507` -> `requestCloudflareGatewayWbQwen3(question)`

(새로운 모델이 추가될 때마다 해당 폴더의 `_.ts`를 확인하세요.)

## Usage

특정 모델을 사용하려면 해당 폴더의 `_.ts`에서 함수를 import 합니다.

### Gemini 2.0 Flash (via Cloudflare Gateway)

```typescript
import { requestCloudflareGatewayGemini20Flash } from "./google_ai_gemini_20_flash/_.ts";

const result = await requestCloudflareGatewayGemini20Flash("Explain Quantum Physics");
console.log(result); // "Quantum physics is..."
```

### 환경 변수 설정 (.env)

Cloudflare Gateway 및 각 Provider 연동을 위한 환경 변수가 필요합니다.

```env
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_GATEWAY_NAME=...
GOOGLE_STUDIO_API_KEY=... (for Google Models)
OPENROUTER_API_KEY=... (for OpenRouter Models)
WANDB_API_KEY=... (for W&B Models)
```
