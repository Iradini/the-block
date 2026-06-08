# Testing — The Block

This document describes the test strategy, how to run tests, what is covered, and known gaps. All counts reflect the current suite: **61 tests in 14 files**.

---

## Quick Start

```bash
npm test              # single run
npm run test:watch    # watch mode
npm run lint          # ESLint (separate from tests)
npm run build         # typecheck + production build
```

**Requirements:** Node.js 18+. Tests use **Vitest 4** with **jsdom**; no browser or network needed.

---

## Philosophy

1. **Test behavior, not implementation** — Assert outcomes (filtered results, bid rejection reasons, visible UI text).
2. **Pure logic first** — `src/lib/` functions take explicit inputs and return predictable outputs.
3. **Deterministic** — Fixed clocks (`vi.setSystemTime`), fixture vehicles, mocked auction normalization in component tests.
4. **No network** — Vehicle JSON is imported at build time; tests do not fetch images or APIs.
5. **Prefer adding tests** over rewriting existing ones when extending coverage.

---

## Tooling

| Tool | Role |
|------|------|
| **Vitest** | Test runner (Vite-native) |
| **jsdom** | DOM environment for component/integration tests |
| **@testing-library/react** | Render components, query by role/label |
| **@testing-library/user-event** | Realistic typing and clicks |
| **@testing-library/jest-dom** | Matchers (`toBeInTheDocument`, etc.) |

### Configuration (`vite.config.ts`)

```typescript
test: {
  environment: 'jsdom',
  setupFiles: ['./tests/setup.ts'],
  include: ['tests/**/*.test.{ts,tsx}'],
}
```

---

## Test Layout

```
tests/
├── setup.ts                    # Global beforeEach: reset store + auction cache
├── fixtures/
│   └── vehicles.ts             # Deterministic live/ended/hamilton fixtures
├── helpers/
│   ├── time.ts                 # withFixedTime / withDefaultFixedTime
│   └── mockAuction.ts          # mockAuctionStartFromVehicleField()
├── lib/                        # Unit tests (pure functions)
├── store/                      # Zustand store tests
├── components/                 # React component tests
└── integration/                # Multi-component / routing flows
```

---

## Global Setup

`tests/setup.ts` runs before each test:

- Resets `useBidsStore` to `{ store: {} }`
- Calls `resetNormalizedAuctionCache()` so auction normalization does not leak between tests

Component tests that need fixed time or mocked vehicles add their own `beforeEach` hooks.

---

## Coverage by Layer

### Unit — `tests/lib/` (41 tests)

| File | Focus |
|------|-------|
| `bids.test.ts` | TOO_LOW, INVALID_AMOUNT, successful bid |
| `bids.extended.test.ts` | NOT_FOUND, AUCTION_ENDED, zero/NaN, sequential bids, store overrides |
| `vehicles.test.ts` | 200 vehicles load, Ford make search, Abbotsford false positive, related, ending soon |
| `vehicles.search-filter.test.ts` | Empty/gibberish search, Toronto/Ontario exact match, filters, sort, featured, filter options |
| `format.test.ts` | Effective bid, increment rounding, subtitle, highlights |
| `format.extended.test.ts` | Currency formatting, condition tiers, highlight line |
| `auction.test.ts` | live/upcoming/ended windows, end label, urgency (< 1 min) |
| `auction.extended.test.ts` | Ended countdown, remaining ms edge cases |
| `auction-countdown.test.ts` | HH:MM:SS live format, upcoming days |

**Search regression tests (real bugs fixed):**

- `ford` matches **make only** — not “Abbotsford” or “Parkway Ford” in other fields
- `Toronto` matches **city only** — not “AutoPark Toronto” dealership in Hamilton

### Store — `tests/store/` (2 tests)

| File | Focus |
|------|-------|
| `bids.test.ts` | Store updates on successful bid; no update on failure; `hasMyBid()` |

### Component — `tests/components/` (9 tests)

