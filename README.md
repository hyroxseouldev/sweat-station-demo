# SunM SaaS Starter

현대적인 SaaS 애플리케이션을 빠르게 시작할 수 있는 스타터 템플릿입니다. Next.js 15, Clerk 인증, Drizzle ORM, shadcn/ui 컴포넌트가 통합되어 있습니다.

## 🚀 주요 기능

- **🔐 완전한 인증 시스템**: Clerk를 통한 소셜 로그인, 이메일/비밀번호 인증
- **🎨 현대적인 UI**: shadcn/ui 컴포넌트 라이브러리 전체 설치
- **🗄️ 타입세이프 데이터베이스**: Drizzle ORM과 PostgreSQL 통합
- **⚡ 최신 Next.js**: App Router, Turbopack, React 19 지원
- **🎯 TypeScript**: 완전한 타입 안전성
- **🎨 TailwindCSS**: 유틸리티 우선 스타일링
- **📱 반응형 디자인**: 모바일 우선 접근 방식

## 🛠️ 기술 스택

### 프론트엔드
- **Next.js 15.4.5** - React 프레임워크
- **React 19.1.0** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **TailwindCSS 4** - 스타일링
- **shadcn/ui** - UI 컴포넌트 라이브러리
- **Lucide React** - 아이콘

### 백엔드 & 데이터베이스
- **Drizzle ORM 0.44.4** - 타입세이프 ORM
- **PostgreSQL** - 데이터베이스 (Neon 지원)
- **Drizzle Kit** - 마이그레이션 도구

### 인증 & 보안
- **Clerk** - 완전한 인증 시스템
- **Middleware** - Route 보호

### 개발 도구
- **ESLint** - 코드 품질
- **PostCSS** - CSS 처리
- **pnpm** - 패키지 매니저

## 📦 설치 및 시작하기

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Clerk 인증
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# 데이터베이스
DATABASE_URL=your_postgresql_database_url
```

### 3. 데이터베이스 설정
```bash
# 스키마 생성
pnpm db:generate

# 데이터베이스에 스키마 푸시
pnpm db:push

# (옵션) Drizzle Studio 실행
pnpm db:studio
```

### 4. 개발 서버 시작
```bash
pnpm dev
```

애플리케이션이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈페이지
├── components/
│   └── ui/                # shadcn/ui 컴포넌트들
├── db/
│   ├── index.ts           # 데이터베이스 연결
│   └── schema.ts          # Drizzle 스키마
├── hooks/                 # 커스텀 React 훅
├── lib/
│   └── utils.ts           # 유틸리티 함수
└── middleware.ts          # Next.js 미들웨어
```

## 🎨 사용 가능한 UI 컴포넌트

이 프로젝트에는 shadcn/ui의 모든 주요 컴포넌트가 설치되어 있습니다:

- **레이아웃**: Card, Separator, Sheet, Sidebar
- **내비게이션**: Breadcrumb, Navigation Menu, Pagination, Tabs
- **폼**: Button, Input, Textarea, Select, Checkbox, Radio Group
- **피드백**: Alert, Dialog, Popover, Tooltip, Progress
- **데이터 표시**: Table, Avatar, Badge, Calendar, Chart
- **기타**: Accordion, Carousel, Command, Skeleton, Toggle

## 🗄️ 데이터베이스 스키마

기본 사용자 테이블이 포함되어 있습니다:

```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

## 📝 사용 가능한 스크립트

```bash
# 개발 서버 (Turbopack 사용)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start

# 린팅
pnpm lint

# 데이터베이스 스키마 생성
pnpm db:generate

# 데이터베이스에 스키마 푸시
pnpm db:push

# 데이터베이스 마이그레이션
pnpm db:migrate

# Drizzle Studio 실행
pnpm db:studio
```

## 🔧 설정

### Clerk 설정
1. [Clerk 대시보드](https://clerk.com)에서 새 애플리케이션 생성
2. 공개 키와 비밀 키를 `.env.local`에 추가
3. 허용된 리디렉트 URL 설정

### 데이터베이스 설정
1. PostgreSQL 데이터베이스 준비 (로컬 또는 [Neon](https://neon.tech) 사용)
2. 연결 문자열을 `DATABASE_URL`에 설정
3. `pnpm db:push`로 스키마 생성

## 🚀 다음 단계

1. **커스텀 스키마**: `src/db/schema.ts`에서 데이터베이스 스키마 확장
2. **API 라우트**: `src/app/api/`에서 백엔드 로직 구현
3. **UI 개선**: shadcn/ui 컴포넌트를 사용해 인터페이스 구축
4. **인증 플로우**: Clerk를 사용해 보호된 라우트 및 사용자 관리 구현
5. **배포**: Vercel, Netlify, 또는 원하는 플랫폼에 배포

## 📄 라이센스

MIT 라이센스에 따라 배포됩니다.

## 🤝 기여하기

이슈를 제출하거나 풀 리퀘스트를 보내주세요!
