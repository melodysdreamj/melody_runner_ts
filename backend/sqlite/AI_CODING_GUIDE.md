# AI 코딩 가이드: SQLite 데이터 모델링

이 가이드는 `backend/sqlite` 디렉토리 내에서 새로운 모델을 생성할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

새로운 모델을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

SQLite에 저장될 새로운 모델을 추가하려면, `backend/sqlite` 폴더 아래에 **모델 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 모델 이름(영문 소문자, kebab-case 권장)으로 폴더를 생성합니다. 예: `posts`, `user_settings`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 데이터 모델 클래스와 SQLite 관리자(Manager) 클래스를 모두 포함합니다.
3.  **클래스 명명**:
    *   **데이터 모델**: 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `posts` -> `Post`
    *   **SQLite 관리자**: 모델 이름 뒤에 `Sqlite`를 붙입니다. 예: `PostSqlite`

### 구조 예시
```
backend/sqlite/
├── post/               <-- 새로운 모델 폴더 (예: 게시글)
│   ├── _.ts            <-- 모델 정의 (Class Post) 및 관리자 (Class PostSqlite)
│   ├── create_table.ts <-- 테이블 생성 스크립트
│   ├── drop_table.ts   <-- 테이블 삭제 스크립트
│   ├── reset_table.ts  <-- 테이블 리셋 (DROP + CREATE) 스크립트
│   └── note/
│       └── _.ts        <-- 실행 연습장 (Playground)
├── user_profile/       <-- 새로운 모델 폴더 (예: 사용자 프로필)
│   └── _.ts            <-- 모델 정의 (Class UserProfile)
```

### 1.1 중첩 클래스 구조 (Nested Class Structure)

데이터 모델이 복잡해져서 **중첩 클래스(Nested Class)**가 필요한 경우, 부모 테이블 폴더 하위에 **`sub` 폴더**를 만들고 그 안에 파일을 생성합니다.

#### 규칙
1.  **`sub` 폴더 생성**: 부모 폴더 아래에 `sub` 폴더를 생성합니다.
2.  **파일 생성**: `sub` 폴더 안에 **클래스 이름(camelCase)**으로 파일을 생성합니다. (예: `address.ts`, `metaData.ts`)
    *   **주의**: 중첩 클래스는 `_.ts`가 아니라 **구체적인 파일명**을 가집니다.

#### 구조 예시
```
backend/sqlite/
├── user/               <-- 부모 모델
│   ├── _.ts            <-- User 모델 정의
│   └── sub/            <-- 중첩 클래스 모음 폴더 (sub)
│       ├── address.ts  <-- Nested Class (Address)
│       └── profile.ts  <-- Nested Class (Profile)
```

### 1.2 Enum 구조 (Enum Structure)

상태값이나 종류를 나타내는 **Enum(열거형)**이 필요한 경우, 부모 테이블 폴더 하위에 **`enums` 폴더**를 만들고 그 안에 파일을 생성합니다.

#### 규칙
1.  **`enums` 폴더 생성**: 부모 폴더 아래에 `enums` 폴더를 생성합니다.
2.  **파일 생성**: `enums` 폴더 안에 **Enum 이름을 snake_case**로 변환하여 파일을 생성합니다. (예: `user_role.ts`, `post_status.ts`)

#### 구조 예시
```
backend/sqlite/
├── user/               <-- 부모 모델
│   ├── _.ts
│   ├── sub/            <-- 중첩 클래스
│   └── enums/          <-- Enum 모음 폴더
│       ├── user_role.ts <-- Enum 파일 (snake_case)
│       └── status.ts    <-- Enum 파일
```

## 2. 데이터 모델 클래스 구현 상세 가이드

`_.ts` 파일 내부의 DTO 클래스는 다음 메서드들을 **반드시** 포함해야 하며, SQLite의 특성상 `toMap`, `fromMap` 메서드가 핵심적인 역할을 합니다.

