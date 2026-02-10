# AI 코딩 가이드: Get Video ID

이 모듈은 다양한 비디오 플랫폼(YouTube, Vimeo 등)의 URL에서 **비디오 ID**와 **서비스 정보**를 추출하는 유틸리티입니다.
`get-video-id` npm 패키지를 래핑하여 제공합니다.

## Features

*   **Multi-Platform Support**: YouTube, Vimeo, Vine, VideoPress 등 다양한 플랫폼 지원.
*   **ID Extraction**: 복잡한 URL 형태(단축 URL, 임베드 URL 등)에서도 정확한 ID 추출.
*   **Service Detection**: URL이 어떤 서비스의 비디오인지 식별.

## Function List

이 모듈(`_.ts`)은 `get-video-id` 패키지의 기본 함수를 그대로 export 합니다.

1.  `getVideoId(url)`

## Usage

### 비디오 ID 추출 (`getVideoId`)

URL 문자열을 입력하면 `{ id, service, metadata }` 객체를 반환합니다. ID를 찾지 못한 경우 `undefined`를 반환할 수 있습니다.

```typescript
import { getVideoId } from "./_.ts";

// 1. YouTube URL
const ytResult = getVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
console.log(ytResult);
// Output: { id: 'dQw4w9WgXcQ', service: 'youtube', metadata: { ... } }

// 2. Vimeo URL
const vimeoResult = getVideoId("https://vimeo.com/12345678");
console.log(vimeoResult);
// Output: { id: '12345678', service: 'vimeo', metadata: { ... } }

// 3. Shortened URL
const shortResult = getVideoId("https://youtu.be/dQw4w9WgXcQ");
console.log(shortResult.id); // 'dQw4w9WgXcQ'
```
