import { getCategories } from "../_";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AliExpress True API - Get Categories", () => {
    it("should fetch categories", async () => {
        mockedAxios.request.mockResolvedValue({
            data: {
                categories: [{ id: "1", name: "Electronics" }]
            }
        });

        const result = await getCategories();
        expect(result?.[0].name).toBe("Electronics");
    });
});
