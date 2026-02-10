// Amazon Creators API — 상품 변형 조회 (GetVariations)
// Operation: com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetVariations

import { amazonPost } from "../client";
import type { AmazonItem } from "../search_items/_";

// ============================================================
// 타입 정의
// ============================================================

export interface GetVariationsParams {
  /** 대표 상품 ASIN */
  asin: string;
  /** 상태 필터 */
  condition?: "Any" | "New" | "Used" | "Collectible" | "Refurbished";
  /** 통화 설정 */
  currencyOfPreference?: string;
  /** 언어 설정 */
  languagesOfPreference?: string[];
  /** 판매자 필터 */
  merchant?: "All" | "Amazon";
  /** Offer 개수 */
  offerCount?: number;
  /** 변형 개수 (1~10, 기본 10) */
  variationCount?: number;
  /** 변형 페이지 (1~10, 기본 1) */
  variationPage?: number;
  /** 응답에 포함할 리소스 */
  resources?: string[];
}

export interface VariationDimension {
  displayName: string;
  name: string;
  values: Array<{ displayValue: string; value: string }>;
}

export interface GetVariationsResponse {
  variationsResult?: {
    items: AmazonItem[];
    variationSummary?: {
      variationCount: number;
      variationDimensions: VariationDimension[];
    };
  };
  errors?: Array<{ code: string; message: string }>;
}

// ============================================================
// 기본 리소스
// ============================================================
const DEFAULT_RESOURCES = [
  "Images.Primary.Medium",
  "ItemInfo.Title",
  "ItemInfo.ByLineInfo",
  "Offers.Listings.Price",
  "VariationSummary.VariationDimension",
];

// ============================================================
// GetVariations 함수
// ============================================================

/**
 * Amazon 상품 변형(사이즈, 컬러 등) 조회
 *
 * 하나의 상품에 대해 사이즈, 색상 등 변형 옵션을 조회합니다.
 *
 * @example
 * const result = await getVariations({ asin: "B09V3KXJPB" });
 */
export async function getVariations(
  params: GetVariationsParams
): Promise<GetVariationsResponse | null> {
  if (!params.asin) {
    throw new Error("asin은 필수입니다.");
  }

  const body: Record<string, any> = {
    asin: params.asin,
    resources: params.resources || DEFAULT_RESOURCES,
  };

  if (params.condition) body.condition = params.condition;
  if (params.currencyOfPreference) body.currencyOfPreference = params.currencyOfPreference;
  if (params.languagesOfPreference) body.languagesOfPreference = params.languagesOfPreference;
  if (params.merchant) body.merchant = params.merchant;
  if (params.offerCount) body.offerCount = params.offerCount;
  if (params.variationCount) body.variationCount = params.variationCount;
  if (params.variationPage) body.variationPage = params.variationPage;

  try {
    return await amazonPost<GetVariationsResponse>("GetVariations", body);
  } catch (error) {
    console.error("Amazon 상품 변형 조회 실패:", error);
    return null;
  }
}
