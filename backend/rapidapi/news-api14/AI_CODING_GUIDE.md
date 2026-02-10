# AI 코딩 가이드: News API

이 모듈은 **RapidAPI**의 **News API**를 사용하여 전 세계 기사를 검색하고, 트렌딩 뉴스를 조회하며, 기사 본문 요약을 확인합니다.

## Endpoint List

*   **Article Content**: `get_article_content/_.ts`
    *   기사 URL 등을 이용해 본문 내용을 가져옵니다.
*   **Trending News**: `get_trending_news/_.ts`
    *   현재 트렌딩 중인 뉴스 목록을 반환합니다.
*   **Search Articles**: `search_articles/_.ts`
    *   다양한 필터(날짜, 소스, 키워드 등)를 사용하여 기사를 정밀 검색합니다.

## Usage Examples

### 1. 기사 검색
```typescript
import { searchArticles } from "./search_articles/_.ts";

const result = await searchArticles({
  query: "bitcoin",
  from_date: "2024-01-01",
  language: "en"
});
```
