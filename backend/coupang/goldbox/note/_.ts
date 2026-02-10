import dotenv from "dotenv";
// 골드박스 상품 조회 실행 연습장
import { getGoldboxProducts } from "../_";

dotenv.config();

;(async () => {
    console.log("=== 쿠팡 파트너스: 골드박스 ===");
    const result = await getGoldboxProducts();
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
