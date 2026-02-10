// 딥링크 생성 단위 테스트 (axios mock)
import { createDeeplink } from "../_";

jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      rCode: "0",
      rMessage: "success",
      data: [
        {
          originalUrl: "https://www.coupang.com/vp/products/12345",
          landingUrl: "https://link.coupang.com/re/AFFTDP?lptag=AF12345",
          shortenUrl: "https://link.coupang.com/a/bXyz",
        },
      ],
    },
  }),
  isAxiosError: jest.fn().mockReturnValue(false),
}));

describe("Coupang Deeplink", () => {
  it("URL이 파트너스 딥링크로 변환되어야 한다", async () => {
    const result = await createDeeplink({
      coupangUrls: ["https://www.coupang.com/vp/products/12345"],
    });
    expect(result).not.toBeNull();
    expect(result?.data[0].shortenUrl).toContain("link.coupang.com");
  });
});
