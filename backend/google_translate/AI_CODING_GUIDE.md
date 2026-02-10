# AI 코딩 가이드: Google Translate (Unofficial)

이 모듈은 **translate-google** 패키지를 사용하여 무료로 텍스트 번역을 수행하는 기능을 제공합니다.
공식 Google Cloud Translate API가 아닌, 웹 기반 번역을 자동화한 비공식 방식입니다.

## Features

*   **Free Translation**: API Key 없이 무료로 사용 가능.
*   **Simple Usage**: 텍스트, 원본 언어, 대상 언어만 지정하면 즉시 번역.

## Function List

`text_by_google` 폴더 내의 `_.ts`에서 제공하는 함수입니다.

1.  `async translateTextByGoogle(text, fromLang, toLang)`

## Usage

### 텍스트 번역 (`translateTextByGoogle`)

```typescript
import { translateTextByGoogle } from "./text_by_google/_.ts";

try {
    const translated = await translateTextByGoogle("Hello", "en", "ko");
    console.log(translated); // "안녕하세요"
} catch (error) {
    console.error("Translation Failed:", error);
}
```

### 주의사항
*   비공식 API이므로 대량/빈번한 요청 시 차단될 수 있습니다. (Rate Limit 주의)
*   프로덕션 환경에서는 공식 `google_translate` 모듈 사용을 권장할 수 있습니다.
