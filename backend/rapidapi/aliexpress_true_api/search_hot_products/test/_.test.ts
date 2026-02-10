import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import assert from "assert";
import { searchHotProducts } from "../_";

const mock = new MockAdapter(axios);

async function runTests() {
  console.log("Running searchHotProducts tests...");

  // Test 1: Success case
  try {
    const mockResponse = {
      total_results: 100,
      products: [
        {
          product_id: "12345",
          product_title: "Test Product",
          app_sale_price: "10.00",
          product_main_image_url: "http://example.com/image.jpg",
          original_price: "12.00",
          discount: "10%",
          sales_volume: "100",
          product_detail_url: "http://example.com/item.html",
          shop_url: "http://example.com/shop",
          shop_id: "999"
        },
      ],
    };

    mock
      .onGet("https://aliexpress-true-api.p.rapidapi.com/hot-products-download")
      .reply(200, mockResponse);

    const result = await searchHotProducts({ page_no: 1 });

    assert.deepStrictEqual(result, mockResponse);
    assert.strictEqual(result?.products[0].product_title, "Test Product");
    console.log("  ✅ properties check passed");
  } catch (err) {
    console.error("  ❌ Success case failed:", err);
    process.exit(1);
  }

  // Test 2: Error case
  try {
    mock
      .onGet("https://aliexpress-true-api.p.rapidapi.com/hot-products-download")
      .reply(500, { message: "Internal Server Error" });

    await searchHotProducts({ page_no: 1 });
    console.error("  ❌ Error case failed: Should have thrown error");
    process.exit(1);
  } catch (err) {
    console.log("  ✅ Error case passed (caught expected error)");
  }

  console.log("All searchHotProducts tests passed!");
}

runTests().catch(console.error);
