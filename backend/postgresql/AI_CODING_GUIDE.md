# AI 코딩 가이드: PostgreSQL (pg-promise) 데이터 모델링

이 가이드는 `backend/postgresql` 디렉토리 내에서 새로운 모델을 생성할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

새로운 모델을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

PostgreSQL에 저장될 새로운 모델을 추가하려면, `backend/postgresql` 폴더 아래에 **모델 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 모델 이름(영문 소문자, kebab-case 권장)으로 폴더를 생성합니다. 예: `posts`, `user_settings`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 데이터 모델 클래스와 PostgreSQL 관리자(Manager) 클래스를 모두 포함합니다.
3.  **클래스 명명**:
    *   **데이터 모델**: 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `posts` -> `Post`
    *   **PostgreSQL 관리자**: 모델 이름 뒤에 `Postgresql`을 붙입니다. 예: `PostPostgresql`

### 구조 예시
```
backend/postgresql/
├── post/               <-- 새로운 모델 폴더 (예: 게시글)
│   ├── _.ts            <-- 모델 정의 (Class Post) 및 관리자 (Class PostPostgresql)
│   ├── create_table.ts <-- 테이블 생성 스크립트
│   ├── drop_table.ts   <-- 테이블 삭제 스크립트
│   ├── reset_table.ts  <-- 테이블 리셋 (DROP + CREATE) 스크립트
│   └── note/
│       └── _.ts        <-- 실행 연습장 (Playground)
├── user_profile/       <-- 새로운 모델 폴더
│   └── _.ts
```

### 1.3 테스트 및 도커 환경 구조 (Test & Docker Structure) `[NEW]`

**모든 모델 폴더**는 독립적인 테스트 환경을 구축해야 합니다. 이를 위해 `test` 폴더를 생성하고 그 안에 **Docker 설정**과 **테스트 코드**를 배치합니다.

#### 규칙
1.  **`test` 폴더 생성**: 모델 폴더(`backend/postgresql/<model>`) 안에 `test` 폴더를 생성합니다.
2.  **`docker-compose.yml`**: 해당 모델의 테스트만을 위한 **최소한의 DB 컨테이너 설정**을 정의합니다.
3.  **`_.test.ts`**: 실제 테스트 코드를 작성합니다. 테스트 실행 전 `docker-compose`가 실행 상태여야 합니다.

#### 구조 예시
```
backend/postgresql/post/
├── _.ts                   <-- 모델 정의
├── test/                  <-- [NEW] 독립 테스트 환경
│   ├── docker-compose.yml <-- 이 모델만을 위한 Postgres 컨테이너
│   └── _.test.ts          <-- 통합 테스트 코드 (Docker DB 연결 검증)
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
### 1.1 중첩 클래스 구조 (Nested Class Structure)

데이터 모델이 복잡해져서 **중첩 클래스(Nested Class)**가 필요한 경우, 부모 테이블 폴더 하위에 **`sub` 폴더**를 만들고 그 안에 파일을 생성합니다.

#### 규칙
1.  **`sub` 폴더 생성**: 부모 폴더 아래에 `sub` 폴더를 생성합니다.
2.  **파일 생성**: `sub` 폴더 안에 **클래스 이름(camelCase)**으로 파일을 생성합니다. (예: `address.ts`, `metaData.ts`)
    *   **주의**: 중첩 클래스는 `_.ts`가 아니라 **구체적인 파일명**을 가집니다.

#### 구조 예시
```
backend/postgresql/
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
backend/postgresql/
├── user/               <-- 부모 모델
│   ├── _.ts
│   ├── sub/            <-- 중첩 클래스
│   └── enums/          <-- Enum 모음 폴더
│       ├── user_role.ts <-- Enum 파일 (snake_case)
│       └── status.ts    <-- Enum 파일
```

---

## 2. 데이터 모델 클래스 구현 상세 가이드

`_.ts` 파일 내부의 DTO 클래스는 다음 메서드들을 **반드시** 포함해야 하며, `toMap`, `fromMap` 메서드가 핵심적인 역할을 합니다.

### 처리해야 할 데이터 타입 및 저장 방식 (PostgreSQL Column Type)
1.  **String** -> `TEXT` (기본) 또는 `VARCHAR(N)`
2.  **Number** -> `BIGINT` (정수)
3.  **Boolean** -> `INTEGER` (0: false, 1: true)
4.  **Float** -> `DOUBLE PRECISION`
5.  **Date** -> `BIGINT` (Timestamp)
6.  **String Array** -> `TEXT` (JSON Stringify)
7.  **Object (Map)** -> `TEXT` (JSON Stringify)
8.  **Nested Class** -> `TEXT` (toDataString() 직렬화)
9.  **Class Array** -> `TEXT` (직렬화된 객체 배열 JSON)
10. **Enum** -> `TEXT` (String 값)

---

### A. `toDataString()` & `fromDataString()` 구현 가이드 (직렬화/역직렬화)
Nested Class 저장이나 데이터 전송 시 사용되는 표준 직렬화 포맷입니다.

```typescript
import { Base64 } from "js-base64";

