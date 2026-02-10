# AI 코딩 가이드: Qdrant (Vector Database)

이 가이드는 `backend/qdrant` 디렉토리 내에서 **Qdrant**를 연동하여 벡터 검색 기능을 구현할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

새로운 모델(Collection)을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 0. 필수 라이브러리 및 환경 설정

Qdrant 연동을 위해 다음 패키지들이 설치되어 있어야 합니다.

```bash
npm install @qdrant/js-client-rest @huggingface/transformers uuid
```

#### `.env` 설정 & Docker 실행
```bash
# Docker 실행 예시
docker run -d \
 -p 6333:6333 \
 -p 6334:6334 \
 -v qdrant_data:/qdrant/storage \
 -e QDRANT_SERVICE_API_KEY="your_api_key" \
 --name qdrant-server \
 qdrant/qdrant:latest
```

```env
QDRANT_HOST="http://127.0.0.1:6333"
QDRANT_API_KEY="your_api_key"
```

---

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

Qdrant Collection을 추가하려면, `backend/qdrant` 폴더 아래에 **모델 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 구조 예시
```
backend/qdrant/
├── new/                <-- 새로운 모델 폴더 (이름: new)
│   ├── _.ts            <-- 모델 정의 (Class New) 및 관리자 (Class NewQdrant)
│   ├── reset_collection.ts <-- 컨렉션 리셋 스크립트
│   └── note/
│       └── _.ts        <-- 실행 연습장 (Playground)
```

### 1.3 테스트 및 도커 환경 구조 (Test & Docker Structure) `[NEW]`

**모든 모델 폴더**는 독립적인 테스트 환경을 구축해야 합니다. 이를 위해 `test` 폴더를 생성하고 그 안에 **Docker 설정**과 **테스트 코드**를 배치합니다.

#### 규칙
1.  **`test` 폴더 생성**: 모델 폴더(`backend/qdrant/<model>`) 안에 `test` 폴더를 생성합니다.
2.  **`docker-compose.yml`**: 해당 모델의 테스트만을 위한 **Qdrant 컨테이너 설정**을 정의합니다.
3.  **`_.test.ts`**: 실제 테스트 코드를 작성합니다. 테스트 실행 전 `docker-compose`가 실행 상태여야 합니다.

#### 구조 예시
```
backend/qdrant/new/
├── _.ts                   <-- 모델 정의
├── test/                  <-- [NEW] 독립 테스트 환경
│   ├── docker-compose.yml <-- 이 모델만을 위한 Qdrant 컨테이너
│   └── _.test.ts          <-- 통합 테스트 코드
├── note/
│   └── _.ts
```

#### 테스트 코드 작성 필수 요건 (`_.test.ts`)
테스트 코드는 단순히 "성공" 여부만 확인하는 것이 아니라, 다음 항목들을 빠짐없이 검증해야 합니다.

1.  **모든 데이터 타입 검증 (10 Types Coverage)**:
    *   `Map`, `Array`, `Date` 등이 Payload로 정상적으로 저장되고 복원(`toDataString` -> `fromDataString`) 되는지 확인.
    *   특히 **Nested Class**와 **Enum**의 직렬화/역직렬화 정합성 검증 필수.
2.  **모든 기능 메서드 검증 (Function Coverage)**:
    *   `upsert`, `upsertMany`, `search`, `getAll`, `delete` 등 구현된 모든 메서드의 동작 확인.
3.  **벡터 검색 정합성 (Vector Search)**:
    *   임베딩 생성 및 검색 결과의 스코어(Score)가 정상 범위인지 확인.

---

## 2. 데이터 모델 클래스 구현

Qdrant는 Payload(메타데이터)와 Vector를 함께 저장합니다.
`toDataString`/`fromDataString` (직렬화) 및 `toMap`/`fromMap` (Payload 변환)을 모두 구현해야 합니다.

