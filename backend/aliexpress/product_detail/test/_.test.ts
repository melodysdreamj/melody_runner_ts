// 상품 상세 조회 단위 테스트 (axios mock)
import { getProductDetail } from "../_";

jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      aliexpress_affiliate_productdetail_get_response: {
        resp_result: {
          result: {
            products: {
              product: [
                {
                  product_id: 1005006123456789,
                  product_title: "Test Product Detail",
                  target_sale_price: "29.99",
                  promotion_link: "https://s.click.aliexpress.com/e/detail",
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

describe("AliExpress Product Detail", () => {
  it("상품 ID로 상세 정보가 반환되어야 한다", async () => {
    const result = await getProductDetail({ product_ids: "1005006123456789" });
    expect(result).not.toBeNull();
    expect(result?.products?.product[0].product_title).toBe("Test Product Detail");
  });
});
