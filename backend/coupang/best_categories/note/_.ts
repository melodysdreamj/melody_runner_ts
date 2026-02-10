import dotenv from "dotenv";
// 베스트 카테고리 상품 조회 실행 연습장
import { getBestCategories } from "../_";

dotenv.config();

;(async () => {
    console.log("=== 쿠팡 파트너스: 베스트 카테고리 ===");
    const result = await getBestCategories({
      categoryId: 1001,
      limit: 5,
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
