import { generateAffiliateLink } from "../_";
import dotenv from "dotenv";

dotenv.config();

;(async () => {
  console.log("Starting AliExpress Affiliate Link Generation Test...");

  if (!process.env.RAPIDAPI_KEY) {
      console.error("Error: RAPIDAPI_KEY is not set in environment variables.");
      process.exit(1);
  }

  try {
    // Example: A random AliExpress product URL (ensure it's valid or use a test one)
    const testUrl = "https://www.aliexpress.com/item/1005001234567890.html"; 

    console.log("Generating Affiliate Link for:", testUrl);
    const result = await generateAffiliateLink({ url: testUrl });
    
    if (result) {
        console.log("Success! Promotion Link:", result.promotion_link);
    } else {
        console.log("No result returned.");
    }

  } catch (error) {
    console.error("Test execution failed:", error);
  }
  process.exit(0);
})();

export {};
