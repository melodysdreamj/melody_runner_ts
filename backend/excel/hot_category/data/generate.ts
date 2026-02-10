// 쿠팡 + 알리익스프레스 대분류 카테고리 엑셀 데이터 생성 스크립트
// 실행: npx ts-node backend/excel/hot_category/data/generate.ts

import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

const categories = [
  // ─── 쿠팡 대분류 (23개) — 2026-02-08 API 검증 완료 ───
  { vendor: "coupang", categoryId: "1001", categoryName: "여성패션", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1002", categoryName: "남성패션", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1003", categoryName: "패션의류", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1007", categoryName: "패션잡화", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1008", categoryName: "스포츠용품", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1010", categoryName: "뷰티", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1011", categoryName: "출산/유아동", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1012", categoryName: "식품", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1013", categoryName: "주방용품", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1014", categoryName: "생활용품", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1015", categoryName: "홈인테리어", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1016", categoryName: "가전디지털", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1017", categoryName: "스포츠/레저", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1018", categoryName: "자동차용품", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1019", categoryName: "도서/음반/DVD", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1020", categoryName: "완구/취미", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1021", categoryName: "문구/오피스", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1022", categoryName: "반려/애완용품", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1024", categoryName: "헬스/건강식품", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1025", categoryName: "국내여행", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1026", categoryName: "해외여행", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1029", categoryName: "반려동물용품", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "coupang", categoryId: "1030", categoryName: "유아동패션", itemCount: 10, categoryLevel: "대분류" },


  // ─── 알리익스프레스 대분류 (28개) ───
  // 주의: 알리 카테고리 ID는 공식 목록 미공개. get_categories API로 조회해 업데이트 필요
  { vendor: "aliexpress", categoryId: "100003109", categoryName: "Home & Garden", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003070", categoryName: "Consumer Electronics", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003071", categoryName: "Computer & Office", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003076", categoryName: "Cellphones & Telecommunications", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200003482", categoryName: "Women's Clothing", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200003494", categoryName: "Men's Clothing", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200000345", categoryName: "Shoes", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200000297", categoryName: "Jewelry & Accessories", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200000346", categoryName: "Bags & Shoes", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003106", categoryName: "Beauty & Health", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003108", categoryName: "Lights & Lighting", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003235", categoryName: "Sports & Entertainment", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003205", categoryName: "Toys & Hobbies", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003099", categoryName: "Tools", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003100", categoryName: "Home Improvement", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003188", categoryName: "Mother & Kids", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003245", categoryName: "Security & Protection", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003350", categoryName: "Automobiles, Parts & Accessories", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003207", categoryName: "Office & School Supplies", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200000532", categoryName: "Watches", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003086", categoryName: "Electronic Components & Supplies", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200000306", categoryName: "Hair Extensions & Wigs", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200000298", categoryName: "Apparel Accessories", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200000532", categoryName: "Underwear & Loungewear", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "100003187", categoryName: "Furniture", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200000780", categoryName: "Novelty & Special Use", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200001996", categoryName: "Weddings & Events", itemCount: 10, categoryLevel: "대분류" },
  { vendor: "aliexpress", categoryId: "200001075", categoryName: "Luggage & Bags", itemCount: 10, categoryLevel: "대분류" },
];

// 엑셀 파일 생성
const worksheet = XLSX.utils.json_to_sheet(categories);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

// 컬럼 너비 설정
worksheet["!cols"] = [
  { wch: 12 }, // vendor
  { wch: 12 }, // categoryId
  { wch: 40 }, // categoryName
  { wch: 10 }, // itemCount
  { wch: 10 }, // categoryLevel
];

const outputPath = path.join(__dirname, "hot_categories.xlsx");
XLSX.writeFile(workbook, outputPath);

console.log(`✅ 엑셀 파일 생성 완료: ${outputPath}`);
console.log(`   쿠팡: 19개 대분류`);
console.log(`   알리익스프레스: ${categories.filter(c => c.vendor === "aliexpress").length}개 대분류`);
console.log(`   총: ${categories.length}개 카테고리`);

export {};
