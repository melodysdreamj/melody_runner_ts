import { getReviews } from "../_";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AliExpress True API - Get Reviews", () => {
    it("should fetch reviews", async () => {
        mockedAxios.request.mockResolvedValue({
            data: {
                total_results: 5,
                page: 1,
                reviews: [
                    { review_id: "r1", content: "Great product!", rating: 5 }
                ]
            }
        });

        const result = await getReviews({ product_id: "123" });
        expect(result?.reviews[0].content).toBe("Great product!");
    });
});
