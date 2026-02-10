// 알리익스프레스 공식 API — 어필리에이트 링크 생성
// API Method: aliexpress.affiliate.link.generate

import { callAliExpressApi } from "../sign";
import dotenv from "dotenv";

dotenv.config();

export interface GenerateLinkParams {
  source_values: string;        // 쉼표 구분 원본 URL 목록
  promotion_link_type?: string; // 0: 일반 링크, 2: 핫링크
}

export interface AliPromotionLink {
  source_value: string;
  promotion_link: string;
}

export interface GenerateLinkResult {
  promotion_links: { promotion_link: AliPromotionLink[] };
  total_result_count: number;
}

/**
 * 일반 상품 URL을 추적 가능한 어필리에이트 링크로 변환
 */
export async function generateLink(
  params: GenerateLinkParams
): Promise<GenerateLinkResult | null> {
  const trackingId = process.env.ALIEXPRESS_TRACKING_ID || "";

  const businessParams: Record<string, string> = {
    source_values: params.source_values,
    tracking_id: trackingId,
    promotion_link_type: params.promotion_link_type || "0",
  };

  const response = await callAliExpressApi<any>(
    "aliexpress.affiliate.link.generate",
    businessParams
  );

  if (response.error_response) {
    console.error("API Error:", response.error_response);
    return null;
  }

  const outer = response["aliexpress_affiliate_link_generate_response"];
  return outer?.resp_result?.result || null;
}
