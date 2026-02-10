# AI 코딩 가이드: AliExpress True API

이 모듈은 **RapidAPI**의 **AliExpress True API** (by *h_y*)를 사용하여 AliExpress의 상품 데이터, 카테고리, 상점 정보 등을 조회하고 제휴 링크를 생성합니다.

## Host Information
*   **RapidAPI Host**: `aliexpress-true-api.p.rapidapi.com`
*   **Base URL**: `https://aliexpress-true-api.p.rapidapi.com`

## Endpoint List

이 모듈은 다음과 같은 Endpoint 폴더 및 함수를 포함합니다.

### 1. Product Search & Discovery
*   **Search Products**: `search_products/_.ts`
    *   Function: `searchProducts(params)`
    *   Description: 키워드, 정렬, 필터 등을 사용하여 상품을 검색합니다.
*   **Hot Products**: `search_hot_products/_.ts`
    *   Function: `searchHotProducts(params)`
    *   Description: 특정 카테고리의 인기/핫 상품을 조회합니다.

### 2. Product Details & Stores
*   **Product Details**: `get_product_details/_.ts`
    *   Function: `getProductDetails(params)`
    *   Description: 상품 ID를 기반으로 상세 정보(가격, 옵션, 이미지 등)를 조회합니다.
*   **Store Details**: `get_store_details/_.ts`
    *   Function: `getStoreDetails(params)`
    *   Description: 판매자(Store)의 상세 정보와 등급을 조회합니다.
*   **Reviews**: `get_reviews/_.ts`
    *   Function: `getReviews(params)`
    *   Description: 상품의 리뷰 데이터(평점, 텍스트, 이미지)를 페이지네이션하여 가져옵니다.

### 3. Metadata & Affiliate
*   **Categories**: `get_categories/_.ts`
    *   Function: `getCategories(params)`
    *   Description: 카테고리 트리를 조회하여 `category_id`를 확보합니다.
*   **Affiliate Link**: `generate_affiliate_link/_.ts`
    *   Function: `generateAffiliateLink(params)`
    *   Description: 일반 상품 URL을 추적 가능한 제휴 링크(Affiliate Link)로 변환합니다.

## Usage Examples

### 1. 핫 상품 검색 (Hot Products)
```typescript
import { searchHotProducts } from "./search_hot_products/_.ts";

// Shoes 카테고리(200000343)의 인기 상품 10개 조회
const result = await searchHotProducts({
  category_id: "200000343", 
  target_currency: "USD",
  target_language: "EN",
  page_size: 10
});

console.log(result);
```

### 2. 제휴 링크 생성 (Affiliate Link)
```typescript
import { generateAffiliateLink } from "./generate_affiliate_link/_.ts";

const affiliateData = await generateAffiliateLink({
  url: "https://www.aliexpress.com/item/123456789.html",
  track_id: "user_123" // 추적용 ID
});

console.log(affiliateData.promotion_link);
```
