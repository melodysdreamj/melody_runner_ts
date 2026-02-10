// Amazon Creators API — OAuth 2.0 인증 유틸리티
// client_credentials 방식으로 Bearer 토큰 발급 및 캐싱

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// ============================================================
// 설정 상수
// ============================================================
const TOKEN_ENDPOINT = "https://api.amazon.com/auth/o2/token";

// 토큰 만료 5분 전에 갱신 (안전 마진)
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

// ============================================================
// 토큰 캐시
// ============================================================
interface TokenCache {
  accessToken: string;
  expiresAt: number; // Date.now() 기준 만료 시각 (ms)
}

let cachedToken: TokenCache | null = null;

// ============================================================
// OAuth 2.0 Access Token 발급
// ============================================================

/**
 * Amazon Creators API 인증용 Access Token 발급
 *
 * - grant_type: client_credentials
 * - 토큰 유효기간: ~1시간 (3600초)
 * - 만료 5분 전 자동 갱신
 *
 * @returns Bearer Access Token 문자열
 */
export async function getAccessToken(): Promise<string> {
  // 캐싱된 토큰이 유효하면 재사용
  if (cachedToken && Date.now() < cachedToken.expiresAt - REFRESH_MARGIN_MS) {
    return cachedToken.accessToken;
  }

  const credentialId = process.env.AMAZON_CREDENTIAL_ID;
  const credentialSecret = process.env.AMAZON_CREDENTIAL_SECRET;

  if (!credentialId || !credentialSecret) {
    throw new Error(
      "Missing Amazon API configuration (AMAZON_CREDENTIAL_ID or AMAZON_CREDENTIAL_SECRET)"
    );
  }

  try {
    const response = await axios.post(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: credentialId,
        client_secret: credentialSecret,
        scope: "ProductAdvertisingAPI",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in } = response.data;

    // 캐시 갱신
    cachedToken = {
      accessToken: access_token,
      expiresAt: Date.now() + expires_in * 1000,
    };

    return cachedToken.accessToken;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Amazon OAuth 토큰 발급 실패:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected Error:", error);
    }
    throw error;
  }
}

/**
 * 캐싱된 토큰 초기화 (테스트용)
 */
export function clearTokenCache(): void {
  cachedToken = null;
}
