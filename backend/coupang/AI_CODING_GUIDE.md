# AI 코딩 가이드: 쿠팡 파트너스 API

이 모듈은 **쿠팡 파트너스 Open API**를 사용하여 상품 검색, 딥링크 생성, 골드박스 조회 등을 수행합니다.

## 인증 방식

*   **Access Key / Secret Key**: 쿠팡 파트너스 개발자 포털에서 발급
*   **서명 방식**: HMAC-SHA256 (datetime + method + path + query → 서명)
    *   datetime: `yyMMddTHHmmssZ` (2자리 연도, UTC)
    *   query: `?` 미포함 (예: `keyword=test&limit=5`)
*   **Authorization 헤더 포맷**: `CEA algorithm=HmacSHA256, access-key=..., signed-date=..., signature=...`
*   **Base URL**: `https://api-gateway.coupang.com`
*   **공용 유틸리티**: `sign.ts`의 `coupangGet(path, params)`, `coupangPost(path, body)` 사용

## 환경변수

| 변수명 | 용도 |
|--------|------|
| `COUPANG_ACCESS_KEY` | 파트너스 API Access Key |
| `COUPANG_SECRET_KEY` | 파트너스 API Secret Key |

## Endpoint List

### 1. 상품 검색
*   **폴더**: `search_products/_.ts`
*   **Function**: `searchProducts(params)`
*   **Endpoint**: `GET /v2/providers/affiliate_open_api/apis/openapi/products/search`
*   **Description**: 키워드로 쿠팡 상품을 검색합니다.

### 2. 딥링크 생성
*   **폴더**: `deeplink/_.ts`
*   **Function**: `createDeeplink(params)`
*   **Endpoint**: `POST /v2/providers/affiliate_open_api/apis/openapi/v1/deeplink`
*   **Description**: 쿠팡 URL을 파트너스 추적 링크로 변환합니다.

### 3. 골드박스 상품
*   **폴더**: `goldbox/_.ts`
*   **Function**: `getGoldboxProducts(params)`
*   **Endpoint**: `GET /v2/providers/affiliate_open_api/apis/openapi/products/goldbox`
*   **Description**: 골드박스(타임딜) 상품을 조회합니다.

### 4. 베스트 카테고리 상품
*   **폴더**: `best_categories/_.ts`
*   **Function**: `getBestCategories(params)`
*   **Endpoint**: `GET /v2/providers/affiliate_open_api/apis/openapi/products/bestcategories/{categoryId}`
*   **Description**: 카테고리별 베스트셀러 상품을 조회합니다.

## Usage Examples

### 상품 검색
```typescript
import { searchProducts } from "./search_products/_";

const products = await searchProducts({
  keyword: "에어팟",
  limit: 10,
});
```

### 딥링크 생성
```typescript
import { createDeeplink } from "./deeplink/_";

const deeplink = await createDeeplink({
  coupangUrls: ["https://www.coupang.com/vp/products/8370960989"],
});
```

