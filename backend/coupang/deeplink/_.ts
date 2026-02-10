// 쿠팡 파트너스 API — 딥링크 생성
// Endpoint: POST /v2/providers/affiliate_open_api/apis/openapi/v1/deeplink

import { coupangPost } from "../sign";
const PATH = "/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink";

export interface CreateDeeplinkParams {
  coupangUrls: string[];       // 변환할 쿠팡 URL 목록
  subId?: string;              // 추적용 서브 ID
}

export interface DeeplinkResult {
  originalUrl: string;
  landingUrl: string;
  shortenUrl: string;
}

export interface CreateDeeplinkResponse {
  rCode: string;
  rMessage: string;
  data: DeeplinkResult[];
}

/**
 * 쿠팡 URL을 파트너스 추적 링크(딥링크)로 변환
 */
export async function createDeeplink(
  params: CreateDeeplinkParams
): Promise<CreateDeeplinkResponse | null> {
  const body = {
    coupangUrls: params.coupangUrls,
    subId: params.subId || "",
  };

  try {
    return await coupangPost<CreateDeeplinkResponse>(PATH, body);
  } catch (error) {
    console.error("쿠팡 딥링크 생성 실패:", error);
    return null;
  }
}
