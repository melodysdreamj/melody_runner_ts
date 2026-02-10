# melody_runner_ts

**TypeScript 백엔드 자동화 프로젝트 템플릿**

AI 기반 개발에 최적화된 3계층 아키텍처 템플릿입니다. 29개의 사전 구축된 백엔드 모듈(AI/LLM, 이커머스, 데이터베이스, 클라우드 등)을 조합하여 빠르게 자동화 프로젝트를 시작할 수 있습니다.

---

## 이 프로젝트는 템플릿입니다

melody_runner_ts는 완성된 애플리케이션이 아닌 **프로젝트 시작점(Boilerplate)**입니다.

- **Backend**: 29개 모듈이 미리 구현되어 있습니다 — 필요한 것만 골라 쓰세요
- **Controller**: 비어 있습니다 — 여러분의 비즈니스 로직을 여기에 작성하세요
- **Frontend**: 비어 있습니다 — 실행 스크립트를 여기에 작성하세요

각 레이어에는 `MODULE_CREATION_GUIDE.md`가 포함되어 있어 새 모듈을 만드는 방법을 안내합니다.

---

## 아키텍처

단방향 의존성을 가진 3계층 구조를 따릅니다.

```
Frontend (실행 진입점)
    │  controller만 import 가능
    ▼
Controller (비즈니스 로직)
    │  backend만 import 가능
    ▼
Backend (순수 데이터 처리)
    ※ 상위 레이어에 대해 Zero Knowledge
```

| 레이어 | 역할 | import 가능 대상 |
|--------|------|------------------|
| **Frontend** | 사용자가 직접 실행하는 스크립트 (IIFE 패턴) | `controller/*` |
| **Controller** | Backend 함수를 조합하여 Use Case 구현 | `backend/*` |
| **Backend** | DB 접근, 외부 API 호출 등 순수 인프라 로직 | 외부 라이브러리만 |

> 규칙 위반 (예: Frontend에서 Backend 직접 import)은 금지됩니다. 자세한 내용은 [RULES.md](./RULES.md)를 참고하세요.

---

## 사전 구축된 백엔드 모듈

### AI / LLM
| 모듈 | 설명 |
|------|------|
| `openai` | GPT-4o-mini, GPT-4o (Structured Output) |
| `gemini` | Gemini Flash 2.0, Flash 2.0 JSON |
| `deepseek` | DeepSeek V3, R1 |
| `open_router` | Claude 3.5 Sonnet, Gemini, Qwen 등 멀티 모델 |
| `cloudflare_gateway` | Cloudflare AI Gateway 경유 호출 |
| `wb` | Weights & Biases 호스팅 모델 |

### 이커머스
| 모듈 | 설명 |
|------|------|
| `aliexpress` | 인기상품, 상품검색, 딥링크, 주문조회 |
| `amazon` | Product Advertising API (검색, 상세, 변형) |
| `coupang` | 쿠팡 파트너스 (검색, 딥링크, 골드박스, 베스트) |
| `rapidapi` | AliExpress True API, Google News, News API 등 |

### 데이터베이스
| 모듈 | 설명 |
|------|------|
| `postgresql` | pg-promise 기반, 커넥션 풀링 |
| `sqlite` | 싱글톤 패턴, Promise 래퍼 |
| `neon` | Serverless PostgreSQL |
| `mariadb` | MySQL 호환 |
| `client-dynamodb` | AWS DynamoDB |
| `pocketbase` | Backend-as-a-Service |
| `qdrant` | 벡터 DB (시맨틱 검색) |
| `quick-lru` | 인메모리 LRU 캐시 |

### 클라우드 & 스토리지
| 모듈 | 설명 |
|------|------|
| `cloudflare_r2` | S3 호환 오브젝트 스토리지 |
| `worker_kv` | Cloudflare Workers KV |
| `amazon_ses` | AWS SES 이메일 발송 |

### 유틸리티
| 모듈 | 설명 |
|------|------|
| `deepl` | DeepL 번역 API |
| `google_translate` | Google Translate |
| `csv` | CSV 파싱 & 생성 |
| `excel` | Excel 파일 생성 |
| `create_hash` | 해싱 유틸리티 |
| `get_video_id` | YouTube/영상 URL 파싱 |
| `ddg` | DuckDuckGo 검색 |
| `gcp/text_to_speech` | Google Cloud TTS |

---

## 퀵스타트 가이드

### 1단계: 템플릿 복제 및 의존성 설치

```bash
# 저장소 복제
git clone https://github.com/your-username/melody_runner_ts.git my-project
cd my-project

# 의존성 설치 (pnpm 권장)
pnpm install

# 또는
npm install
```

> [!IMPORTANT]
> **의존성 설치(`pnpm install` 또는 `npm install`)는 필수입니다.**
> 설치 없이는 `npx tsx` 실행, 테스트 등 모든 명령어가 동작하지 않습니다.
> 클론 직후 반드시 먼저 실행하세요.

### 2단계: 환경변수 설정

```bash
# .env.example을 복사하여 .env 생성
cp .env.example .env
```

`.env` 파일을 열고 **사용할 서비스의 API 키만** 입력하세요. 사용하지 않는 항목은 비워두면 됩니다.

```env
# 예: Gemini와 PostgreSQL만 사용하는 경우
GEMINI_API_KEY=your-gemini-key-here
NEON_DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
```

