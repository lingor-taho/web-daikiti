# DKT Motors Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-responsive DKT Motors frontend and admin backend that preserves existing company/contact functions and adds strong automotive customization case presentation with brand/category filtering.

**Architecture:** Use a new Next.js App Router application because the current workspace does not contain the original website source. Keep frontend pages, admin pages, data access, validation, and UI primitives separated so the implementation can later be adapted to an existing source tree if provided.

**Tech Stack:** Next.js, TypeScript, Prisma, SQLite for local development, React Hook Form, Zod, TipTap rich text editor, local file uploads under `public/uploads`, Playwright or browser verification for responsive QA.

---

## Scope And Preconditions

The current workspace has no application source code. This plan assumes a greenfield implementation in `D:\www\web-daikiti`.

If an existing source code package is provided before implementation starts, first inspect that source and map the tasks below to its framework. Do not overwrite existing user files without review.

The first production-ready version must include:

- Frontend homepage with company positioning, two business summaries, custom case section, and contact CTA.
- Frontend custom works list with brand/category filtering.
- Frontend custom work detail with Before/After comparison, rich text body, and spec summary.
- Frontend company/business/access/contact/privacy pages.
- Admin case maintenance using fixed fields plus rich text content.
- Admin brand/category maintenance.
- Admin inquiry list/detail.
- Contact form submission storage.
- Mobile responsive layout.

## Proposed File Structure

Create these main areas:

- `package.json`: project scripts and dependencies.
- `next.config.ts`: Next.js config.
- `tsconfig.json`: TypeScript config.
- `prisma/schema.prisma`: database schema for brands, categories, custom cases, tags, inquiries, and image metadata.
- `prisma/seed.ts`: starter brands, categories, and sample custom cases for visual QA.
- `src/app/(site)/page.tsx`: homepage.
- `src/app/(site)/custom-works/page.tsx`: custom case listing and filters.
- `src/app/(site)/custom-works/[slug]/page.tsx`: custom case detail.
- `src/app/(site)/business/page.tsx`: business detail page.
- `src/app/(site)/company/page.tsx`: company profile page.
- `src/app/(site)/access/page.tsx`: access/location page.
- `src/app/(site)/contact/page.tsx`: contact page and form.
- `src/app/(site)/privacy/page.tsx`: privacy policy page.
- `src/app/admin/layout.tsx`: backend shell with sidebar.
- `src/app/admin/page.tsx`: backend dashboard.
- `src/app/admin/custom-cases/page.tsx`: case list.
- `src/app/admin/custom-cases/new/page.tsx`: create case.
- `src/app/admin/custom-cases/[id]/edit/page.tsx`: edit case.
- `src/app/admin/brands/page.tsx`: brand maintenance.
- `src/app/admin/categories/page.tsx`: custom category maintenance.
- `src/app/admin/inquiries/page.tsx`: inquiry list.
- `src/app/admin/inquiries/[id]/page.tsx`: inquiry detail.
- `src/app/api/contact/route.ts`: contact form API.
- `src/app/api/uploads/route.ts`: image upload API.
- `src/components/site/*`: frontend layout, sections, cards, filters, rich content renderer.
- `src/components/admin/*`: admin forms, tables, editor, image upload controls.
- `src/components/ui/*`: shared low-level UI controls.
- `src/lib/db.ts`: Prisma client.
- `src/lib/queries/*`: server-side query helpers.
- `src/lib/actions/*`: validated server actions for admin mutations.
- `src/lib/validation/*`: Zod schemas.
- `src/lib/uploads.ts`: upload validation and storage helper.
- `src/styles/globals.css`: global design system, responsive rules, colors.
- `tests/e2e/site.spec.ts`: frontend smoke and responsive checks.
- `tests/e2e/admin.spec.ts`: admin workflow checks.

## Task 1: Bootstrap The Application

**Files:**

- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `src/app/layout.tsx`
- Create: `src/styles/globals.css`
- Create: `.env.example`

- [ ] **Step 1: Initialize the Next.js project**

Run:

```powershell
npx create-next-app@latest . --ts --app --eslint --src-dir --no-tailwind --import-alias "@/*"
```

Expected: project files are created in `D:\www\web-daikiti`.

- [ ] **Step 2: Add required dependencies**

Run:

```powershell
npm install @prisma/client prisma zod react-hook-form @hookform/resolvers @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link clsx lucide-react
npm install -D tsx playwright @playwright/test
```

Expected: dependencies are added to `package.json`.

- [ ] **Step 3: Add base environment example**

Create `.env.example`:

