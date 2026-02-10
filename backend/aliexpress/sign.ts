// AliExpress Open Platform — HMAC 서명 유틸리티
// 모든 API 요청에 필요한 서명 생성 및 요청 빌드 공용 함수

import crypto from "crypto";
import axios from "axios";
// ============================================================
// 설정 상수
// ============================================================
const BASE_URL = "https://api-iop.aliexpress.com/sync";

// ============================================================
// 서명 생성
// ============================================================

/**
 * AliExpress Open Platform 서명 생성
 *
 * 알고리즘:
 * 1. 모든 파라미터를 key 기준 알파벳 정렬
 * 2. appSecret + key1value1key2value2... + appSecret 형식으로 연결
 * 3. MD5 또는 HMAC-SHA256 해시 → 대문자 HEX
 */
export function generateSign(
  params: Record<string, string>,
  appSecret: string,
  signMethod: "md5" | "hmac" = "md5"
): string {
  // 1. 파라미터 key 기준 정렬
  const sortedKeys = Object.keys(params).sort();

  // 2. 문자열 조합
  const paramString = sortedKeys
    .map((key) => `${key}${params[key]}`)
    .join("");

  if (signMethod === "hmac") {
    // HMAC-SHA256
    return crypto
      .createHmac("sha256", appSecret)
      .update(paramString)
      .digest("hex")
      .toUpperCase();
  }

  // MD5: appSecret + params + appSecret
  const signString = `${appSecret}${paramString}${appSecret}`;
  return crypto.createHash("md5").update(signString).digest("hex").toUpperCase();
}

// ============================================================
// 요청 빌더
// ============================================================

export interface AliExpressResponse<T = any> {
  aliexpress_affiliate_response?: T;
  error_response?: {
    code: string;
    msg: string;
    sub_code?: string;
    sub_msg?: string;
  };
  [key: string]: any;
}

/**
 * AliExpress Open Platform API 요청 실행
 *
 * 공통 파라미터(app_key, timestamp, sign 등)를 자동으로 부가하고
 * 서명을 계산한 뒤 POST 요청을 전송합니다.
 */
export async function callAliExpressApi<T = any>(
  method: string,
  businessParams: Record<string, string> = {}
): Promise<AliExpressResponse<T>> {
  const appKey = process.env.ALIEXPRESS_APP_KEY;
  const appSecret = process.env.ALIEXPRESS_APP_SECRET;

  if (!appKey || !appSecret) {
    throw new Error(
      "Missing AliExpress API configuration (ALIEXPRESS_APP_KEY or ALIEXPRESS_APP_SECRET)"
    );
  }

  // 공통 시스템 파라미터
  const timestamp = new Date()
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d+Z$/, "");

  const systemParams: Record<string, string> = {
    method,
    app_key: appKey,
    timestamp,
    v: "2.0",
    sign_method: "md5",
    format: "json",
  };

  // 전체 파라미터 = 시스템 + 비즈니스
  const allParams = { ...systemParams, ...businessParams };

  // 서명 생성
  allParams.sign = generateSign(allParams, appSecret, "md5");

  try {
    const response = await axios.post<AliExpressResponse<T>>(
      BASE_URL,
      null,
      { params: allParams }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("AliExpress API 호출 실패:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    throw error;
  }
}
