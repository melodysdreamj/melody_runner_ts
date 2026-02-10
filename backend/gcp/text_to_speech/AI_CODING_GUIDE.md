# AI 코딩 가이드: GCP Text-to-Speech

이 모듈은 **Google Cloud Text-to-Speech (TTS)** API를 사용하여 텍스트를 고품질 음성으로 변환하는 기능을 제공합니다.
변환된 음성을 파일로 저장하거나 버퍼로 반환받을 수 있습니다.

## Features

*   **High Quality Voice**: Google의 Neural2 등 고품질 음성 모델 사용.
*   **Text Cleaning**: TTS 품질을 저해하는 특수문자, 괄호, 이모지 등을 자동으로 정제하는 전처리 기능 내장.
*   **Truncation Support**: 바이트 제한(API 한계)에 맞춰 텍스트를 안전하게 자르는 기능 포함.
*   **Output Options**: 파일 저장(`synthesizeSpeechToFile`) 또는 메모리 버퍼 반환(`synthesizeSpeechToBuffer`) 지원.

## Function List

`_.ts` 파일에서 export하는 주요 함수들입니다.

1.  `async synthesizeSpeechToFile(text, outputFileName, options, forceTruncate)`
2.  `async synthesizeSpeechToBuffer(text, options, forceTruncate)`

## Usage

### 1. 음성 파일 생성 (`synthesizeSpeechToFile`)

```typescript
import { synthesizeSpeechToFile, TTSVoiceOptions } from "./_.ts";

const options: TTSVoiceOptions = {
    languageCode: "ko-KR",
    name: "ko-KR-Neural2-A", // Voice Name
    ssmlGender: "FEMALE"
};

const success = await synthesizeSpeechToFile(
    "안녕하세요, 반가워요!",
    "./output/hello.ogg", // Output Path
    options
);

if (success) console.log("File created!");
```

### 2. 음성 버퍼 생성 (`synthesizeSpeechToBuffer`)

파일로 저장하지 않고 메모리 상에서 바로 사용할 때 유용합니다 (예: R2 업로드 등).

```typescript
const buffer = await synthesizeSpeechToBuffer(
    "Hello World",
    { languageCode: "en-US", name: "en-US-Neural2-D" }
);

if (buffer) {
    console.log(`Buffer size: ${buffer.length} bytes`);
}
```

### 환경 변수 설정
GCP 인증을 위한 `GOOGLE_APPLICATION_CREDENTIALS` 등이 설정되어 있거나, 로컬 환경(gcloud auth login)이 구성되어 있어야 합니다.
