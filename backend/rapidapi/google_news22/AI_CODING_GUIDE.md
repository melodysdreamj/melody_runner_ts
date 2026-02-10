# AI 코딩 가이드: Google News API

이 모듈은 **RapidAPI**의 **Google News** 서비스를 통해 최신 뉴스, 토픽별 헤드라인, 지역 기반 뉴스를 검색합니다.

## Host Information
*   **RapidAPI Host**: `google-news22.p.rapidapi.com` (또는 해당 API의 Host)

## Endpoint List

### 1. Search & Headlines
*   **Keyword Search**: `search_by_keyword/_.ts`
    *   Function: `searchByKeyword(keyword, country, lang)`
    *   Description: 특정 키워드로 뉴스를 검색합니다.
*   **Topic Headlines**: `search_by_topic_headlines/_.ts`
    *   Function: `searchByTopicHeadlines(topic, country, lang)`
    *   Description: 특정 주제(예: WORLD, BUSINESS, TECH)의 헤드라인을 가져옵니다.

### 2. Region & Top
*   **Geolocation**: `search_by_geolocation/_.ts`
    *   Function: `searchByGeolocation(location, ...)`
    *   Description: 특정 지역(Geo) 기반의 뉴스를 검색합니다.
*   **Top Headlines**: `search_by_top_headlines/_.ts`
    *   Function: `searchByTopHeadlines(country, lang)`
    *   Description: 현재 가장 인기 있는 주요 뉴스(Top Headlines)를 가져옵니다.

## Usage Examples

### 1. 키워드 검색
```typescript
import { searchByKeyword } from "./search_by_keyword/_.ts";

const news = await searchByKeyword("Artificial Intelligence", "US", "en");
news.forEach(item => {
  console.log(item.title, item.link);
});
```

### 2. 토픽 헤드라인 조회 (Technology)
```typescript
import { searchByTopicHeadlines } from "./search_by_topic_headlines/_.ts";

const techNews = await searchByTopicHeadlines("TECHNOLOGY", "KR", "ko");
console.log(techNews);
```
