# AI 코딩 가이드: Amazon Creators API

이 모듈은 **Amazon Creators API** (PA-API 5.0 후속)를 사용하여 상품 검색, 상세 조회, 카테고리 조회, 변형 조회를 수행합니다.

## 인증 방식

*   **OAuth 2.0 client_credentials**: Creators API 전용 Credential ID / Secret 사용
*   **토큰 엔드포인트**: `https://api.amazon.com/auth/o2/token`
*   **토큰 유효기간**: ~1시간 (3600초), 만료 5분 전 자동 갱신
*   **Authorization 헤더**: `Bearer {access_token}`
*   **요청 방식**: 모든 오퍼레이션 `POST` + JSON
*   **페이로드 케이싱**: `lowerCamelCase` (예: `itemIds`, `partnerTag`)
*   **Base URL**: `https://webservices.amazon.com` (US, 리전별 상이)
*   **공용 유틸리티**: `auth.ts`의 `getAccessToken()`, `client.ts`의 `amazonPost(operation, body)` 사용

## 환경변수

| 변수명 | 용도 | 필수 |
|--------|------|------|
| `AMAZON_CREDENTIAL_ID` | Creators API Credential ID | ✅ |
| `AMAZON_CREDENTIAL_SECRET` | Creators API Credential Secret | ✅ |
| `AMAZON_PARTNER_TAG` | Associates Store/Tracking ID (예: `mystore-20`) | ✅ |
| `AMAZON_MARKETPLACE` | 타겟 마켓플레이스 (기본: `www.amazon.com`) | ❌ |
| `AMAZON_HOST` | API 호스트 (기본: `webservices.amazon.com`) | ❌ |
| `AMAZON_REGION` | AWS 리전 (기본: `us-east-1`) | ❌ |

## Credential 발급 방법

1. [Amazon Associates Central](https://affiliate-program.amazon.com/) 로그인
2. **Tools** → **Creators API** 이동
3. **Create credentials** 클릭
4. Credential ID와 Credential Secret을 `.env`에 저장

> ⚠️ 자격 요건: 최근 30일 내 **10건 이상의 적격 판매**가 있어야 API 접근 가능

## Endpoint List

### 1. 상품 검색 (SearchItems)
*   **폴더**: `search_items/_.ts`
*   **Function**: `searchItems(params)`
*   **Operation**: `SearchItems`
*   **Description**: 키워드, 브랜드, 작가 등으로 Amazon 상품을 검색합니다.

### 2. 상품 상세 조회 (GetItems)
*   **폴더**: `get_items/_.ts`
*   **Function**: `getItems(params)`
*   **Operation**: `GetItems`
*   **Description**: ASIN으로 상품의 상세 정보를 조회합니다. 최대 10개 동시 조회.

### 3. 카테고리 조회 (GetBrowseNodes)
*   **폴더**: `get_browse_nodes/_.ts`
*   **Function**: `getBrowseNodes(params)`
*   **Operation**: `GetBrowseNodes`
*   **Description**: Browse Node ID로 카테고리 트리(부모/자식)를 조회합니다.

### 4. 상품 변형 조회 (GetVariations)
*   **폴더**: `get_variations/_.ts`
*   **Function**: `getVariations(params)`
*   **Operation**: `GetVariations`
*   **Description**: 상품의 변형(사이즈, 컬러 등) 옵션을 조회합니다.

## Usage Examples

### 상품 검색
```typescript
import { searchItems } from "./search_items/_";

const result = await searchItems({
  keywords: "AirPods",
  itemCount: 5,
  searchIndex: "Electronics",
});
```

### 상품 상세 조회
```typescript
import { getItems } from "./get_items/_";

const result = await getItems({
  itemIds: ["B09V3KXJPB", "B0BSHF7WHW"],
});
```

### 카테고리 조회
```typescript
import { getBrowseNodes } from "./get_browse_nodes/_";

const result = await getBrowseNodes({
  browseNodeIds: ["172282"], // Electronics (US)
});
```

### 상품 변형 조회
```typescript
import { getVariations } from "./get_variations/_";

const result = await getVariations({
  asin: "B09V3KXJPB",
});
```

## 리전별 Host & Region

| 마켓 | Host | Region |
|------|------|--------|
| US | `webservices.amazon.com` | `us-east-1` |
| JP | `webservices.amazon.co.jp` | `us-west-2` |
| UK | `webservices.amazon.co.uk` | `eu-west-1` |
| DE | `webservices.amazon.de` | `eu-west-1` |
| FR | `webservices.amazon.fr` | `eu-west-1` |
| CA | `webservices.amazon.ca` | `us-east-1` |
| AU | `webservices.amazon.com.au` | `us-west-2` |

## 아키텍처

```
backend/amazon/
├── AI_CODING_GUIDE.md     ← 이 문서
├── auth.ts                ← OAuth 2.0 인증 + 토큰 캐싱
├── client.ts              ← API POST 요청 헬퍼
├── search_items/          ← 상품 검색
│   ├── _.ts
│   └── note/_.ts
├── get_items/             ← 상품 상세 조회
│   ├── _.ts
│   └── note/_.ts
├── get_browse_nodes/      ← 카테고리 조회
│   ├── _.ts
│   └── note/_.ts
└── get_variations/        ← 상품 변형 조회
    ├── _.ts
    └── note/_.ts
```
