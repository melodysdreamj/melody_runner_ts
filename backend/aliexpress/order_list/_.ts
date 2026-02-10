// 알리익스프레스 공식 API — 주문/수수료 내역 조회
// API Method: aliexpress.affiliate.order.list
// ★ 핵심: AffiliateSale 테이블의 데이터 소스

import { callAliExpressApi } from "../sign";
export interface GetOrderListParams {
  start_time: string;           // "2026-02-01 00:00:00" 형식
  end_time: string;             // "2026-02-07 23:59:59" 형식
  status?: string;              // "Payment Completed" | "Buyer Confirmed Receipt" 등
  page_no?: string;
  page_size?: string;           // 최대 50
}

export interface AliOrder {
  order_id: number;
  sub_order_id: number;
  order_number: string;
  product_id: number;
  product_title: string;
  paid_amount: string;
  estimated_paid_commission: string;
  tracking_id: string;
  sub_id: string;
  order_status: string;
  created_time: string;
  paid_time: string;
}

export interface GetOrderListResult {
  current_page_no: number;
  total_page_no: number;
  total_record_count: number;
  orders: { order: AliOrder[] };
}

/**
 * 기간별 어필리에이트 주문/수수료 내역 조회
 *
 * AffiliateSale 테이블에 넣을 핵심 데이터 소스.
 * sub_id에서 domain과 quizId를 역추적합니다.
 */
export async function getOrderList(
  params: GetOrderListParams
): Promise<GetOrderListResult | null> {
  const businessParams: Record<string, string> = {
    start_time: params.start_time,
    end_time: params.end_time,
  };

  if (params.status) businessParams.status = params.status;
  if (params.page_no) businessParams.page_no = params.page_no;
  if (params.page_size) businessParams.page_size = params.page_size;

  const response = await callAliExpressApi<any>(
    "aliexpress.affiliate.order.list",
    businessParams
  );

  if (response.error_response) {
    console.error("API Error:", response.error_response);
    return null;
  }

  const outer = response["aliexpress_affiliate_order_list_response"];
  return outer?.resp_result?.result || null;
}
