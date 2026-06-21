# Würth Platform — Backend API

A ready-to-deploy REST API for the Würth Platform interface (a student ⇄ company ⇄
educator ⇄ corporate-admin networking and bounty platform). Built with **Express +
TypeScript**, JWT authentication, and a zero-dependency JSON persistence layer seeded
verbatim from the frontend's mock data.

This backend implements the exact contract the frontend already calls
(`POST /api/auth/login` → `{ role, email, id }` and `GET /health`) and adds real
endpoints for every entity the app previously mocked, so the UI can drop its local
mock data and talk to a live server.

---

## Quick start

```bash
# 1. install
npm install

# 2. (optional) regenerate the seed from the frontend mock files
npm run seed

# 3. dev (hot reload on :3000)
npm run dev

# 4. or build + run
npm run build
npm start
```

The server boots on `http://localhost:3000`. On first run it loads `data/seed.json`,
attaches a login email + hashed password to every seeded user, and writes a mutable
`data/db.json`. All later reads/writes go through `db.json`.

### Verify it works

```bash
bash smoke-test.sh      # boots the server, runs 26 endpoint checks, tears down
```

```bash
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"u1","password":"wurth1234"}'
```

---

## Demo accounts

Every seeded user shares the password from `SEED_PASSWORD` (default `wurth1234`).
You can log in with either the user **id** (e.g. `u1`) or the **derived email**
(`firstname.lastname@wurth-platform.dev`). Seeded roles include `student`, `company`,
`educator`, and `corporate_admin` — log in as the admin to reach the `/api/admin/*`
routes. List users with `GET /api/users?role=corporate_admin` to find one.

> Change or remove `SEED_PASSWORD` for any real deployment, and always set a strong
> `JWT_SECRET`.

---

## Configuration

