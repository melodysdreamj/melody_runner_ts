# AI 코딩 가이드: AliExpress 공식 API (Open Platform)

이 모듈은 **AliExpress Open Platform**의 공식 Affiliate API를 사용하여 상품 검색, 어필리에이트 링크 생성, 주문 내역 조회 등을 수행합니다.

## 인증 방식

*   **App Key / App Secret**: AliExpress Open Platform에서 발급
*   **서명 방식**: MD5 (파라미터 정렬 → appSecret + key1value1... + appSecret → MD5 → 대문자 HEX)
*   **Base URL**: `https://api-iop.aliexpress.com/sync`
*   **공용 유틸리티**: `sign.ts`의 `callAliExpressApi(method, params)` 사용

## 환경변수

| 변수명 | 용도 |
|--------|------|
| `ALIEXPRESS_APP_KEY` | Open Platform App Key |
| `ALIEXPRESS_APP_SECRET` | Open Platform App Secret |
| `ALIEXPRESS_TRACKING_ID` | 어필리에이트 추적 ID |

## Endpoint List

### 1. 상품 검색
*   **폴더**: `product_query/_.ts`
*   **Function**: `queryProducts(params)`
*   **API Method**: `aliexpress.affiliate.product.query`
*   **Description**: 키워드/카테고리로 어필리에이트 상품을 검색합니다.

### 2. 상품 상세
*   **폴더**: `product_detail/_.ts`
*   **Function**: `getProductDetail(params)`
*   **API Method**: `aliexpress.affiliate.productdetail.get`
*   **Description**: 상품 ID로 상세 정보(가격, 이미지, 링크)를 조회합니다.

### 3. 어필리에이트 링크 생성
*   **폴더**: `link_generate/_.ts`
*   **Function**: `generateLink(params)`
*   **API Method**: `aliexpress.affiliate.link.generate`
*   **Description**: 일반 상품 URL을 추적 가능한 어필리에이트 링크로 변환합니다.

### 4. 주문/수수료 조회
*   **폴더**: `order_list/_.ts`
*   **Function**: `getOrderList(params)`
*   **API Method**: `aliexpress.affiliate.order.list`
*   **Description**: 기간별 어필리에이트 구매 확정 내역과 수수료를 조회합니다.

### 5. 인기 상품 조회
*   **폴더**: `hot_product/_.ts`
*   **Function**: `queryHotProducts(params)`
*   **API Method**: `aliexpress.affiliate.hotproduct.query`
*   **Description**: 카테고리별 인기/핫 상품을 조회합니다.

## Usage Examples

### 상품 검색
```typescript
import { queryProducts } from "./product_query/_";

const result = await queryProducts({
  keywords: "bluetooth earbuds",
  target_currency: "USD",
  page_no: "1",
  page_size: "20",
});
```

### 주문 내역 조회 (핵심 — AffiliateSale 데이터 소스)
```typescript
import { getOrderList } from "./order_list/_";

const orders = await getOrderList({
  start_time: "2026-02-01 00:00:00",
  end_time: "2026-02-07 23:59:59",
  status: "Payment Completed",
});
```
