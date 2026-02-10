# AI 코딩 가이드: MariaDB 데이터 모델링

이 가이드는 `backend/mariadb` 디렉토리 내에서 새로운 모델을 생성할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

새로운 모델을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

MariaDB에 저장될 새로운 모델을 추가하려면, `backend/mariadb` 폴더 아래에 **모델 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 모델 이름(영문 소문자, kebab-case 권장)으로 폴더를 생성합니다. 예: `posts`, `user_settings`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 데이터 모델 클래스와 MariaDB 관리자(Manager) 클래스를 모두 포함합니다.
3.  **클래스 명명**:
    *   **데이터 모델**: 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `posts` -> `Post`
    *   **MariaDB 관리자**: 모델 이름 뒤에 `MySql`을 붙입니다 (MariaDB/MySQL 호환). 예: `PostMySql`

### 구조 예시
```
backend/mariadb/
├── post/               <-- 새로운 모델 폴더 (예: 게시글)
│   ├── _.ts            <-- 모델 정의 (Class Post) 및 관리자 (Class PostMySql)
│   ├── create_table.ts <-- 테이블 생성 스크립트
│   ├── drop_table.ts   <-- 테이블 삭제 스크립트
│   ├── reset_table.ts  <-- 테이블 리셋 (DROP + CREATE) 스크립트
│   └── note/
│       └── _.ts        <-- 실행 연습장 (Playground)
├── user_profile/       <-- 새로운 모델 폴더 (예: 사용자 프로필)
│   └── _.ts            <-- 모델 정의 (Class UserProfile)
```

### 1.3 테스트 및 도커 환경 구조 (Test & Docker Structure) `[NEW]`

**모든 모델 폴더**는 독립적인 테스트 환경을 구축해야 합니다. 이를 위해 `test` 폴더를 생성하고 그 안에 **Docker 설정**과 **테스트 코드**를 배치합니다.

#### 규칙
1.  **`test` 폴더 생성**: 모델 폴더(`backend/mariadb/<model>`) 안에 `test` 폴더를 생성합니다.
2.  **`docker-compose.yml`**: 해당 모델의 테스트만을 위한 **MariaDB 컨테이너 설정**을 정의합니다.
3.  **`_.test.ts`**: 실제 테스트 코드를 작성합니다. 테스트 실행 전 `docker-compose`가 실행 상태여야 합니다.

#### 구조 예시
```
backend/mariadb/post/
├── _.ts                   <-- 모델 정의
├── test/                  <-- [NEW] 독립 테스트 환경
│   ├── docker-compose.yml <-- 이 모델만을 위한 MariaDB 컨테이너
│   └── _.test.ts          <-- 통합 테스트 코드
├── note/
│   └── _.ts
```

#### 테스트 코드 작성 필수 요건 (`_.test.ts`)
테스트 코드는 단순히 "성공" 여부만 확인하는 것이 아니라, 다음 항목들을 빠짐없이 검증해야 합니다.

1.  **모든 데이터 타입 검증 (10 Types Coverage)**:
    *   `Map`, `Array`, `Date` 등이 정상적으로 저장되고 복원(`toDataString` -> `fromDataString`) 되는지 확인.
    *   특히 **Nested Class**와 **Enum**의 직렬화/역직렬화 정합성 검증 필수.
2.  **모든 기능 메서드 검증 (Function Coverage)**:
    *   `insert`, `update`, `upsert`, `get`, `delete` 등 구현된 모든 메서드의 동작 확인.
3.  **엣지 케이스 확인 (Edge Cases)**:
    *   `null` 또는 빈 값(`[]`, `{}`) 처리 확인.

### 1.1 중첩 클래스 구조 (Nested Class Structure)
---

## 2. 데이터 모델 클래스 구현 상세 가이드

`_.ts` 파일 내부의 DTO 클래스는 다음 메서드들을 **반드시** 포함해야 하며, `toMap`, `fromMap` 메서드가 핵심적인 역할을 합니다.

