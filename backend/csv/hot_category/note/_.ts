import { HotCategoryCsv } from "../_";

;(async () => {
    console.log("start");

    const csv = new HotCategoryCsv();

    // 전체 조회
    const all = await csv.getAll();
    console.log(`총 ${all.length}개 카테고리`);

    // 벤더별 조회
    const coupang = await csv.getByVendor("coupang");
    console.log(`\n쿠팡 (${coupang.length}개):`);
    coupang.forEach((c) =>
      console.log(`  [${c.categoryLevel}] ${c.categoryId}: ${c.categoryName} (${c.itemCount}개)`)
    );

    const ali = await csv.getByVendor("aliexpress");
    console.log(`\n알리익스프레스 (${ali.length}개):`);
    ali.forEach((c) =>
      console.log(`  [${c.categoryLevel}] ${c.categoryId}: ${c.categoryName} (${c.itemCount}개)`)
    );

    process.exit(0);
})();

export {};
