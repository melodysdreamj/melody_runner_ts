// 어필리에이트 링크 생성 단위 테스트 (axios mock)
import { generateLink } from "../_";

jest.mock("axios", () => ({
  post: jest.fn().mockResolvedValue({
    data: {
      aliexpress_affiliate_link_generate_response: {
        resp_result: {
          result: {
            total_result_count: 1,
            promotion_links: {
              promotion_link: [
                {
                  source_value: "https://www.aliexpress.com/item/123.html",
                  promotion_link: "https://s.click.aliexpress.com/e/generated",
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

describe("AliExpress Link Generate", () => {
  it("URL이 어필리에이트 링크로 변환되어야 한다", async () => {
    const result = await generateLink({
      source_values: "https://www.aliexpress.com/item/123.html",
    });
    expect(result).not.toBeNull();
    expect(result?.promotion_links?.promotion_link[0].promotion_link).toContain("generated");
  });
});
