// 쿠팡 파트너스 API — 상품 검색
// Endpoint: GET /v2/providers/affiliate_open_api/apis/openapi/products/search

import { coupangGet } from "../sign";
const PATH = "/v2/providers/affiliate_open_api/apis/openapi/products/search";

export interface SearchProductsParams {
  keyword: string;
  limit?: number;
  subId?: string;
}

export interface CoupangProduct {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  categoryName: string;
  isRocket: boolean;
  isFreeShipping: boolean;
}

export interface SearchProductsResponse {
  rCode: string;
  rMessage: string;
  data: CoupangProduct[];
}

/**
 * 키워드로 쿠팡 상품 검색
 */
export async function searchProducts(
  params: SearchProductsParams
): Promise<SearchProductsResponse | null> {
  const queryParams: Record<string, string> = {
    keyword: params.keyword,
    limit: (params.limit || 10).toString(),
  };
  if (params.subId) queryParams.subId = params.subId;

  try {
    return await coupangGet<SearchProductsResponse>(PATH, queryParams);
  } catch (error) {
    console.error("쿠팡 상품 검색 실패:", error);
    return null;
  }
}
