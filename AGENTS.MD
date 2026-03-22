# Repository Guidelines

## How to Use This Guide

- This is a Next.js 16 application template
- Skills provide detailed patterns for development
- Follow the auto-invoke rules when working on specific tasks

---

## Available Skills

### Core Skills (Any Project)
| Skill | Description | File |
|-------|-------------|------|
| `typescript` | Const types, flat interfaces, utility types | [skill.md](skills/typescript/skill.md) |
| `react-19` | React 19 patterns, Server Components, use() hook | [skill.md](skills/react-19/skill.md) |
| `next-16` | Next.js 16 App Router, Server Actions, streaming | [skill.md](skills/next-16/skill.md) |
| `tailwind-4` | cn() utility, no var() in className | [skill.md](skills/tailwind-4/skill.md) |
| `shadcn` | shadcn/ui components, variants, theming | [skill.md](skills/shadcn/skill.md) |
| `supabase` | Supabase Auth, RLS, Client configuration | [skill.md](skills/supabase/skill.md) |
| `drizzle` | Drizzle ORM, schema definition, queries | [skill.md](skills/drizzle/skill.md) |
| `cloudinary` | Image upload, transformations, optimization | [skill.md](skills/cloudinary/skill.md) |
| `zod-4` | Zod validation, z.email(), z.uuid() | [skill.md](skills/zod-4/skill.md) |
| `zustand-5` | Zustand state management, persist, selectors | [skill.md](skills/zustand-5/skill.md) |
| `tdd` | Test-Driven Development with Vitest + RTL | [skill.md](skills/tdd/skill.md) |
| `playwright` | E2E testing, Page Object Model, selectors | [skill.md](skills/playwright/skill.md) |
| `commit` | Professional git commits (conventional-commits) | [skill.md](skills/commit/skill.md) |

---

## Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Writing TypeScript types/interfaces | `typescript` |
| Writing React components | `react-19` |
| Working with App Router / Server Actions | `next-16` |
| Using Tailwind CSS classes | `tailwind-4` |
| Adding shadcn/ui components | `shadcn` |
| Working with shadcn/ui | `shadcn` |
| Adding authentication | `supabase` |
| Working with Supabase (Auth, RLS, Client) | `supabase` |
| Working with database (schema, queries, migrations) | `drizzle` |
| Adding image upload | `cloudinary` |
| Working with Cloudinary | `cloudinary` |
| Creating Zod validation schemas | `zod-4` |
| Using Zustand stores | `zustand-5` |
| Implementing feature | `tdd` |
| Fixing bug | `tdd` |
| Refactoring code | `tdd` |
| Writing component tests | `tdd` |
| Writing E2E tests | `playwright` |
| Creating git commits | `commit` |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 |
| Language | TypeScript |
| UI | React 19 + shadcn/ui + Tailwind 4 |
| State | Zustand |
| Database | PostgreSQL (via Supabase/Neon) |
| ORM | Drizzle |
| Auth | Supabase Auth |
| Storage | Cloudinary (images) |
| Validation | Zod |
| Testing | Vitest + React Testing Library |
| E2E | Playwright |
| Deployment | Vercel |

---

## Architecture

This template uses **Clean Architecture adapted to Next.js** with three main layers. The fundamental rule is that dependencies always flow inward:

```
app/ → application/ → domain/
              ↓
       infrastructure/
```

`app/` never directly imports from `infrastructure/`. It only communicates with `application/`, which orchestrates domain and infrastructure.

---

## Project Structure

