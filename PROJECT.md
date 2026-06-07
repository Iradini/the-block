# The Block — Buyer Prototype

OPENLANE wholesale vehicle auction buyer prototype built with React, Vite, and TypeScript.

## How to Run (Node.js)

**Prerequisites:** Node.js 18+ and npm

```bash
npm install
npm run dev
```

Open http://localhost:5173

## How to Run (Docker — no Node install required)

**Prerequisites:** Docker Desktop (or Docker Engine + Compose)

```bash
docker compose up --build
```

Open http://localhost:8080

To stop:

```bash
docker compose down
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint |

## Stack

- **Frontend:** React 19, Vite 8, TypeScript, Tailwind CSS 4, React Router, Zustand
- **Backend:** None (static JSON + in-memory bid state)
- **Tests:** Vitest (`tests/` directory)

## Assumptions

- No authentication; bid state is in-memory and resets on page refresh
- Minimum bid increment: $500 CAD
- Auction timestamps normalized relative to "now" for live/upcoming/ended states
- Reserve price shown as met/not met only (exact reserve hidden)

## Testing

Critical logic is covered in `tests/lib/`:

- Bid validation and placement (`bids.test.ts`)
- Search and related vehicles (`vehicles.test.ts`)
- Currency and increment helpers (`format.test.ts`)
- Auction status windows (`auction.test.ts`)