Copy `.env.example` → `.env` and adjust. All vars have safe dev defaults.

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Listen port (matches the frontend's expected base URL) |
| `API_PREFIX` | `/api` | Path prefix for all API routes |
| `JWT_SECRET` | dev placeholder | **Set a long random value in production** |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `SEED_PASSWORD` | `wurth1234` | Shared password for seeded demo accounts |
| `CORS_ORIGINS` | `*` | Comma-separated allow-list (`*` = all, dev only) |
| `DATA_DIR` | `./data` | Where `seed.json` lives and `db.json` is written |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate-limit window (15 min) |
| `RATE_LIMIT_MAX` | `1000` | Max requests per window per IP |

---

## Deploy

### Docker

```bash
docker build -t wurth-platform-backend .
docker run -p 3000:3000 \
  -e JWT_SECRET="$(openssl rand -hex 32)" \
  -e CORS_ORIGINS="https://your-frontend.com" \
  -v wurth-data:/app/data \
  wurth-platform-backend
```

### Docker Compose

```bash
JWT_SECRET="$(openssl rand -hex 32)" docker compose up -d
```

The `wurth-data` named volume persists `db.json` across restarts.

### Render

Push the repo and point Render at `render.yaml` (Docker runtime, persistent disk
mounted at `/app/data`, `JWT_SECRET` auto-generated). The same image runs on Railway,
Fly.io, Heroku, ECS, or any container host — set the env vars above and expose port
`3000`.

---

## Connecting the frontend

The frontend reads its base URL from `VITE_API_URL` (defaulting to
`http://localhost:3000/api`). Point it at this backend:

```bash
# in the frontend project's .env
VITE_API_URL=https://your-backend-host/api
```

`POST /api/auth/login` returns the `{ role, email, id }` shape `AuthContext` already
expects, plus a `token`. To move the UI off mock data, replace the `MOCK_*` imports in
`src/data` with `fetch`/service calls to the matching endpoints below; response shapes
mirror the types in the frontend's `src/types`.

---

## API reference

Base URL: `http://localhost:3000`. All list endpoints support `?q=`, `?page=`,
`?limit=` and return `{ data, total, page, limit, totalPages }`. Auth via
`Authorization: Bearer <token>`.

### Health
| Method | Path | Notes |
|---|---|---|
| GET | `/health`, `/healthz` | Liveness probe |

### Auth
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/login` | — | `{ email, password }` → `{ id, role, email, token, user }`. `email` accepts user id too |
| POST | `/api/auth/register` | — | `{ email, password, name, role? }` |
| GET | `/api/auth/me` | ✓ | Current user |
| POST | `/api/auth/logout` | — | Client-side no-op (stateless JWT) |

### Users
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/users` | — | `?role=` filter |
| GET | `/api/users/:id` | — | |
| PATCH | `/api/users/:id` | ✓ | Own profile (or admin); whitelisted fields |
| GET | `/api/users/:id/badges` `…/achievements` `…/certificates` | — | |

### Posts (feed)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/posts` | — | Newest first |
| GET | `/api/posts/:id` | — | |
| POST | `/api/posts` | ✓ | Create |
| DELETE | `/api/posts/:id` | ✓ | Author or admin |
| POST | `/api/posts/:id/like` | ✓ | Toggle |
| POST | `/api/posts/:id/comments` | ✓ | `{ content }` |
| POST | `/api/posts/:id/share` | ✓ | |

### Jobs, listings & bounties
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/jobs` | — | `?type=` `?companyId=` |
| GET/POST | `/api/jobs` `/api/jobs/:id` | POST ✓ | |
| POST | `/api/jobs/:id/apply` | ✓ | |
| GET | `/api/job-listings` `…/:id` | — | Würth catalogue; `?department=` `?type=` |
| GET | `/api/bounties` `…/:id` | — | `?status=` |
| POST | `/api/bounties/:id/apply` | ✓ | |

### Projects, communities, events, news
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET/POST | `/api/projects` `…/:id` | POST ✓ | `POST /:id/like` (✓) |
| GET | `/api/communities` `…/:id` | — | `?category=`; `POST /:id/join` (✓) |
| GET | `/api/events` | — | `?communityId=` `?type=`; `POST /:id/register` (✓) |
| GET | `/api/news` `…/:id` | — | `?category=`; `POST /:id/upvote` `…/save` (✓) |

### Catalogues & analytics
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/lecture-materials`, `/api/initiatives`, `/api/qa-channels`, `/api/deadlines`, `/api/we-feed` | — | List + `/:id` |
| GET | `/api/nexus/members` `…/threads` `…/announcements` | — | Community Nexus |
| GET | `/api/github/:username/portfolio` | — | GitHub portfolio analytics (try `alex-mueller`) |

### Admin (`corporate_admin` only)
| Method | Path | Notes |
|---|---|---|
| GET | `/api/admin/analytics/metrics` `…/roi` | Executive dashboard |
| GET/PATCH | `/api/admin/gdpr` `…/:id` | GDPR records + audit trail |
| GET/POST/PATCH/DELETE | `/api/admin/bounties` `…/:id` | Hardware bounty management |
| GET | `/api/admin/internships` | Micro-internships |
| GET/PATCH | `/api/admin/validations` `…/:id` | Project validation |
| GET | `/api/admin/verification-audit`, `/api/admin/activity-log` | Audit trails |

### Utilities
| Method | Path | Notes |
|---|---|---|
| GET | `/api/` | Endpoint index |
| POST | `/api/admin-tools/reset` | Reset DB to seed (admin-only in production) |

---

## Project structure

```
src/
  app.ts                Express app (security, CORS, logging, routes)
  server.ts             Entry point + graceful shutdown
  lib/
    config.ts           Env-driven config
    store.ts            JSON persistence + first-boot seeding
    auth.ts             JWT + bcrypt helpers
    http.ts             asyncHandler, ApiError, pagination
  middleware/index.ts   requireAuth, requireRole, error handler
  routes/               auth, users, posts, jobs, community, content, admin
  seed/
    buildSeed.ts        Extracts seed.json from the frontend mock files
    source/             Verbatim copies of the frontend's data/*.ts
data/
  seed.json             Generated seed (committed)
  db.json               Mutable runtime DB (git-ignored)
```

## Notes & next steps

- **Persistence** is a JSON file — ideal for demos and small deployments, and trivially
  deployable with no DB to provision. For higher write concurrency, swap `lib/store.ts`
  for Postgres/Prisma; the route layer is already decoupled from storage.
- The seed can be regenerated any time the frontend mock data changes: copy the updated
  `src/data/*.ts` into `src/seed/source/` and run `npm run seed`.
