import { searchProducts } from "../_";
import axios from "axios";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AliExpress True API - Search Products", () => {
    it("should fetch products successfully", async () => {
        // Mock Response
        const mockResponse = {
            data: {
                total_results: 100,
                page: 1,
                total_pages: 5,
                products: [
                    {
                        product_id: "12345",
                        product_title: "Test Product",
                        app_sale_price: "10.00"
                    }
                ]
            }
        };

        mockedAxios.request.mockResolvedValue(mockResponse);

        const result = await searchProducts({ search_query: "test" });
        
        expect(result).toBeDefined();
        expect(result?.products[0].product_id).toBe("12345");
        expect(mockedAxios.request).toHaveBeenCalledWith(expect.objectContaining({
            method: "GET",
            url: "https://aliexpress-true-api.p.rapidapi.com/search"
        }));
    });

    it("should handle API errors", async () => {
        mockedAxios.request.mockRejectedValue(new Error("API Error"));

        await expect(searchProducts({ search_query: "fail" }))
            .rejects
            .toThrow("API Error");
    });
});
