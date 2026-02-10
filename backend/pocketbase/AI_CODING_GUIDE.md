# AI 코딩 가이드: PocketBase (BaaS)

이 가이드는 `backend/pocketbase` 디렉토리 내에서 **PocketBase**를 연동하여 데이터 모델 및 파일(File)을 관리할 때 따라야 할 **필수적인 디렉토리 구조와 코딩 규칙**을 정의합니다.

새로운 모델을 추가할 때는 반드시 아래의 **"폴더 기반 구조 (Folder-Based Structure)"**를 준수해야 합니다.

## 0. 필수 라이브러리 및 환경 설정

PocketBase 연동을 위해 다음 패키지들이 설치되어 있어야 합니다.

```bash
npm install pocketbase axios form-data dotenv
```

#### `.env` 설정
```env
POCKET_BASE_URL="http://127.0.0.1:8090"
POCKET_BASE_ADMIN_EMAIL="admin@example.com"
POCKET_BASE_ADMIN_PASSWORD="password"
```

---

## 1. 디렉토리 및 파일 구조 (Directory & File Structure)

PocketBase 모델(Collection)을 추가하려면, `backend/pocketbase` 폴더 아래에 **모델 이름과 동일한 폴더**를 만들고 그 안에 `_.ts` 파일을 생성합니다.

### 규칙
1.  **폴더 생성**: 모델 이름(영문 소문자, kebab-case 권장)으로 폴더를 생성합니다. 예: `posts`, `user_profiles`
2.  **파일 생성**: 해당 폴더 안에 `_.ts` 파일을 생성합니다. 이 파일이 데이터 모델 클래스와 PocketBase 관리자(Manager) 클래스를 모두 포함합니다.
3.  **클래스 명명**:
    *   **데이터 모델**: 폴더 이름을 **PascalCase**로 변환하여 사용합니다. 예: `posts` -> `Post`
    *   **Manager**: 모델 이름 뒤에 `PocketBaseCollection`을 붙입니다. 예: `PostPocketBaseCollection`

### 구조 예시
```
backend/pocketbase/
├── post/               <-- 새로운 모델 폴더
│   ├── _.ts            <-- 모델 정의 (Class Post) 및 관리자 (Class PostPocketBaseCollection)
│   └── note/
│       └── _.ts        <-- 실행 연습장 (Playground)
├── user_profile/       <-- 새로운 모델 폴더
│   └── _.ts
```

### 1.1 중첩 클래스 및 Enum 구조
*   **중첩 클래스**: `sub/` 폴더 아래 생성 (규칙 동일)
*   **Enum**: `enums/` 폴더 아래 생성 (규칙 동일)

---

## 2. 데이터 모델 클래스 구현 상세 중첩

`_.ts` 파일 내부의 DTO 클래스는 `toDataString`/`fromDataString` (직렬화 호환성) 및 `toMap`/`fromMap` (PocketBase 호환성)을 모두 구현해야 합니다.

```typescript
import { Base64 } from "js-base64";
import { SomeEnum, SomeEnumHelper } from "./enums/some_enum";
import { OtherModel } from "./sub/other_model";

export class Post {
  constructor() {
    this.docId = Math.random().toString(36).substr(2, 10);
  }

  // 필드 정의
  s: string = "";
  i: number = 0;
  b: boolean = false;
  f: number = 0.0;
  d: Date = new Date(0);
  l: string[] = [];
  m: { [key: string]: any } = {};
  c: OtherModel = new OtherModel();
  j: OtherModel[] = [];
  e: SomeEnum = SomeEnum.notSelected;
  
  // PocketBase 전용 필드 (파일)
  fileName: string = "";

  docId: string = "";

  // ... (toDataString, fromDataString은 다른 DB 가이드와 동일하게 구현) ...
  toDataString(): string { /* ... */ return ""; }
  static fromDataString(dataString: string): Post { /* ... */ return new Post(); }

  // PocketBase 연동용 Map 변환
  toMap(): object {
    return {
      s: this.s,
      i: this.i,
      b: this.b, // PocketBase는 bool 타입 지원 (true/false)
      f: this.f,
      d: this.d.toISOString(), // PocketBase는 Date 문자열 권장
      l: JSON.stringify(this.l),
      m: JSON.stringify(this.m),
      c: this.c.toDataString(),
      j: JSON.stringify(this.j.map((model) => model.toDataString())),
      e: this.e,
      fileName: this.fileName,
      docId: this.docId,
    };
  }

  static fromMap(record: any): Post {
    const object = new Post();
    object.s = record.s || "";
    object.i = Number(record.i || 0);
    object.b = record.b === true || record.b === "true"; 
    object.f = Number(record.f || 0.0);
    object.d = new Date(record.d || 0);
    object.l = JSON.parse(record.l || "[]");
    object.m = JSON.parse(record.m || "{}");
    object.c = OtherModel.fromDataString(record.c || new OtherModel().toDataString());
    object.j = (JSON.parse(record.j || "[]") || []).map((item: string) => OtherModel.fromDataString(item));
    object.e = SomeEnumHelper.fromString(record.e || SomeEnum.notSelected);
    object.fileName = record.fileName || "";
    object.docId = record.docId;

    return object;
  }
}
```

