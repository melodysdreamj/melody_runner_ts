// 상품 검색 단위 테스트 (axios mock)
import { queryProducts } from "../_";

// axios mock
jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      aliexpress_affiliate_product_query_response: {
        resp_result: {
          result: {
            current_page_no: 1,
            total_page_no: 10,
            total_record_count: 200,
            products: {
              product: [
                {
                  product_id: 1005006123456789,
                  product_title: "Test Bluetooth Earbuds",
                  product_main_image_url: "https://example.com/img.jpg",
                  target_sale_price: "15.99",
                  promotion_link: "https://s.click.aliexpress.com/e/test",
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

describe("AliExpress Product Query", () => {
  it("키워드로 상품 검색이 성공해야 한다", async () => {
    const result = await queryProducts({ keywords: "bluetooth earbuds" });
    expect(result).not.toBeNull();
    expect(result?.products?.product).toHaveLength(1);
    expect(result?.products?.product[0].product_title).toBe("Test Bluetooth Earbuds");
  });
});
