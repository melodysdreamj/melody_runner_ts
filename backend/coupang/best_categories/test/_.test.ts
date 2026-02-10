// 베스트 카테고리 상품 조회 단위 테스트 (axios mock)
import { getBestCategories } from "../_";

jest.mock("axios", () => ({
  get: jest.fn().mockResolvedValue({
    data: {
      rCode: "0",
      rMessage: "success",
      data: [
        {
          productId: 77777,
          productName: "베스트 테스트 상품",
          productPrice: 45000,
          productImage: "https://example.com/best.jpg",
          productUrl: "https://www.coupang.com/vp/products/77777",
          categoryName: "전자제품",
          rank: 1,
          isRocket: true,
          isFreeShipping: true,
        },
      ],
    },
  }),
  isAxiosError: jest.fn().mockReturnValue(false),
}));

describe("Coupang Best Categories", () => {
  it("카테고리별 베스트 상품이 반환되어야 한다", async () => {
    const result = await getBestCategories({ categoryId: 1001 });
    expect(result).not.toBeNull();
    expect(result?.data[0].rank).toBe(1);
    expect(result?.data[0].productName).toBe("베스트 테스트 상품");
  });
});