```typescript
import { v4 as uuidv4 } from "uuid";

export class New {
  constructor() {
    this.docId = uuidv4();
  }

  // 핵심 검색 대상 텍스트
  text: string = "";

  // 10 Core Data Types 예시
  // s000: string = "";
  // i000: number = 0;
  // b000: boolean = false;
  // r000: number = 0.0;
  // t000: Date = new Date(0);
  // l000: string[] = [];
  // m000: { [key: string]: any } = {};
  // c000: OtherModel = new OtherModel();
  // j000: OtherModel[] = [];
  // e000: SomeEnum = SomeEnum.notSelected;

  docId: string = "";

  toDataString(): string {
    return btoa(
      Array.from(
        new TextEncoder().encode(
          new URLSearchParams({
            text: this.text,
            // s000: this.s000,
            // i000: this.i000.toString(),
            // t000: this.t000.getTime().toString(),
            // l000: JSON.stringify(this.l000),
            // m000: JSON.stringify(this.m000),
            // c000: this.c000.toDataString(),
            // j000: JSON.stringify(this.j000.map((model) => model.toDataString())),
            // e000: this.e000,
            docId: this.docId,
          }).toString()
        )
      )
        .map((byte) => String.fromCharCode(byte))
        .join("")
    );
  }

  static fromDataString(dataString: string): New {
    const queryParams = Object.fromEntries(
      new URLSearchParams(atob(dataString))
    );

    const object = new New();

    object.text = queryParams["text"] || "";
    // object.s000 = queryParams["s000"] || "";
    // object.i000 = parseInt(queryParams["i000"] || "0", 10);
    // object.t000 = new Date(parseInt(queryParams["t000"] || "0", 10));
    // object.l000 = JSON.parse(queryParams["l000"] || "[]");
    // object.m000 = JSON.parse(queryParams["m000"] || "{}");
    // object.c000 = OtherModel.fromDataString(queryParams["c000"] || new OtherModel().toDataString());
    // object.e000 = SomeEnumHelper.fromString(queryParams["e000"] || SomeEnum.notSelected);
    object.docId = queryParams["docId"] || "";

    return object;
  }

  toMap(): any {
    return {
      text: this.text,
      // s000: this.s000,
      // i000: this.i000,
      // t000: this.t000.getTime(),
      // m000: JSON.stringify(this.m000),
      docId: this.docId,
    };
  }

  static fromMap(map: any): New {
    const object = new New();

    object.text = map.text || "";
    // object.s000 = map.s000 || '';
    // object.i000 = Number(map.i000 || 0);
    // object.t000 = new Date(parseInt(map.t000) || 0);
    // object.m000 = JSON.parse(map.m000 || '{}');
    object.docId = map.docId;

    return object;
  }
}
```

---

## 3. Qdrant Manager 클래스 구현

**핵심 기능**:
*   `_embedTexts`: HuggingFace Transformers (`Xenova/bge-m3`)를 이용한 로컬 임베딩 생성 (1024차원)
*   `upsert` / `upsertMany`: 자동 임베딩 생성 후 저장 (배치 지원)
*   `search` / `searchWithScore`: 벡터 유사도 검색 및 스코어링
*   `getAll`: Scroll API를 이용한 전체 조회 (Pagination)
*   `get`: 단건 조회
*   `delete`: 단건 삭제

### 코드 템플릿 (`_.ts` - Manager Part)

