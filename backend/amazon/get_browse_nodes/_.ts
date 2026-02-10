// Amazon Creators API — 카테고리 조회 (GetBrowseNodes)
// Operation: com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetBrowseNodes

import { amazonPost } from "../client";

// ============================================================
// 타입 정의
// ============================================================

export interface GetBrowseNodesParams {
  /** Browse Node ID 목록 (최대 10개) */
  browseNodeIds: string[];
  /** 언어 설정 */
  languagesOfPreference?: string[];
  /** 응답에 포함할 리소스 */
  resources?: string[];
}

export interface BrowseNode {
  id: string;
  displayName: string;
  contextFreeName: string;
  isRoot: boolean;
  ancestor?: BrowseNode;
  children?: BrowseNode[];
}

export interface GetBrowseNodesResponse {
  browseNodesResult?: {
    browseNodes: BrowseNode[];
  };
  errors?: Array<{ code: string; message: string }>;
}

// ============================================================
// 기본 리소스
// ============================================================
const DEFAULT_RESOURCES = [
  "BrowseNodes.Ancestor",
  "BrowseNodes.Children",
];

// ============================================================
// GetBrowseNodes 함수
// ============================================================

/**
 * Amazon 카테고리(Browse Node) 조회
 *
 * Browse Node는 Amazon의 상품 분류 체계입니다.
 * 부모/자식 노드를 탐색하여 카테고리 트리를 구성할 수 있습니다.
 *
 * @example
 * const result = await getBrowseNodes({ browseNodeIds: ["172282"] }); // Electronics
 */
export async function getBrowseNodes(
  params: GetBrowseNodesParams
): Promise<GetBrowseNodesResponse | null> {
  if (!params.browseNodeIds || params.browseNodeIds.length === 0) {
    console.error("browseNodeIds는 최소 1개 이상 필요합니다.");
    return null;
  }
  if (params.browseNodeIds.length > 10) {
    console.error("browseNodeIds는 최대 10개까지 가능합니다.");
    return null;
  }

  const body: Record<string, any> = {
    browseNodeIds: params.browseNodeIds,
    resources: params.resources || DEFAULT_RESOURCES,
  };

  if (params.languagesOfPreference) {
    body.languagesOfPreference = params.languagesOfPreference;
  }

  try {
    return await amazonPost<GetBrowseNodesResponse>("GetBrowseNodes", body);
  } catch (error) {
    console.error("Amazon 카테고리 조회 실패:", error);
    return null;
  }
}
