import { getStoreDetails } from "../_";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AliExpress True API - Get Store Details", () => {
    it("should fetch store details", async () => {
        mockedAxios.request.mockResolvedValue({
            data: {
                store_id: "123",
                store_name: "Test Store"
            }
        });

        const result = await getStoreDetails({ store_id: "123" });
        expect(result?.store_name).toBe("Test Store");
    });
});
