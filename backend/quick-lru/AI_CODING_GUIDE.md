# AI 코딩 가이드: QuickLRU (In-Memory Cache)

이 가이드는 `backend/quick-lru` 디렉토리 내에서 `quick-lru` 라이브러리를 사용한 인메모리 캐싱 모델을 생성할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

새로운 모델을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

메모리 캐시 모델을 추가하려면, `backend/quick-lru` 폴더 아래에 **모델 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 모델 이름(영문 소문자, kebab-case 권장)으로 폴더를 생성합니다. 예: `posts`, `user_settings`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 데이터 모델 클래스와 LRU 관리자(Manager) 클래스를 모두 포함합니다.
3.  **클래스 명명**:
    *   **데이터 모델**: 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `posts` -> `Post`
    *   **LRU 관리자**: 모델 이름 뒤에 `QuickLRU`를 붙입니다. 예: `PostQuickLRU`

### 구조 예시
```
backend/quick-lru/
├── post/               <-- 새로운 모델 폴더
│   ├── _.ts            <-- 모델 정의 (Class Post) 및 관리자 (Class PostQuickLRU)
│   └── note/
│       └── _.ts        <-- 실행 연습장 (Playground)
├── user_profile/       <-- 새로운 모델 폴더
│   └── _.ts
```

### 1.3 테스트 구조 (Test Structure) `[NEW]`

**모든 모델 폴더**는 독립적인 테스트 환경을 구축해야 합니다. QuickLRU는 인메모리 방식이라 Docker가 필수는 아니지만, 일관성을 위해 `test` 폴더 구조를 따릅니다.

#### 규칙
1.  **`test` 폴더 생성**: 모델 폴더(`backend/quick-lru/<model>`) 안에 `test` 폴더를 생성합니다.
2.  **`_.test.ts`**: 실제 테스트 코드를 작성합니다.

#### 구조 예시
```
backend/quick-lru/post/
├── _.ts                   <-- 모델 정의
├── test/                  <-- [NEW] 독립 테스트 환경
│   └── _.test.ts          <-- 단위 테스트 코드
├── note/
│   └── _.ts
```

#### 테스트 코드 작성 필수 요건 (`_.test.ts`)
테스트 코드는 단순히 "성공" 여부만 확인하는 것이 아니라, 다음 항목들을 빠짐없이 검증해야 합니다.

1.  **모든 데이터 타입 검증 (10 Types Coverage)**:
    *   `Map`, `Array`, `Date` 등이 정상적으로 저장되고 복원(`toDataString` -> `fromDataString`) 되는지 확인.
    *   특히 **Nested Class**와 **Enum**의 직렬화/역직렬화 정합성 검증 필수.
2.  **모든 기능 메서드 검증 (Function Coverage)**:
    *   `set`, `get`, `isExist` 등 구현된 모든 메서드의 동작 확인.
3.  **캐시 동작 확인 (Cache Eviction)**:
    *   `maxSize` 초과 시 가장 오래된 항목이 삭제(Eviction)되는지 확인.

### 1.1 중첩 클래스 구조 (Nested Class Structure)
### 1.1 중첩 클래스 구조 (Nested Class Structure)

데이터 모델이 복잡해져서 **중첩 클래스(Nested Class)**가 필요한 경우, 부모 테이블 폴더 하위에 **`sub` 폴더**를 만들고 그 안에 파일을 생성합니다.

#### 규칙
1.  **`sub` 폴더 생성**: 부모 폴더 아래에 `sub` 폴더를 생성합니다.
2.  **파일 생성**: `sub` 폴더 안에 **클래스 이름(camelCase)**으로 파일을 생성합니다. (예: `otherModel.ts`)
    *   **주의**: 중첩 클래스는 `_.ts`가 아니라 **구체적인 파일명**을 가집니다.

#### 코드 템플릿 (`sub/other_model.ts`)
```typescript
import { Base64 } from "js-base64";

export class OtherModel {
    s: string = "";

    // 직렬화: JSON Stringify 후 Base64 (URL Safe)
    toDataString(): string {
        return btoa(encodeURIComponent(JSON.stringify({ s: this.s })));
    }

    // 역직렬화
    static fromDataString(dataString: string): OtherModel {
        const obj = new OtherModel();
        try {
            const data = JSON.parse(decodeURIComponent(atob(dataString)));
            obj.s = data.s || "";
        } catch (e) {
            // Error handling or fallback
        }
        return obj;
    }
}
```

### 1.2 Enum 구조 (Enum Structure)

상태값이나 종류를 나타내는 **Enum(열거형)**이 필요한 경우, 부모 테이블 폴더 하위에 **`enums` 폴더**를 만들고 그 안에 파일을 생성합니다.

#### 규칙
1.  **`enums` 폴더 생성**: 부모 폴더 아래에 `enums` 폴더를 생성합니다.
2.  **파일 생성**: `enums` 폴더 안에 **Enum 이름을 snake_case**로 변환하여 파일을 생성합니다. (예: `some_enum.ts`)

#### 코드 템플릿 (`enums/some_enum.ts`)
```typescript
export enum SomeEnum {
    notSelected = "notSelected",
    selected = "selected"
}

export class SomeEnumHelper {
    static fromString(value: string): SomeEnum {
        if (value === SomeEnum.selected) return SomeEnum.selected;
        return SomeEnum.notSelected;
    }
}
```

