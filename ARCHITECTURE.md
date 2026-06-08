# Architecture — The Block

This document describes how the buyer auction prototype is structured, how data flows, and the main design tradeoffs. Everything here reflects the **current codebase**, not a planned future system.

---

## Overview

The Block is a **single-page application (SPA)** with no backend. All vehicle data ships as static JSON; bid state lives in a client-side store and is lost on refresh.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐ │
│  │   Pages     │─▶ │  Components  │ ─▶ │  Zustand store  │ │
│  │ Browse/     │    │  browse/     │    │  (bid overrides)│ │
│  │ Detail      │    │  vehicle/    │    └────────┬────────┘ │
│  └──────┬──────┘    └──────┬───────┘             │          │
│         │                  │                     │          │
│         └────────┬─────────┘                     │          │
│                  ▼                               ▼          │
│         ┌─────────────────────────────────────────────┐     │
│         │           src/lib/ (pure functions)         │     │
│         │        vehicles · bids · auction · format   │     │
│         └────────────────────┬────────────────────────┘     │
│                              ▼                              │
│                   src/data/vehicles.json                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Concern | Implementation |
|---------|----------------|
| Build | Vite 8 + TypeScript project references |
| UI | React 19 function components |
| Styles | Tailwind CSS 4 via `@tailwindcss/vite` |
| Routes | React Router 7 — `/`, `/vehicles/:id`, `*` |
| Client state | Zustand (`useBidsStore`) for bid overrides only |
| Server | None; Docker serves static `dist/` via nginx |

---

## Directory Layout

```
src/
├── App.tsx                 # Router shell
├── main.tsx                # Entry + global CSS
├── data/
│   └── vehicles.json       # 200 vehicles (bundled at build time)
├── types/
│   └── vehicle.ts          # Vehicle, VehicleWithBids, BidStore, filters
├── lib/                    # Pure, testable business logic
│   ├── vehicles.ts         # Search, filter, sort, related, featured
│   ├── bids.ts             # mergeVehicleWithBids, placeBid
│   ├── auction.ts          # Status, normalization, countdown helpers
│   └── format.ts           # Currency, increments, display strings
├── store/
│   └── bids.ts             # Zustand wrapper calling lib/bids
├── hooks/
│   ├── useVehicle.ts       # Vehicle + merged bid state by id
│   └── useBidState.ts      # Per-vehicle bid helpers
├── pages/
│   ├── BrowsePage.tsx
│   ├── VehicleDetailPage.tsx
│   └── NotFoundPage.tsx
└── components/
    ├── browse/             # Grid, cards, filters, featured row
    ├── vehicle/            # Detail sections, gallery, bid panel
    ├── layout/             # Header, footer, app shell
    └── ui/                 # Countdown, badges, empty state
```

**Principle:** UI components call `lib/` functions or the Zustand store. They do not embed bid rules or search logic.

---

## Routing

| Path | Page | Behavior |
|------|------|----------|
| `/` | `BrowsePage` | Inventory grid, search, filters |
| `/vehicles/:id` | `VehicleDetailPage` | Detail + bid panel; invalid id → `NotFoundPage` |
| `*` | `NotFoundPage` | Catch-all 404 |

`AppLayout` wraps all routes with `Header` and `Footer`.

---

## Data Model

### `Vehicle` (from JSON)

Core fields: identity (`id`, `vin`, `lot`), specs (`year`, `make`, `model`, …), auction (`auction_start`, `starting_bid`, `current_bid`, `bid_count`, `reserve_price`), location (`city`, `province`), media (`images[]`).

### `VehicleWithBids` (derived)

Extends `Vehicle` with computed fields from `mergeVehicleWithBids()`:

| Field | Source |
|-------|--------|
| `effective_bid` | Store override → else `current_bid` → else `starting_bid` |
| `bid_count` | Store override → else JSON `bid_count` |
| `my_bids` | Store override only |
| `min_next_bid` | `ceil((effective_bid + 500) / 500) * 500` |
| `auction_status` | `live` \| `upcoming` \| `ended` from normalized start |
| `normalized_auction_start` | Mapped date (see below) |

### `BidStore`

```typescript
Record<vehicleId, { currentBid, bidCount, myBids[] }>
```

Only vehicles the user has bid on appear in the store.

---

## Auction Time Normalization

Raw `auction_start` values in JSON span a historical range. For demo purposes, `getNormalizedAuctionStart()` maps each vehicle’s raw timestamp **linearly** onto a window:

