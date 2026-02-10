// 딥링크 생성 실행 연습장
import { createDeeplink } from "../_";

;(async () => {
    console.log("=== 쿠팡 파트너스: 딥링크 생성 ===");
    const result = await createDeeplink({
      coupangUrls: ["https://www.coupang.com/vp/products/8370960989"],
      subId: "test_subid",
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
