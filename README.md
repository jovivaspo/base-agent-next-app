# Next.js 16 Agent Template

A production-ready Next.js 16 template with AI agent support, clean architecture, and provider-agnostic design.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 |
| Language | TypeScript |
| UI | React 19 + Tailwind 4 |
| State | Zustand |
| Database | PostgreSQL (Supabase/Neon) |
| ORM | Drizzle |
| Auth | Supabase Auth |
| Storage | Cloudinary |
| Validation | Zod |
| Testing | Vitest + React Testing Library |
| E2E | Playwright |
| Deployment | Vercel |

## Features

- **Clean Architecture** - Repository pattern for easy provider switching
- **Server Actions** - Type-safe backend logic
- **Authentication** - Supabase Auth integration
- **Image Upload** - Cloudinary integration
- **Type Safety** - Strict TypeScript + Zod validation
- **Testing** - Vitest (unit) + Playwright (E2E)

## Project Structure

```
app/
├── actions/                  # Server Actions
├── api/webhooks/             # Route Handlers
├── components/ui/           # Base components
├── components/features/      # Business components
├── lib/supabase/            # Supabase client
├── lib/drizzle/             # Drizzle schema
├── lib/cloudinary/          # Cloudinary client
├── services/                 # Business logic
├── repositories/            # Data access layer
├── types/                    # TypeScript types
└── utils/                    # Utilities
```

## Getting Started

### 1. Clone and install

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Add your credentials
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (optional)
- `CLOUDINARY_API_KEY` (optional)
- `CLOUDINARY_API_SECRET` (optional)

### 3. Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Commands

```bash
# Development
pnpm dev               # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Vitest watch mode
pnpm test:run        # Vitest single run
pnpm test:coverage   # Coverage report
pnpm playwright test  # E2E tests

# Database
pnpm db:generate     # Generate Drizzle migrations
pnpm db:push         # Push schema to DB
pnpm db:migrate      # Run migrations

# Code quality
pnpm lint            # ESLint
pnpm typecheck       # TypeScript check
```

## Repository Pattern

This template uses the repository pattern to make switching providers easy:

```
UI/Actions → Repositories (Interface) → Implementation (Supabase/Neon/etc.)
```

To switch database providers:
1. Create new implementation in `app/repositories/`
2. Update `app/repositories/index.ts`
3. Done - rest of app unchanged

## Skills

This template includes AI agent skills for:

- `typescript` - Strict TypeScript patterns
- `react-19` - React 19 patterns
- `next-16` - Next.js 16 App Router
- `tailwind-4` - Tailwind CSS
- `supabase` - Authentication & RLS
- `drizzle` - Database ORM
- `cloudinary` - Image upload
- `zod-4` - Validation
- `zustand-5` - State management
- `tdd` - Test-driven development
- `playwright` - E2E testing
- `commit` - Conventional commits

See `AGENTS.MD` for details.

## Deployment

Deploy to Vercel:

```bash
# Connect your repository to Vercel
# Add environment variables in Vercel dashboard
# Push to main - auto deploys
```

## License

MIT