### 처리해야 할 데이터 타입 및 저장 방식 (SQLite Column Type)
1.  **String** -> `TEXT`
2.  **Number** -> `INTEGER`
3.  **Boolean** -> `INTEGER` (0: false, 1: true)
4.  **Float** -> `REAL`
5.  **Date** -> `INTEGER` (Timestamp)
6.  **String Array** -> `TEXT` (JSON Stringify)
7.  **Object (Map)** -> `TEXT` (JSON Stringify)
8.  **Nested Class** -> `TEXT` (toDataString() 직렬화)
9.  **Class Array** -> `TEXT` (직렬화된 객체 배열 JSON)
10. **Enum** -> `TEXT` (String 값)

---

### A. `toDataString()` & `fromDataString()` 구현 가이드 (직렬화/역직렬화)
Nested Class 저장이나 데이터 전송 시 사용되는 표준 직렬화 포맷입니다.

```typescript
toDataString(): string {
  return btoa(
    Array.from(
      new TextEncoder().encode(
        new URLSearchParams({
          // 1. String
          s: this.s,
          
          // 2. Number
          i: this.i.toString(),
          
          // 3. Boolean
          b: this.b.toString(), // "true" or "false"
          
          // 4. Float
          f: this.f.toString(),
          
          // 5. Date (Timestamp String)
          d: this.d.getTime().toString(),
          
          // 6. String Array (JSON)
          l: JSON.stringify(this.l),
          
          // 7. Object/Map (JSON)
          m: JSON.stringify(this.m),
          
          // 8. Nested Class (재귀 호출)
          c: this.c.toDataString(),
          
          // 9. Class Array (리스트 각 요소를 재귀 호출 후 JSON)
          j: JSON.stringify(this.j.map((item) => item.toDataString())),
          
          // 10. Enum
          e: this.e,

          docId: this.docId,
        }).toString()
      )
    )
    .map((byte) => String.fromCharCode(byte))
    .join("")
  );
}

static fromDataString(dataString: string): Post {
  const queryParams = Object.fromEntries(
    new URLSearchParams(atob(dataString))
  );

  const object = new Post();

  // 1. String
  object.s = queryParams["s"] || "";

  // 2. Number (Int)
  object.i = parseInt(queryParams["i"] || "0", 10);

  // 3. Boolean
  object.b = queryParams["b"] === "true";

  // 4. Float
  object.f = parseFloat(queryParams["f"] || "0.0");

  // 5. Date
  object.d = new Date(parseInt(queryParams["d"] || "0", 10));

  // 6. String Array
  object.l = JSON.parse(queryParams["l"] || "[]");

  // 7. Object/Map
  object.m = JSON.parse(queryParams["m"] || "{}");

  // 8. Nested Class
  object.c = Other.fromDataString(
      queryParams["c"] || new Other().toDataString()
  );

  // 9. Class Array
  object.j = (JSON.parse(queryParams["j"] || "[]") || [])
      .map((item: string) => Other.fromDataString(item));

  // 10. Enum
  object.e = EnumHelper.fromString(queryParams["e"] || Enum.Default);

  object.docId = queryParams["docId"] || "";

  return object;
}
```

### B. `toMap()` 구현 가이드 (DB 저장용 객체 변환)

DB에 Insert/Update 하기 위해 데이터를 단순 객체(Map)로 변환합니다.

```typescript
toMap(): object {
  return {
    // 1. String
    s: this.s,
    
    // 2. Number
    i: this.i,
    
    // 3. Boolean -> 0 or 1
    b: this.b ? 1 : 0,

    // 4. Float
    f: this.f,
    
    // 5. Date -> Timestamp
    d: this.d.getTime(),
    
    // 6. String Array -> JSON String
    l: JSON.stringify(this.l),

    // 7. Object/Map -> JSON String
    m: JSON.stringify(this.m),
    
    // 8. Nested Class -> toDataString() (직렬화된 문자열로 저장)
    c: this.c.toDataString(),
    
    // 9. Class Array -> 각 요소 직렬화 후 JSON String
    j: JSON.stringify(this.j.map((item) => item.toDataString())),
    
    // 10. Enum -> String 값
    e: this.e,

    docId: this.docId,
  };
}
```