---

## 3. PocketBase Manager 클래스 구현

**핵심 기능**:
*   `upsertMany`: 대량 데이터 처리 (Chunking & `getFullList` 활용)
*   **File Handling**: `Stream`, `Buffer`, `FilePath`를 통한 파일 업로드/다운로드 지원

### 코드 템플릿 (`_.ts` - Manager Part)

```typescript
import PocketBase from "pocketbase";
import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import * as fs from "fs";
import path from "path";
import { Readable } from "stream";

// ... Post 클래스 정의 ...

const pb = new PocketBase(process.env.POCKET_BASE_URL);

export class PostPocketBaseCollection {
  static _ready = false;

  static async getDb() {
    if (PostPocketBaseCollection._ready) return;
    dotenv.config();
    pb.baseUrl = (process.env.POCKET_BASE_URL || "").replace(/\/$/, "");
    
    // Admin Auth
    await pb.admins.authWithPassword(
      process.env.POCKET_BASE_ADMIN_EMAIL!,
      process.env.POCKET_BASE_ADMIN_PASSWORD!
    );
    PostPocketBaseCollection._ready = true;
  }

  // 1. 단건 조회
  static async get(docId: string): Promise<Post | null> {
    await this.getDb();
    try {
      const record = await pb.collection("Post").getFirstListItem(\`docId="\${docId}"\`);
      return Post.fromMap(record);
    } catch (e) {
      return null;
    }
  }
  
  // 1-1. Row(Record) 조회 - 내부용
  static async getRow(docId: string): Promise<any> {
    await this.getDb();
    try {
      return await pb.collection("Post").getFirstListItem(\`docId="\${docId}"\`);
    } catch (e) {
      return null;
    }
  }

  // 2. 단건 Upsert
  static async upsert(object: Post): Promise<string | null> {
    await this.getDb();
    const rawObj = await this.getRow(object.docId);
    const data = object.toMap();

    try {
      if (rawObj == null) {
        const record = await pb.collection("Post").create(data);
        return record.id;
      } else {
        const record = await pb.collection("Post").update(rawObj.id, data);
        return record.id;
      }
    } catch (e) {
      console.error("Upsert failed:", e);
      return null;
    }
  }

  // 3. 대량 Upsert (Optimized Chunking)
  static async upsertMany(objects: Post[]): Promise<string[] | null> {
    if (objects.length === 0) return [];
    await this.getDb();

    const chunkSize = 100;
    const allResultIds: string[] = [];

    try {
      for (let i = 0; i < objects.length; i += chunkSize) {
        const chunk = objects.slice(i, i + chunkSize);
        console.log(\`Processing chunk \${i / chunkSize + 1}\`);

        const docIds = chunk.map((o) => o.docId);
        const filter = docIds.map((id) => \`docId = "\${id}"\`).join(" || ");
        
        // 청크 내 docId 존재 여부 확인
        const existingRecords = await pb.collection("Post").getFullList({ filter });
        const existingMap = new Map<string, any>();
        existingRecords.forEach((r: any) => existingMap.set(r.docId, r));

        for (const obj of chunk) {
          const existing = existingMap.get(obj.docId);
          const data = obj.toMap();
          
          if (existing) {
             const r = await pb.collection("Post").update(existing.id, data);
             allResultIds.push(r.id);
          } else {
             const r = await pb.collection("Post").create(data);
             allResultIds.push(r.id);
          }
        }
      }
      return allResultIds;
    } catch (e) {
      console.error("upsertMany failed:", e);
      return null;
    }
  }

  // ==========================================
  // 4. File Handling (Upload)
  // ==========================================

  // 4-1. 파일 경로(FilePath)로 업로드
  static async upsertFile(object: Post, filePath: string) {
    return this.upsertFileFromStream(object, fs.createReadStream(filePath));
  }

  // 4-2. 버퍼(Buffer)로 업로드
  static async upsertFileFromBuffer(object: Post, buffer: Buffer) {
    await this.getDb();
    // 레코드 확보 (없으면 생성)
    let recordId = (await this.getRow(object.docId))?.id;
    if (!recordId) recordId = await this.upsert(object);
    if (!recordId) return null;

    const formData = new FormData();
    formData.append("fileName", buffer, { filename: object.docId }); // docId를 파일명으로

    const res = await axios.patch(
      \`\${pb.baseUrl}/api/collections/Post/records/\${recordId}\`,
      formData,
      { headers: { ...formData.getHeaders(), Authorization: \`Bearer \${pb.authStore.token}\` } }
    );
    return res.data;
  }

  // 4-3. 스트림(Stream)으로 업로드
  static async upsertFileFromStream(object: Post, stream: Readable) {
    await this.getDb();
    let recordId = (await this.getRow(object.docId))?.id;
    if (!recordId) recordId = await this.upsert(object);
    if (!recordId) return null;

    const formData = new FormData();
    formData.append("fileName", stream, { filename: object.docId });

    const res = await axios.patch(
      \`\${pb.baseUrl}/api/collections/Post/records/\${recordId}\`,
      formData,
      { headers: { ...formData.getHeaders(), Authorization: \`Bearer \${pb.authStore.token}\` } }
    );
    return res.data;
  }

  // ==========================================
  // 5. File Handling (Download)
  // ==========================================

  // 5-1. 다운로드 URL 생성
  static async getDownloadUrl(object: Post | null): Promise<string | null> {
    if (!object) return null;
    await this.getDb();
    const row = await this.getRow(object.docId);
    if (!row || !row.fileName) return null;
    return pb.files.getURL(row, row.fileName);
  }

  // 5-2. 버퍼로 다운로드
  static async downloadFileAsBuffer(object: Post): Promise<Buffer | null> {
    const url = await this.getDownloadUrl(object);
    if (!url) return null;
    try {
      const res = await axios.get(url, { responseType: "arraybuffer" });
      return Buffer.from(res.data);
    } catch (e) { return null; }
  }

  // 5-3. 파일로 저장
  static async downloadFile(object: Post, filePath: string): Promise<boolean> {
    const url = await this.getDownloadUrl(object);
    if (!url) return false;
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const res = await axios({ method: "get", url, responseType: "stream" });
    const writer = fs.createWriteStream(filePath);
    res.data.pipe(writer);

    return new Promise((resolve) => {
      writer.on("finish", () => resolve(true));
      writer.on("error", () => resolve(false));
    });
  }
}
```