---

## 2. 데이터 모델 클래스 구현 상세 가이드

`_.ts` 파일 내부의 DTO 클래스는 다음 메서드들을 **반드시** 포함해야 하며, `toDataString`, `fromDataString` 메서드가 핵심적인 역할을 합니다.
**메모리 캐시에서는 `toMap`/`fromMap`(DB용)은 필수가 아니지만, 표준 호환성을 위해 `toDataString`은 반드시 구현해야 합니다.**

### 처리해야 할 데이터 타입 (Standard 10 Types)
1.  **String**
2.  **Number**
3.  **Boolean**
4.  **Float**
5.  **Date**
6.  **String Array**
7.  **Object (Map)**
8.  **Nested Class**
9.  **Class Array**
10. **Enum**

---

### A. `toDataString()` & `fromDataString()` 구현 가이드 (직렬화/역직렬화)
LRU 캐시에 데이터를 저장할 때 객체 참조가 아닌 **문자열(Serialized String)**로 저장하여 불변성을 보장합니다.

```typescript
import QuickLRU from "quick-lru";
import { Base64 } from "js-base64";
import { SomeEnum, SomeEnumHelper } from "./enums/some_enum";
import { OtherModel } from "./sub/other_model";

// LRU 최대 크기 설정
const maxLruSizeConfig = 1000;

export class Post {
  constructor() {
    this.docId = Math.random().toString(36).substr(2, 10);
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
  c: OtherModel = new OtherModel();
  // 9. Class Array
  j: OtherModel[] = [];
  // 10. Enum
  e: SomeEnum = SomeEnum.notSelected;

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
    object.c = OtherModel.fromDataString(
        queryParams["c"] || new OtherModel().toDataString()
    );

    // 9. Class Array
    object.j = (JSON.parse(queryParams["j"] || "[]") || [])
        .map((item: string) => OtherModel.fromDataString(item));

    // 10. Enum
    object.e = SomeEnumHelper.fromString(queryParams["e"] || SomeEnum.notSelected);

    object.docId = queryParams["docId"] || "";

    return object;
  }
}
```

---

## 2.1 중첩 클래스 구현 규칙 (Nested Class Rules)

**중첩 클래스(Nested Class)**는 독립적인 테이블이 아니므로 다음 규칙이 적용됩니다.

### 핵심 규칙
1.  **`docId` 제외**: 독립적으로 저장되지 않으므로 `docId` 필드가 없습니다.
2.  **Manager Class 제외**: `...QuickLRU` 클래스를 만들지 않습니다.
3.  **필수 메서드 구현 (중요)**: `toDataString()`과 `static fromDataString()`을 **반드시** 구현해야 합니다.

---

## 3. LRU 관리 클래스 구현 (Manager Class)

`quick-lru` 라이브러리를 사용하며, **Singleton 패턴**과 유사하게 정적 프로퍼티로 인스턴스를 관리합니다.
지연 초기화(`ready`) 패턴을 사용하여 모듈 로딩 시점의 오버헤드를 줄입니다.

### 코드 템플릿 (`_.ts` - Manager Part)

```typescript
export class PostQuickLRU {
  static lru: QuickLRU<string, string> | null = null;
  static isReady = false;

  // 1. 초기화 (Lazy Loading)
  static ready() {
    if (PostQuickLRU.isReady) return;
    PostQuickLRU.lru = new QuickLRU({ maxSize: maxLruSizeConfig });
    PostQuickLRU.isReady = true;
  }

  // 2. 존재 확인
  static isExist(docId: string): boolean {
    PostQuickLRU.ready();
    return PostQuickLRU.lru!.has(docId);
  }

  // 3. 저장 (Set)
  static set(object: Post): void {
    PostQuickLRU.ready();
    // 객체 자체가 아니라 직렬화된 문자열을 저장 (Immutability & Memory efficiency)
    PostQuickLRU.lru!.set(object.docId, object.toDataString());
  }

  // 4. 조회 (Get)
  static get(docId: string): Post | null {
    PostQuickLRU.ready();
    const dataString = PostQuickLRU.lru!.get(docId);
    if (!dataString) return null;
    return Post.fromDataString(dataString);
  }
}
```

---

## 4. 실행 스크립트 템플릿 (`note/_.ts`)

```typescript
import { Post, PostQuickLRU } from "../_";

async function main() {
    console.log("start");

    // 1. 객체 생성 및 저장
    let obj1 = new Post();
    obj1.docId = "123";
    obj1.s = "Hello LRU";
    
    PostQuickLRU.set(obj1);
    console.log("Stored:", obj1.docId);

    // 2. 존재 확인
    let exists = PostQuickLRU.isExist("123");
    console.log("Exists:", exists);

    // 3. 조회
    let retrieved = PostQuickLRU.get("123");
    console.log("Retrieved:", retrieved?.s);

    // 4. 대량 데이터 테스트 (Eviction 확인)
    console.log("Inserting 2000 items...");
    for (let i = 0; i < 2000; i++) {
        let obj = new Post();
        obj.docId = i.toString();
        PostQuickLRU.set(obj);
    }

    // LRU(1000) 초과로 인해 "123"은 삭제되어야 함
    let evicted = PostQuickLRU.isExist("123");
    console.log("Is '123' still exist? (Should be false):", evicted);
    
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

export { };
```
