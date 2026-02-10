// GetVariations 실행 연습장
import { getVariations } from "../_";

;(async () => {
    console.log("=== Amazon Creators API: 상품 변형 조회 ===");
    const result = await getVariations({
      asin: "B09V3KXJPB", // 예시 ASIN (실제 ASIN으로 교체하세요)
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