- **Start of window:** ~2 hours before “now”
- **End of window:** ~7 days after “now”
- **Auction duration:** 2 hours per listing (`AUCTION_DURATION_MS`)

```
raw min ─────────────────────────────── raw max
         ↘ linear map ↙
now - 2h ───────────────────────────── now + 7d
              └── each vehicle gets a normalized start
                  status = live if now ∈ [start, start + 2h)
```

**Tradeoff:** Countdowns feel realistic without hand-editing 200 records. **Cost:** Status is relative to the viewer’s clock and is rebuilt from a module-level cache on first access (`resetNormalizedAuctionCache()` exists for tests).

---

## Search and Filter Pipeline

`searchVehicles(query, filters, sort, store)`:

1. **Search** — Multi-term AND query. Special rules:
   - Term matches a **known make** → exact `make` match only
   - Term matches a **known city** → exact `city` match only
   - Term matches a **known province** → exact `province` match only
   - Otherwise → word-boundary match on year, model, trim, lot, dealer, city, province
2. **Filters** — make, bodyStyle, province, price range (on effective bid), condition grade range
3. **Sort** — price, year, odometer, condition
4. **Merge** — Map each result through `mergeVehicleWithBids()`

Browse page debounces search input by **300 ms** before calling `searchVehicles`.

---

## Bid Placement Flow

```
User submits BidPanel form
        │
        ▼
useBidsStore.placeBid(id, amount)
        │
        ▼
placeBid() in lib/bids.ts
        │
        ├── NOT_FOUND      (unknown id)
        ├── INVALID_AMOUNT (non-integer, ≤ 0, NaN)
        ├── AUCTION_ENDED  (status === 'ended')
        ├── TOO_LOW        (amount < min_next_bid)
        └── ok → updated VehicleWithBids
                    │
                    ▼
            Zustand store updated
                    │
                    ▼
    useVehicle / searchVehicles re-merge → UI updates
```

**UI validation:** Submit button disabled when input is empty, non-integer, or below minimum. Server-side rules in `placeBid()` remain the source of truth.

---

## Key UI Composition

### BrowsePage

- Local state: `query`, `debouncedQuery`, `filters`, `sort`, `filtersOpen`
- Reads `store` from Zustand so bid price changes affect sort/filter
- `FeaturedRow` ← `getFeaturedVehicles()`
- Main grid ← `searchVehicles()`

### VehicleDetailPage

- `useVehicle(id)` → `getVehicleWithBids(id, store)`
- **Desktop:** main column (gallery, highlights, specs, condition, related) + sticky sidebar (bid panel, ending soon)
- **Mobile:** sticky `AuctionActionBar` under header; bid form in bottom sheet
- Invalid `id` → `NotFoundPage` (same component as 404)

---

## Styling Conventions

- **Theme tokens** in `src/index.css` (`@theme`): OPENLANE navy, blue, auction dark, green
- **Utility classes:** `.btn-primary`, `.card`, `.bid-panel-dark`, `.auction-action-bar`, `.spec-label`
- Browse pages use light background; bid panel and card footers use dark `#1c1c1e`

---

## Build and Deploy

```
npm run build  →  tsc -b  +  vite build  →  dist/
Dockerfile     →  node:22-alpine build stage  →  nginx:alpine serves dist on port 8080
nginx.conf     →  SPA fallback (try_files → index.html), gzip
```

---

## Assumptions

- Single user per browser tab; no concurrent bid conflict resolution
- No CSRF, auth, or rate limiting
- JSON schema is trusted (no runtime validation library)
- Image URLs may fail; components handle `onError`

---

## Tradeoffs Summary

| Decision | Benefit | Cost |
|----------|---------|------|
| Static JSON | Zero infra, fast load | No live inventory updates |
| In-memory bids | Simple, instant UI | Lost on refresh |
| Normalized auction times | Live demos without API | Not real-world auction schedule |
| Pure `lib/` layer | High test coverage | Extra merge step on every read |
| Zustand vs Context | Minimal boilerplate | Global store harder to reset in tests (mitigated in `tests/setup.ts`) |

---

## Future Architecture (not implemented)

- REST or GraphQL API replacing JSON import
- WebSocket channel for countdown and competing bids
- React Query for server cache + optimistic updates
- Feature-based folders with co-located tests
- Shared component library for OPENLANE design system