export class Post {
  constructor() {
    this.docId = Math.random().toString(36).substring(2, 12);
  }

  // 필드 정의
  // 1. String
  s: string = "";
  // 2. Number
  i: number = 0;
  // 3. Boolean
  b: boolean = false;
  // 4. Float
  f: number = 0.0;
  // 5. Date
  d: Date = new Date(0);
  // 6. String Array
  l: string[] = [];
  // 7. Object
  m: { [key: string]: any } = {};
  // 8. Nested Class
  c: Other = new Other();
  // 9. Class Array
  j: Other[] = [];
  // 10. Enum
  e: Enum = Enum.Default;

  docId: string = "";

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

### C. `static fromMap()` 구현 가이드 (DB 조회용 복원)

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
    object.d = new Date(Number(row.d || 0));

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
}
```

---

## 2.1 중첩 클래스 구현 규칙 (Nested Class Rules)

**중첩 클래스(Nested Class)**는 독립적인 테이블이 아니므로 다음 규칙이 적용됩니다.

### 핵심 규칙
1.  **`docId` 제외**: 독립적으로 저장되지 않으므로 `docId` 필드가 없습니다.
2.  **Manager Class 제외**: `...Postgresql` 클래스를 만들지 않습니다.
3.  **필수 메서드 구현 (중요)**: `toDataString()`과 `static fromDataString()`을 **반드시** 구현해야 합니다. 부모 클래스에서 이 메서드들을 통해 직렬화/역직렬화를 수행하기 때문입니다.

---

## 2.2 Enum 구현 규칙 (Enum Rules)

**Enum**은 안전한 타입 변환을 위해 **Helper 클래스**와 함께 정의해야 합니다.

### 핵심 규칙
1.  **Helper 클래스**: Enum 이름 뒤에 `Helper`를 붙인 클래스를 `export` 합니다.
2.  **`fromString` 필수**: 문자열을 Enum으로 안전하게 변환하며, 실패 시 에러를 던져야 합니다.

---

## 3. PostgreSQL 관리 클래스 구현 (Manager Class)

`pg-promise`를 사용하여 구현하며, **Connection Pool**을 `static` 프로퍼티로 관리합니다.
또한 **Named Parameters**(`$ {name}`)와 **ColumnSet Helper**를 적극 활용하여 PostgreSQL의 장점을 살립니다.

### 3.1 기본 골격 및 Pool 설정 (`PostPostgresql`)

```typescript
import pgPromise from "pg-promise";

// DB 연결 정보 (환경변수 사용)
const connectionDetails = {
  host: process.env.PG_HOST || "hostAddress",
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DB || "databaseName",
  user: process.env.PG_USER || "userName",
  password: process.env.PG_PASSWORD || "password",
};

export class PostPostgresql {
  // 1. Pool 초기화
  private static pgp = pgPromise({ capSQL: true });
  private static db = PostPostgresql.pgp(connectionDetails);

