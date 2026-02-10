# AI 코딩 가이드: DuckDuckGo Search

이 모듈은 **DuckDuckGo** 검색 엔진을 사용하여 웹 검색 결과를 가져오는 기능을 제공합니다.
공식 API가 아닌 HTML 파싱(Scraping) 방식을 사용하여 검색 결과를 추출합니다.

## Features

*   **HTML Parsing**: `cheerio`를 사용하여 DuckDuckGo HTML 페이지를 파싱합니다.
*   **Privacy Focus**: 검색 기록을 남기지 않는 DuckDuckGo의 특성을 활용합니다.
*   **Bot Protection Bypass**: 적절한 `User-Agent` 및 헤더를 사용하여 봇 차단을 우회합니다.

## Function List

이 모듈(`_.ts`)에서 export하는 `DuckDuckGo` 클래스의 주요 함수입니다.

1.  `static async search(query)`

## Usage

### 검색 수행 (`search`)

검색어(`query`)를 입력받아 관련성 높은 결과 목록(`title`, `link`)을 반환합니다.

```typescript
import { DuckDuckGo } from "./_.ts";

const results = await DuckDuckGo.search("TypeScript Tutorial");

results.forEach(item => {
    console.log(`Title: ${item.title}`);
    console.log(`Link: ${item.link}`);
});

// Output example:
// [
//   { title: "TypeScript - The Superpad of JavaScript", link: "https://www.typescriptlang.org/" },
//   ...
// ]
```

### 주의사항
*   이 모듈은 HTML 구조에 의존적이므로, DuckDuckGo의 페이지 구조가 변경되면 작동하지 않을 수 있습니다.
*   과도한 요청은 IP 차단을 유발할 수 있습니다.
