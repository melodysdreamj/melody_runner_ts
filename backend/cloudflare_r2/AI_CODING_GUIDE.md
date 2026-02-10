# AI 코딩 가이드: Cloudflare R2 (Object Storage)

이 모듈은 **Cloudflare R2**를 사용하여 파일을 저장하고 관리하는 표준 패턴을 정의합니다.
R2는 AWS S3 API와 호환되므로 `@aws-sdk/client-s3`를 사용하여 구현됩니다.

## Features

*   **S3 Compatibility**: AWS SDK v3를 그대로 사용하여 R2에 접근.
*   **Zero Egress Fees**: 데이터 전송 비용이 없는 R2의 장점 활용.
*   **Standardized Manager**: 업로드(File/Buffer/Stream), 다운로드(File/Buffer/Stream) 로직을 표준화하여 제공.

## Function List

각 R2 모델 폴더(예: `user_upload`) 내의 `Manager` 클래스(예: `UserUploadR2`)가 구현해야 하는 표준 함수 목록입니다.

1.  `static async uploadFile(filePath, key)`
2.  `static async uploadBuffer(buffer, key)`
3.  `static async uploadStream(stream, key)`
4.  `static async downloadFile(key, downloadPath)`
5.  `static async downloadStream(key)`
6.  `static async downloadAsBuffer(key)`

## Usage

### 1. 파일 업로드 (`uploadFile`, `uploadBuffer`)

로컬 파일 경로 또는 메모리 상의 Buffer를 R2에 업로드합니다.

```typescript
import { UserUploadR2 } from "./user_upload/_.ts";

// 로컬 파일 업로드
await UserUploadR2.uploadFile("./local/file.txt", "uploads/file.txt");

// 버퍼 업로드
const buffer = Buffer.from("Hello R2");
await UserUploadR2.uploadBuffer(buffer, "uploads/hello.txt");
```

### 2. 스트림 업로드 (`uploadStream`)

대용량 파일 등을 스트림으로 전송합니다. R2 호환성을 위해 `BodyChecksum: false` 옵션이 내부적으로 사용됩니다.

```typescript
import fs from "fs";

const readStream = fs.createReadStream("./large-video.mp4");
await UserUploadR2.uploadStream(readStream, "videos/large.mp4");
```

### 3. 파일 다운로드 (`downloadFile`, `downloadAsBuffer`)

R2에 저장된 객체를 로컬 파일로 저장하거나 Buffer로 가져옵니다.

```typescript
// 파일로 저장
const success = await UserUploadR2.downloadFile("uploads/file.txt", "./downloaded/file.txt");
if (success) console.log("Download complete");

// 버퍼로 가져오기
const dataBuffer = await UserUploadR2.downloadAsBuffer("uploads/hello.txt");
console.log(dataBuffer?.toString());
```

## Structure Rule

새로운 R2 버킷/경로(Model)를 추가할 때는 다음 구조를 따릅니다.

1.  `backend/cloudflare_r2/<model_name>/` 폴더 생성
2.  `_.ts` 파일 내에 `Model` 클래스와 `Manager` 클래스 구현
3.  `Manager` 클래스명 뒤에 `R2` 접미사 사용 (예: `ImageR2`)