```env
DATABASE_URL="file:./dev.db"
UPLOAD_DIR="public/uploads"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- [ ] **Step 4: Add global design tokens**

Create `src/styles/globals.css`:

```css
:root {
  --color-primary: #111827;
  --color-metal: #374151;
  --color-accent: #f6c85f;
  --color-base: #f8fafc;
  --color-action: #b91c1c;
  --color-text: #1f2937;
  --color-muted: #596171;
  --color-border: #e5e7eb;
  --radius-card: 8px;
  --content-width: 1180px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  color: var(--color-text);
  background: #fff;
  font-family: Arial, "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

.container {
  width: min(100% - 32px, var(--content-width));
  margin-inline: auto;
}
```

- [ ] **Step 5: Verify bootstrap**

Run:

```powershell
npm run lint
npm run dev
```

Expected: lint passes and the app serves on `http://localhost:3000`.

- [ ] **Step 6: Commit**

Run:

```powershell
git add .
git commit -m "chore: bootstrap DKT redesign app"
```

Expected: commit succeeds if the workspace has been initialized as a Git repository.

## Task 2: Add Database Schema And Seed Data

**Files:**

- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Modify: `package.json`
- Create: `src/lib/db.ts`

- [ ] **Step 1: Initialize Prisma**

Run:

```powershell
npx prisma init --datasource-provider sqlite
```

Expected: `prisma/schema.prisma` and `.env` are created.

- [ ] **Step 2: Replace `prisma/schema.prisma`**

Use this schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Brand {
  id        Int          @id @default(autoincrement())
  name      String
  slug      String       @unique
  sortOrder Int          @default(0)
  isActive  Boolean      @default(true)
  cases     CustomCase[]
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
}

model CustomCategory {
  id        Int                  @id @default(autoincrement())
  name      String
  slug      String               @unique
  sortOrder Int                  @default(0)
  isActive  Boolean              @default(true)
  cases     CustomCaseCategory[]
  createdAt DateTime             @default(now())
  updatedAt DateTime             @updatedAt
}

model CustomCase {
  id           Int                  @id @default(autoincrement())
  title        String
  slug         String               @unique
  brandId      Int
  brand        Brand                @relation(fields: [brandId], references: [id])
  modelName    String?
  summary      String
  coverImage   String
  beforeImage  String?
  afterImage   String?
  content      String
  galleryJson  String               @default("[]")
  status       PublishStatus        @default(DRAFT)
  isFeatured   Boolean              @default(false)
  sortOrder    Int                  @default(0)
  publishedAt  DateTime?
  categories   CustomCaseCategory[]
  tags         CustomCaseTag[]
  createdAt    DateTime             @default(now())
  updatedAt    DateTime             @updatedAt
}

model CustomCaseCategory {
  customCaseId Int
  categoryId   Int
  customCase   CustomCase     @relation(fields: [customCaseId], references: [id], onDelete: Cascade)
  category     CustomCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([customCaseId, categoryId])
}

model CustomCaseTag {
  id           Int        @id @default(autoincrement())
  customCaseId Int
  customCase   CustomCase @relation(fields: [customCaseId], references: [id], onDelete: Cascade)
  name         String
}

model Inquiry {
  id          Int           @id @default(autoincrement())
  name        String
  email       String
  phone       String?
  inquiryType String?
  message     String
  status      InquiryStatus @default(UNREAD)
  adminMemo   String?
  submittedAt DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum PublishStatus {
  DRAFT
  PUBLISHED
}

enum InquiryStatus {
  UNREAD
  READ
}
```

- [ ] **Step 3: Add Prisma client helper**

Create `src/lib/db.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

- [ ] **Step 4: Seed starter data**

Create `prisma/seed.ts`:

```ts
import { PrismaClient, PublishStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const brands = [
    ["TOYOTA", "toyota"],
    ["LEXUS", "lexus"],
    ["NISSAN", "nissan"],
    ["HONDA", "honda"],
    ["輸入車", "imported"],
  ];

  for (const [index, [name, slug]] of brands.entries()) {
    await prisma.brand.upsert({
      where: { slug },
      update: { name, sortOrder: index, isActive: true },
      create: { name, slug, sortOrder: index, isActive: true },
    });
  }

  const categories = [
    ["Before / After", "before-after"],
    ["Exterior", "exterior"],
    ["Interior", "interior"],
    ["Paint", "paint"],
    ["Parts", "parts"],
  ];

  for (const [index, [name, slug]] of categories.entries()) {
    await prisma.customCategory.upsert({
      where: { slug },
      update: { name, sortOrder: index, isActive: true },
      create: { name, slug, sortOrder: index, isActive: true },
    });
  }

  const toyota = await prisma.brand.findUniqueOrThrow({ where: { slug: "toyota" } });
  await prisma.customCase.upsert({
    where: { slug: "sample-before-after" },
    update: {},
    create: {
      title: "TOYOTA カスタム Before / After",
      slug: "sample-before-after",
      brandId: toyota.id,
      modelName: "Sample Model",
      summary: "外装と内装の印象を大きく変えたカスタム事例です。",
      coverImage: "/images/placeholders/custom-case-1.jpg",
      beforeImage: "/images/placeholders/before.jpg",
      afterImage: "/images/placeholders/after.jpg",
      content: "<h2>施工内容</h2><p>入庫状態を確認し、外装パーツと内装の調整を行いました。</p>",
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date(),
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 5: Add Prisma scripts**

Modify `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  }
}
```

- [ ] **Step 6: Run migration and seed**

Run:

```powershell
npx prisma migrate dev --name init
npm run db:seed
```

Expected: SQLite database is created and starter data exists.

- [ ] **Step 7: Commit**

Run:

```powershell
git add prisma src/lib/db.ts package.json package-lock.json
git commit -m "feat: add custom works data model"
```

## Task 3: Build Frontend Layout And Home Page

**Files:**

- Create: `src/components/site/SiteHeader.tsx`
- Create: `src/components/site/SiteFooter.tsx`
- Create: `src/components/site/HomeHero.tsx`
- Create: `src/components/site/BusinessSummary.tsx`
- Create: `src/components/site/FeaturedCases.tsx`
- Create: `src/components/site/ContactCta.tsx`
- Create: `src/lib/queries/customCases.ts`
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Add custom case query helper**

Create `src/lib/queries/customCases.ts`:

```ts
import { PublishStatus } from "@prisma/client";
import { db } from "@/lib/db";

export async function getFeaturedCustomCases() {
  return db.customCase.findMany({
    where: { status: PublishStatus.PUBLISHED, isFeatured: true },
    include: { brand: true, categories: { include: { category: true } }, tags: true },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    take: 3,
  });
}
```

- [ ] **Step 2: Create site header**

Create `src/components/site/SiteHeader.tsx`:

```tsx
import Link from "next/link";

