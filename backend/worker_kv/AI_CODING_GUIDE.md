# AI 코딩 가이드: WorkerKV 데이터 모델링

이 가이드는 `backend/worker_kv` 디렉토리 내에서 새로운 모델을 생성할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

새로운 모델을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

WorkerKV에 저장될 새로운 모델을 추가하려면, `worker_kv` 폴더 아래에 **모델 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 모델 이름(영문 소문자, kebab-case 권장)으로 폴더를 생성합니다. 예: `posts`, `user_settings`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 데이터 모델 클래스와 KV 관리자(Manager) 클래스를 모두 포함합니다.
3.  **클래스 명명**:
    *   **데이터 모델**: 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `posts` -> `Post`
    *   **KV 관리자**: 모델 이름 뒤에 `WorkerKV`를 붙입니다. 예: `PostWorkerKV`

### 구조 예시
```
backend/worker_kv/
├── post/               <-- 새로운 모델 폴더 (예: 게시글)
│   └── _.ts            <-- 모델 정의 (Class Post) 및 관리자 (Class PostWorkerKV)
├── user_profile/       <-- 새로운 모델 폴더 (예: 사용자 프로필)
│   └── _.ts            <-- 모델 정의 (Class UserProfile)
```

### 1.3 테스트 및 도커 환경 구조 (Test & Docker Structure) `[NEW]`

**모든 모델 폴더**는 독립적인 테스트 환경을 구축해야 합니다. 이를 위해 `test` 폴더를 생성하고 그 안에 **Docker 설정(Miniflare)**과 **테스트 코드**를 배치합니다.

#### 규칙
1.  **`test` 폴더 생성**: 모델 폴더(`backend/worker_kv/<model>`) 안에 `test` 폴더를 생성합니다.
2.  **`docker-compose.yml`**: 필요시 로컬 에뮬레이션(Miniflare 등)을 위한 컨테이너 설정을 정의합니다. (또는 `wrangler` 설정)
3.  **`_.test.ts`**: 실제 테스트 코드를 작성합니다.

#### 구조 예시
```
backend/worker_kv/post/
├── _.ts                   <-- 모델 정의
├── test/                  <-- [NEW] 독립 테스트 환경
│   ├── docker-compose.yml <-- (Optional) Local Emulator
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
    *   `upsert`, `get`, `delete` 등 구현된 모든 메서드의 동작 확인.
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
backend/worker_kv/
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
backend/worker_kv/
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

### 처리해야 할 데이터 타입 목록
1.  **String**: 기본 문자열
2.  **Number**: 숫자
3.  **Boolean**: 참/거짓 (String "true"/"false" 또는 Number로 저장)
4.  **Float**: 실수
5.  **Date**: 날짜 객체 (Timestamp String 또는 Number로 저장)
6.  **String Array**: 단순 문자열 배열 (JSON String)
7.  **Object (Map)**: JSON 객체 (JSON String)
8.  **Nested Class**: 중첩된 모델 객체 (`toDataString` 재귀 호출)
9.  **Class Array**: 중첩된 모델 객체의 배열 (`map` + `toDataString` 후 JSON String)
10. **Enum**: 열거형 타입 (String 값 저장)

---

### A. `toDataString()` 구현 가이드 (KV 저장용)

모든 데이터는 문자열로 변환되어야 합니다. `URLSearchParams`를 사용하여 데이터를 직렬화하고, `btoa`로 인코딩하여 저장합니다.

```typescript
toDataString(): string {
  return btoa(
    Array.from(
      new TextEncoder().encode(
        new URLSearchParams({
          // 1. String
          s: this.s,
          
          // 2. Number (Int)
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
```

### B. `static fromDataString()` 구현 가이드 (KV 복원용)

KV에서 불러온 문자열을 파싱하여 객체로 복원합니다.

```typescript
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

---

### 2.1 중첩 클래스 구현 규칙 (Nested Class Rules)

**중첩 클래스(Nested Class)**는 독립적인 KV 엔트리가 아니므로 다음 규칙이 적용됩니다.

### 핵심 규칙
1.  **`docId` 제외**: 독립적으로 저장되지 않으므로 `docId` 필드가 없습니다.
2.  **Manager Class 제외**: `...WorkerKV` 클래스를 만들지 않습니다.
3.  **필수 메서드 구현 (중요)**: `toDataString()`과 `static fromDataString()`을 **반드시** 구현해야 합니다. 부모 클래스에서 이 메서드들을 통해 직렬화/역직렬화를 수행하기 때문입니다.

---

## 2.2 Enum 구현 규칙 (Enum Rules)

**Enum**은 안전한 타입 변환을 위해 **Helper 클래스**와 함께 정의해야 합니다.

### 핵심 규칙
1.  **Helper 클래스**: Enum 이름 뒤에 `Helper`를 붙인 클래스를 `export` 합니다.
2.  **`fromString` 필수**: 문자열을 Enum으로 안전하게 변환하며, 실패 시 에러를 던져야 합니다.

---

## 3. WorkerKV 관리 클래스 구현 (WorkerKV Manager Class)

데이터 접근을 담당하는 정적(static) 클래스(`ClassName + WorkerKV`)는 `@melodysdreamj/cloudflare-workers-kv` 라이브러리를 사용하여 구현합니다.

### 3.1 구현 예시 (`PostWorkerKV`)

```typescript
import dotenv from "dotenv";
const cloudFlareWorkersKV = require("@melodysdreamj/cloudflare-workers-kv");

dotenv.config();

export class PostWorkerKV {
  static store = cloudFlareWorkersKV({
    accountId: process.env.CLOUD_FLARE_ACCOUNT_ID,
    key: process.env.CLOUD_FLARE_API_KEY,
    namespaceId: process.env.CLOUD_FLARE_NAMESPACE_ID,
  });

  // 1. UPSERT (Insert + Update)
  static async upsert(object: Post): Promise<void> {
    await PostWorkerKV.store.set(object.docId, object.toDataString());
  }

  // 2. GET
  static async get(docId: string): Promise<Post | null> {
    try {
      const result = await PostWorkerKV.store.get(docId);
      if (!result) return null;
      return Post.fromDataString(result);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

```typescript
  // 3. DELETE
  static async delete(docId: string): Promise<void> {
    await PostWorkerKV.store.delete(docId);
  }
}
```

> [!WARNING]
> **환경 변수 설정 필수**
> `.env` 파일에 `CLOUD_FLARE_ACCOUNT_ID`, `CLOUD_FLARE_API_KEY`, `CLOUD_FLARE_NAMESPACE_ID`가 올바르게 설정되어 있는지 반드시 확인하세요.


---

## 4. 실행 스크립트 구조 (Execution Scripts)

모델 폴더 내부에 **실행 연습장(`note`)**을 위한 폴더를 별도로 구성합니다.

### 구조 예시
```
backend/worker_kv/post/
├── _.ts                   <-- 모델 본체
└── note/
    └── _.ts               <-- 실행 연습장 (Playground)
```

### 4.1 실행 연습장 (`note/_.ts`)

개발 중 모델의 기능을 테스트하거나 사용 예시를 작성하는 공간입니다.

```typescript
import { PostWorkerKV } from "../_"; // 부모 폴더의 모델 임포트

;(async () => {
    console.log("start");
    // await PostWorkerKV.upsert(...)
    process.exit(0);
})();

export {};
```

