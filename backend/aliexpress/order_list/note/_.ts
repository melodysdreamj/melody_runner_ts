import dotenv from "dotenv";
// 주문/수수료 조회 실행 연습장
import { getOrderList } from "../_";

dotenv.config();

;(async () => {
    console.log("=== 알리 공식 API: 주문 내역 조회 ===");
    const result = await getOrderList({
      start_time: "2026-02-01 00:00:00",
      end_time: "2026-02-07 23:59:59",
      page_no: "1",
      page_size: "50",
    });
    console.log("Result:", JSON.stringify(result, null, 2));
    process.exit(0);
})();