### B. `static fromMap()` 구현 가이드 (DB 조회용 복원)

DB(`select *`)에서 가져온 Row 데이터를 객체로 복원합니다.

```typescript
static fromMap(row: any): Post {
  const object = new Post();

  // 1. String
  object.s = row.s || "";

  // 2. Number
  object.i = Number(row.i || 0);

  // 3. Boolean (1=true, 0=false)
  object.b = row.b === 1;

  // 4. Float
  object.f = Number(row.f || 0.0);

  // 5. Date (Timestamp -> Date)
  object.d = new Date(row.d || 0);

  // 6. String Array (JSON Parse)
  object.l = JSON.parse(row.l || "[]");

  // 7. Object (JSON Parse)
  object.m = JSON.parse(row.m || "{}");

  // 8. Nested Class (String -> Object)
  object.c = Other.fromDataString(row.c || new Other().toDataString());

  // 9. Class Array
  object.j = (JSON.parse(row.j || "[]") || [])
      .map((item: string) => Other.fromDataString(item));

  // 10. Enum
  object.e = EnumHelper.fromString(row.e || Enum.Default);

  object.docId = row.docId;

  return object;
}
```

---

## 2.1 중첩 클래스 구현 규칙 (Nested Class Rules)

**중첩 클래스(Nested Class)**는 독립적인 테이블이 아니므로 다음 규칙이 적용됩니다.

### 핵심 규칙
1.  **`docId` 제외**: 독립적으로 저장되지 않으므로 `docId` 필드가 없습니다.
2.  **Manager Class 제외**: `...Sqlite` 클래스를 만들지 않습니다.
3.  **필수 메서드 구현 (중요)**: `toDataString()`과 `static fromDataString()`을 **반드시** 구현해야 합니다. 부모 클래스에서 이 메서드들을 통해 직렬화/역직렬화를 수행하기 때문입니다.

---

## 2.2 Enum 구현 규칙 (Enum Rules)

**Enum**은 안전한 타입 변환을 위해 **Helper 클래스**와 함께 정의해야 합니다.

### 핵심 규칙
1.  **Helper 클래스**: Enum 이름 뒤에 `Helper`를 붙인 클래스를 `export` 합니다.
2.  **`fromString` 필수**: 문자열을 Enum으로 안전하게 변환하며, 실패 시 에러를 던져야 합니다.

---

---

## 3. SQLite 관리 클래스 구현 (Manager Class)

`sqlite3` 라이브러리를 사용하며, **Singleton 패턴**과 **Promise Wrapper** 패턴을 적용합니다.

### 3.1 기본 골격 및 Singleton (`PostSqlite`)

```typescript
import sqlite3 from "sqlite3";
import path from "path";

export class PostSqlite {
  private static dbInstance: sqlite3.Database;

  // DB 연결 및 테이블 생성 보장
  static async getDb(): Promise<sqlite3.Database> {
    if (!this.dbInstance) {
      // DB 파일 위치: 해당 모듈 폴더 내 (예: backend/sqlite/post/Post.db)
      const dbPath = path.join(__dirname, "Post.db");

      this.dbInstance = await new Promise<sqlite3.Database>(
        (resolve, reject) => {
          const db = new sqlite3.Database(dbPath, (err) => {
            if (err) reject(err);
            else resolve(db);
          });
        }
      );

      // 테이블 생성 (최초 실행 시)
      await this.createTable();
    }
    return this.dbInstance;
  }
  
  // ... 메서드 구현들
}
```

### 3.2 핵심 기능 구현 (CRUD)

