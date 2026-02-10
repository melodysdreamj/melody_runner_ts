import { requestCloudflareGatewayWbQwen3 } from "../_";
import OpenAI from "openai";

jest.mock("openai");

describe("Cloudflare Gateway - W&B Qwen3 Integration", () => {
    let mockCreate: jest.Mock;

    beforeEach(() => {
        mockCreate = jest.fn();
        (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
            chat: {
                completions: {
                    create: mockCreate
                }
            }
        }));
        
        process.env.CLOUDFLARE_ACCOUNT_ID = "test_account";
        process.env.CLOUDFLARE_GATEWAY_NAME = "test_gateway";
        process.env.WANDB_API_KEY = "test_key";
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should construct correct Universal Endpoint URL and return response", async () => {
        const mockStream = {
            async *[Symbol.asyncIterator]() {
                yield { choices: [{ delta: { content: "Gateway" } }] };
                yield { choices: [{ delta: { content: " " } }] };
                yield { choices: [{ delta: { content: "Works" } }] };
            }
        };

        mockCreate.mockResolvedValue(mockStream);

        const onChunk = jest.fn();
        const result = await requestCloudflareGatewayWbQwen3("Test", onChunk);

        expect(result).toBe("Gateway Works");
        
        // Check OpenAI constructor call for correct Gateway URL
        expect(OpenAI).toHaveBeenCalledWith(expect.objectContaining({
            baseURL: "https://gateway.ai.cloudflare.com/v1/test_account/test_gateway/api.inference.wandb.ai/v1",
            apiKey: "test_key"
        }));
    });
});