> 각 환경변수 위에 API 키 발급 링크가 주석으로 포함되어 있습니다.

### 3단계: 백엔드 모듈 동작 확인

사용할 모듈이 정상 작동하는지 `note/_.ts` 연습장으로 확인합니다.

```bash
# Gemini Flash 2.0 테스트
npx tsx backend/gemini/flash_2_0/note/_.ts

# PostgreSQL 연결 테스트
npx tsx backend/postgresql/<feature>/note/_.ts
```

### 4단계: Controller 작성 (비즈니스 로직)

`controller/` 폴더에 Use Case를 생성합니다. 자세한 규칙은 [controller/MODULE_CREATION_GUIDE.md](./controller/MODULE_CREATION_GUIDE.md)를 참고하세요.

```
controller/summarize_news/
├── AI_CODING_GUIDE.md     ← 이 모듈의 가이드
├── _.ts                   ← 비즈니스 로직 (export 함수)
└── note/
    └── _.ts               ← 연습장
```

```typescript
// controller/summarize_news/_.ts
import { searchArticles } from "../../backend/rapidapi/news-api14/search_articles/_";
import { requestGeminiFlash } from "../../backend/gemini/flash_2_0/_";

export async function summarizeNews(keyword: string): Promise<string | null> {
    const articles = await searchArticles({ query: keyword, limit: 5 });
    if (!articles || articles.length === 0) return null;

    const prompt = `다음 뉴스를 3줄로 요약해줘:\n${articles.map(a => a.title).join("\n")}`;
    return await requestGeminiFlash(prompt);
}
```

### 5단계: Frontend 작성 (실행 스크립트)

`frontend/` 폴더에 실행 진입점을 생성합니다. 자세한 규칙은 [frontend/MODULE_CREATION_GUIDE.md](./frontend/MODULE_CREATION_GUIDE.md)를 참고하세요.

```
frontend/daily_news/
├── AI_CODING_GUIDE.md     ← 이 스크립트의 가이드
└── _.ts                   ← IIFE 실행 스크립트
```

```typescript
// frontend/daily_news/_.ts
import { summarizeNews } from "../../controller/summarize_news/_";
import dotenv from "dotenv";

;(async () => {
    dotenv.config();
    console.log("뉴스 요약 시작...");

    const summary = await summarizeNews("AI 반도체");
    console.log("결과:", summary);

    process.exit(0);
})();
```

### 6단계: 실행

```bash
npx tsx frontend/daily_news/_.ts
```

---

## AI 기반 개발 가이드

이 템플릿의 핵심 특징은 **AI와의 협업에 최적화된 구조**입니다.

### AI_CODING_GUIDE.md 시스템

모든 모듈에는 `AI_CODING_GUIDE.md`가 포함되어 있습니다. 이 파일은 해당 모듈의 "로컬 헌법"으로, AI에게 모듈의 규칙과 패턴을 알려줍니다.

```
프로젝트 전체 규칙: RULES.md (상위 헌법)
    └── 모듈별 규칙: AI_CODING_GUIDE.md (로컬 헌법)
```

AI에게 작업을 요청할 때:
1. AI가 해당 모듈의 `AI_CODING_GUIDE.md`를 먼저 읽음
2. 가이드에 명시된 패턴과 규칙을 따라 코드 작성
3. 프로젝트 전체의 일관성 유지

### 새 모듈 추가 시 AI 활용법

```
"backend/redis 모듈의 AI_CODING_GUIDE.md를 읽고, get/set 함수를 추가해줘"
```

AI가 가이드를 읽고 기존 패턴에 맞춰 코드를 생성합니다.

---

## 프로젝트 구조

```
melody_runner_ts/
├── backend/                    ← 29개 사전 구축 모듈
│   ├── MODULE_CREATION_GUIDE.md
│   ├── openai/
│   ├── gemini/
│   ├── postgresql/
│   ├── ...
│   └── <module>/
│       ├── AI_CODING_GUIDE.md
│       ├── <feature>/
│       │   ├── _.ts            ← 구현체
│       │   ├── note/_.ts       ← 연습장
│       │   └── test/_.test.ts  ← 테스트
│       └── ...
├── controller/                 ← 비즈니스 로직 (직접 작성)
│   └── MODULE_CREATION_GUIDE.md
├── frontend/                   ← 실행 스크립트 (직접 작성)
│   └── MODULE_CREATION_GUIDE.md
├── RULES.md                    ← 프로젝트 전체 규칙
├── .env.example                ← 환경변수 템플릿
├── package.json
└── tsconfig.json
```

---

## 사용하지 않는 모듈 제거

필요 없는 백엔드 모듈은 폴더를 삭제하고, `package.json`에서 관련 의존성을 제거하면 됩니다.

```bash
# 예: AliExpress 모듈이 불필요한 경우
rm -rf backend/aliexpress

# package.json에서 관련 의존성 제거 후 재설치
pnpm install
```

---

## 실행 명령어

```bash
# 백엔드 모듈 연습장 실행
npx tsx backend/<module>/<feature>/note/_.ts

# 컨트롤러 연습장 실행
npx tsx controller/<use_case>/note/_.ts

# 프론트엔드 스크립트 실행
npx tsx frontend/<task>/_.ts

# 테스트 실행
npm test
```

---

## 라이선스

MIT License - 자유롭게 사용, 수정, 배포할 수 있습니다.
