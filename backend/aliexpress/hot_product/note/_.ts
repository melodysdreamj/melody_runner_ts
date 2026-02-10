// 인기 상품 조회 실행 연습장
import { queryHotProducts } from "../_";

;(async () => {
    console.log("=== 알리 공식 API: 인기 상품 ===");
    const result = await queryHotProducts({
      category_ids: "200000343",
      target_currency: "USD",
      page_no: "1",
      page_size: "5",
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
