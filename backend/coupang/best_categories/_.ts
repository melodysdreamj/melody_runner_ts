// 쿠팡 파트너스 API — 카테고리별 베스트 상품 조회
// Endpoint: GET /v2/providers/affiliate_open_api/apis/openapi/products/bestcategories/{categoryId}

import { coupangGet } from "../sign";
const BASE_PATH = "/v2/providers/affiliate_open_api/apis/openapi/products/bestcategories";

export interface BestCategoriesParams {
  categoryId: number;
  limit?: number;
  subId?: string;
}

export interface BestCategoryProduct {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  categoryName: string;
  rank: number;
  isRocket: boolean;
  isFreeShipping: boolean;
}

export interface BestCategoriesResponse {
  rCode: string;
  rMessage: string;
  data: BestCategoryProduct[];
}

/**
 * 카테고리별 베스트셀러 상품 조회
 */
export async function getBestCategories(
  params: BestCategoriesParams
): Promise<BestCategoriesResponse | null> {
  const path = `${BASE_PATH}/${params.categoryId}`;
  const queryParams: Record<string, string> = {};
  if (params.limit) queryParams.limit = params.limit.toString();
  if (params.subId) queryParams.subId = params.subId;

  try {
    return await coupangGet<BestCategoriesResponse>(path, queryParams);
  } catch (error) {
    console.error("쿠팡 베스트 카테고리 조회 실패:", error);
    return null;
  }
}
