import dotenv from "dotenv";
// GetBrowseNodes 실행 연습장
import { getBrowseNodes } from "../_";

dotenv.config();

;(async () => {
    console.log("=== Amazon Creators API: 카테고리 조회 ===");
    const result = await getBrowseNodes({
      browseNodeIds: ["172282"], // Electronics (US)
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
