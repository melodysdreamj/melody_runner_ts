import { getProductDetails } from "../_";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AliExpress True API - Get Product Details", () => {
    it("should fetch details successfully", async () => {
        const mockResponse = {
            data: {
                product_id: "123",
                product_title: "Test Item",
                sale_price: "9.99"
            }
        };

        mockedAxios.request.mockResolvedValue(mockResponse);

        const result = await getProductDetails({ product_id: "123" });
        
        expect(result).toBeDefined();
        expect(result?.product_title).toBe("Test Item");
    });
});
