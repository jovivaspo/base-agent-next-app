---
name: drizzle
description: >
  Drizzle ORM patterns and best practices.
  Trigger: When working with database schemas, queries, or migrations using Drizzle.
  Works with PostgreSQL, MySQL, SQLite, and cloud providers like Supabase, Neon.
  Schema files go in: app/lib/drizzle/
license: Apache-2.0
metadata:
  author: next-agent-template
  version: "1.0"
  scope: [root, app]
  auto_invoke:
    - "Creating database schemas"
    - "Writing database queries"
    - "Running migrations"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

## Schema Definition (REQUIRED)

```typescript
// db/schema.ts
import { pgTable, serial, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

// Always use camelCase for columns, pg_ style for internal
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relationships via references
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  published: boolean('published').default(false).notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type-safe inferred types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

---

## Column Types (PostgreSQL)

| Type | Usage |
|------|-------|
| `serial()` | Auto-increment integer |
| `varchar(length)` | String with max length |
| `text()` | Unlimited string |
| `boolean()` | true/false |
| `integer()` | 32-bit integer |
| `bigint()` | 64-bit integer |
| `decimal(precision, scale)` | Numeric |
| `timestamp()` | Date + time |
| `date()` | Date only |
| `json()` | JSON object |
| `uuid()` | UUID v4 |
| `array(Type)` | Array of Type |

---

## Queries

### Select

```typescript
// Simple select
const allUsers = await db.select().from(users);

// Select specific columns
const userEmails = await db
  .select({ email: users.email, name: users.name })
  .from(users);

// With where
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.active, true));

// With relationships (joins)
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: true, // hasMany relation
  },
});
```

### Insert

```typescript
// Single insert
const [newUser] = await db
  .insert(users)
  .values({
    email: 'john@example.com',
    name: 'John',
  })
  .returning();

// Batch insert
const newUsers = await db
  .insert(users)
  .values([
    { email: 'a@a.com', name: 'A' },
    { email: 'b@b.com', name: 'B' },
  ])
  .returning();
```

### Update

```typescript
const [updated] = await db
  .update(users)
  .set({ name: 'Jane' })
  .where(eq(users.id, 1))
  .returning();
```

### Delete

```typescript
await db
  .delete(users)
  .where(eq(users.id, 1));
```

---

## Operators

```typescript
import { eq, ne, gt, gte, lt, lte, like, ilike, inArray, notInArray, isNull, isNotNull, and, or, not } from 'drizzle-orm';

// Equality
eq(users.id, 1)
ne(users.name, 'John')

// Comparison
gt(users.age, 18)
gte(users.age, 18)
lt(users.age, 65)
lte(users.age, 65)

// Pattern matching
like(users.email, '%@example.com')     // Case sensitive
ilike(users.email, '%@example.com')   // Case insensitive

// Arrays
inArray(users.id, [1, 2, 3])
notInArray(users.id, [4, 5, 6])

// Null checks
isNull(users.deletedAt)
isNotNull(users.deletedAt)

// Complex
and(eq(users.active, true), gte(users.age, 18))
or(eq(users.role, 'admin'), eq(users.role, 'moderator'))
not(eq(users.id, 1))
```

---

## Migrations

```bash
# Generate migration from schema
npx drizzle-kit generate:pg

# Push schema to database (dev)
npx drizzle-kit push:pg

# Apply migrations (prod)
npx drizzle-kit migrate
```

---

## Supabase Integration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// For Drizzle with Supabase
const queryClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(queryClient);
```

---

## Best Practices

```typescript
// ✅ ALWAYS: Use returning() for inserts/updates
const [user] = await db.insert(users).values({...}).returning();

// ✅ ALWAYS: Use parameterized queries (drizzle handles this)
await db.select().from(users).where(eq(users.email, email)); // Safe!

// ✅ ALWAYS: Define types for complex queries
type UserWithPosts = {
  id: number;
  email: string;
  posts: Post[];
};

// ✅ NEVER: String concatenation in queries
// BAD: `select * from users where id = ${userId}`
// GOOD: eq(users.id, userId)
```
