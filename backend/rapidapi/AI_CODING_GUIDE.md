# AI 코딩 가이드: RapidAPI Integration

이 모듈은 **RapidAPI** 마켓플레이스의 다양한 서드파티 API들을 통합 관리하는 모듈입니다.
**TS-Lego** 아키텍처 원칙에 따라, 각 구체적인 API 서비스(Host)는 자신만의 독립적인 디렉토리와 가이드를 가집니다.

## Core Principle (핵심 원칙)

1.  **Host-Based Structure**: 각 API 공급자는 `Host Name`을 폴더명으로 하여 구분됩니다. (예: `aliexpress_true_api`)
2.  **Endpoint Isolation**: 각 기능(Endpoint)은 하위 폴더로 완전히 격리되며, `_.ts` 파일을 통해서만 노출됩니다.
3.  **Standardized Client**: 모든 요청은 `axios`와 `RAPIDAPI_KEY` 환경 변수를 사용하여 표준화된 방식으로 처리됩니다.

## Module Index (대단락 가이드)

상세한 사용법과 함수 목록은 *각 서브 디렉토리의 가이드*를 참고하십시오.

### 1. [AliExpress (`aliexpress_true_api`)](./aliexpress_true_api/AI_CODING_GUIDE.md)
*   **주요 기능**: 상품 검색, 핫 아이템 조회, 카테고리 트리, 상품/상점 상세 정보, 제휴 링크 생성.
*   **활용**: 이커머스 분석, 제휴 마케팅 자동화, 상품 데이터 수집 등.

### 2. [Google News (`google_news22`)](./google_news22/AI_CODING_GUIDE.md)
*   **주요 기능**: 키워드 뉴스 검색, 지역 기반 뉴스, 토픽별 헤드라인.
*   **활용**: 트렌드 분석, 키워드 모니터링, 지역별 이슈 트래킹.

### 3. [News API & Extraction](./news-api14/AI_CODING_GUIDE.md)
*   **News API (`news-api14`)**: 글로벌 기사 검색, 트렌딩 뉴스.
*   **Extractor (`news-article-extractor1`)**: [가이드](./news-article-extractor1/AI_CODING_GUIDE.md) 참고. 기사 URL에서 본문 텍스트만 깨끗하게 추출.

## Environment Setup
모든 RapidAPI 모듈은 공통적으로 아래 환경 변수를 사용합니다.

```env
RAPIDAPI_KEY=your_rapidapi_key_here
```
