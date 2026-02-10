// 알리익스프레스 공식 API — 상품 상세 조회
// API Method: aliexpress.affiliate.productdetail.get

import { callAliExpressApi } from "../sign";
export interface GetProductDetailParams {
  product_ids: string;          // 쉼표 구분 상품 ID (최대 50개)
  target_currency?: string;
  target_language?: string;
  country?: string;
}

export interface AliProductDetail {
  product_id: number;
  product_title: string;
  product_main_image_url: string;
  product_small_image_urls: { string: string[] };
  target_sale_price: string;
  target_original_price: string;
  discount: string;
  evaluate_rate: string;
  original_price: string;
  sale_price: string;
  promotion_link: string;
  shop_url: string;
  shop_id: number;
  first_level_category_id: number;
  second_level_category_id: number;
}

export interface GetProductDetailResult {
  products: { product: AliProductDetail[] };
}

/**
 * 상품 ID로 상세 정보 조회
 */
export async function getProductDetail(
  params: GetProductDetailParams
): Promise<GetProductDetailResult | null> {
  const trackingId = process.env.ALIEXPRESS_TRACKING_ID || "";

  const businessParams: Record<string, string> = {
    product_ids: params.product_ids,
    tracking_id: trackingId,
  };

  if (params.target_currency) businessParams.target_currency = params.target_currency;
  if (params.target_language) businessParams.target_language = params.target_language;
  if (params.country) businessParams.country = params.country;

  const response = await callAliExpressApi<any>(
    "aliexpress.affiliate.productdetail.get",
    businessParams
  );

  if (response.error_response) {
    console.error("API Error:", response.error_response);
    return null;
  }

  const outer = response["aliexpress_affiliate_productdetail_get_response"];
  return outer?.resp_result?.result || null;
}
