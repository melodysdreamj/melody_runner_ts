// 골드박스 상품 조회 단위 테스트 (axios mock)
import { getGoldboxProducts } from "../_";

jest.mock("axios", () => ({
  get: jest.fn().mockResolvedValue({
    data: {
      rCode: "0",
      rMessage: "success",
      data: [
        {
          productId: 99999,
          productName: "골드박스 테스트 상품",
          productPrice: 29900,
          productImage: "https://example.com/goldbox.jpg",
          productUrl: "https://www.coupang.com/vp/products/99999",
          categoryName: "홈&라이프",
          isRocket: true,
          isFreeShipping: false,
        },
      ],
    },
  }),
  isAxiosError: jest.fn().mockReturnValue(false),
}));

describe("Coupang Goldbox", () => {
  it("골드박스 상품 목록이 반환되어야 한다", async () => {
    const result = await getGoldboxProducts();
    expect(result).not.toBeNull();
    expect(result?.data[0].productName).toBe("골드박스 테스트 상품");
  });
});