  // ... 기능 구현
}
```

### 3.2 핵심 기능 구현 (CRUD)

#### 3.2.1 테이블 생성 (`createTable`)
`CREATE TABLE IF NOT EXISTS`를 사용합니다.

```typescript
  static async createTable() {
    const createTableSQL: string =
      `CREATE TABLE IF NOT EXISTS "Post" (` +
      `"docId" TEXT PRIMARY KEY` +
      `,"s" TEXT` +
      `,"i" BIGINT` +
      `,"b" INTEGER CHECK("b" IN (0, 1))` +
      `,"f" DOUBLE PRECISION` +
      `,"d" BIGINT` +
      `,"l" TEXT` +
      `,"m" TEXT` +
      `,"c" TEXT` +
      `,"j" TEXT` +
      `,"e" TEXT` +
      `)`;
    await PostPostgresql.db.none(createTableSQL);
  }
```

#### 3.2.2 단일 삽입 (`insert`)
**Named Parameters**(`$ {propName}`)를 사용하여 직관적인 쿼리를 작성합니다.

```typescript
  static async insert(object: Post) {
    const sql =
      `insert into "Post" (` +
      `"docId", "s", "i", "b", "f", "d", "l", "m", "c", "j", "e"` +
      `) values (` +
      `\${docId}, \${s}, \${i}, \${b}, \${f}, \${d}, \${l}, \${m}, \${c}, \${j}, \${e}` +
      `)`;

    await PostPostgresql.db.none(sql, object.toMap());
  }
```

#### 3.2.3 업데이트 (`update`)
```typescript
  static async update(object: Post) {
    const sql =
      `update "Post" set ` +
      `"s" = \${s}, "i" = \${i}, "b" = \${b}, "f" = \${f}, "d" = \${d}, ` +
      `"l" = \${l}, "m" = \${m}, "c" = \${c}, "j" = \${j}, "e" = \${e} ` +
      `where "docId" = \${docId}`;

    await PostPostgresql.db.none(sql, object.toMap());
  }
```

#### 3.2.4 Upsert (`upsert`)
`ON CONFLICT`를 사용하여 하나의 쿼리로 처리합니다.

```typescript
  static async upsert(object: Post) {
    const sql =
      `INSERT INTO "Post" ("docId", "s", "i", "b", "f", "d", "l", "m", "c", "j", "e") ` +
      `VALUES (\${docId}, \${s}, \${i}, \${b}, \${f}, \${d}, \${l}, \${m}, \${c}, \${j}, \${e}) ` +
      `ON CONFLICT ("docId") DO UPDATE SET ` +
      `"s" = \${s}, "i" = \${i}, "b" = \${b}, "f" = \${f}, "d" = \${d}, ` +
      `"l" = \${l}, "m" = \${m}, "c" = \${c}, "j" = \${j}, "e" = \${e}`;
      
    await PostPostgresql.db.none(sql, object.toMap());
  }
```

#### 3.2.5 대량 Upsert (`upsertMany`)
`pg-promise`의 **`helpers.insert`**와 **`ColumnSet`**을 사용하여 대량 데이터를 고성능으로 처리합니다.

```typescript
  static async upsertMany(objects: Post[]) {
    if (!objects || objects.length === 0) return;

    // 1. 컬럼 정의
    const columns = [
      "docId", "s", "i", "b", "f", "d", "l", "m", "c", "j", "e"
    ];

    // 2. ColumnSet 생성
    const cs = new PostPostgresql.pgp.helpers.ColumnSet(columns, {
      table: "Post",
    });

    // 3. Update 구문 자동 생성
    const updateQuery = cs.assignColumns({ from: "EXCLUDED", skip: ["docId"] });

    // 4. Chunk 단위 Transaction 실행
    const chunkSize = 500;
    await PostPostgresql.db.tx(async (t) => {
      const queries = [];
      for (let i = 0; i < objects.length; i += chunkSize) {
        const chunk = objects.slice(i, i + chunkSize);
        const data = chunk.map((obj) => obj.toMap());

        // Batch Insert Query 생성
        const insertQuery = PostPostgresql.pgp.helpers.insert(data, cs);

        // Upsert 쿼리 조합
        const sql = `${insertQuery} ON CONFLICT ("docId") DO UPDATE SET ${updateQuery}`;

        queries.push(t.none(sql));
      }
      return t.batch(queries);
    });
  }
