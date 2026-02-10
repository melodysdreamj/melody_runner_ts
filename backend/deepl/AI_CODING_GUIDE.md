# AI 코딩 가이드: DeepL Translate

이 모듈은 **DeepL API**를 사용하여 고품질 텍스트 번역 기능을 제공합니다.
`axios`를 통해 HTTP 요청을 직접 수행하며, 환경 변수에서 API Key를 관리합니다.

## Features

*   **High Quality Translation**: DeepL의 신경망 번역 엔진 사용.
*   **Secure Request**: API Key 및 파라미터를 안전하게 전송.
*   **Simple Interface**: 복잡한 옵션 없이 `from`, `to` 언어 설정만으로 번역 수행.

## Function List

이 모듈(`_.ts`)에서 export하는 `DeepL` 클래스의 주요 함수입니다.

1.  `static async translate(text, fromLang, toLang)`

## Usage

### 텍스트 번역 (`translate`)

```typescript
import { DeepL } from "./_.ts";

try {
    const translated = await DeepL.translate(
        "Hello, world!", // Text to translate
        "en",            // Source Language Code (ISO 639-1)
        "ko"             // Target Language Code
    );
    
    console.log(translated); // "안녕, 세상아!"
} catch (error) {
    console.error("Translation failed:", error);
}
```

### 환경 변수 설정 (.env)

실행을 위해 DeepL API Key가 필요합니다 (Free/Pro 공용).

```env
DEEPL_API_KEY=your-deepl-api-key
```
