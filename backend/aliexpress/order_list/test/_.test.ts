// 주문/수수료 조회 단위 테스트 (axios mock)
import { getOrderList } from "../_";

jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      aliexpress_affiliate_order_list_response: {
        resp_result: {
          result: {
            current_page_no: 1,
            total_page_no: 1,
            total_record_count: 2,
            orders: {
              order: [
                {
                  order_id: 8001234567890,
                  sub_id: "abc123_42",
                  paid_amount: "15.99",
                  estimated_paid_commission: "1.20",
                  order_status: "Payment Completed",
                },
                {
                  order_id: 8001234567891,
                  sub_id: "def456_17",
                  paid_amount: "42.00",
                  estimated_paid_commission: "3.15",
                  order_status: "Payment Completed",
                },
              ],
            },
          },
        },
      },
    },
  }),
  isAxiosError: jest.fn().mockReturnValue(false),
}));

describe("AliExpress Order List", () => {
  it("기간별 주문 내역이 반환되어야 한다", async () => {
    const result = await getOrderList({
      start_time: "2026-02-01 00:00:00",
      end_time: "2026-02-07 23:59:59",
    });
    expect(result).not.toBeNull();
    expect(result?.orders?.order).toHaveLength(2);
    expect(result?.orders?.order[0].sub_id).toBe("abc123_42");
  });
});
