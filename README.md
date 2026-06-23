# Würth Platform

A professional networking and engineering-talent platform that connects engineering
students with industry (Würth Elektronik and partner companies). It combines a social
feed, a jobs and bounty marketplace, project portfolios with GitHub analytics,
gamification, community groups, an industry news digest, and a role-based admin
back office.

This repository contains the **web frontend** (React 19 + TypeScript + Vite + Tailwind v4).
It is designed to run against a REST backend (assumed to be a Next.js API) backed by the
PostgreSQL schema described in [`docs/DATABASE.md`](docs/DATABASE.md).

---
 
## Documentation map

| Document | What it covers |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System overview, layers, data flow, frontend ↔ backend contract |
| [`docs/FRONTEND.md`](docs/FRONTEND.md) | Routing, pages, components, hooks, services, state, design system |
| [`docs/API.md`](docs/API.md) | REST API reference the frontend expects from the backend |
| [`docs/DATABASE.md`](docs/DATABASE.md) | PostgreSQL schema, tables, enums, relationships |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Build, environment variables, hosting, hardening |
| [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) | Dev workflow, conventions, code style |

---

## Tech stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Language | TypeScript (strict, bundler module resolution) |
| Build tool | Vite 8 |
| Routing | React Router v6 (`BrowserRouter`) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`), CSS custom properties for theming |
| State | React Context (auth) + local hooks; no external store |
| PWA | Web App Manifest + service worker (`public/sw.js`) |
| Linting | ESLint 10 + `typescript-eslint` + React Hooks rules |
| Backend (assumed) | Next.js API routes over PostgreSQL |

The runtime dependency surface is intentionally small — `react`, `react-dom`, and
`react-router-dom`. Everything else is dev/build tooling.

---

## Quick start

Prerequisites: **Node.js 20+** and **npm**.

```bash
# 1. Install dependencies
npm install

# 2. Configure the backend URL (optional in pure-mock mode)
echo "VITE_API_URL=http://localhost:3000/api" > .env.local

# 3. Start the dev server (Vite, with HMR)
npm run dev
```

The app boots at `http://localhost:5173` by default.

### Available scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server with hot-module reload |
| `npm run build` | Type-check (`tsc -b`) then produce a production bundle in `dist/` |
| `npm run preview` | Serve the built `dist/` locally to verify the production build |
| `npm run lint` | Run ESLint across the project |

---

## How it runs without a backend

The frontend ships with a complete set of mock data under `src/data/`. On first load the
auth context selects a mock user, and every page reads from these in-memory fixtures. This
makes the app fully demoable with no server running.

The integration seam to a real backend already exists:

- `src/services/api.ts` — `loginUser()` posts to `POST {VITE_API_URL}/auth/login`, and
  `checkBackendHealth()` probes a health endpoint.
- `src/services/githubService.ts` — talks to the GitHub GraphQL/REST API for portfolio data.
- `src/context/AuthContext.tsx` — uses the backend login when a password is supplied and
  falls back to mock users otherwise.

To go production, the mock reads in each page/hook are replaced with calls to the endpoints
documented in [`docs/API.md`](docs/API.md), which map one-to-one onto the schema in
[`docs/DATABASE.md`](docs/DATABASE.md).

---

## Repository layout

```
.
├── index.html              # Vite HTML entry; PWA meta + theme color
├── vite.config.ts          # React + Tailwind plugins
├── eslint.config.js
├── tsconfig*.json          # app / node project references
├── public/                 # static assets, manifest.json, sw.js
└── src/
    ├── main.tsx            # React root + service-worker registration
    ├── App.tsx             # Router + route table
    ├── index.css           # Tailwind import + @theme design tokens
    ├── context/            # AuthContext (current user, login/logout)
    ├── guards/             # adminGuard — RBAC route protection
    ├── pages/              # Route-level screens (incl. pages/admin/*)
    ├── components/         # Feature + UI components (feed, github, layout, …)
    ├── hooks/              # usePosts, useJobFilter, useAdminActions
    ├── services/           # api.ts, githubService.ts
    ├── utils/              # nlpMatcher (TF-IDF job matching), time helpers
    ├── types/              # index.ts (domain types) + admin.ts
    └── data/               # mock fixtures used in lieu of the backend
```

See [`docs/FRONTEND.md`](docs/FRONTEND.md) for a file-by-file tour.

---

## Key features

- **Social feed** — text/image/link posts, likes, comments, shares, role and search filters.
- **Jobs board** — Würth engineering roles with department/type filters and TF-IDF
  profile-to-job matching (`utils/nlpMatcher.ts`).
- **Bounties** — companies post hardware/engineering challenges; students apply and submit.
- **Projects & portfolio** — student projects plus a GitHub portfolio widget (repos,
  contribution graph, collaboration metrics).
- **Gamification** — points, levels, badges, achievements, certificates, leaderboard.
- **Community** — interest groups, events, and a "Community Nexus" engagement layer.
- **News digest** — curated industry news with upvotes and saves.
- **WE Chatbot** — an in-app assistant over Würth feed content (products, news, events, FAQ).
- **Admin back office** — RBAC-protected dashboards for analytics, GDPR compliance,
  opportunity management, and project/institution verification.

---

## License & ownership

Internal project. Add the appropriate license and ownership notice before public
distribution.
