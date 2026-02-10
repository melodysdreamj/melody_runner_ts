// Amazon Creators API — 상품 상세 조회 (GetItems)
// Operation: com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems

import { amazonPost } from "../client";
import type { AmazonItem } from "../search_items/_";

// ============================================================
// 타입 정의
// ============================================================

export interface GetItemsParams {
  /** ASIN 목록 (최대 10개) */
  itemIds: string[];
  /** 상품 ID 타입 */
  itemIdType?: "ASIN";
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
  /** 응답에 포함할 리소스 */
  resources?: string[];
}

export interface GetItemsResponse {
  itemsResult?: {
    items: AmazonItem[];
  };
  errors?: Array<{ code: string; message: string }>;
}

// ============================================================
// 기본 리소스
// ============================================================
const DEFAULT_RESOURCES = [
  "Images.Primary.Medium",
  "Images.Primary.Large",
  "ItemInfo.Title",
  "ItemInfo.ByLineInfo",
  "ItemInfo.Classifications",
  "ItemInfo.ContentInfo",
  "ItemInfo.Features",
  "ItemInfo.ProductInfo",
  "Offers.Listings.Price",
  "Offers.Listings.DeliveryInfo.IsPrimeEligible",
];

// ============================================================
// GetItems 함수
// ============================================================

/**
 * ASIN으로 Amazon 상품 상세 조회
 *
 * @example
 * const result = await getItems({ itemIds: ["B09V3KXJPB"] });
 */
export async function getItems(
  params: GetItemsParams
): Promise<GetItemsResponse | null> {
  if (!params.itemIds || params.itemIds.length === 0) {
    console.error("itemIds는 최소 1개 이상 필요합니다.");
    return null;
  }
  if (params.itemIds.length > 10) {
    console.error("itemIds는 최대 10개까지 가능합니다.");
    return null;
  }

  const body: Record<string, any> = {
    itemIds: params.itemIds,
    itemIdType: params.itemIdType || "ASIN",
    resources: params.resources || DEFAULT_RESOURCES,
  };

  if (params.condition) body.condition = params.condition;
  if (params.currencyOfPreference) body.currencyOfPreference = params.currencyOfPreference;
  if (params.languagesOfPreference) body.languagesOfPreference = params.languagesOfPreference;
  if (params.merchant) body.merchant = params.merchant;
  if (params.offerCount) body.offerCount = params.offerCount;

  try {
    return await amazonPost<GetItemsResponse>("GetItems", body);
  } catch (error) {
    console.error("Amazon 상품 상세 조회 실패:", error);
    return null;
  }
}