| File | Focus |
|------|-------|
| `BidPanel.test.tsx` | Renders bid info, disabled when ended, prevents low bid submit, success flow, `aria-invalid` |
| `BrowsePage.test.tsx` | Listing count, accessible searchbox, empty state, debounced search (mocked listings) |

BrowsePage component tests **mock** `searchVehicles` / `getFeaturedVehicles` to avoid rendering 200 cards in jsdom.

### Integration — `tests/integration/` (3 tests)

| File | Focus |
|------|-------|
| `routing.test.tsx` | Valid vehicle id renders detail `<h1>`; invalid id shows not found |
| `bid-flow.test.tsx` | Detail page → place bid → success message + store update (fixture data) |

---

## Fixtures and Mocks

### `tests/fixtures/vehicles.ts`

Small set of vehicles with controlled `auction_start` values:

- `liveVehicle` — auction started 30 minutes ago (live under fixed clock)
- `endedVehicle` — started 3 hours ago (ended)
- `hamiltonDealerTorontoName` — Hamilton city + “AutoPark Toronto” dealer (search regression)

Helpers: `getLiveVehicleWithBids()`, `getEndedVehicleWithBids()`.

### `mockAuctionStartFromVehicleField()`

Spies `getNormalizedAuctionStart()` to return `new Date(vehicle.auction_start)` so fixture auction status matches raw timestamps instead of the global normalization map.

Used in bid, store, and component tests.

---

## What Is Not Tested

| Area | Reason / future work |
|------|----------------------|
| **Photo gallery lightbox** | Keyboard navigation, focus trap — candidate for component test |
| **Mobile bid sheet** | Open/close interaction — manual or Playwright |
| **Filter panel sheet** | Mobile filter UX — manual |
| **FeaturedRow / VehicleCard** | Covered indirectly via BrowsePage mocks |
| **Watch / Share buttons** | Prototype stubs (`DetailActions`); Share uses native share or clipboard |
| **Visual / responsive layout** | No visual regression suite |
| **Docker / nginx** | Manual smoke test on port 8080 |
| **Full 200-vehicle render performance** | Browse tests mock listings |
| **Accessibility audit** | Partial (`aria-invalid`, `aria-live`, search label); no axe run |
| **Security** | No auth; React escapes text by default — no XSS suite |

---

## Writing New Tests

### Unit test (lib)

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { placeBid } from '../../src/lib/bids';
import { liveVehicle, fixtureVehicles, FIXED_NOW } from '../fixtures/vehicles';
import { mockAuctionStartFromVehicleField } from '../helpers/mockAuction';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
  mockAuctionStartFromVehicleField();
});

afterEach(() => vi.useRealTimers());
```

### Component test

```typescript
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

afterEach(() => cleanup());
```

Wrap any component that uses `<Link>` in `<MemoryRouter>`.

---

## CI Recommendation

For a production pipeline:

```bash
npm ci
npm run lint
npm test
npm run build
```

Optional: add `@vitest/coverage-v8` with thresholds on `src/lib/**`.

---

## Testability Notes in Production Code

| Export | Purpose |
|--------|---------|
| `resetNormalizedAuctionCache()` in `auction.ts` | Reset module cache between tests |
| `placeBid(id, amount, vehicles, store)` | Injectable vehicle list and store |
| `getAuctionStatus(start, now?)` | Injectable clock |

No dependency injection framework — tests pass explicit parameters or use Vitest spies on `getAllVehicles`.

---

## Assumptions in Tests

- `src/data/vehicles.json` contains exactly **200** vehicles (asserted in `vehicles.test.ts`)
- At least one Ford and one Toronto listing exist in production JSON
- Fixture tests do not mutate production JSON

---

## Future Improvements

1. **Playwright E2E** — Full browse → detail → bid against `docker compose up`
2. **Coverage report** — Enforce minimum on `src/lib`
3. **PhotoGallery tests** — Lightbox open/close, Escape key
4. **axe-core smoke** — Browse + detail pages
5. **Contract tests** — If a backend replaces JSON, validate schema with Zod