### 처리해야 할 데이터 타입 및 저장 방식 (MariaDB Column Type)
1.  **String** -> `LONGTEXT` (기본) 또는 `VARCHAR(N)` (PK 등 짧은 문자열)
2.  **Number** -> `BIGINT` (정수)
3.  **Boolean** -> `INTEGER` (0: false, 1: true)
4.  **Float** -> `DOUBLE`
5.  **Date** -> `BIGINT` (Timestamp)
6.  **String Array** -> `LONGTEXT` (JSON Stringify)
7.  **Object (Map)** -> `LONGTEXT` (JSON Stringify)
8.  **Nested Class** -> `LONGTEXT` (toDataString() 직렬화)
9.  **Class Array** -> `LONGTEXT` (직렬화된 객체 배열 JSON)
10. **Enum** -> `LONGTEXT` (String 값)

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
  object.d = new Date(Number(row.d || 0)); // BIGINT는 String/Number로 올 수 있으므로 Number로 변환

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
2.  **Manager Class 제외**: `...MySql` 클래스를 만들지 않습니다.
3.  **필수 메서드 구현 (중요)**: `toDataString()`과 `static fromDataString()`을 **반드시** 구현해야 합니다. 부모 클래스에서 이 메서드들을 통해 직렬화/역직렬화를 수행하기 때문입니다.

---

## 2.2 Enum 구현 규칙 (Enum Rules)

**Enum**은 안전한 타입 변환을 위해 **Helper 클래스**와 함께 정의해야 합니다.

### 핵심 규칙
1.  **Helper 클래스**: Enum 이름 뒤에 `Helper`를 붙인 클래스를 `export` 합니다.
2.  **`fromString` 필수**: 문자열을 Enum으로 안전하게 변환하며, 실패 시 에러를 던져야 합니다.

---

---

## 3. MariaDB 관리 클래스 구현 (Manager Class)

`mariadb` 라이브러리를 사용하며, **Connection Pool**을 사용하여 효율적으로 연결을 관리합니다.

### 3.1 기본 골격 및 Pool 설정 (`PostMySql`)

```typescript
import mariadb from "mariadb";
import dotenv from "dotenv";

dotenv.config();

export class PostMySql {
  static pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
    acquireTimeout: 20000000,
    leakDetectionTimeout: 20000,
  });

  // ... 메서드 구현들
}
```

### 3.2 핵심 기능 구현 (CRUD)

#### 3.2.1 테이블 생성 (`createTable`)
`ENGINE=InnoDB`, `utf8mb4_general_ci`를 사용하여 테이블을 생성합니다.

```typescript
static async createTable() {
  const createTableSQL: string =
    `CREATE TABLE IF NOT EXISTS Post(` +
    `docId VARCHAR(512) PRIMARY KEY` +
    `,s LONGTEXT` +
    `,i BIGINT` +
    `,b INTEGER CHECK(b IN (0, 1))` +
    `,f DOUBLE` +
    `,d BIGINT` +
    `,l LONGTEXT` +
    `,m LONGTEXT` +
    `,c LONGTEXT` +
    `,j LONGTEXT` +
    `,e LONGTEXT` +
    `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;`;

  const conn = await PostMySql.pool.getConnection();
  await conn.execute(createTableSQL);
  conn.release();
}
```

#### 3.2.2 단일 삽입 (`insert`)
```typescript
static async insert(object: Post) {
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

  const conn = await PostMySql.pool.getConnection();
  await conn.query(sql, values);
  await conn.commit();
  await conn.release();
}
```

#### 3.2.3 업데이트 (`update`)
```typescript
static async update(object: Post) {
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
    object.docId
  ];

  const conn = await PostMySql.pool.getConnection();
  await conn.query(sql, values);
  await conn.commit();
  await conn.release();
}
```

#### 3.2.4 대량 삽입 (`insertBulk`)
**Transaction**을 사용하여 대량 데이터를 안전하게 삽입합니다.

```typescript
static async insertBulk(objects: Post[]) {
  const sql = `INSERT INTO Post (docId, s, i, b, f, d, l, m, c, j, e) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const conn = await PostMySql.pool.getConnection();

  try {
    await conn.beginTransaction();

    for (const object of objects) {
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
      await conn.query(sql, values);
    }
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    console.error("Error inserting bulk data:", error);
    throw error;
  } finally {
    await conn.release();
  }
}
```

#### 3.2.5 조회 (`get` & `upsert`)
```typescript
static async get(docId: string): Promise<Post | null> {
  const sql = `SELECT * FROM Post WHERE docId = ?`;
  const conn = await PostMySql.pool.getConnection();
  const rows = await conn.query(sql, [docId]);
  await conn.release();

  if (rows.length === 0) return null;
  return Post.fromMap(rows[0]);
}