```

#### 3.2.6 조회 (`get`, `getAll`)
`getAll`은 **Keyset Pagination**을 적용하여 성능을 최적화합니다.

```typescript
  static async get(docId: string): Promise<Post | null> {
    const sql = 'SELECT * FROM "Post" WHERE "docId" = \${docId}';
    const result = await PostPostgresql.db.oneOrNone(sql, { docId });
    return result ? Post.fromMap(result) : null;
  }

  static async getAll(): Promise<Post[]> {
    const allResults: Post[] = [];
    const chunkSize = 10000; 
    let lastDocId: string | null = null;
    let keepFetching = true;

    while (keepFetching) {
      // Keyset Pagination 쿼리
      const sql = lastDocId === null
        ? 'SELECT * FROM "Post" ORDER BY "docId" LIMIT \${chunkSize}'
        : 'SELECT * FROM "Post" WHERE "docId" > \${lastDocId} ORDER BY "docId" LIMIT \${chunkSize}';
      
      const params = { chunkSize, lastDocId };
      const chunk = await PostPostgresql.db.any(sql, params);

      if (chunk.length > 0) {
        allResults.push(...chunk.map((row) => Post.fromMap(row)));
        lastDocId = chunk[chunk.length - 1].docId;
      }

      if (chunk.length < chunkSize) keepFetching = false;
    }
    return allResults;
  }
```

#### 3.2.7 연결 종료 (`closeConnection`)
```typescript
  static async closeConnection() {
    await PostPostgresql.pgp.end(); 
  }
```

#### 3.2.8 테이블 삭제 (`dropTable`)
```typescript
  static async dropTable() {
    await PostPostgresql.db.none('DROP TABLE IF EXISTS "Post"');
  }
}
```

---

## 4. 인덱스 관리 (`createIndex`)

```typescript
  static async createIndex(name: string, columns: string[]) {
    if (columns.length == 0) return;
    
    // 식별자 Sanitization 권장
    const indexName = `idx_${name}_${columns.join("_")}`.replace(/[^a-zA-Z0-9_]/g, "");
    const safeColumns = columns.map(c => `"${c}"`).join(", ");
    
    const sql = `CREATE INDEX IF NOT EXISTS "${indexName}" ON "Post" (${safeColumns})`;
    await PostPostgresql.db.none(sql);
  }
```

---

## 5. 실행 스크립트 템플릿

모델 폴더 내부에 **유틸리티 스크립트**와 **실행 연습장(`note`)**을 위한 폴더를 별도로 구성합니다.

### 5.1 테이블 생성 스크립트 (`create_table.ts`)
```typescript
import { PostPostgresql } from "./_";

;(async () => {
    console.log("📦 테이블 생성 시작...");
    await PostPostgresql.createTable();
    console.log("✅ 테이블 생성 완료");
    await PostPostgresql.closeConnection();
    process.exit(0);
})();

export {};
```

### 5.2 테이블 삭제 스크립트 (`drop_table.ts`)
```typescript
import { PostPostgresql } from "./_";

;(async () => {
    console.log("🗑️ 테이블 삭제 시작...");
    await PostPostgresql.dropTable();
    console.log("✅ 테이블 삭제 완료");
    await PostPostgresql.closeConnection();
    process.exit(0);
})();

export {};
```

### 5.3 테이블 리셋 스크립트 (`reset_table.ts`)
기존 데이터를 모두 삭제하고 테이블을 새로 생성합니다.
```typescript
import { PostPostgresql } from "./_";

;(async () => {
    console.log("🔄 테이블 리셋 시작...");
    await PostPostgresql.dropTable();
    console.log("  ✅ 삭제 완료");
    await PostPostgresql.createTable();
    console.log("  ✅ 생성 완료");
    console.log("🎉 테이블 리셋 완료!");
    await PostPostgresql.closeConnection();
    process.exit(0);
})();

export {};
```

### 5.4 실행 연습장 (`note/_.ts`)
```typescript
import dotenv from "dotenv";
import { PostPostgresql } from "../_";

dotenv.config();

;(async () => {
    console.log("start");
    try {
        const all = await PostPostgresql.getAll();
        console.log(`Fetched ${all.length} records.`);
    } catch (e) {
        console.log("Error:", e);
    }
    await PostPostgresql.closeConnection();
    process.exit(0);
})();

export {};
```