```typescript
import { pipeline } from "@huggingface/transformers";
import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from "dotenv";

// ... New 클래스 정의 ...

dotenv.config();

const vectorSize = 1024; // BGE-M3
const distance = "Cosine"; // Inner Product (Cosine 유사도)

// Qdrant 클라이언트 설정
const connectionDetails = {
    url: process.env.QDRANT_HOST,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false,
};

export class NewQdrant {
  private static client = new QdrantClient(connectionDetails);
  private static extractor: any = null;
  private static _isReady = false;

  // 1. 초기화 (Collection 생성)
  static async _ready() {
    if (NewQdrant._isReady) return;
    
    // 임베딩 모델 로드 (Lazy Loading)
    if (!NewQdrant.extractor) {
        NewQdrant.extractor = await pipeline("feature-extraction", "Xenova/bge-m3");
    }

    try {
      const exists = await NewQdrant.client.collectionExists("New");
      if (!exists.exists) {
        await NewQdrant.client.createCollection("New", {
          vectors: { size: vectorSize, distance: distance },
        });
      }
      NewQdrant._isReady = true;
    } catch (e) {
      console.error("Qdrant Init Error:", e);
      throw e;
    }
  }

  // 2. 임베딩 생성 (Local)
  static async _embedTexts(texts: string[]): Promise<number[][]> {
    const output = await NewQdrant.extractor(texts, { pooling: "cls", normalize: true });
    return output.tolist();
  }

  // 3. Upsert (Single)
  static async upsert(object: New) {
    try {
        await this._ready();
        const vectors = await this._embedTexts([object.text]);
        await NewQdrant.client.upsert("New", {
          points: [{ id: object.docId, vector: vectors[0], payload: object.toMap() }]
        });
    } catch (error) {
        console.error(`❌ Upsert Error (docId: ${object.docId}):`, error);
        throw error;
    }
  }

  // 4. Upsert (Batch)
  static async upsertMany(objects: New[]) {
    if (objects.length === 0) return;
    try {
        await this._ready();
        const vectors = await this._embedTexts(objects.map(o => o.text));
        
        await NewQdrant.client.upsert("New", {
          points: objects.map((obj, i) => ({
            id: obj.docId,
            vector: vectors[i],
            payload: obj.toMap()
          }))
        });
    } catch (error) {
        console.error(`❌ Bulk Upsert Error (${objects.length} items):`, error);
        throw error;
    }
  }

  // 5. Get Single
  static async get(docId: string): Promise<New | null> {
    try {
      await this._ready();
      const result = await NewQdrant.client.retrieve("New", { ids: [docId] });
      if (!result || result.length === 0 || !result[0].payload) return null;
      return New.fromMap(result[0].payload);
    } catch (error) {
      console.error(`❌ Get Error (${docId}):`, error);
      throw error;
    }
  }

  // 6. Search
  static async search(query: string, limit: number = 3): Promise<New[]> {
    try {
        await this._ready();
        const vectors = await this._embedTexts([query]);
        const res = await NewQdrant.client.search("New", {
          vector: vectors[0],
          limit,
          with_payload: true
        });
        
        return res
            .filter(pt => pt.payload)
            .map(pt => New.fromMap(pt.payload!));
    } catch (error) {
        console.error("❌ Search Error:", error);
        throw error;
    }
  }
  
  // 7. Search with Score
  static async searchWithScore(query: string, limit: number = 3) {
    try {
        await this._ready();
        const vectors = await this._embedTexts([query]);
        const res = await NewQdrant.client.search("New", {
          vector: vectors[0],
          limit,
          with_payload: true
        });
        
        return {
            objects: res.filter(pt => pt.payload).map(pt => New.fromMap(pt.payload!)),
            scores: res.map(pt => pt.score)
        };
    } catch (error) {
        console.error("❌ Search Error:", error);
        throw error;
    }
  }

  // 8. Get All (Scroll with Pagination)
  static async getAll(): Promise<New[]> {
    try {
        await this._ready();
        const all: New[] = [];
        let offset: any = undefined;
        
        do {
          const res = await NewQdrant.client.scroll("New", { limit: 1000, offset, with_payload: true });
          res.points.forEach(pt => {
              if (pt.payload) all.push(New.fromMap(pt.payload));
          });
          offset = res.next_page_offset;
        } while (offset);
        
        return all;
    } catch (error) {
        console.error("❌ GetAll Error:", error);
        throw error;
    }
  }
  
  // 9. Delete & Reset
  static async delete(docId: string) {
      await this._ready();
      await NewQdrant.client.delete("New", { points: [docId] });
  }
  
  static async reset() {
      await NewQdrant.client.deleteCollection("New");
      NewQdrant._isReady = false;
  }
}
```

---

## 4. 실행 스크립트 템플릿

### 4.1 컨렉션 리셋 스크립트 (`reset_collection.ts`)
컨렉션을 삭제하고 새로 초기화합니다. (`reset()` 메서드 활용)
```typescript
import { NewQdrant } from "./_";

;(async () => {
    console.log("🔄 컨렉션 리셋 시작...");
    await NewQdrant.reset();
    console.log("✅ 컨렉션 리셋 완료");
    process.exit(0);
})();

export {};
```

### 4.2 실행 연습장 (`note/_.ts`)

```typescript
import dotenv from "dotenv";
import { New, NewQdrant } from "../_";

dotenv.config();

;(async () => {
    console.log("--- Qdrant Test Start ---");
    
    // 초기화 (Reset)
    await NewQdrant.reset();

    // 데이터 준비
    const new1 = new New(); new1.text = "삼성전자는 2024년 1분기 실적을 발표했습니다.";
    const new2 = new New(); new2.text = "최근 인공지능 기술이 급속도로 발전하고 있습니다.";
    const new3 = new New(); new3.text = "기후 변화는 전 지구적인 문제이며, 해결을 위한 국제적인 협력이 필요합니다.";

    // Upsert (Batch)
    await NewQdrant.upsertMany([new1, new2, new3]);
    console.log("✅ Upserted 3 items");

    // Get Single
    const got = await NewQdrant.get(new1.docId);
    console.log(`✅ Get Result: ${got?.text}`);

    // Search
    const results = await NewQdrant.search("인공지능", 5);
    console.log(`✅ Search '인공지능' Results: ${results.length} found`);
    results.forEach(r => console.log(` - ${r.text}`));

    // Search with Score
    const scored = await NewQdrant.searchWithScore("인공지능", 5);
    console.log(`✅ Search with Score:`);
    scored.objects.forEach((obj, i) => {
        console.log(` - [Score: ${scored.scores[i]}] ${obj.text}`);
    });

    // Delete
    await NewQdrant.delete(new1.docId);
    console.log(`✅ Deleted docId: ${new1.docId}`);

    // Get All
    const all = await NewQdrant.getAll();
    console.log(`✅ Total Remaining Count: ${all.length}`); // Should be 2

    console.log("--- Qdrant Test End ---");
    process.exit(0);
})();

export {};
```
