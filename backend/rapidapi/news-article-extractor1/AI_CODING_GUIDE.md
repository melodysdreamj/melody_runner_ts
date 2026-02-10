# AI 코딩 가이드: News Article Extractor

이 모듈은 뉴스 기사의 URL을 입력받아, 광고와 불필요한 태그를 제거하고 건조한 **텍스트 본문(Content)**과 메타데이터를 추출하는 도구입니다.

## Endpoint List

*   **Scrape Article**: `scrape_article/_.ts`
    *   Function: `scrapeArticle(url)`
    *   Description: 뉴스 기사 URL을 전달하면, 본문 텍스트, 이미지, 작성자 등을 추출하여 반환합니다.

## Usage Examples

```typescript
import { scrapeArticle } from "./scrape_article/_.ts";

const url = "https://example.com/some-news-article";
const articleData = await scrapeArticle(url);

console.log("Title:", articleData.title);
console.log("Content:", articleData.content); // 순수 텍스트 본문
```
