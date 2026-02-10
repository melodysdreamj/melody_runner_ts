# AI 코딩 가이드: CSV 파일 데이터 모델링

이 가이드는 `backend/csv` 디렉토리 내에서 새로운 모델을 생성할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

CSV 모듈은 `.csv` 파일을 **데이터베이스처럼** 취급합니다.
`csv-parser` 라이브러리(읽기)와 Node.js 내장 `fs` 모듈(쓰기)을 사용하며, CSV 파일 경로만으로 즉시 사용 가능합니다.

새로운 모델을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

CSV에 저장될 새로운 모델을 추가하려면, `backend/csv` 폴더 아래에 **모델 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 모델 이름(영문 소문자, snake_case 권장)으로 폴더를 생성합니다. 예: `product`, `sales_report`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 데이터 모델 클래스와 CSV 관리자(Manager) 클래스를 모두 포함합니다.
3.  **클래스 명명**:
    *   **데이터 모델**: 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `product` -> `Product`
    *   **CSV 관리자**: 모델 이름 뒤에 `Csv`를 붙입니다. 예: `ProductCsv`
4.  **`data` 폴더**: 각 모델 폴더 안에 `data/` 폴더를 생성하고, 해당 모델의 **CSV 원본 파일(`.csv`)을 보관**합니다.
    *   Manager 클래스에서 파일 경로를 지정할 때, `data/` 폴더 내의 파일을 참조합니다.

### 구조 예시
```
backend/csv/
├── AI_CODING_GUIDE.md     <-- 이 파일
├── product/               <-- 새로운 모델 폴더 (예: 상품)
│   ├── _.ts               <-- 모델 정의 (Class Product) 및 관리자 (Class ProductCsv)
│   ├── data/              <-- CSV 원본 파일 보관 폴더
│   │   └── products.csv   <-- 실제 CSV 데이터 파일
│   └── note/
│       └── _.ts           <-- 실행 연습장 (Playground)
└── sales_report/          <-- 새로운 모델 폴더
    ├── _.ts
    └── data/
        └── report_2026.csv
```

---

## 2. 처리 가능한 데이터 타입 (Supported Types)

CSV 모듈은 CSV 셀에서 자연스럽게 표현 가능한 **3가지 타입만** 지원합니다.

| # | 타입 | TypeScript | CSV 셀 | 예시 |
|---|------|-----------|--------|------|
| 1 | **String** | `string` | 텍스트 | `"안녕하세요"` |
| 2 | **Number (정수)** | `number` | 숫자 | `100` |
| 3 | **Float (실수)** | `number` | 숫자 | `3.14` |

> **참고**: Boolean, Date, Array, Map, Nested Class, Enum 등 복잡한 타입은 CSV 모듈에서 사용하지 않습니다.
> CSV 파일의 특성상, 모든 데이터는 문자열 또는 숫자로 처리됩니다.

---

## 2. 데이터 모델 클래스 구현 상세 가이드

`_.ts` 파일 내부의 DTO 클래스는 다음 메서드들을 **반드시** 포함해야 합니다.

### A. `toDataString()` & `fromDataString()` 구현 가이드 (직렬화/역직렬화)

```typescript
export class Product {
  // 필드 정의 — CSV 컬럼과 1:1 매핑
  // 1. String
  name: string = "";
  // 2. Number (정수)
  price: number = 0;
  // 3. Float (실수)
  rating: number = 0.0;

  toDataString(): string {
    return btoa(
      Array.from(
        new TextEncoder().encode(
          new URLSearchParams({
            // 1. String
            name: this.name,
            // 2. Number
            price: this.price.toString(),
            // 3. Float
            rating: this.rating.toString(),
          }).toString()
        )
      )
        .map((byte) => String.fromCharCode(byte))
        .join("")
    );
  }

  static fromDataString(dataString: string): Product {
    const queryParams = Object.fromEntries(
      new URLSearchParams(atob(dataString))
    );

    const object = new Product();

    // 1. String
    object.name = queryParams["name"] || "";
    // 2. Number (정수)
    object.price = parseInt(queryParams["price"] || "0", 10);
    // 3. Float (실수)
    object.rating = parseFloat(queryParams["rating"] || "0.0");

    return object;
  }
```

### B. `toMap()` 구현 가이드 (CSV Row 변환용)

CSV에 쓰기 위해 데이터를 단순 객체(Map)로 변환합니다.

```typescript
  toMap(): Record<string, any> {
    return {
      // 1. String — 그대로
      name: this.name,
      // 2. Number — 그대로
      price: this.price,
      // 3. Float — 그대로
      rating: this.rating,
    };
  }
```