```
app/                          ← Next.js: pages, layouts, actions, route handlers
├── (ecommerce)/              ← Public ecommerce routes
│   ├── page.tsx              ← Home
│   ├── products/
│   ├── cart/
│   └── profile/
├── (auth)/                   ← Authentication routes
│   ├── login/
│   ├── register/
│   └── auth/callback/
├── dashboard/                ← Admin-only routes
│   ├── categories/
│   ├── products/
│   ├── orders/
│   └── users/
├── api/                      ← Route Handlers
│   └── webhooks/
├── 404/
└── layout.tsx

domain/                       ← Pure entities and business rules (no external dependencies)
├── product/
│   ├── product.entity.ts     ← Types and interfaces
│   ├── product.errors.ts     ← Typed errors
│   └── product.rules.ts      ← Pure business validations
├── order/
├── category/
└── user/

application/                  ← Use cases: orchestrate domain + infrastructure
├── product/
│   ├── create-product.ts
│   ├── update-product.ts
│   ├── delete-product.ts
│   └── update-thumbnail.ts
├── order/
├── category/
└── user/

infrastructure/               ← Concrete implementations (Drizzle, Cloudinary, Supabase)
├── db/
│   ├── index.ts              ← Drizzle client
│   ├── schema/               ← Table definitions
│   ├── queries/              ← DB operations
│   └── types.ts
├── cloudinary/
│   ├── upload.ts
│   └── delete.ts
└── supabase/
    ├── client.ts
    └── server.ts

components/                   ← React components
├── ui/                       ← Pure components, no domain knowledge
│   └── Button.tsx, Modal.tsx, DataTable.tsx...
├── shared/                   ← Knows domain, reusable across app
│   ├── products/
│   └── orders/
└── dashboard/                ← Used only in dashboard
    ├── DashboardSidebar.tsx
    └── DeleteModal.tsx

lib/                          ← Cross-cutting utilities
└── api/
    ├── guards.ts             ← requireAdmin(), requireSameOrigin()
    └── actions.ts            ← assertAdmin() for Server Actions
```

---

### Layer Rules

| From | Can import | Cannot import |
|------|------------|---------------|
| `domain/` | TypeScript only | External dependencies |
| `infrastructure/` | `domain/` | `application/`, `app/`, `components/` |
| `application/` | `domain/`, `infrastructure/` | `app/`, `components/` |
| `app/` | `application/`, `components/`, `lib/` | `infrastructure/` directly |
| `components/` | `domain/` (types), `lib/` | `application/`, `infrastructure/`, `app/` |

---

### Server Action Flow

```
app/dashboard/products/actions.ts
  └─ assertAdmin()                          ← lib/api/actions.ts
  └─ deleteProductUseCase(id)               ← application/product/delete-product.ts
       ├─ getProductById(id)                ← infrastructure/db/queries/products.ts
       ├─ deleteImagesByUrls(urls)         ← infrastructure/cloudinary/delete.ts
       └─ deleteProduct(id)                 ← infrastructure/db/queries/products.ts
  └─ revalidatePath('/dashboard/products')  ← Next.js (only in app/)
  └─ redirect('/dashboard/products')        ← Next.js (only in app/)
```

Server Actions should be **thin**: verify permissions, call use case, handle Next.js response. Nothing more.

---

## shadcn/ui

This template uses **shadcn/ui** for UI components. Components are installed via CLI and live in `components/ui/`.

### Quick Commands

```bash
# Initialize shadcn
npx shadcn@latest init

# Add a component
npx shadcn@latest add button card dialog

# Check project info
npx shadcn@latest info --json

# Search components
npx shadcn@latest search @shadcn -q "sidebar"
```

### Key Patterns

- Use `cn()` from `lib/utils.ts` for conditional classes
- Use semantic colors: `bg-primary`, `text-muted-foreground`
- Icons: `<SearchIcon data-icon="inline-start" />`
- Forms: Use Field components, never raw `<div className="space-y-4">`

### Configuration

| Setting | Value |
|---------|-------|
| Style | new-york |
| RSC | true |
| CSS Variables | enabled |
| Icon Library | lucide |
| Aliases | `@/components`, `@/lib` |

---

## Commands

```bash
# Development
pnpm dev               # Start dev server
pnpm build             # Build for production
pnpm start             # Start production server

# Testing
pnpm vitest            # Watch mode
pnpm vitest run        # Run tests
pnpm vitest coverage   # Coverage report
pnpm playwright test   # E2E tests

# Code quality
pnpm lint              # ESLint
pnpm typecheck        # TypeScript check
```

---

## Commit Guidelines

Follow conventional-commits format: `<type>: <description>`

**Types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`

Example:
```
feat: add user authentication flow
```
