import dotenv from "dotenv";
import { HotCategoryExcel } from "../_";

dotenv.config();

;(async () => {
    console.log("start");

    const excel = new HotCategoryExcel();

    // 전체 조회
    const all = excel.getAll();
    console.log(`총 ${all.length}개 카테고리`);

    // 벤더별 조회
    const coupang = excel.getByVendor("coupang");
    console.log(`\n쿠팡 (${coupang.length}개):`);
    coupang.forEach((c) =>
      console.log(`  [${c.categoryLevel}] ${c.categoryId}: ${c.categoryName} (${c.itemCount}개)`)
    );

    const ali = excel.getByVendor("aliexpress");
    console.log(`\n알리익스프레스 (${ali.length}개):`);
    ali.forEach((c) =>
      console.log(`  [${c.categoryLevel}] ${c.categoryId}: ${c.categoryName} (${c.itemCount}개)`)
    );

    process.exit(0);
})();

export {};
