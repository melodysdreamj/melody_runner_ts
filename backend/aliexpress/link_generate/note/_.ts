// 어필리에이트 링크 생성 실행 연습장
import { generateLink } from "../_";

;(async () => {
    console.log("=== 알리 공식 API: 링크 생성 ===");
    const result = await generateLink({
      source_values: "https://www.aliexpress.com/item/1005006123456789.html",
      promotion_link_type: "0",
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