#### 3.2.1 테이블 생성 (`createTable`)
```typescript
private static async createTable() {
  const sql = `CREATE TABLE IF NOT EXISTS Post(` +
    `docId TEXT PRIMARY KEY` +
    `,s TEXT` +
    `,i INTEGER` +
    `,b INTEGER CHECK(b IN (0, 1))` + // Boolean Check
    `,f REAL` +
    `,d INTEGER` +
    `,l TEXT` +
    `,m TEXT` +
    `,c TEXT` + // Nested Class도 TEXT로 저장
    `,j TEXT` +
    `,e TEXT` +
    `)`;

  await new Promise<void>((resolve, reject) => {
    this.dbInstance.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
```

#### 3.2.2 Helper 메서드 (`runQuery`, `getQuery`, `getAllQuery`)
콜백 방식의 sqlite3를 Promise로 감싸서 사용합니다.

```typescript
static async runQuery(query: string, params: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    PostSqlite.dbInstance.run(query, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

static async getQuery<T>(query: string, params: any[]): Promise<T> {
  return new Promise((resolve, reject) => {
    PostSqlite.dbInstance.get(query, params, (err, row: T) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

static async getAllQuery<T>(query: string, params: any[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    PostSqlite.dbInstance.all(query, params, (err, rows: T[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
```

#### 3.2.3 단일 삽입 (`insert`) 및 조회 (`get`)
```typescript
static async insert(object: Post) {
  await PostSqlite.getDb();
  const sql = `INSERT INTO Post (docId, s, i, b, f, d, l, m, c, j, e) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    object.docId, 
    object.s, 
    object.i, 
    object.b ? 1 : 0,
    object.f,
    object.d.getTime(),
    JSON.stringify(object.l),
    JSON.stringify(object.m),
    object.c.toDataString(),
    JSON.stringify(object.j.map((model) => model.toDataString())),
    object.e
  ];
  await this.runQuery(sql, values);
}

