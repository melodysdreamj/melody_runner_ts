import dotenv from "dotenv";
// 상품 상세 조회 실행 연습장
import { getProductDetail } from "../_";

dotenv.config();

;(async () => {
    console.log("=== 알리 공식 API: 상품 상세 ===");
    const result = await getProductDetail({
      product_ids: "1005006123456789",
      target_currency: "USD",
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
