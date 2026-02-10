// 상품 검색 실행 연습장
import { queryProducts } from "../_";

;(async () => {
    console.log("=== 알리 공식 API: 상품 검색 ===");
    const result = await queryProducts({
      keywords: "bluetooth earbuds",
      target_currency: "USD",
      page_no: "1",
      page_size: "5",
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
