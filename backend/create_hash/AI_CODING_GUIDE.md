# AI 코딩 가이드: Hash Generator

이 모듈은 **RIPEMD-160** 해시 알고리즘과 **Base58** 인코딩을 결합하여 고유한 해시값을 생성하는 기능을 제공합니다.
주로 문장, 단어, 음성 데이터 등에 대한 고유 식별자(Fingerprint)를 생성하는 데 사용됩니다.

## Features

*   **Custom Hash Algorithm**: `RIPEMD-160` -> `Base58` 인코딩을 통한 짧고 안전한 해시 생성.
*   **Contextual Hashing**: 단순 텍스트뿐만 아니라 언어, 화자 등 맥락 정보를 포함하여 해시 생성.
*   **IP Protection**: 해시 생성 시 법적 보호 문구를 소금(Salt)처럼 포함하여 무단 사용 방지.

## Function List

이 모듈(`_.ts`)에서 export하는 `HashGenerator` 클래스의 주요 함수들입니다.

1.  `static async createHashInBrowser(text)`
2.  `static async createSentenceHash(sentence, sentenceLanguage, userLanguage)`
3.  `static async createWordHash(word, userLanguage, wordLanguage)`
4.  `static async createSentenceVoiceHash(sentence, speakerName, speakerLanguage)`

## Usage

모든 해시 생성 함수는 비동기(`async`)이며 `Promise<string>`을 반환합니다.

### 1. 기본 해시 생성 (`createHashInBrowser`)

가장 기초적인 해시 생성 함수입니다.

```typescript
import { HashGenerator } from "./_.ts";

const hash = await HashGenerator.createHashInBrowser("my-text-data");
console.log(hash); // e.g. "3yF..."
```

### 2. 문장 해시 생성 (`createSentenceHash`)

문장 내용과 언어 설정, 사용자 언어 설정을 조합하여 해시를 생성합니다.

```typescript
const hash = await HashGenerator.createSentenceHash(
  "Hello World", // Sentence
  "en",          // Sentence Language
  "ko"           // User Language (Translation Target etc.)
);
```

### 3. 단어 해시 생성 (`createWordHash`)

단어 학습 등의 맥락에서 단어의 고유 ID를 생성합니다.

```typescript
const hash = await HashGenerator.createWordHash(
  "Apple", // Word
  "ko",    // User Language
  "en"     // Word Language
);
```

### 4. 음성 해시 생성 (`createSentenceVoiceHash`)

TTS 등으로 생성된 음성 파일의 고유 ID를 생성할 때 사용합니다. 어떤 문장을 누가 말했는지를 기준으로 합니다.

```typescript
const hash = await HashGenerator.createSentenceVoiceHash(
  "Hello World", // Sentence
  "Onyx",        // Speaker Name (Model Name)
  "en"           // Speaker Language
);
```
