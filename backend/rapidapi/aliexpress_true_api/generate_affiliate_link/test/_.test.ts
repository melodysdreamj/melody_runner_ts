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

  // Test 2: Error case (returns null instead of throwing)
  try {
    mock
      .onGet("https://aliexpress-true-api.p.rapidapi.com/affiliate-link-generate")
      .reply(500, { message: "Internal Server Error" });

    const result = await generateAffiliateLink({ url: "https://www.aliexpress.com/item/123" });
    assert.strictEqual(result, null, "Should return null on API error");
    console.log("  ✅ Error case passed (returned null as expected)");
  } catch (err) {
    console.error("  ❌ Error case failed:", err);
    process.exit(1);
  }

  console.log("All generateAffiliateLink tests passed!");
}

runTests().catch(console.error);
