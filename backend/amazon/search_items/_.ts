// Amazon Creators API — 상품 검색 (SearchItems)
// Operation: com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems

import { amazonPost } from "../client";

// ============================================================
// 타입 정의
// ============================================================

export interface SearchItemsParams {
  /** 검색 키워드 (필수: keywords, actor, artist, author, brand, title 중 하나) */
  keywords?: string;
  actor?: string;
  artist?: string;
  author?: string;
  brand?: string;
  title?: string;

  /** 검색 카테고리 (예: "Electronics", "Books") */
  searchIndex?: string;
  /** 결과 개수 (1~10, 기본 10) */
  itemCount?: number;
  /** 페이지 번호 (1~10, 기본 1) */
  itemPage?: number;
  /** 최소 가격 (센트 단위) */
  minPrice?: number;
  /** 최대 가격 (센트 단위) */
  maxPrice?: number;
  /** 최소 리뷰 평점 (1~5) */
  minReviewsRating?: number;
  /** 정렬 기준 */
  sortBy?: string;
  /** 상태 필터 */
  condition?: "Any" | "New" | "Used" | "Collectible" | "Refurbished";
  /** Prime 배송 필터 */
  deliveryFlags?: string[];
  /** 판매자 필터 */
  merchant?: "All" | "Amazon";
  /** 응답에 포함할 리소스 */
  resources?: string[];
}

export interface AmazonItem {
  asin: string;
  detailPageURL: string;
  itemInfo?: {
    title?: { displayValue: string };
    byLineInfo?: { brand?: { displayValue: string } };
    classifications?: { productGroup?: { displayValue: string } };
  };
  images?: {
    primary?: {
      medium?: { url: string; width: number; height: number };
      large?: { url: string; width: number; height: number };
    };
  };
  offers?: {
    listings?: Array<{
      price?: {
        displayAmount: string;
        amount: number;
        currency: string;
      };
      deliveryInfo?: {
        isPrimeEligible: boolean;
        isFreeShippingEligible: boolean;
      };
    }>;
  };
}

export interface SearchItemsResponse {
  searchResult?: {
    items: AmazonItem[];
    totalResultCount: number;
    searchURL: string;
  };
  errors?: Array<{ code: string; message: string }>;
}

// ============================================================
// 기본 리소스 (요청 시 포함할 정보)
// ============================================================
const DEFAULT_RESOURCES = [
  "Images.Primary.Medium",
  "Images.Primary.Large",
  "ItemInfo.Title",
  "ItemInfo.ByLineInfo",
  "ItemInfo.Classifications",
  "Offers.Listings.Price",
  "Offers.Listings.DeliveryInfo.IsPrimeEligible",
];

// ============================================================
// SearchItems 함수
// ============================================================

/**
 * Amazon 상품 검색
 *
 * @example
 * const result = await searchItems({ keywords: "AirPods", itemCount: 5 });
 */
export async function searchItems(
  params: SearchItemsParams
): Promise<SearchItemsResponse | null> {
  const body: Record<string, any> = {};

  // 검색 조건 (최소 하나 필수)
  if (params.keywords) body.keywords = params.keywords;
  if (params.actor) body.actor = params.actor;
  if (params.artist) body.artist = params.artist;
  if (params.author) body.author = params.author;
  if (params.brand) body.brand = params.brand;
  if (params.title) body.title = params.title;

  // 옵션 파라미터
  if (params.searchIndex) body.searchIndex = params.searchIndex;
  if (params.itemCount) body.itemCount = params.itemCount;
  if (params.itemPage) body.itemPage = params.itemPage;
  if (params.minPrice) body.minPrice = params.minPrice;
  if (params.maxPrice) body.maxPrice = params.maxPrice;
  if (params.minReviewsRating) body.minReviewsRating = params.minReviewsRating;
  if (params.sortBy) body.sortBy = params.sortBy;
  if (params.condition) body.condition = params.condition;
  if (params.deliveryFlags) body.deliveryFlags = params.deliveryFlags;
  if (params.merchant) body.merchant = params.merchant;

  // 리소스
  body.resources = params.resources || DEFAULT_RESOURCES;

  try {
    return await amazonPost<SearchItemsResponse>("SearchItems", body);
  } catch (error) {
    console.error("Amazon 상품 검색 실패:", error);
    return null;
  }
}