const navItems = [
  { href: "/business", label: "事業紹介" },
  { href: "/custom-works", label: "改装事例" },
  { href: "/company", label: "会社情報" },
  { href: "/access", label: "アクセス" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="site-header__brand" href="/">
          DKT MOTORS
        </Link>
        <nav className="site-header__nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Add homepage components**

Create `src/components/site/HomeHero.tsx`:

```tsx
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="home-hero">
      <div className="container home-hero__grid">
        <div>
          <p className="eyebrow">Total Car Support & Custom Works</p>
          <h1>自動車サービスと改装で、車の価値を引き出す。</h1>
          <p className="lead">
            中古車販売・買取・輸出を含むトータルカーサポートを基盤に、車種や用途に合わせた自動車改装事例をわかりやすく紹介します。
          </p>
          <div className="button-row">
            <Link className="button button--accent" href="/custom-works">
              改装事例を見る
            </Link>
            <Link className="button button--dark" href="/contact">
              お問い合わせ
            </Link>
          </div>
        </div>
        <div className="home-hero__image" aria-label="Custom vehicle visual" />
      </div>
    </section>
  );
}
```

Create `src/components/site/BusinessSummary.tsx`:

```tsx
const businesses = [
  {
    title: "自動車トータルサービス事業",
    body: "中古車販売、買取、輸出、整備相談など、カーライフに関わる幅広いニーズに対応します。",
  },
  {
    title: "プラスチックのリサイクル及び輸出",
    body: "既存事業としてのリサイクル・輸出事業も紹介し、企業としての事業幅と信頼性を伝えます。",
  },
];

export function BusinessSummary() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h2>事業紹介</h2>
          <p>詳しい会社情報は各ページでご確認いただけます。</p>
        </div>
        <div className="business-grid">
          {businesses.map((business) => (
            <article className="business-card" key={business.title}>
              <h3>{business.title}</h3>
              <p>{business.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create featured case component**

Create `src/components/site/FeaturedCases.tsx`:

```tsx
import Link from "next/link";
import type { Brand, CustomCase } from "@prisma/client";

type FeaturedCase = CustomCase & {
  brand: Brand;
};

export function FeaturedCases({ cases }: { cases: FeaturedCase[] }) {
  return (
    <section className="section section--base">
      <div className="container">
        <div className="section-heading">
          <h2>自動車改装事例</h2>
          <p>ブランド別・改装部位別に施工事例を探せます。</p>
        </div>
        <div className="case-grid">
          {cases.map((customCase) => (
            <Link className="case-card" href={`/custom-works/${customCase.slug}`} key={customCase.id}>
              <div className="case-card__image" style={{ backgroundImage: `url(${customCase.coverImage})` }} />
              <div className="case-card__body">
                <span className="pill pill--accent">{customCase.brand.name}</span>
                <h3>{customCase.title}</h3>
                <p>{customCase.summary}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="section-action">
          <Link className="button button--dark" href="/custom-works">
            すべての改装事例を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Wire homepage**

Create `src/app/(site)/page.tsx`:

```tsx
import { BusinessSummary } from "@/components/site/BusinessSummary";
import { ContactCta } from "@/components/site/ContactCta";
import { FeaturedCases } from "@/components/site/FeaturedCases";
import { HomeHero } from "@/components/site/HomeHero";
import { getFeaturedCustomCases } from "@/lib/queries/customCases";

export default async function HomePage() {
  const cases = await getFeaturedCustomCases();

  return (
    <>
      <HomeHero />
      <BusinessSummary />
      <FeaturedCases cases={cases} />
      <ContactCta />
    </>
  );
}
```

- [ ] **Step 6: Add responsive CSS**

Append homepage styles to `src/styles/globals.css`:

```css
.home-hero {
  background: var(--color-primary);
  color: #fff;
  padding: 72px 0;
}

.home-hero__grid,
.business-grid,
.case-grid {
  display: grid;
  gap: 24px;
}

.home-hero__grid {
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
}

.home-hero h1 {
  margin: 10px 0 0;
  font-size: clamp(2.25rem, 5vw, 4.25rem);
  line-height: 1.05;
}

.eyebrow {
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lead {
  color: #d1d5db;
  line-height: 1.8;
  max-width: 620px;
}

.home-hero__image,
.case-card__image {
  min-height: 240px;
  border-radius: var(--radius-card);
  background: linear-gradient(135deg, #374151, #9ca3af 58%, var(--color-accent));
  background-size: cover;
  background-position: center;
}

.section {
  padding: 64px 0;
}

.section--base {
  background: var(--color-base);
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: end;
  margin-bottom: 24px;
}

.business-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.business-card,
.case-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: #fff;
}

.business-card {
  padding: 24px;
}

.case-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.case-card {
  overflow: hidden;
}

.case-card__body {
  padding: 18px;
}

.pill {
  display: inline-flex;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 10px;
}

.pill--accent {
  background: var(--color-accent);
  color: var(--color-primary);
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.button {
  display: inline-flex;
  border-radius: 6px;
  font-weight: 700;
  padding: 12px 16px;
}

.button--accent {
  background: var(--color-accent);
  color: var(--color-primary);
}

.button--dark {
  background: var(--color-primary);
  color: #fff;
}

@media (max-width: 820px) {
  .home-hero__grid,
  .business-grid,
  .case-grid,
  .section-heading {
    grid-template-columns: 1fr;
    display: grid;
  }

  .section {
    padding: 44px 0;
  }
}
```

- [ ] **Step 7: Verify homepage**

Run:

```powershell
npm run dev
```

Open `http://localhost:3000`.

Expected:

- Hero appears first.
- Two business cards appear before custom case cards.
- Featured case cards use large images.
- Mobile width stacks sections without overlap.

- [ ] **Step 8: Commit**

Run:

```powershell
git add src
git commit -m "feat: build redesigned homepage"
```

## Task 4: Build Custom Works List And Detail Pages

**Files:**

- Modify: `src/lib/queries/customCases.ts`
- Create: `src/components/site/BrandFilter.tsx`
- Create: `src/components/site/CustomCaseCard.tsx`
- Create: `src/components/site/BeforeAfter.tsx`
- Create: `src/components/site/RichContent.tsx`
- Create: `src/components/site/CaseSpec.tsx`
- Create: `src/app/(site)/custom-works/page.tsx`
- Create: `src/app/(site)/custom-works/[slug]/page.tsx`

- [ ] **Step 1: Add list/detail queries**

Add to `src/lib/queries/customCases.ts`:

```ts
import { notFound } from "next/navigation";

export async function getActiveBrands() {
  return db.brand.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getPublishedCustomCases(filters: { brand?: string; category?: string }) {
  return db.customCase.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      brand: filters.brand ? { slug: filters.brand } : undefined,
      categories: filters.category
        ? { some: { category: { slug: filters.category } } }
        : undefined,
    },
    include: { brand: true, categories: { include: { category: true } }, tags: true },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
  });
}

export async function getCustomCaseBySlug(slug: string) {
  const customCase = await db.customCase.findFirst({
    where: { slug, status: PublishStatus.PUBLISHED },
    include: { brand: true, categories: { include: { category: true } }, tags: true },
  });

  if (!customCase) {
    notFound();
  }

  return customCase;
}
```

- [ ] **Step 2: Create brand filter**

Create `src/components/site/BrandFilter.tsx`:

```tsx
import Link from "next/link";
import type { Brand } from "@prisma/client";

export function BrandFilter({ brands, currentBrand }: { brands: Brand[]; currentBrand?: string }) {
  return (
    <div className="brand-filter" aria-label="Brand filter">
      <Link className={!currentBrand ? "pill pill--accent" : "pill"} href="/custom-works">
        ALL
      </Link>
      {brands.map((brand) => (
        <Link
          className={currentBrand === brand.slug ? "pill pill--accent" : "pill"}
          href={`/custom-works?brand=${brand.slug}`}
          key={brand.id}
        >
          {brand.name}
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create detail components**

Create `src/components/site/BeforeAfter.tsx`:

```tsx
export function BeforeAfter({ beforeImage, afterImage }: { beforeImage?: string | null; afterImage?: string | null }) {
  if (!beforeImage && !afterImage) {
    return null;
  }

  return (
    <div className="before-after">
      {beforeImage ? <img src={beforeImage} alt="Before customization" /> : null}
      {afterImage ? <img src={afterImage} alt="After customization" /> : null}
    </div>
  );
}
```

Create `src/components/site/RichContent.tsx`:

```tsx
export function RichContent({ html }: { html: string }) {
  return <div className="rich-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
```

Create `src/components/site/CaseSpec.tsx`:

```tsx
import type { Brand, CustomCase } from "@prisma/client";

export function CaseSpec({ customCase }: { customCase: CustomCase & { brand: Brand } }) {
  return (
    <aside className="case-spec">
      <h2>Case Spec</h2>
      <dl>
        <div>
          <dt>Brand</dt>
          <dd>{customCase.brand.name}</dd>
        </div>
        <div>
          <dt>Model</dt>
          <dd>{customCase.modelName || "-"}</dd>
        </div>
        <div>
          <dt>Published</dt>
          <dd>{customCase.publishedAt ? customCase.publishedAt.toLocaleDateString("ja-JP") : "-"}</dd>
        </div>
      </dl>
    </aside>
  );
}
```

- [ ] **Step 4: Create list page**

Create `src/app/(site)/custom-works/page.tsx`:

```tsx
import { BrandFilter } from "@/components/site/BrandFilter";
import { FeaturedCases } from "@/components/site/FeaturedCases";
import { getActiveBrands, getPublishedCustomCases } from "@/lib/queries/customCases";

export default async function CustomWorksPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; category?: string }>;
}) {
  const filters = await searchParams;
  const [brands, cases] = await Promise.all([getActiveBrands(), getPublishedCustomCases(filters)]);

  return (
    <main className="section">
      <div className="container">
        <div className="section-heading">
          <h1>自動車改装事例</h1>
          <p>ブランド別・改装部位別に施工事例をご覧いただけます。</p>
        </div>
        <BrandFilter brands={brands} currentBrand={filters.brand} />
      </div>
      <FeaturedCases cases={cases} />
    </main>
  );
}
```

- [ ] **Step 5: Create detail page**

Create `src/app/(site)/custom-works/[slug]/page.tsx`:

```tsx
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { CaseSpec } from "@/components/site/CaseSpec";
import { RichContent } from "@/components/site/RichContent";
import { getCustomCaseBySlug } from "@/lib/queries/customCases";

export default async function CustomWorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const customCase = await getCustomCaseBySlug(slug);

  return (
    <main className="case-detail">
      <section className="case-detail__hero">
        <div className="container">
          <p className="eyebrow">{customCase.brand.name}</p>
          <h1>{customCase.title}</h1>
          <p>{customCase.summary}</p>
          <BeforeAfter beforeImage={customCase.beforeImage} afterImage={customCase.afterImage} />
        </div>
      </section>
      <section className="section">
        <div className="container case-detail__grid">
          <RichContent html={customCase.content} />
          <CaseSpec customCase={customCase} />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 6: Verify list/detail**

Run:

```powershell
npm run dev
```

Expected:

- `/custom-works` shows filters and case cards.
- `/custom-works?brand=toyota` filters cases.
- `/custom-works/sample-before-after` shows Before/After and rich content.

- [ ] **Step 7: Commit**

Run:

```powershell
git add src
git commit -m "feat: add custom works frontend"
```

## Task 5: Protect Admin Routes

**Files:**

- Create: `src/lib/adminAuth.ts`
- Create: `middleware.ts`
- Modify: `.env.example`

- [ ] **Step 1: Add admin auth environment variables**

Append to `.env.example`:

```env
ADMIN_USER="admin"
ADMIN_PASSWORD="change-this-password"
```

- [ ] **Step 2: Create basic auth helper**

Create `src/lib/adminAuth.ts`:

```ts
export function isValidAdminAuth(authorization: string | null) {
  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  const encoded = authorization.slice("Basic ".length);
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  const [user, password] = decoded.split(":");

  return user === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD;
}
```

- [ ] **Step 3: Protect `/admin` with middleware**

Create `middleware.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { isValidAdminAuth } from "@/lib/adminAuth";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (isValidAdminAuth(request.headers.get("authorization"))) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="DKT Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 4: Verify admin protection**

Run:

```powershell
npm run dev
```

Open `http://localhost:3000/admin`.

Expected:

- Browser asks for username and password.
- `ADMIN_USER` and `ADMIN_PASSWORD` from `.env` allow access.
- Wrong credentials keep the user out of `/admin`.

- [ ] **Step 5: Commit**

Run:

```powershell
git add .env.example middleware.ts src/lib/adminAuth.ts
git commit -m "feat: protect admin routes"
```

## Task 6: Build Admin Shell And CRUD Foundation

**Files:**

- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/AdminTable.tsx`
- Create: `src/lib/validation/customCase.ts`
- Create: `src/lib/actions/customCases.ts`
- Create: `src/app/admin/custom-cases/page.tsx`

- [ ] **Step 1: Create admin sidebar**

Create `src/components/admin/AdminSidebar.tsx`:

```tsx
import Link from "next/link";

const adminItems = [
  { href: "/admin/custom-cases", label: "改装事例" },
  { href: "/admin/brands", label: "ブランド" },
  { href: "/admin/categories", label: "カテゴリ" },
  { href: "/admin/inquiries", label: "お問い合わせ" },
];

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <Link className="admin-sidebar__brand" href="/admin">
        DKT Admin
      </Link>
      <nav>
        {adminItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Create admin layout**

Create `src/app/admin/layout.tsx`:

```tsx
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Add case validation**

Create `src/lib/validation/customCase.ts`:

```ts
import { z } from "zod";

export const customCaseSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  slug: z.string().min(1, "URL識別子を入力してください").regex(/^[a-z0-9-]+$/, "半角英数字とハイフンで入力してください"),
  brandId: z.coerce.number().int().positive(),
  modelName: z.string().optional(),
  summary: z.string().min(1, "概要を入力してください"),
  coverImage: z.string().min(1, "カバー画像を設定してください"),
  beforeImage: z.string().optional(),
  afterImage: z.string().optional(),
  content: z.string().min(1, "本文を入力してください"),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  isFeatured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export type CustomCaseInput = z.infer<typeof customCaseSchema>;
```

- [ ] **Step 4: Add case list page**

Create `src/app/admin/custom-cases/page.tsx`:

```tsx
import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminCustomCasesPage() {
  const cases = await db.customCase.findMany({
    include: { brand: true },
    orderBy: [{ updatedAt: "desc" }],
  });

  return (
    <section>
      <div className="admin-heading">
        <h1>改装事例</h1>
        <Link className="button button--dark" href="/admin/custom-cases/new">
          新規作成
        </Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>タイトル</th>
            <th>ブランド</th>
            <th>状態</th>
            <th>更新日</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {cases.map((customCase) => (
            <tr key={customCase.id}>
              <td>{customCase.title}</td>
              <td>{customCase.brand.name}</td>
              <td>{customCase.status}</td>
              <td>{customCase.updatedAt.toLocaleDateString("ja-JP")}</td>
              <td>
                <Link href={`/admin/custom-cases/${customCase.id}/edit`}>編集</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
```

- [ ] **Step 5: Verify admin shell**

Run:

```powershell
npm run dev
```

Open `http://localhost:3000/admin/custom-cases`.

Expected: admin sidebar appears and the seeded case appears in a table.

- [ ] **Step 6: Commit**

Run:

```powershell
git add src
git commit -m "feat: add admin shell and case list"
```

## Task 7: Build Admin Case Editor With Fixed Fields And Rich Text

**Files:**

- Create: `src/components/admin/CustomCaseForm.tsx`
- Create: `src/components/admin/RichTextEditor.tsx`
- Create: `src/components/admin/ImageUploadField.tsx`
- Modify: `src/lib/actions/customCases.ts`
- Create: `src/app/admin/custom-cases/new/page.tsx`
- Create: `src/app/admin/custom-cases/[id]/edit/page.tsx`

- [ ] **Step 1: Create server actions**

Create `src/lib/actions/customCases.ts`:

```ts
"use server";

import { PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { customCaseSchema } from "@/lib/validation/customCase";

export async function createCustomCase(formData: FormData) {
  const parsed = customCaseSchema.parse(Object.fromEntries(formData));
  await db.customCase.create({
    data: {
      ...parsed,
      status: parsed.status as PublishStatus,
      publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/");
  revalidatePath("/custom-works");
  redirect("/admin/custom-cases");
}

export async function updateCustomCase(id: number, formData: FormData) {
  const parsed = customCaseSchema.parse(Object.fromEntries(formData));
  await db.customCase.update({
    where: { id },
    data: {
      ...parsed,
      status: parsed.status as PublishStatus,
      publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
    },
  });
  revalidatePath("/");
  revalidatePath("/custom-works");
  redirect("/admin/custom-cases");
}
```

- [ ] **Step 2: Create rich text editor**

Create `src/components/admin/RichTextEditor.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

export function RichTextEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [content, setContent] = useState(defaultValue || "<p></p>");
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    editorProps: { attributes: { class: "rich-editor" } },
    immediatelyRender: false,
  });

  return (
    <div>
      <div className="editor-toolbar">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>
          B
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>
          I
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          List
        </button>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={content} readOnly />
    </div>
  );
}
```

- [ ] **Step 3: Create case form**

Create `src/components/admin/CustomCaseForm.tsx`:

```tsx
import type { Brand, CustomCase } from "@prisma/client";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export function CustomCaseForm({
  brands,
  customCase,
  action,
}: {
  brands: Brand[];
  customCase?: CustomCase;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="admin-form">
      <label>
        タイトル
        <input name="title" defaultValue={customCase?.title} required />
      </label>
      <label>
        URL識別子
        <input name="slug" defaultValue={customCase?.slug} required />
      </label>
      <label>
        ブランド
        <select name="brandId" defaultValue={customCase?.brandId} required>
          {brands.map((brand) => (
            <option value={brand.id} key={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        車種
        <input name="modelName" defaultValue={customCase?.modelName || ""} />
      </label>
      <label>
        概要
        <textarea name="summary" defaultValue={customCase?.summary} required />
      </label>
      <label>
        カバー画像URL
        <input name="coverImage" defaultValue={customCase?.coverImage} required />
      </label>
      <label>
        Before画像URL
        <input name="beforeImage" defaultValue={customCase?.beforeImage || ""} />
      </label>
      <label>
        After画像URL
        <input name="afterImage" defaultValue={customCase?.afterImage || ""} />
      </label>
      <label>
        本文
        <RichTextEditor name="content" defaultValue={customCase?.content} />
      </label>
      <label>
        状態
        <select name="status" defaultValue={customCase?.status || "DRAFT"}>
          <option value="DRAFT">下書き</option>
          <option value="PUBLISHED">公開</option>
        </select>
      </label>
      <label>
        表示順
        <input name="sortOrder" type="number" defaultValue={customCase?.sortOrder || 0} />
      </label>
      <label>
        <input name="isFeatured" type="checkbox" value="true" defaultChecked={customCase?.isFeatured} />
        トップページに表示
      </label>
      <button className="button button--dark" type="submit">
        保存
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create new/edit pages**

Create `src/app/admin/custom-cases/new/page.tsx`:

```tsx
import { CustomCaseForm } from "@/components/admin/CustomCaseForm";
import { createCustomCase } from "@/lib/actions/customCases";
import { db } from "@/lib/db";

export default async function NewCustomCasePage() {
  const brands = await db.brand.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return (
    <section>
      <h1>改装事例 新規作成</h1>
      <CustomCaseForm brands={brands} action={createCustomCase} />
    </section>
  );
}
```

Create `src/app/admin/custom-cases/[id]/edit/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { CustomCaseForm } from "@/components/admin/CustomCaseForm";
import { updateCustomCase } from "@/lib/actions/customCases";
import { db } from "@/lib/db";

export default async function EditCustomCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseId = Number(id);
  const [customCase, brands] = await Promise.all([
    db.customCase.findUnique({ where: { id: caseId } }),
    db.brand.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  if (!customCase) notFound();

  return (
    <section>
      <h1>改装事例 編集</h1>
      <CustomCaseForm brands={brands} customCase={customCase} action={updateCustomCase.bind(null, caseId)} />
    </section>
  );
}
```

- [ ] **Step 5: Verify create/edit**

Run:

```powershell
npm run dev
```

Expected:

- `/admin/custom-cases/new` creates a draft or published case.
- Edited published cases appear on `/custom-works`.
- Featured published cases appear on homepage.
- Rich text changes are saved after editing text in the editor.

- [ ] **Step 6: Commit**

Run:

```powershell
git add src
git commit -m "feat: add custom case editor"
```

## Task 8: Add Delete And Preview Actions For Custom Cases

**Files:**

- Modify: `src/lib/actions/customCases.ts`
- Modify: `src/app/admin/custom-cases/page.tsx`

- [ ] **Step 1: Add archive/delete server actions**

Append to `src/lib/actions/customCases.ts`:

```ts
export async function unpublishCustomCase(id: number) {
  await db.customCase.update({
    where: { id },
    data: { status: PublishStatus.DRAFT, publishedAt: null },
  });
  revalidatePath("/");
  revalidatePath("/custom-works");
  revalidatePath("/admin/custom-cases");
}

export async function deleteCustomCase(id: number) {
  await db.customCase.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/custom-works");
  revalidatePath("/admin/custom-cases");
}
```

- [ ] **Step 2: Add preview/edit/delete controls to case list**

Modify the action cell in `src/app/admin/custom-cases/page.tsx`:

```tsx
<td className="admin-actions">
  <Link href={`/custom-works/${customCase.slug}`} target="_blank">
    プレビュー
  </Link>
  <Link href={`/admin/custom-cases/${customCase.id}/edit`}>編集</Link>
  <form action={unpublishCustomCase.bind(null, customCase.id)}>
    <button type="submit">下書きに戻す</button>
  </form>
  <form action={deleteCustomCase.bind(null, customCase.id)}>
    <button type="submit">削除</button>
  </form>
</td>
```

Also import the actions at the top of the file:

```tsx
import { deleteCustomCase, unpublishCustomCase } from "@/lib/actions/customCases";
```

- [ ] **Step 3: Verify preview and archive/delete**

Run:

```powershell
npm run dev
```

Expected:

- Preview opens the public case page in a new tab for published cases.
- "下書きに戻す" removes the case from public listing.
- "削除" removes the case from the admin list and public listing.

- [ ] **Step 4: Commit**

Run:

```powershell
git add src
git commit -m "feat: add custom case preview and removal actions"
```

## Task 9: Add Brand And Category Maintenance

**Files:**

- Create: `src/lib/validation/taxonomy.ts`
- Create: `src/lib/actions/taxonomy.ts`
- Create: `src/components/admin/TaxonomyForm.tsx`
- Create: `src/app/admin/brands/page.tsx`
- Create: `src/app/admin/categories/page.tsx`

- [ ] **Step 1: Create validation**

Create `src/lib/validation/taxonomy.ts`:

```ts
import { z } from "zod";

export const taxonomySchema = z.object({
  name: z.string().min(1, "名称を入力してください"),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(false),
});
```

- [ ] **Step 2: Create taxonomy actions**

Create `src/lib/actions/taxonomy.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { taxonomySchema } from "@/lib/validation/taxonomy";

export async function createBrand(formData: FormData) {
  const data = taxonomySchema.parse(Object.fromEntries(formData));
  await db.brand.create({ data });
  revalidatePath("/admin/brands");
  revalidatePath("/custom-works");
}

export async function createCategory(formData: FormData) {
  const data = taxonomySchema.parse(Object.fromEntries(formData));
  await db.customCategory.create({ data });
  revalidatePath("/admin/categories");
  revalidatePath("/custom-works");
}
```

- [ ] **Step 3: Create maintenance pages**

Create `src/app/admin/brands/page.tsx`:

```tsx
import { createBrand } from "@/lib/actions/taxonomy";
import { db } from "@/lib/db";

export default async function AdminBrandsPage() {
  const brands = await db.brand.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

  return (
    <section>
      <h1>ブランド</h1>
      <form action={createBrand} className="admin-inline-form">
        <input name="name" placeholder="TOYOTA" required />
        <input name="slug" placeholder="toyota" required />
        <input name="sortOrder" type="number" defaultValue={0} />
        <label><input name="isActive" type="checkbox" value="true" defaultChecked /> 有効</label>
        <button type="submit">追加</button>
      </form>
      <ul className="admin-list">
        {brands.map((brand) => (
          <li key={brand.id}>{brand.name} / {brand.slug} / {brand.isActive ? "有効" : "無効"}</li>
        ))}
      </ul>
    </section>
  );
}
```

Create `src/app/admin/categories/page.tsx`:

```tsx
import { createCategory } from "@/lib/actions/taxonomy";
import { db } from "@/lib/db";

export default async function AdminCategoriesPage() {
  const categories = await db.customCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

  return (
    <section>
      <h1>カテゴリ</h1>
      <form action={createCategory} className="admin-inline-form">
        <input name="name" placeholder="Exterior" required />
        <input name="slug" placeholder="exterior" required />
        <input name="sortOrder" type="number" defaultValue={0} />
        <label>
          <input name="isActive" type="checkbox" value="true" defaultChecked /> 有効
        </label>
        <button type="submit">追加</button>
      </form>
      <ul className="admin-list">
        {categories.map((category) => (
          <li key={category.id}>
            {category.name} / {category.slug} / {category.isActive ? "有効" : "無効"}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Verify taxonomy maintenance**

Run:

```powershell
npm run dev
```

Expected:

- New brands appear in admin and frontend brand filter.
- New categories can be created and later attached to cases.

- [ ] **Step 5: Commit**

Run:

```powershell
git add src
git commit -m "feat: add brand and category maintenance"
```

## Task 10: Build Contact Form And Inquiry Admin

**Files:**

- Create: `src/lib/validation/inquiry.ts`
- Create: `src/app/api/contact/route.ts`
- Create: `src/components/site/ContactForm.tsx`
- Create: `src/app/(site)/contact/page.tsx`
- Create: `src/app/admin/inquiries/page.tsx`
- Create: `src/app/admin/inquiries/[id]/page.tsx`
- Create: `src/lib/actions/inquiries.ts`

- [ ] **Step 1: Create inquiry validation**

Create `src/lib/validation/inquiry.ts`:

```ts
import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("メールアドレスを入力してください"),
  phone: z.string().optional(),
  inquiryType: z.string().optional(),
  message: z.string().min(1, "お問い合わせ内容を入力してください"),
});
```

- [ ] **Step 2: Create contact API**

Create `src/app/api/contact/route.ts`:

```ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquirySchema } from "@/lib/validation/inquiry";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  await db.inquiry.create({ data: parsed.data });

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Create contact form**

Create `src/components/site/ContactForm.tsx`:

```tsx
"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    if (response.ok) {
      setSent(true);
      form.reset();
    }
  }

  if (sent) {
    return <p>お問い合わせを受け付けました。</p>;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>お名前<input name="name" required /></label>
      <label>メール<input name="email" type="email" required /></label>
      <label>電話番号<input name="phone" /></label>
      <label>お問い合わせ種別<input name="inquiryType" /></label>
      <label>内容<textarea name="message" required /></label>
      <button className="button button--dark" type="submit">送信</button>
    </form>
  );
}
```

- [ ] **Step 4: Create inquiry admin pages**

Create `src/app/admin/inquiries/page.tsx`:

```tsx
import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminInquiriesPage() {
  const inquiries = await db.inquiry.findMany({ orderBy: { submittedAt: "desc" } });

  return (
    <section>
      <h1>お問い合わせ</h1>
      <table className="admin-table">
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id}>
              <td>{inquiry.status}</td>
              <td>{inquiry.name}</td>
              <td>{inquiry.email}</td>
              <td>{inquiry.submittedAt.toLocaleString("ja-JP")}</td>
              <td><Link href={`/admin/inquiries/${inquiry.id}`}>詳細</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
```

Create `src/app/admin/inquiries/[id]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export default async function AdminInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await db.inquiry.findUnique({ where: { id: Number(id) } });
  if (!inquiry) notFound();

  return (
    <section>
      <h1>{inquiry.name}</h1>
      <p>{inquiry.email}</p>
      <p>{inquiry.phone || "-"}</p>
      <p>{inquiry.inquiryType || "-"}</p>
      <pre>{inquiry.message}</pre>
    </section>
  );
}
```

- [ ] **Step 5: Verify inquiry flow**

Run:

```powershell
npm run dev
```

Expected:

- `/contact` submits inquiry.
- `/admin/inquiries` lists submitted inquiry.
- Detail page shows message content.

- [ ] **Step 6: Commit**

Run:

```powershell
git add src
git commit -m "feat: store and manage inquiries"
```

## Task 11: Add Static Company Pages And Content Migration

**Files:**

- Create: `src/app/(site)/business/page.tsx`
- Create: `src/app/(site)/company/page.tsx`
- Create: `src/app/(site)/access/page.tsx`
- Create: `src/app/(site)/privacy/page.tsx`
- Modify: `src/components/site/SiteFooter.tsx`

- [ ] **Step 1: Create business page**

Create `src/app/(site)/business/page.tsx`:

```tsx
export default function BusinessPage() {
  return (
    <main className="section">
      <div className="container">
        <h1>事業紹介</h1>
        <section>
          <h2>自動車トータルサービス事業</h2>
          <p>中古車販売、買取、輸出、整備相談、自動車改装など、車に関わる幅広いサービスを提供します。</p>
        </section>
        <section>
          <h2>プラスチックのリサイクル及び輸出</h2>
          <p>既存事業としてリサイクル及び輸出に関する事業内容を紹介します。</p>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create company/access/privacy pages**

Create `src/app/(site)/company/page.tsx`:

```tsx
export default function CompanyPage() {
  return (
    <main className="section">
      <div className="container">
        <h1>会社情報</h1>
        <p>会社名、所在地、代表者、事業内容などを掲載します。</p>
      </div>
    </main>
  );
}
```

Create `src/app/(site)/access/page.tsx`:

```tsx
export default function AccessPage() {
  return (
    <main className="section">
      <div className="container">
        <h1>アクセス</h1>
        <p>所在地、地図、交通案内を掲載します。</p>
      </div>
    </main>
  );
}
```

Create `src/app/(site)/privacy/page.tsx`:

```tsx
export default function PrivacyPage() {
  return (
    <main className="section">
      <div className="container">
        <h1>プライバシーポリシー</h1>
        <p>お問い合わせで取得する個人情報の利用目的、管理、第三者提供の有無を掲載します。</p>
      </div>
    </main>
  );
}
```

When the client provides exact original-site text, replace these short page bodies with the approved text and keep the same page paths.

- [ ] **Step 3: Verify static pages**

Run:

```powershell
npm run dev
```

Expected: `/business`, `/company`, `/access`, and `/privacy` load and are linked from navigation/footer.

- [ ] **Step 4: Commit**

Run:

```powershell
git add src
git commit -m "feat: add company information pages"
```

## Task 12: Add Upload Handling

**Files:**

- Create: `src/lib/uploads.ts`
- Create: `src/app/api/uploads/route.ts`
- Modify: `src/components/admin/ImageUploadField.tsx`
- Modify: `src/components/admin/CustomCaseForm.tsx`

- [ ] **Step 1: Create upload helper**

Create `src/lib/uploads.ts`:

```ts
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function saveUpload(file: File) {
  if (!allowedTypes.has(file.type)) {
    throw new Error("JPEG, PNG, WEBP のみアップロードできます");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("画像は5MB以下にしてください");
  }

  const uploadDir = process.env.UPLOAD_DIR || "public/uploads";
  await mkdir(uploadDir, { recursive: true });

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = path.join(uploadDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, bytes);

  return `/uploads/${fileName}`;
}
```

- [ ] **Step 2: Create upload API**

Create `src/app/api/uploads/route.ts`:

```ts
import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/uploads";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "画像ファイルを選択してください" }, { status: 400 });
  }

  try {
    const url = await saveUpload(file);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "アップロードに失敗しました" }, { status: 400 });
  }
}
```

- [ ] **Step 3: Verify uploads**

Run:

```powershell
npm run dev
```

Expected: uploading a JPEG/PNG/WEBP returns `/uploads/<filename>` and rejects other file types.

- [ ] **Step 4: Commit**

Run:

```powershell
git add src public
git commit -m "feat: add image uploads"
```

## Task 13: Responsive And End-To-End Verification

**Files:**

- Create: `tests/e2e/site.spec.ts`
- Create: `tests/e2e/admin.spec.ts`
- Create: `playwright.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Add Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
});
```

- [ ] **Step 2: Add site smoke test**

Create `tests/e2e/site.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("homepage shows business summary before custom cases", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "事業紹介" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "自動車改装事例" })).toBeVisible();
});

test("custom works supports brand filter and detail page", async ({ page }) => {
  await page.goto("/custom-works?brand=toyota");
  await expect(page.getByText("TOYOTA")).toBeVisible();
  await page.getByRole("link", { name: /TOYOTA/ }).first().click();
  await expect(page.getByText("Case Spec")).toBeVisible();
});
```

- [ ] **Step 3: Add scripts**

Modify `package.json` scripts:

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

- [ ] **Step 4: Run verification**

Run:

```powershell
npm run lint
npm run build
npm run test:e2e
```

Expected: lint, build, and e2e tests pass on desktop and mobile projects.

- [ ] **Step 5: Browser visual QA**

Open:

```text
http://localhost:3000
http://localhost:3000/custom-works
http://localhost:3000/custom-works/sample-before-after
http://localhost:3000/admin/custom-cases
```

Expected:

- No text overlaps.
- Header navigation fits desktop and mobile.
- Case cards use large images and do not look empty.
- Before/After images stack cleanly on mobile.
- Admin tables/forms are usable.

- [ ] **Step 6: Commit**

Run:

```powershell
git add .
git commit -m "test: add responsive e2e coverage"
```

## Task 14: Final Content Pass And Launch Checklist

**Files:**

- Modify: `src/app/(site)/*`
- Modify: `prisma/seed.ts`
- Create: `docs/launch-checklist.md`

- [ ] **Step 1: Replace placeholder copy and images**

Use real company text and real custom work photos from the client. Replace all sample image paths:

```text
/images/placeholders/custom-case-1.jpg
/images/placeholders/before.jpg
/images/placeholders/after.jpg
```

Expected: no placeholder images remain in published pages.

- [ ] **Step 2: Create launch checklist**

Create `docs/launch-checklist.md`:

```md
# Launch Checklist

- [ ] Company profile content confirmed.
- [ ] Business descriptions confirmed.
- [ ] Real custom case images uploaded.
- [ ] At least three published custom cases exist.
- [ ] Brand filters reviewed.
- [ ] Contact form submission tested.
- [ ] Admin inquiry view tested.
- [ ] Mobile homepage checked.
- [ ] Mobile custom case detail checked.
- [ ] Privacy policy reviewed.
- [ ] Production database configured.
- [ ] Upload storage configured.
```

- [ ] **Step 3: Final verification**

Run:

```powershell
npm run lint
npm run build
npm run test:e2e
```

Expected: all checks pass.

- [ ] **Step 4: Commit**

Run:

```powershell
git add .
git commit -m "docs: add launch checklist"
```

## Implementation Notes

- Add authentication for `/admin` before public deployment. If the deployment environment already has basic auth or another auth layer, use that existing mechanism.
- For production uploads, replace local disk storage with the hosting provider's persistent storage if local filesystem writes are not durable.
- Do not expose unpublished custom cases on public pages.
- Sanitize or constrain rich text output before deployment if editor permissions are broader than trusted admin users.
- Keep all frontend images responsive and compressed.

## Spec Coverage Checklist

- Existing functions preserved: Tasks 3, 10, 11, 14.
- Homepage with two business summaries before custom cases: Task 3.
- Automotive customization list/detail: Task 4.
- Brand/category filters and maintenance: Tasks 4 and 9.
- Backend route protection: Task 5.
- Backend fixed fields + rich text editor: Tasks 6 and 7.
- Case preview, unpublish, and delete actions: Task 8.
- Inquiry storage and backend display: Task 10.
- Image upload support: Task 12.
- Mobile responsive verification: Task 13.
- Polished UI direction: Tasks 3, 4, and 13.
