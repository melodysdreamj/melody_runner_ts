// GetItems 실행 연습장
import { getItems } from "../_";

;(async () => {
    console.log("=== Amazon Creators API: 상품 상세 조회 ===");
    const result = await getItems({
      itemIds: ["B09V3KXJPB"], // 예시 ASIN (실제 ASIN으로 교체하세요)
      resources: [
        "Images.Primary.Large",
        "ItemInfo.Title",
        "ItemInfo.Features",
        "Offers.Listings.Price",
      ],
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
