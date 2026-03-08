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
| UI | React 19 + Tailwind 4 |
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

## Project Structure

This template uses **clean architecture** with separation of concerns to make it easy to swap providers.

```
app/
├── (public)/                 # Public routes
│   └── login/
├── (dashboard)/              # Protected routes
│   └── dashboard/
├── actions/                  # Server Actions (use repositories)
├── api/                      # Route Handlers
│   └── webhooks/
├── components/              # UI Components
│   ├── ui/                 # Base components (Button, Input...)
│   └── features/            # Feature-specific components
├── lib/                     # Provider clients (SWAP IF NEEDED)
│   ├── supabase/           # Supabase client
│   ├── drizzle/            # Drizzle client + schema
│   └── cloudinary/         # Cloudinary client
├── services/                # Business logic (DOMAIN)
│   ├── auth/
│   ├── products/
│   └── orders/
├── repositories/            # Data access layer (KEY FOR SWAPPING)
│   ├── product-repository.ts    # Interface
│   └── supabase-*-repository.ts # Implementations
├── types/                   # Global TypeScript types
└── utils/                   # Utilities
```

### Repository Pattern

The repository pattern allows you to swap database providers without breaking the rest of the app:

```
┌─────────────────────────────────────────────────┐
│                   UI / ACTIONS                   │
│              (use repositories)                 │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                  REPOSITORIES                     │
│    Interface → Implementation (swap here)      │
│    ┌─────────────────────────────────────────┐  │
│    │ product-repository.ts (CONTRACT)        │  │
│    └─────────────────────────────────────────┘  │
│    ┌─────────────────────────────────────────┐  │
│    │ supabase-*-repository.ts (IMPLEMENT)   │  │
│    └─────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                     LIB                          │
│         Drizzle / Supabase / Cloudinary         │
└─────────────────────────────────────────────────┘
```

**To switch providers:**
1. Create new implementation in `repositories/`
2. Update `repositories/index.ts` to export new implementation
3. Done — rest of the app is unchanged

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
