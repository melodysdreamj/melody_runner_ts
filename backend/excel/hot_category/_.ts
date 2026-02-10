// Excel 모듈 — 광고 카테고리별 핫 아이템 조회 설정
// vendor별 카테고리 목록 + 아이템 가져올 개수 관리

import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

// ─── 데이터 모델 ───
export class HotCategory {
  // 1. String — 벤더명 (coupang, aliexpress, amazon)
  vendor: string = "";
  // 2. String — 카테고리 ID (벤더마다 형식 다름)
  categoryId: string = "";
  // 3. String — 카테고리 이름 (사람이 읽기 위한 용도)
  categoryName: string = "";
  // 4. Number — 가져올 아이템 개수
  itemCount: number = 10;
  // 5. String — 대분류/소분류 구분
  categoryLevel: string = "대분류";

  toDataString(): string {
    return btoa(
      Array.from(
        new TextEncoder().encode(
          new URLSearchParams({
            vendor: this.vendor,
            categoryId: this.categoryId,
            categoryName: this.categoryName,
            itemCount: this.itemCount.toString(),
            categoryLevel: this.categoryLevel,
          }).toString()
        )
      )
        .map((byte) => String.fromCharCode(byte))
        .join("")
    );
  }

  static fromDataString(dataString: string): HotCategory {
    const queryParams = Object.fromEntries(
      new URLSearchParams(atob(dataString))
    );

    const object = new HotCategory();
    object.vendor = queryParams["vendor"] || "";
    object.categoryId = queryParams["categoryId"] || "";
    object.categoryName = queryParams["categoryName"] || "";
    object.itemCount = parseInt(queryParams["itemCount"] || "10", 10);
    object.categoryLevel = queryParams["categoryLevel"] || "대분류";

    return object;
  }

  toMap(): Record<string, any> {
    return {
      vendor: this.vendor,
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      itemCount: this.itemCount,
      categoryLevel: this.categoryLevel,
    };
  }

  static fromMap(row: any): HotCategory {
    const object = new HotCategory();
    object.vendor = String(row.vendor || "");
    object.categoryId = String(row.categoryId || "");
    object.categoryName = String(row.categoryName || "");
    object.itemCount = parseInt(String(row.itemCount || "10"), 10);
    object.categoryLevel = String(row.categoryLevel || "대분류");
    return object;
  }
}

// ─── Excel 관리 클래스 ───
export class HotCategoryExcel {
  private filePath: string;

  constructor() {
    const dataDir = path.join(__dirname, "data");
    if (!fs.existsSync(dataDir)) {
      throw new Error(`data 폴더가 없습니다: ${dataDir}`);
    }

    const xlsxFiles = fs
      .readdirSync(dataDir)
      .filter((f) => f.endsWith(".xlsx") || f.endsWith(".xls"));

    if (xlsxFiles.length === 0) {
      throw new Error(`data 폴더에 엑셀 파일이 없습니다: ${dataDir}`);
    }

    this.filePath = path.join(dataDir, xlsxFiles[0]);
  }

  getAll(sheetName?: string): HotCategory[] {
    const workbook = XLSX.readFile(this.filePath);
    const target = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[target];

    if (!worksheet) {
      throw new Error(`시트 "${target}"를 찾을 수 없습니다.`);
    }

    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
    });

    return rows.map((row) => HotCategory.fromMap(row));
  }

  /** 특정 벤더의 카테고리만 필터링 */
  getByVendor(vendor: string): HotCategory[] {
    return this.getAll().filter(
      (c) => c.vendor.toLowerCase() === vendor.toLowerCase()
    );
  }

  writeAll(objects: HotCategory[], sheetName: string = "Sheet1"): void {
    const rows = objects.map((obj) => obj.toMap());
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, this.filePath);
  }

  getSheetNames(): string[] {
    const workbook = XLSX.readFile(this.filePath);
    return workbook.SheetNames;
  }
}
