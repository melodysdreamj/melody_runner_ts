# AI 코딩 가이드: DynamoDB 데이터 모델링

이 가이드는 `backend/client-dynamodb` 디렉토리 내에서 새로운 모델을 생성할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

새로운 모델을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

DynamoDB에 저장될 새로운 모델을 추가하려면, `backend/client-dynamodb` 폴더 아래에 **모델 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 모델 이름(영문 소문자, kebab-case 권장)으로 폴더를 생성합니다. 예: `posts`, `user_settings`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 데이터 모델 클래스와 DynamoDB 관리자(Manager) 클래스를 모두 포함합니다.
3.  **클래스 명명**:
    *   **데이터 모델**: 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `posts` -> `Post`
    *   **DynamoDB 관리자**: 모델 이름 뒤에 `ClientDynamoDB`를 붙입니다. 예: `PostClientDynamoDB`

### 구조 예시
```
backend/client-dynamodb/
├── post/               <-- 새로운 모델 폴더 (예: 게시글)
│   ├── _.ts            <-- 모델 정의 (Class Post) 및 관리자 (Class PostClientDynamoDB)
│   ├── create_table.ts <-- 테이블 생성 스크립트
│   ├── delete_table.ts <-- 테이블 삭제 스크립트
│   ├── reset_table.ts  <-- 테이블 리셋 (DELETE + CREATE) 스크립트
│   └── note/
│       └── _.ts        <-- 실행 연습장 (Playground)
├── user_profile/       <-- 새로운 모델 폴더 (예: 사용자 프로필)
│   └── _.ts            <-- 모델 정의 (Class UserProfile)
```

### 1.3 테스트 및 도커 환경 구조 (Test & Docker Structure) `[NEW]`

**모든 모델 폴더**는 독립적인 테스트 환경을 구축해야 합니다. 이를 위해 `test` 폴더를 생성하고 그 안에 **Docker 설정**과 **테스트 코드**를 배치합니다.

#### 규칙
1.  **`test` 폴더 생성**: 모델 폴더(`backend/client-dynamodb/<model>`) 안에 `test` 폴더를 생성합니다.
2.  **`docker-compose.yml`**: 해당 모델의 테스트만을 위한 **DynamoDB Local 컨테이너 설정**을 정의합니다.
3.  **`_.test.ts`**: 실제 테스트 코드를 작성합니다. 테스트 실행 전 `docker-compose`가 실행 상태여야 합니다.

