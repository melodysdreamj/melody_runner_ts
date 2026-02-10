// 쿠팡 파트너스 API — 골드박스(타임딜) 상품 조회
// Endpoint: GET /v2/providers/affiliate_open_api/apis/openapi/products/goldbox

import { coupangGet } from "../sign";
const PATH = "/v2/providers/affiliate_open_api/apis/openapi/products/goldbox";

export interface GoldboxParams {
  subId?: string;
}

export interface GoldboxProduct {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  categoryName: string;
  isRocket: boolean;
  isFreeShipping: boolean;
}

export interface GoldboxResponse {
  rCode: string;
  rMessage: string;
  data: GoldboxProduct[];
}

/**
 * 골드박스(타임딜) 상품 조회
 */
export async function getGoldboxProducts(
  params: GoldboxParams = {}
): Promise<GoldboxResponse | null> {
  const queryParams: Record<string, string> = {};
  if (params.subId) queryParams.subId = params.subId;

  try {
    return await coupangGet<GoldboxResponse>(PATH, queryParams);
  } catch (error) {
    console.error("쿠팡 골드박스 조회 실패:", error);
    return null;
  }
}
