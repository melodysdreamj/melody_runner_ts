// 인기 상품 조회 단위 테스트 (axios mock)
import { queryHotProducts } from "../_";

jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      aliexpress_affiliate_hotproduct_query_response: {
        resp_result: {
          result: {
            current_page_no: 1,
            total_page_no: 5,
            total_record_count: 100,
            products: {
              product: [
                {
                  product_id: 1005009999999,
                  product_title: "Hot Product Test",
                  target_sale_price: "9.99",
                  promotion_link: "https://s.click.aliexpress.com/e/hot",
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

describe("AliExpress Hot Product", () => {
  it("인기 상품 목록이 반환되어야 한다", async () => {
    const result = await queryHotProducts({ category_ids: "200000343" });
    expect(result).not.toBeNull();
    expect(result?.products?.product[0].product_title).toBe("Hot Product Test");
  });
});