static async upsert(object: Post) {
  if ((await this.get(object.docId)) == null) {
    await this.insert(object);
  } else {
    await this.update(object);
  }
}
```

#### 3.2.6 테이블 삭제 (`dropTable`)
```typescript
static async dropTable() {
  const conn = await PostMySql.pool.getConnection();
  await conn.execute("DROP TABLE IF EXISTS Post");
  conn.release();
}
```

---

## 4. 인덱스 관리 (`createIndex`)

```typescript
async createIndex(name: string, columns: string[]) {
  if (columns.length == 0) return;

  // 인덱스 명명 규칙: idx_이름 (괄호 등 특수문자 제거)
  let indexName = `idx_${name}`.replace(/\(.*?\)/g, "");
  
  const sql = `CREATE INDEX IF NOT EXISTS ${indexName} ON Post (${columns.join(", ")})`;

  const conn = await PostMySql.pool.getConnection();
  try {
    await conn.query(sql);
    console.log(`Index ${indexName} created successfully`);
  } catch (error) {
    console.error("Error creating index:", error);
    throw error;
  } finally {
    conn.release();
  }
}
```

---

## 5. 실행 스크립트 템플릿

모델 폴더 내부에 **유틸리티 스크립트**와 **실행 연습장(`note`)**을 위한 폴더를 별도로 구성합니다.

### 구조 예시
```
backend/mariadb/post/
├── _.ts                   <-- 모델 본체
├── create_table.ts        <-- 테이블 생성
├── drop_table.ts          <-- 테이블 삭제
├── reset_table.ts         <-- 테이블 리셋 (DROP + CREATE)
└── note/
    └── _.ts               <-- 실행 연습장 (Playground)
```

### 5.1 테이블 생성 스크립트 (`create_table.ts`)
```typescript
import { PostMySql } from "./_";

;(async () => {
    console.log("📦 테이블 생성 시작...");
    await PostMySql.createTable();
    console.log("✅ 테이블 생성 완료");
    await PostMySql.pool.end();
    process.exit(0);
})();

export {};
```

### 5.2 테이블 삭제 스크립트 (`drop_table.ts`)
```typescript
import { PostMySql } from "./_";

;(async () => {
    console.log("🗑️ 테이블 삭제 시작...");
    await PostMySql.dropTable();
    console.log("✅ 테이블 삭제 완료");
    await PostMySql.pool.end();
    process.exit(0);
})();

export {};
```

### 5.3 테이블 리셋 스크립트 (`reset_table.ts`)
기존 데이터를 모두 삭제하고 테이블을 새로 생성합니다.
```typescript
import { PostMySql } from "./_";

;(async () => {
    console.log("🔄 테이블 리셋 시작...");
    await PostMySql.dropTable();
    console.log("  ✅ 삭제 완료");
    await PostMySql.createTable();
    console.log("  ✅ 생성 완료");
    console.log("🎉 테이블 리셋 완료!");
    await PostMySql.pool.end();
    process.exit(0);
})();

export {};
```

### 5.4 실행 연습장 (`note/_.ts`)

개발 중 모델의 기능을 테스트하거나 사용 예시를 작성하는 공간입니다.

```typescript
import { PostMySql } from "../_";

;(async () => {
    console.log("start");
    // await PostMySql.createTable();
    process.exit(0);
})();

export {};
```
