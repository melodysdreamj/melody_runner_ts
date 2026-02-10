// Coupang Partners API — HMAC-SHA256 서명 유틸리티
// 모든 API 요청에 필요한 CEA 인증 서명 생성

import crypto from "crypto";
import axios from "axios";
// ============================================================
// 설정 상수
// ============================================================
const BASE_URL = "https://api-gateway.coupang.com";

// ============================================================
// HMAC-SHA256 서명 생성
// ============================================================

/**
 * 쿠팡 파트너스 API 인증 헤더 생성
 *
 * 포맷: CEA algorithm=HmacSHA256, access-key={accessKey}, signed-date={datetime}, signature={signature}
 *
 * 서명 알고리즘:
 * 1. datetime = yyMMddTHHmmssZ (2자리 연도, UTC)
 * 2. message = datetime + httpMethod + path + queryString (? 미포함)
 * 3. signature = HMAC-SHA256(secretKey, message) → HEX
 */
export function generateAuthorization(
  httpMethod: string,
  path: string,
  query: string = ""
): string | null {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) {
    console.error(
      "Missing Coupang API configuration (COUPANG_ACCESS_KEY or COUPANG_SECRET_KEY)"
    );
    return null;
  }

  // UTC datetime: 쿠팡 공식 포맷 — yyMMddTHHmmssZ (2자리 연도)
  // 예: 260207T072205Z
  const datetime = new Date()
    .toISOString()
    .substr(2, 17)
    .replace(/[-:]/g, "") + "Z";

  // 메시지 조합: datetime + method + path + queryString
  const message = `${datetime}${httpMethod.toUpperCase()}${path}${query}`;

  // HMAC-SHA256 서명
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("hex");

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

// ============================================================
// API 요청 헬퍼
// ============================================================

/**
 * 쿠팡 파트너스 API GET 요청
 */
export async function coupangGet<T = any>(
  path: string,
  queryParams: Record<string, string> = {}
): Promise<T | null> {
  // 서명용 query: ? 없이 (예: "limit=5")
  const queryForSign = Object.keys(queryParams).length > 0
    ? new URLSearchParams(queryParams).toString()
    : "";
  // URL용 query: ? 포함 (예: "?limit=5")
  const queryForUrl = queryForSign ? `?${queryForSign}` : "";

  const authorization = generateAuthorization("GET", path, queryForSign);

  try {
    const response = await axios.get<T>(`${BASE_URL}${path}${queryForUrl}`, {
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Coupang API 호출 실패:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return null;
  }
}

/**
 * 쿠팡 파트너스 API POST 요청
 */
export async function coupangPost<T = any>(
  path: string,
  body: any = {}
): Promise<T | null> {
  const authorization = generateAuthorization("POST", path);

  try {
    const response = await axios.post<T>(`${BASE_URL}${path}`, body, {
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Coupang API 호출 실패:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return null;
  }
}
