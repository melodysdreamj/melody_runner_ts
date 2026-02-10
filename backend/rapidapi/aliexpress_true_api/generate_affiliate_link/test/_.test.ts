import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import assert from "assert";
import { generateAffiliateLink } from "../_";

const mock = new MockAdapter(axios);

async function runTests() {
  console.log("Running generateAffiliateLink tests...");

  // Test 1: Success case
  try {
    const mockResponse = {
      promotion_link: "https://s.click.aliexpress.com/e/mockLink",
    };

    mock
      .onGet("https://aliexpress-true-api.p.rapidapi.com/affiliate-link-generate")
      .reply(200, mockResponse);

    const result = await generateAffiliateLink({ url: "https://www.aliexpress.com/item/123" });

    assert.deepStrictEqual(result, mockResponse);
    assert.match(result?.promotion_link || "", /mockLink/);
    console.log("  ✅ properties check passed");
  } catch (err) {
    console.error("  ❌ Success case failed:", err);
    process.exit(1);
  }

  // Test 2: Error case
  try {
    mock
      .onGet("https://aliexpress-true-api.p.rapidapi.com/affiliate-link-generate")
      .reply(500, { message: "Internal Server Error" });

    await generateAffiliateLink({ url: "https://www.aliexpress.com/item/123" });
    console.error("  ❌ Error case failed: Should have thrown error");
    process.exit(1);
  } catch (err) {
    console.log("  ✅ Error case passed (caught expected error)");
  }

  console.log("All generateAffiliateLink tests passed!");
}

runTests().catch(console.error);