static async get(docId: string): Promise<Post | null> {
  await PostSqlite.getDb();
  const sql = `SELECT * FROM Post WHERE docId = ?`;
  const row = await this.getQuery(sql, [docId]);
  if (!row) return null;
  return Post.fromMap(row);
}
```

#### 3.2.4 대량 삽입/업데이트 (`upsertBulk`)
대량 데이터 처리 시 성능을 위해 **Batch 처리** 및 `ON CONFLICT DO UPDATE` 구문을 사용합니다.

```typescript
static async upsertBulk(objects: Post[]) {
  await PostSqlite.getDb();

  const baseSql = `INSERT INTO Post (docId, s, i, b, f, d, l, m, c, j, e) VALUES `;
  
  const valuesArray = objects.map((object) => [
    object.docId, 
    object.s, 
    object.i, 
    object.b ? 1 : 0,
    object.f,
    object.d.getTime(),
    JSON.stringify(object.l),
    JSON.stringify(object.m),
    object.c.toDataString(),
    JSON.stringify(object.j.map((model) => model.toDataString())),
    object.e
  ]);

  const BATCH_SIZE = 10000;

  for (let i = 0; i < valuesArray.length; i += BATCH_SIZE) {
    const batchValues = valuesArray.slice(i, i + BATCH_SIZE);
    
    // (?, ?, ..., ?) 패턴 생성
    const placeholders = batchValues.map(() => `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).join(",");
    
    // ON CONFLICT 구문: docId가 충돌하면 기존 값을 덮어씌움 (UPDATE)
    // 필요한 다른 필드도 `col = excluded.col` 형태로 추가 업데이트 가능
    const batchSQL = baseSql + placeholders + 
      ` ON CONFLICT(docId) DO UPDATE SET 
          s = excluded.s,
          i = excluded.i,
          b = excluded.b,
          f = excluded.f,
          d = excluded.d,
          l = excluded.l,
          m = excluded.m,
          c = excluded.c,
          j = excluded.j,
          e = excluded.e`;

    await this.runQuery(batchSQL, batchValues.flat());
  }
}
```

#### 3.2.5 업데이트 (`update` & `upsert`)

```typescript
static async update(object: Post) {
  await PostSqlite.getDb();

  const sql = `UPDATE Post SET 
    s = ?, i = ?, b = ?, f = ?, d = ?, l = ?, m = ?, c = ?, j = ?, e = ? 
    WHERE docId = ?`;

  const values = [
    object.s, 
    object.i, 
    object.b ? 1 : 0,
    object.f,
    object.d.getTime(),
    JSON.stringify(object.l),
    JSON.stringify(object.m),
    object.c.toDataString(),
    JSON.stringify(object.j.map((model) => model.toDataString())),
    object.e,
    object.docId // WHERE docId = ?
  ];
  
  await this.runQuery(sql, values);
}

static async upsert(object: Post) {
  if ((await this.get(object.docId)) == null) {
    await this.insert(object);
  } else {
    await this.update(object);
  }
```

#### 3.2.6 테이블 삭제 (`dropTable`)
```typescript
static async dropTable() {
  await PostSqlite.getDb();
  await new Promise<void>((resolve, reject) => {
    PostSqlite.dbInstance.run("DROP TABLE IF EXISTS Post", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
```

---

## 4. 인덱스 관리 (`createIndex`)

성능 최적화를 위해 필요한 컬럼에 인덱스를 생성하는 메서드를 제공합니다.

```typescript
static createIndex(columns: string[]): Promise<void> {
  if (columns.length == 0) return Promise.resolve();
  // 인덱스 명명 규칙: idx_컬럼명_조합
  let indexName = `idx_${columns.join("_")}`.replace(/\(.*?\)/g, ""); 
  const sql = `CREATE INDEX IF NOT EXISTS ${indexName} ON Post (${columns.join(", ")})`;
  
  return new Promise((resolve, reject) => {
    PostSqlite.dbInstance.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
```

---

## 5. 실행 스크립트 템플릿

모델 폴더 내부에 **유틸리티 스크립트**와 **실행 연습장(`note`)**을 위한 폴더를 별도로 구성합니다.

### 구조 예시
```
backend/sqlite/post/
├── _.ts                   <-- 모델 본체
├── create_table.ts        <-- 테이블 생성
├── drop_table.ts          <-- 테이블 삭제
├── reset_table.ts         <-- 테이블 리셋 (DROP + CREATE)
└── note/
    └── _.ts               <-- 실행 연습장 (Playground)
```

### 5.1 테이블 생성 스크립트 (`create_table.ts`)
```typescript
import { PostSqlite } from "./_";

;(async () => {
    console.log("📦 테이블 생성 시작...");
    await PostSqlite.getDb(); // getDb 호출 시 createTable 자동 수행
    console.log("✅ 테이블 생성 완료");
    process.exit(0);
})();

export {};
```

### 5.2 테이블 삭제 스크립트 (`drop_table.ts`)
```typescript
import { PostSqlite } from "./_";

;(async () => {
    console.log("🗑️ 테이블 삭제 시작...");
    await PostSqlite.dropTable();
    console.log("✅ 테이블 삭제 완료");
    process.exit(0);
})();

export {};
```

### 5.3 테이블 리셋 스크립트 (`reset_table.ts`)
기존 데이터를 모두 삭제하고 테이블을 새로 생성합니다.
```typescript
import { PostSqlite } from "./_";

;(async () => {
    console.log("🔄 테이블 리셋 시작...");
    await PostSqlite.dropTable();
    console.log("  ✅ 삭제 완료");
    await PostSqlite.getDb(); // 재생성
    console.log("  ✅ 생성 완료");
    console.log("🎉 테이블 리셋 완료!");
    process.exit(0);
})();

export {};
```

### 5.4 실행 연습장 (`note/_.ts`)

개발 중 모델의 기능을 테스트하거나 사용 예시를 작성하는 공간입니다.

```typescript
import dotenv from "dotenv";
import { PostSqlite } from "../_";

dotenv.config();

;(async () => {
    console.log("start");
    // await PostSqlite.insert(...)
    process.exit(0);
})();

export {};
```
