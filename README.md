# The Block — OPENLANE Buyer Auction Prototype

A frontend-only buyer-side prototype for wholesale vehicle auctions. Browse 200 listings, search and filter inventory, view vehicle details, and place bids with live UI updates; all without a backend.

Built for the OPENLANE **“The Block”** coding challenge.

---

## How to Run

### Option A — Node.js (development)

**Prerequisites:** Node.js 18+ and npm

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Option B — Docker (no Node install required)

**Prerequisites:** Docker Desktop (or Docker Engine + Compose)

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080)

To stop:

```bash
docker compose down
```

### Production preview (local)

```bash
npm run build
npm run preview
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload (port 5173) |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve production build locally |
| `npm test` | Run full test suite once (61 tests) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint |

---

## What I Built

### Browse (inventory)

- Grid of **200 vehicles** with photo, title, location, countdown, and current bid
- **Featured row** prioritizing live, then upcoming auctions
- **Search** (300 ms debounce) across make, model, lot, dealer, city, and province
- **Filter chips** (make, body style, province) plus mobile filter sheet (price, condition)
- **Sort** by price, year, odometer, or condition
- **Empty state** when no listings match

### Vehicle detail

- Photo gallery with grid thumbnails, counter, and **lightbox** (keyboard + prev/next)
- Detail header with specs subtitle, ending time, and Live / No Reserve badges
- **Auction action bar**: time left, high bid, bid count, Place bid CTA
- Highlights, grouped specifications (Vehicle · Powertrain · Auction), condition report
- **Dark bid panel** (desktop sidebar; mobile bottom sheet)
- **Ending soon** sidebar and related vehicles

### Bidding

- Minimum increment **$500 CAD**
- Validates integer amounts, minimum bid, and auction status
- **In-memory state** via Zustand; UI updates immediately on success
- “You bid” badge on cards after placing a bid
- State **resets on page refresh** (by design for this prototype)

### Branding & UX

- OPENLANE-inspired theme (navy, blue CTAs, light browse shell)
- Cars & Bids–influenced detail layout (action bar, grouped specs) without copying their full dark shell
- Responsive layout with mobile sticky action bar and bid sheet

---

## Stack

| Layer | Choice |
|-------|--------|
| **Frontend** | React 19, TypeScript, Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **State** | Zustand (bid overrides only) |
| **Data** | Static JSON (`src/data/vehicles.json`) |
| **Tests** | Vitest, Testing Library, jsdom |
| **Deploy** | Docker multi-stage build → nginx |

**Backend / database:** None. All logic runs in the browser.

---

## Assumptions and Scope

| Assumption | Detail |
|------------|--------|
| No authentication | Anyone can bid; no user accounts |
| No persistence | Bid state lives in memory until refresh |
| Static inventory | 200 vehicles bundled at build time |
| Normalized auction times | Raw `auction_start` values are mapped to a window around “now” so some listings appear live/upcoming/ended during a demo |
| Reserve display | Shows met / not met only; exact reserve amount is not revealed to buyers |
| Images | Placeholder URLs from generated data; broken images show a fallback |
| Currency | CAD, whole dollars only |

**Intentionally out of scope:** seller flows, payments, notifications, real-time multi-user bidding, admin tools, authentication, API integration.

---

## Notable Decisions

1. **Pure functions in `src/lib/`, thin UI**: Search, bid validation, and auction timing are testable without React.
2. **Zustand for bids only**: Browse filters stay in component state; only bid overrides need cross-page sharing.
3. **Normalized auction window**: Maps the dataset’s date range onto “now ± a few days” so countdowns feel alive without editing JSON.
4. **Exact-match search for makes, cities, provinces**: Prevents false positives (e.g. “ford” in Abbotsford, “Toronto” in dealership names for Hamilton listings).
5. **Light browse / dark bid accents**: Keeps OPENLANE brand consistency; dark panel reserved for high-intent bid UI (similar to card footers).
6. **Docker + nginx**: Single command for reviewers; SPA routing via `try_files`.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for diagrams and data flow.

---

## Testing

**61 tests** across unit, store, component, and integration layers. No network calls in tests.

```bash
npm test
```

Details: [TESTING.md](./TESTING.md)

---

## Project Structure

```
src/
  components/   # UI by domain (browse, vehicle, layout, ui)
  data/         # vehicles.json (single source of truth)
  hooks/        # useVehicle, useBidState
  lib/          # bids, vehicles, auction, format (pure logic)
  pages/        # BrowsePage, VehicleDetailPage, NotFoundPage
  store/        # Zustand bid store
  types/        # TypeScript interfaces
tests/          # Vitest suites (lib, store, components, integration)
scripts/        # generate_vehicles.mjs (dataset generator)
```

---

## Documentation

| File | Purpose |
|------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, data flow, key modules |
| [TESTING.md](./TESTING.md) | Test strategy, coverage, how to run |
| [PROJECT.md](./PROJECT.md) | Quick reference (run commands, assumptions) |

---

## What I'd Do With More Time

- **Backend API** with real auction endpoints and WebSocket countdown sync
- **Authentication** and persisted bid history per user
- **E2E tests** (Playwright) against Docker preview
- **Accessibility audit** (axe) and keyboard-only bid flow polish
- **Performance** — virtualized grid for large inventories, code-splitting
- **Seller / admin** views and reserve management
- **Analytics** — search funnels, bid conversion tracking

---

## Regenerating Vehicle Data

```bash
node scripts/generate_vehicles.mjs
```

Writes to `src/data/vehicles.json` (200 vehicles).

---

## License

Prototype for OPENLANE evaluation purposes.
