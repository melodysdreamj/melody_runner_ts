# AI 코딩 가이드: Amazon SES Integration

이 모듈은 **Amazon SES (Simple Email Service)**를 사용하여 이메일을 발송하는 기능을 제공합니다.
AWS SDK v3를 기반으로 구현되어 있으며, 단순 텍스트, HTML, 템플릿, 대량 발송 등 다양한 발송 방식을 지원합니다.

## Features

*   **Simple Email**: 제목과 텍스트 본문만 있는 간단한 이메일 발송.
*   **HTML Email**: HTML 본문을 포함한 이메일 발송 (CC, BCC, Reply-To 지원).
*   **Template Email**: SES에 저장된 템플릿을 사용한 이메일 발송.
*   **Raw Email**: MIME 형식을 직접 구성하여 발송 (첨부파일 등).
*   **Bulk Email**: 동일한 내용을 여러 수신자에게 한 번에 발송.

## Function List

이 모듈(`_.ts`)에서 export하는 `AmazonSESLite` 클래스의 주요 함수들입니다.

1.  `static async sendSimpleEmail(from, to, subject, textBody)`
2.  `static async sendEmail(options)`
3.  `static async sendTemplateEmail(from, to, templateName, templateData)`
4.  `static async sendRawEmail(rawMessage, destinations)`
5.  `static async sendBulkEmail(from, toList, subject, textBody, htmlBody)`

## Usage

### 1. 간단한 텍스트 이메일 발송 (`sendSimpleEmail`)

```typescript
import { AmazonSESLite } from "./_.ts"; // 실제 경로에 맞게 수정

await AmazonSESLite.sendSimpleEmail(
  "sender@example.com", // From (Verified in SES)
  "receiver@example.com", // To
  "Hello!", // Subject
  "This is a simple text email." // Body
);
```

### 2. HTML 이메일 발송 (`sendEmail`)

수신자(`to`), 참조(`cc`), 숨은 참조(`bcc`)는 문자열 또는 문자열 배열을 받을 수 있습니다.

```typescript
await AmazonSESLite.sendEmail({
  from: "sender@example.com",
  to: ["user1@example.com", "user2@example.com"],
  cc: "manager@example.com",
  subject: "Weekly Report",
  textBody: "Please view in HTML supported client.", // Fallback text
  htmlBody: "<h1>Weekly Report</h1><p>Content...</p>",
});
```

### 3. 템플릿 이메일 발송 (`sendTemplateEmail`)

SES 콘솔에 미리 등록된 템플릿을 사용합니다. `templateData`는 템플릿 내 변수(`{{name}}`)를 치환합니다.

```typescript
await AmazonSESLite.sendTemplateEmail(
  "sender@example.com",
  "user@example.com",
  "MyTemplateName", // SES Template Name
  { name: "June", date: "2024-02-01" } // Template Data
);
```

### 4. 대량 이메일 발송 (`sendBulkEmail`)

여러 수신자에게 동일한 내용을 보냅니다. (개별 커스텀 불가, 단순 `Destination` 목록 추가 방식)

```typescript
await AmazonSESLite.sendBulkEmail(
  "sender@example.com",
  ["user1@example.com", "user2@example.com", "user3@example.com"],
  "Notice",
  "This is a notice for all users.",
  "<p>This is a notice for all users.</p>"
);
```

### 환경 변수 설정 (.env)

실행을 위해 다음 환경 변수가 필요합니다.

```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-northeast-2
```