#### 구조 예시
```
backend/client-dynamodb/post/
├── _.ts                   <-- 모델 정의
├── test/                  <-- [NEW] 독립 테스트 환경
│   ├── docker-compose.yml <-- 이 모델만을 위한 DynamoDB Local
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
### 1.1 중첩 클래스 구조 (Nested Class Structure)

데이터 모델이 복잡해져서 **중첩 클래스(Nested Class)**가 필요한 경우, 부모 테이블 폴더 하위에 **`sub` 폴더**를 만들고 그 안에 파일을 생성합니다.

#### 규칙
1.  **`sub` 폴더 생성**: 부모 폴더 아래에 `sub` 폴더를 생성합니다.
2.  **파일 생성**: `sub` 폴더 안에 **클래스 이름(camelCase)**으로 파일을 생성합니다. (예: `address.ts`, `metaData.ts`)
    *   **주의**: 중첩 클래스는 `_.ts`가 아니라 **구체적인 파일명**을 가집니다.

#### 구조 예시
```
backend/client-dynamodb/
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
backend/client-dynamodb/
├── user/               <-- 부모 모델
│   ├── _.ts
│   ├── sub/            <-- 중첩 클래스
│   └── enums/          <-- Enum 모음 폴더
│       ├── user_role.ts <-- Enum 파일 (snake_case)
│       └── status.ts    <-- Enum 파일
```

---

## 2. 데이터 모델 클래스 구현 상세 가이드

`_.ts` 파일 내부의 DTO 클래스는 다음 메서드들을 **반드시** 포함해야 하며, **10가지 핵심 데이터 타입**을 빠짐없이 처리해야 합니다.

### 처리해야 할 데이터 타입 및 저장 방식 (DynamoDB Attribute Type)
1.  **String** -> `S` (String)
2.  **Number** -> `N` (Number String)
3.  **Boolean** -> `BOOL` (Boolean)
4.  **Float** -> `N` (Number String)
5.  **Date** -> `N` (Timestamp Number String)
6.  **String Array** -> `SS` (String Set) 또는 `L` (List of S) (여기선 `L` 권장, JSON String으로 저장 가능)
7.  **Object (Map)** -> `M` (Map) 또는 `S` (JSON String) (여기선 `S` JSON String 권장)
8.  **Nested Class** -> `S` (toDataString() 직렬화)
9.  **Class Array** -> `L` (List of S - toDataString() 직렬화된 문자열 리스트)
10. **Enum** -> `S` (String 값)

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

### B. `toMap()` 구현 가이드 (DynamoDB Item 변환)

DynamoDB SDK(`@aws-sdk/client-dynamodb`)에 전달하기 위한 Item 객체로 변환합니다.

```typescript
toMap(): Record<string, any> {
  return {
    // 1. String
    s: { S: this.s },
    
    // 2. Number
    i: { N: this.i.toString() },
    
    // 3. Boolean
    b: { BOOL: this.b },

    // 4. Float
    f: { N: this.f.toString() },
    
    // 5. Date -> Timestamp Number
    d: { N: this.d.getTime().toString() },
    
    // 6. String Array -> List of String (or SS)
    l: { S: JSON.stringify(this.l) }, // 단순화를 위해 JSON String 저장 권장

    // 7. Object/Map -> JSON String
    m: { S: JSON.stringify(this.m) },
    
    // 8. Nested Class -> toDataString() (직렬화된 문자열로 저장)
    c: { S: this.c.toDataString() },
    
    // 9. Class Array -> List of String (직렬화된 문자열 리스트)
    j: { L: this.j.map((item) => ({ S: item.toDataString() })) },
    
    // 10. Enum -> String 값
    e: { S: this.e },

    docId: { S: this.docId },
  };
}
```

### C. `static fromMap()` 구현 가이드 (DynamoDB Item 복원)

DynamoDB(`GetItem`)에서 가져온 Item 데이터를 객체로 복원합니다.

```typescript
static fromMap(item: any): Post {
  const object = new Post();

  // 1. String
  object.s = item.s?.S || "";

  // 2. Number
  object.i = Number(item.i?.N || 0);

  // 3. Boolean
  object.b = item.b?.BOOL || false;

  // 4. Float
  object.f = Number(item.f?.N || 0.0);

  // 5. Date
  object.d = new Date(Number(item.d?.N || 0));

  // 6. String Array (JSON Parse)
  object.l = JSON.parse(item.l?.S || "[]");

  // 7. Object (JSON Parse)
  object.m = JSON.parse(item.m?.S || "{}");

  // 8. Nested Class (String -> Object)
  object.c = Other.fromDataString(item.c?.S || new Other().toDataString());

  // 9. Class Array
  object.j = (item.j?.L || []).map((entry: any) => Other.fromDataString(entry.S));

  // 10. Enum
  object.e = EnumHelper.fromString(item.e?.S || Enum.Default);

  object.docId = item.docId?.S || "";

  return object;
}
```

---

## 2.1 중첩 클래스 구현 규칙 (Nested Class Rules)

**중첩 클래스(Nested Class)**는 독립적인 테이블이 아니므로 다음 규칙이 적용됩니다.

### 핵심 규칙
1.  **`docId` 제외**: 독립적으로 저장되지 않으므로 `docId` 필드가 없습니다.
2.  **Manager Class 제외**: `...ClientDynamoDB` 클래스를 만들지 않습니다.
3.  **필수 메서드 구현 (중요)**: `toDataString()`과 `static fromDataString()`을 **반드시** 구현해야 합니다. 부모 클래스에서 이 메서드들을 통해 직렬화/역직렬화를 수행하기 때문입니다.

---

## 2.2 Enum 구현 규칙 (Enum Rules)

**Enum**은 안전한 타입 변환을 위해 **Helper 클래스**와 함께 정의해야 합니다.

### 핵심 규칙
1.  **Helper 클래스**: Enum 이름 뒤에 `Helper`를 붙인 클래스를 `export` 합니다.
2.  **`fromString` 필수**: 문자열을 Enum으로 안전하게 변환하며, 실패 시 에러를 던져야 합니다.

---

## 3. DynamoDB 관리 클래스 구현 (Manager Class)

`@aws-sdk/client-dynamodb` 라이브러리를 사용하며, **Singleton 패턴** 또는 정적 인스턴스를 통해 클라이언트를 관리합니다.

### 3.1 기본 골격 및 Client 설정 (`PostClientDynamoDB`)

```typescript
import { DynamoDBClient, CreateTableCommand, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

export class PostClientDynamoDB {
  static client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
  
  static TableName = "Post";

  // ... 메서드 구현들
}
```

### 3.2 핵심 기능 구현 (CRUD)

#### 3.2.1 테이블 생성 (`createTable`)

```typescript
static async createTable() {
  const command = new CreateTableCommand({
    TableName: PostClientDynamoDB.TableName,
    KeySchema: [{ AttributeName: "docId", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "docId", AttributeType: "S" }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  });

  try {
    await PostClientDynamoDB.client.send(command);
    console.log("Table created successfully");
  } catch (err: any) {
    if (err.name === "ResourceInUseException") {
      console.log("Table already exists");
    } else {
      throw err;
    }
  }
}
```

#### 3.2.2 단일 삽입 (`insert` / `putItem`)

`PutItem`은 기존 키가 있으면 덮어쓰기(Upsert)하므로 Insert와 Update를 겸할 수 있습니다.

```typescript
static async insert(object: Post) {
  const command = new PutItemCommand({
    TableName: PostClientDynamoDB.TableName,
    Item: object.toMap(),
  });
  await PostClientDynamoDB.client.send(command);
}
```

#### 3.2.3 조회 (`get`)

```typescript
static async get(docId: string): Promise<Post | null> {
  const command = new GetItemCommand({
    TableName: PostClientDynamoDB.TableName,
    Key: { docId: { S: docId } },
  });

  const result = await PostClientDynamoDB.client.send(command);
  if (!result.Item) return null;
  return Post.fromMap(result.Item);
}

#### 3.2.4 삭제 (`delete`)

```typescript
static async delete(docId: string): Promise<void> {
  const command = new DeleteItemCommand({
    TableName: PostClientDynamoDB.TableName,
    Key: { docId: { S: docId } },
  });
  await PostClientDynamoDB.client.send(command);
}
```

#### 3.2.5 테이블 삭제 (`deleteTable`)
```typescript
static async deleteTable() {
  const command = new DeleteTableCommand({
    TableName: PostClientDynamoDB.TableName,
  });

  try {
    await PostClientDynamoDB.client.send(command);
    console.log("Table deleted successfully");
  } catch (err: any) {
    if (err.name === "ResourceNotFoundException") {
      console.log("Table does not exist");
    } else {
      throw err;
    }
  }
}
```

---

## 4. 실행 스크립트 템플릿

모델 폴더 내부에 **유틸리티 스크립트**와 **실행 연습장(`note`)**을 위한 폴더를 별도로 구성합니다.

### 구조 예시
```
backend/client-dynamodb/post/
├── _.ts                   <-- 모델 본체
├── create_table.ts        <-- 테이블 생성
├── delete_table.ts        <-- 테이블 삭제
├── reset_table.ts         <-- 테이블 리셋 (DELETE + CREATE)
└── note/
    └── _.ts               <-- 실행 연습장 (Playground)
```

### 4.1 테이블 생성 스크립트 (`create_table.ts`)
```typescript
import { PostClientDynamoDB } from "./_";

;(async () => {
    console.log("📦 테이블 생성 시작...");
    await PostClientDynamoDB.createTable();
    console.log("✅ 테이블 생성 완료");
    process.exit(0);
})();

export {};
```

### 4.2 테이블 삭제 스크립트 (`delete_table.ts`)
```typescript
import { PostClientDynamoDB } from "./_";

;(async () => {
    console.log("🗑️ 테이블 삭제 시작...");
    await PostClientDynamoDB.deleteTable();
    console.log("✅ 테이블 삭제 완료");
    process.exit(0);
})();

export {};
```

### 4.3 테이블 리셋 스크립트 (`reset_table.ts`)
기존 테이블을 삭제하고 새로 생성합니다.
```typescript
import { PostClientDynamoDB } from "./_";

;(async () => {
    console.log("🔄 테이블 리셋 시작...");
    await PostClientDynamoDB.deleteTable();
    console.log("  ✅ 삭제 완료");
    // DynamoDB 테이블 삭제는 비동기적으로 처리될 수 있으므로 대기
    await new Promise(resolve => setTimeout(resolve, 5000));
    await PostClientDynamoDB.createTable();
    console.log("  ✅ 생성 완료");
    console.log("🎉 테이블 리셋 완료!");
    process.exit(0);
})();

export {};
```

### 4.4 실행 연습장 (`note/_.ts`)

개발 중 모델의 기능을 테스트하거나 사용 예시를 작성하는 공간입니다.

```typescript
import { PostClientDynamoDB } from "../_";

;(async () => {
    console.log("start");
    // await PostClientDynamoDB.insert(...)
    process.exit(0);
})();

export {};
```
