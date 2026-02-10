// Amazon Creators API — API 요청 헬퍼
// OAuth Bearer 토큰을 사용한 POST 요청

import axios from "axios";
import { getAccessToken } from "./auth";

// ============================================================
// 설정 상수
// ============================================================
const DEFAULT_HOST = "webservices.amazon.com";
const DEFAULT_REGION = "us-east-1";
const DEFAULT_MARKETPLACE = "www.amazon.com";
const API_PATH = "/paapi5/";

// ============================================================
// Operation → x-amz-target 매핑
// ============================================================
const OPERATION_TARGETS: Record<string, string> = {
  SearchItems:
    "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
  GetItems:
    "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
  GetBrowseNodes:
    "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetBrowseNodes",
  GetVariations:
    "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetVariations",
};

// ============================================================
// API 요청 헬퍼
// ============================================================

/**
 * Amazon Creators API POST 요청
 *
 * - Bearer 토큰 인증
 * - 공통 파라미터 (partnerTag, partnerType, marketplace) 자동 주입
 * - x-amz-target 헤더 자동 설정
 *
 * @param operation 오퍼레이션 이름 (예: "SearchItems")
 * @param body 요청 바디 (lowerCamelCase)
 * @returns API 응답 데이터
 */
export async function amazonPost<T = any>(
  operation: string,
  body: Record<string, any> = {}
): Promise<T> {
  const host = process.env.AMAZON_HOST || DEFAULT_HOST;
  const partnerTag = process.env.AMAZON_PARTNER_TAG;
  const marketplace = process.env.AMAZON_MARKETPLACE || DEFAULT_MARKETPLACE;

  if (!partnerTag) {
    throw new Error(
      "Missing Amazon API configuration (AMAZON_PARTNER_TAG)"
    );
  }

  const target = OPERATION_TARGETS[operation];
  if (!target) {
    throw new Error(`Unknown Amazon API operation: ${operation}`);
  }

  // 공통 파라미터 주입 (lowerCamelCase — Creators API 컨벤션)
  const payload = {
    partnerTag,
    partnerType: "Associates",
    marketplace,
    ...body,
  };

  const operationPath = `${API_PATH}${operation.charAt(0).toLowerCase() + operation.slice(1)}`;
  const url = `https://${host}${operationPath}`;

  const accessToken = await getAccessToken();

  try {
    const response = await axios.post<T>(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=utf-8",
        "Content-Encoding": "amz-1.0",
        "x-amz-target": target,
        Host: host,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Amazon API 호출 실패 [${operation}]:`,
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected Error:", error);
    }
    throw error;
  }
}
