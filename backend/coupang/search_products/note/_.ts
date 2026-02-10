import dotenv from "dotenv";
// 상품 검색 실행 연습장
import { searchProducts } from "../_";

dotenv.config();

;(async () => {
    console.log("=== 쿠팡 파트너스: 상품 검색 ===");
    const result = await searchProducts({
      keyword: "에어팟",
      limit: 5,
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
