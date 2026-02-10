// 상품 검색 단위 테스트 (axios mock)
import { searchProducts } from "../_";

jest.mock("axios", () => ({
  get: jest.fn().mockResolvedValue({
    data: {
      rCode: "0",
      rMessage: "success",
      data: [
        {
          productId: 12345,
          productName: "테스트 에어팟",
          productPrice: 159000,
          productImage: "https://example.com/img.jpg",
          productUrl: "https://www.coupang.com/vp/products/12345",
          categoryName: "이어폰",
          isRocket: true,
          isFreeShipping: true,
        },
      ],
    },
  }),
  isAxiosError: jest.fn().mockReturnValue(false),
}));

describe("Coupang Search Products", () => {
  it("키워드로 상품 검색이 성공해야 한다", async () => {
    const result = await searchProducts({ keyword: "에어팟" });
    expect(result).not.toBeNull();
    expect(result?.data).toHaveLength(1);
    expect(result?.data[0].productName).toBe("테스트 에어팟");
  });
});
