import { searchHotProducts } from "../_";
import dotenv from "dotenv";

dotenv.config();

;(async () => {
  console.log("Starting AliExpress Hot Products Search Test...");

  if (!process.env.RAPIDAPI_KEY) {
      console.error("Error: RAPIDAPI_KEY is not set in environment variables.");
      process.exit(1);
  }

  try {
    const params = {
      // category_id: "200000345", // Example: Mobile Phones
      page_no: 1,
      page_size: 5,
      target_currency: "KRW",
      language: "ko",
      target_country: "KR",
    };

    console.log("Requesting Hot Products with params:", params);
    const result = await searchHotProducts(params);
    
    if (result) {
        console.log("Success! Total Results:", result.total_results);
        console.log("First 2 Products:", JSON.stringify(result.products.slice(0, 2), null, 2));
    } else {
        console.log("No result returned.");
    }

  } catch (error) {
    console.error("Test execution failed:", error);
  }
  process.exit(0);
})();

export {};
