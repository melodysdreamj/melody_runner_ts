// 알리익스프레스 공식 API — 인기 상품 조회
// API Method: aliexpress.affiliate.hotproduct.query

import { callAliExpressApi } from "../sign";
export interface QueryHotProductsParams {
  category_ids?: string;
  keywords?: string;
  min_sale_price?: string;
  max_sale_price?: string;
  page_no?: string;
  page_size?: string;
  sort?: string;
  target_currency?: string;
  target_language?: string;
  ship_to_country?: string;
}

export interface HotProduct {
  product_id: number;
  product_title: string;
  product_main_image_url: string;
  target_sale_price: string;
  target_original_price: string;
  discount: string;
  evaluate_rate: string;
  sale_price: string;
  original_price: string;
  promotion_link: string;
  shop_url: string;
  second_level_category_id: number;
}

export interface QueryHotProductsResult {
  current_page_no: number;
  total_page_no: number;
  total_record_count: number;
  products: { product: HotProduct[] };
}

/**
 * 카테고리별 인기/핫 상품 조회
 */
export async function queryHotProducts(
  params: QueryHotProductsParams
): Promise<QueryHotProductsResult | null> {
  const trackingId = process.env.ALIEXPRESS_TRACKING_ID || "";

  const businessParams: Record<string, string> = {
    tracking_id: trackingId,
  };

  if (params.category_ids) businessParams.category_ids = params.category_ids;
  if (params.keywords) businessParams.keywords = params.keywords;
  if (params.min_sale_price) businessParams.min_sale_price = params.min_sale_price;
  if (params.max_sale_price) businessParams.max_sale_price = params.max_sale_price;
  if (params.page_no) businessParams.page_no = params.page_no;
  if (params.page_size) businessParams.page_size = params.page_size;
  if (params.sort) businessParams.sort = params.sort;
  if (params.target_currency) businessParams.target_currency = params.target_currency;
  if (params.target_language) businessParams.target_language = params.target_language;
  if (params.ship_to_country) businessParams.ship_to_country = params.ship_to_country;

  const response = await callAliExpressApi<any>(
    "aliexpress.affiliate.hotproduct.query",
    businessParams
  );

  if (response.error_response) {
    console.error("API Error:", response.error_response);
    return null;
  }

  const outer = response["aliexpress_affiliate_hotproduct_query_response"];
  return outer?.resp_result?.result || null;
}
