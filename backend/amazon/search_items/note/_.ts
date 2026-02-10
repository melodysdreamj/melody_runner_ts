import dotenv from "dotenv";
// SearchItems 실행 연습장
import { searchItems } from "../_";

dotenv.config();

;(async () => {
    console.log("=== Amazon Creators API: 상품 검색 ===");
    const result = await searchItems({
      keywords: "wireless earbuds",
      itemCount: 5,
      resources: [
        "Images.Primary.Medium",
        "ItemInfo.Title",
        "Offers.Listings.Price",
      ],
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