---

## 4. 테이블 생성을 위한 스크립트 (`create_table.ts`)
```typescript
import { PostPocketBaseCollection } from "./_";

export async function createTable() {
  await PostPocketBaseCollection.getDb();
  // pb.collections.create(...) 로직 구현
  // 예: const collection = await pb.collections.create({ name: 'Post', type: 'base', schema: [...] });
}
```

---

## 5. 실행 스크립트 템플릿 (`note/_.ts`)

파일 업로드/다운로드 및 기본 CRUD를 테스트하는 스크립트 예시입니다.

```typescript
import { Post, PostPocketBaseCollection } from "../_";
import * as fs from "fs";
import path from "path";

async function main() {
    console.log("--- PocketBase Test Start ---");

    // 1. 객체 생성
    const post = new Post();
    post.s = "Hello PocketBase";
    post.docId = "test_doc_01";
    
    // 2. 메타데이터 Upsert
    await PostPocketBaseCollection.upsert(post);
    console.log("Upserted Metadata:", post.docId);

    // 3. 파일 업로드 (Buffer 예시)
    const buffer = Buffer.from("Hello File Content", "utf-8");
    await PostPocketBaseCollection.upsertFileFromBuffer(post, buffer);
    console.log("Uploaded Buffer for:", post.docId);

    // 4. 파일 다운로드 (Buffer 예시)
    const downloadedBuffer = await PostPocketBaseCollection.downloadFileAsBuffer(post);
    console.log("Downloaded Content:", downloadedBuffer?.toString());

    // 5. 정리 (삭제)
    // await PostPocketBaseCollection.delete(post.docId);
    
    console.log("--- PocketBase Test End ---");
}

main().catch(console.error);
export {};
```