### C. `static fromMap()` 구현 가이드 (CSV Row -> 객체 복원)

CSV에서 읽은 Row 데이터를 객체로 복원합니다.

```typescript
  static fromMap(row: any): Product {
    const object = new Product();

    // 1. String — 문자열 변환
    object.name = String(row.name || "");
    // 2. Number (정수) — 정수 변환
    object.price = parseInt(String(row.price || "0"), 10);
    // 3. Float (실수) — 실수 변환
    object.rating = Number(row.rating || 0.0);

    return object;
  }
}
```

---

## 3. CSV 관리 클래스 구현 (Manager Class)

`csv-parser` 라이브러리(읽기)와 `fs.writeFileSync`(쓰기)를 사용합니다.
CSV 파일 하나가 곧 DB 테이블 하나에 해당합니다.

`data/` 폴더에 있는 `.csv` 파일을 **이름과 상관없이 자동으로 탐색**합니다.

### 3.1 기본 골격 및 연결 설정 (`ProductCsv`)

```typescript
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

export class ProductCsv {
  // data/ 폴더에서 자동 탐색된 CSV 파일 경로
  private filePath: string;

  constructor() {
    // 같은 모델 폴더 내 data/ 폴더에서 .csv 파일 자동 탐색
    const dataDir = path.join(__dirname, "data");
    if (!fs.existsSync(dataDir)) {
      throw new Error(`data 폴더가 없습니다: ${dataDir}`);
    }

    const csvFiles = fs.readdirSync(dataDir)
      .filter((f) => f.endsWith(".csv"));

    if (csvFiles.length === 0) {
      throw new Error(`data 폴더에 CSV 파일이 없습니다: ${dataDir}`);
    }

    // 첫 번째 CSV 파일 사용
    this.filePath = path.join(dataDir, csvFiles[0]);
  }

  // ... 기능 구현
}
```

> **동작 방식**: `data/` 폴더에 `.csv` 파일을 하나 넣어두면, 파일 이름과 관계없이 자동으로 불러옵니다.

### 3.2 핵심 기능 구현 (CRUD)

#### 3.2.1 전체 조회 (`getAll`) — csv-parser 사용 (비동기)
CSV 파일의 모든 행을 읽어서 표준 객체 배열로 반환합니다.

```typescript
  async getAll(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const results: Product[] = [];
      fs.createReadStream(this.filePath)
        .pipe(csvParser())
        .on("data", (row: any) => {
          results.push(Product.fromMap(row));
        })
        .on("end", () => resolve(results))
        .on("error", (err: Error) => reject(err));
    });
  }
```

#### 3.2.2 전체 조회 동기 (`getAllSync`) — 간단 파싱
빠르게 동기적으로 읽어야 할 때 사용합니다.

```typescript
  getAllSync(): Product[] {
    const content = fs.readFileSync(this.filePath, "utf-8");
    const lines = content.trim().split("\n");
    if (lines.length === 0) return [];

    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ""; });
      return Product.fromMap(row);
    });
  }
```

#### 3.2.3 전체 저장 (`writeAll`)
표준 객체 배열을 CSV 파일로 저장합니다.

```typescript
  writeAll(objects: Product[]): void {
    if (objects.length === 0) {
      fs.writeFileSync(this.filePath, "", "utf-8");
      return;
    }

    const headers = Object.keys(objects[0].toMap());
    const rows = objects.map((obj) => {
      const map = obj.toMap();
      return headers.map((h) => String(map[h])).join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n") + "\n";
    fs.writeFileSync(this.filePath, csv, "utf-8");
  }
```

#### 3.2.4 헤더 목록 (`getHeaders`)
```typescript
  getHeaders(): string[] {
    const content = fs.readFileSync(this.filePath, "utf-8");
    const firstLine = content.split("\n")[0] || "";
    return firstLine.split(",").map((h) => h.trim());
  }
```

---

## 4. 실행 스크립트 템플릿

### 4.1 실행 연습장 (`note/_.ts`)
```typescript
import dotenv from "dotenv";
import { ProductCsv } from "../_";

dotenv.config();

;(async () => {
    console.log("start");

    // data/ 폴더의 CSV 파일을 자동 탐색
    const csv = new ProductCsv();

    // 읽기 (비동기)
    const products = await csv.getAll();
    console.log(`총 ${products.length}개 상품`);
    products.forEach((p) => console.log(`  ${p.name}: ${p.price}원`));

    process.exit(0);
})();

export {};
```

---

## 5. 설치된 패키지

```
csv-parser (읽기)
fs (Node.js 내장 — 쓰기)
```
