# AI 코딩 가이드: Excel 파일 데이터 모델링

이 가이드는 `backend/excel` 디렉토리 내에서 새로운 모델을 생성할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

Excel 모듈은 `.xlsx` / `.xls` 파일을 **데이터베이스처럼** 취급합니다.
`xlsx` (SheetJS) 라이브러리를 사용하며, 엑셀 파일 경로만으로 즉시 사용 가능합니다.

새로운 모델을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

Excel에 저장될 새로운 모델을 추가하려면, `backend/excel` 폴더 아래에 **모델 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 모델 이름(영문 소문자, snake_case 권장)으로 폴더를 생성합니다. 예: `product`, `sales_report`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 데이터 모델 클래스와 Excel 관리자(Manager) 클래스를 모두 포함합니다.
3.  **클래스 명명**:
    *   **데이터 모델**: 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `product` -> `Product`
    *   **Excel 관리자**: 모델 이름 뒤에 `Excel`을 붙입니다. 예: `ProductExcel`
4.  **`data` 폴더**: 각 모델 폴더 안에 `data/` 폴더를 생성하고, 해당 모델의 **엑셀 원본 파일(`.xlsx`)을 보관**합니다.
    *   Manager 클래스에서 파일 경로를 지정할 때, `data/` 폴더 내의 파일을 참조합니다.
    *   `.gitignore`에 `*.xlsx`가 없다면, 대용량 파일은 별도로 관리하세요.

### 구조 예시
```
backend/excel/
├── AI_CODING_GUIDE.md     <-- 이 파일
├── product/               <-- 새로운 모델 폴더 (예: 상품)
│   ├── _.ts               <-- 모델 정의 (Class Product) 및 관리자 (Class ProductExcel)
│   ├── data/              <-- 엑셀 원본 파일 보관 폴더
│   │   └── products.xlsx  <-- 실제 엑셀 데이터 파일
│   └── note/
│       └── _.ts           <-- 실행 연습장 (Playground)
└── sales_report/          <-- 새로운 모델 폴더
    ├── _.ts
    └── data/
        └── report_2026.xlsx
```

---

## 2. 처리 가능한 데이터 타입 (Supported Types)

Excel 모듈은 엑셀 셀에서 자연스럽게 표현 가능한 **3가지 타입만** 지원합니다.

| # | 타입 | TypeScript | Excel 셀 | 예시 |
|---|------|-----------|----------|------|
| 1 | **String** | `string` | 텍스트 | `"안녕하세요"` |
| 2 | **Number (정수)** | `number` | 숫자 | `100` |
| 3 | **Float (실수)** | `number` | 숫자 | `3.14` |

> **참고**: Boolean, Date, Array, Map, Nested Class, Enum 등 복잡한 타입은 Excel 모듈에서 사용하지 않습니다.
> 엑셀 파일의 특성상, 모든 데이터는 문자열 또는 숫자로 처리됩니다.

---

## 2. 데이터 모델 클래스 구현 상세 가이드

`_.ts` 파일 내부의 DTO 클래스는 다음 메서드들을 **반드시** 포함해야 합니다.

### A. `toDataString()` & `fromDataString()` 구현 가이드 (직렬화/역직렬화)

```typescript
export class Product {
  // 필드 정의 — 엑셀 컬럼과 1:1 매핑
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

### B. `toMap()` 구현 가이드 (엑셀 Row 변환용)

엑셀에 쓰기 위해 데이터를 단순 객체(Map)로 변환합니다.

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

### C. `static fromMap()` 구현 가이드 (엑셀 Row -> 객체 복원)

엑셀에서 읽은 Row 데이터를 객체로 복원합니다.

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

## 3. Excel 관리 클래스 구현 (Manager Class)

`xlsx` 라이브러리의 `readFile`과 `writeFile`을 사용합니다.
엑셀 파일 하나가 곧 DB 테이블 하나에 해당합니다.

`data/` 폴더에 있는 `.xlsx` 파일을 **이름과 상관없이 자동으로 탐색**합니다.

### 3.1 기본 골격 및 연결 설정 (`ProductExcel`)

```typescript
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export class ProductExcel {
  // data/ 폴더에서 자동 탐색된 엑셀 파일 경로
  private filePath: string;

  constructor() {
    // 같은 모델 폴더 내 data/ 폴더에서 .xlsx 파일 자동 탐색
    const dataDir = path.join(__dirname, "data");
    if (!fs.existsSync(dataDir)) {
      throw new Error(`data 폴더가 없습니다: ${dataDir}`);
    }

    const xlsxFiles = fs.readdirSync(dataDir)
      .filter((f) => f.endsWith(".xlsx") || f.endsWith(".xls"));

    if (xlsxFiles.length === 0) {
      throw new Error(`data 폴더에 엑셀 파일이 없습니다: ${dataDir}`);
    }

    // 첫 번째 엑셀 파일 사용
    this.filePath = path.join(dataDir, xlsxFiles[0]);
  }

  // ... 기능 구현
}
```

> **동작 방식**: `data/` 폴더에 `.xlsx` 또는 `.xls` 파일을 하나 넣어두면, 파일 이름과 관계없이 자동으로 불러옵니다.

### 3.2 핵심 기능 구현 (CRUD)

#### 3.2.1 전체 조회 (`getAll`)
엑셀 파일의 모든 행을 읽어서 표준 객체 배열로 반환합니다.

```typescript
  getAll(sheetName?: string): Product[] {
    const workbook = XLSX.readFile(this.filePath);
    const target = sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[target];

    if (!worksheet) {
      throw new Error(`시트 "${target}"를 찾을 수 없습니다.`);
    }

    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
    });

    return rows.map((row) => Product.fromMap(row));
  }
```

#### 3.2.2 전체 저장 (`writeAll`)
표준 객체 배열을 엑셀 파일로 저장합니다.

```typescript
  writeAll(objects: Product[], sheetName: string = "Sheet1"): void {
    const rows = objects.map((obj) => obj.toMap());
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, this.filePath);
  }
```

#### 3.2.3 시트 이름 목록 (`getSheetNames`)
```typescript
  getSheetNames(): string[] {
    const workbook = XLSX.readFile(this.filePath);
    return workbook.SheetNames;
  }
```

---

## 4. 실행 스크립트 템플릿

### 4.1 실행 연습장 (`note/_.ts`)
```typescript
import dotenv from "dotenv";
import { ProductExcel } from "../_";

dotenv.config();

;(async () => {
    console.log("start");

    // data/ 폴더의 엑셀 파일을 자동 탐색
    const excel = new ProductExcel();

    // 읽기
    const products = excel.getAll();
    console.log(`총 ${products.length}개 상품`);
    products.forEach((p) => console.log(`  ${p.name}: ${p.price}원`));

    process.exit(0);
})();

export {};
```

---

## 5. 설치된 패키지

```
xlsx (SheetJS Community Edition)
```
