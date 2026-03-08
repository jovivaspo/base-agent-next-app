---
name: tdd
description: >
  Test-Driven Development workflow using Vitest + React Testing Library.
  Trigger: ALWAYS when implementing features, fixing bugs, or refactoring in Next.js.
  This is a MANDATORY workflow for all TypeScript/React code.
license: Apache-2.0
metadata:
  author: next-agent-template
  version: "2.0"
  scope: [root, app]
  auto_invoke:
    - "Implementing feature"
    - "Fixing bug"
    - "Refactoring code"
    - "Working on task"
    - "Modifying component"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Task
---

## TDD Cycle (MANDATORY)

```
+-----------------------------------------+
|  RED -> GREEN -> REFACTOR               |
|     ^                        |          |
|     +------------------------+          |
+-----------------------------------------+
```

**The question is NOT "should I write tests?" but "what tests do I need?"**

---

## The Three Laws of TDD

1. **No production code** until you have a failing test
2. **No more test** than necessary to fail
3. **No more code** than necessary to pass

---

## Stack Detection

This skill is for **Next.js + TypeScript** stack:

| Component | Stack | Runner | Test Pattern |
|-----------|-------|--------|--------------|
| `app/` | TypeScript / React | Vitest + RTL | `*.test.{ts,tsx}` co-located |

---

## Phase 0: Assessment (ALWAYS FIRST)

Before writing ANY code:

```bash
# 1. Find existing tests
fd "*.test.tsx" app/components/
fd "*.test.ts" app/lib/

# 2. Check coverage
pnpm test:coverage -- app/

# 3. Read existing tests for patterns
```

### Decision Tree

```
+------------------------------------------+
|     Does test file exist for this code?  |
+----------+-----------------------+-------+
          | NO                    | YES
          v                       v
+------------------+    +------------------+
| CREATE test file |    | Check coverage   |
| -> Phase 1: RED  |    | for your change  |
+--------+---------+    +--------+---------+
                     |
            +--------+--------+
            | Missing cases?  |
            +---+---------+---+
                | YES     | NO
                v         v
        +-----------+ +-----------+
        | ADD tests | | Proceed   |
        | Phase 1   | | Phase 2   |
        +-----------+ +-----------+
```

---

## Phase 1: RED - Write Failing Tests

### For NEW Functionality

```typescript
// app/lib/calculator.ts
describe("PriceCalculator", () => {
  it("should return 0 for quantities below threshold", () => {
    // Given
    const quantity = 3;

    // When
    const result = calculateDiscount(quantity);

    // Then
    expect(result).toBe(0);
  });
});
```

### For Components

```typescript
// app/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe("Button", () => {
  it("should render with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### For BUG FIXES

Write a test that **reproduces the bug** first:

```typescript
// Test that reproduces the bug
it("should not throw when value is null", () => {
  expect(() => render(<DatePicker value={null} />)).not.toThrow();
});

// Currently returns PASS incorrectly - we want this to FAIL
assert(result[0].status === "FAIL");
```

**Run -> Should FAIL (reproducing the bug)**

### For REFACTORING

Capture ALL current behavior BEFORE refactoring:

```bash
# Run ALL existing tests - they should PASS
# This is your safety net
pnpm test:run
```

**Run -> All should PASS (baseline)**

---

## Phase 2: GREEN - Minimum Code

Write the MINIMUM code to make the test pass. Hardcoding is valid for the first test.

```typescript
// Test expects calculateDiscount(100, 10) === 10
function calculateDiscount() {
  return 10; // FAKE IT - hardcoded is valid for first test
}
```

**This passes. But we're not done...**

---

## Phase 3: Triangulation (CRITICAL)

**One test allows faking. Multiple tests FORCE real logic.**

Add tests with different inputs that break the hardcoded value:

| Scenario | Required? |
|----------|-----------|
| Happy path | YES |
| Zero/empty values | YES |
| Boundary values | YES |
| Different valid inputs | YES (breaks fake) |
| Error conditions | YES |

```typescript
// ADD - breaks the fake:
it("should calculate 10% discount", () => {
  expect(calculateDiscount(100, 10)).toBe(10);
});

it("should calculate 15% on 200", () => {
  expect(calculateDiscount(200, 15)).toBe(30);
});

it("should return 0 for 0% rate", () => {
  expect(calculateDiscount(100, 0)).toBe(0);
});
```

**Now fake BREAKS -> Real implementation required.**

---

## Phase 4: REFACTOR

Tests GREEN -> Improve code quality WITHOUT changing behavior.

- Extract functions/methods
- Improve naming
- Add types/validation
- Reduce duplication

**Run tests after EACH change -> Must stay GREEN**

---

## Quick Reference

```
+------------------------------------------------+
|                 TDD WORKFLOW                    |
+------------------------------------------------+
| 0. ASSESS: What tests exist? What's missing?   |
|                                                |
| 1. RED: Write ONE failing test                 |
|    +-- Run -> Must fail with clear error       |
|                                                |
| 2. GREEN: Write MINIMUM code to pass           |
|    +-- Fake It is valid for first test         |
|                                                |
| 3. TRIANGULATE: Add tests that break the fake  |
|    +-- Different inputs, edge cases            |
|                                                |
| 4. REFACTOR: Improve with confidence           |
|    +-- Tests stay green throughout             |
|                                                |
| 5. REPEAT: Next behavior/requirement           |
+------------------------------------------------+
```

---

## Anti-Patterns (NEVER DO)

```
# 1. Code first, tests after
function newFeature(): ...  # Then writing tests = USELESS

# 2. Skip triangulation
# Single test allows faking forever

# 3. Test implementation details
expect(component.state.isLoading).toBe(true)  # BAD - test behavior
expect(mockService.callCount).toBe(3)         # BAD - brittle

# 4. All tests at once before any code
# Write ONE test, make it pass, THEN write the next

# 5. Giant test methods
# Each test should verify ONE behavior
```

---

## Commands

```bash
pnpm vitest              # Watch mode
pnpm vitest run          # Single run (CI)
pnpm vitest coverage     # Coverage report
pnpm vitest ComponentName # Filter by name
```

---

## Testing Library Queries (Priority Order)

```typescript
// 1. Accessible by text (preferred)
screen.getByText('Submit')
screen.getByRole('button', { name: 'Submit' })

// 2. Semantic roles
screen.getByRole('heading', { level: 1 })
screen.getByRole('textbox', { name: 'Email' })

// 3. Label associations
screen.getByLabelText('Email')
screen.getByPlaceholderText('Enter email')

// 4. Test IDs (last resort)
screen.getByTestId('custom-element')
```
