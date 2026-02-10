// CSV 모듈 — 광고 카테고리별 핫 아이템 조회 설정
// vendor별 카테고리 목록 + 아이템 가져올 개수 관리

import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

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

// ─── CSV 유틸리티 ───

/** CSV 값 이스케이프 (쉼표, 따옴표, 줄바꿈 포함 시 따옴표로 감싸기) */
function escapeCsvValue(value: any): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/** CSV 한 줄 파싱 (따옴표 안의 쉼표 처리) */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // 이스케이프된 따옴표 건너뛰기
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current.trim());
  return result;
}

// ─── CSV 관리 클래스 ───
export class HotCategoryCsv {
  private filePath: string;

  constructor() {
    const dataDir = path.join(__dirname, "data");
    if (!fs.existsSync(dataDir)) {
      throw new Error(`data 폴더가 없습니다: ${dataDir}`);
    }

    const csvFiles = fs
      .readdirSync(dataDir)
      .filter((f) => f.endsWith(".csv"));

    if (csvFiles.length === 0) {
      throw new Error(`data 폴더에 CSV 파일이 없습니다: ${dataDir}`);
    }

    this.filePath = path.join(dataDir, csvFiles[0]);
  }

  /** 전체 조회 (비동기 — csv-parser 사용) */
  async getAll(): Promise<HotCategory[]> {
    return new Promise((resolve, reject) => {
      const results: HotCategory[] = [];
      fs.createReadStream(this.filePath)
        .pipe(csvParser())
        .on("data", (row: any) => {
          results.push(HotCategory.fromMap(row));
        })
        .on("end", () => resolve(results))
        .on("error", (err: Error) => reject(err));
    });
  }

  /** 전체 조회 (동기 — 따옴표 처리 포함 파싱) */
  getAllSync(): HotCategory[] {
    const content = fs.readFileSync(this.filePath, "utf-8");
    const lines = content.trim().split("\n");
    if (lines.length === 0) return [];

    const headers = parseCsvLine(lines[0]);
    return lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = values[i] || "";
      });
      return HotCategory.fromMap(row);
    });
  }

  /** 특정 벤더의 카테고리만 필터링 */
  async getByVendor(vendor: string): Promise<HotCategory[]> {
    const all = await this.getAll();
    return all.filter(
      (c) => c.vendor.toLowerCase() === vendor.toLowerCase()
    );
  }

  /** 전체 저장 (쉼표 포함 값 자동 이스케이프) */
  writeAll(objects: HotCategory[]): void {
    if (objects.length === 0) {
      fs.writeFileSync(this.filePath, "", "utf-8");
      return;
    }

    const headers = Object.keys(objects[0].toMap());
    const rows = objects.map((obj) => {
      const map = obj.toMap();
      return headers.map((h) => escapeCsvValue(map[h])).join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n") + "\n";
    fs.writeFileSync(this.filePath, csv, "utf-8");
  }

  /** CSV 헤더(컬럼명) 반환 */
  getHeaders(): string[] {
    const content = fs.readFileSync(this.filePath, "utf-8");
    const firstLine = content.split("\n")[0] || "";
    return parseCsvLine(firstLine);
  }
}
