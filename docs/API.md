# API Reference

This document specifies the HTTP contract between the frontend and the backend. Two of
these endpoints already exist in code (`POST /auth/login`, `GET /health` via
`services/api.ts`); the rest are derived from the frontend's data needs and the database
schema in [DATABASE.md](DATABASE.md). The assumed implementation is **Next.js API routes
over PostgreSQL**, but any framework that honors this contract will work.

JSON field names below follow the frontend domain types in `src/types/`. The backend may
store snake_case (per the SQL schema) and serialize to camelCase at the API boundary.

---

## Conventions

- **Base URL:** `VITE_API_URL` (default `http://localhost:3000/api`).
- **Content type:** `application/json` for requests and responses.
- **Auth:** session via httpOnly secure cookie (recommended) or `Authorization: Bearer <jwt>`.
- **IDs:** UUID strings.
- **Timestamps:** ISO 8601 (`2025-06-21T10:00:00Z`).
- **Pagination:** `?page=<n>&limit=<n>` (default `page=1`, `limit=20`); list responses
  return `{ data: [...], page, limit, total }`.
- **Errors:** non-2xx responses return `{ message: string, status?: number }`. The frontend
  surfaces `message` directly (see `loginUser` error handling).

### Standard error shape

```json
{ "message": "Human-readable explanation", "status": 400 }
```

| Code | Meaning |
|---|---|
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized (e.g. non-admin hitting `/admin/**`) |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate application) |
| 429 | Rate limited |
| 500 | Server error |

---

## Authentication

### `POST /auth/login`  *(implemented in frontend)*
Authenticate a user.

Request:
```json
{ "email": "user@example.com", "password": "••••••••" }
```
Response `200`:
```json
{ "role": "student", "email": "user@example.com", "id": "uuid" }
```
`role` ∈ `student | company | educator | corporate_admin`. On failure returns the standard
error shape; the frontend throws `Error(message)`.

### `GET /health`  *(implemented in frontend)*
Liveness probe. `200 OK` means healthy (`checkBackendHealth()` returns the `response.ok`).

### `POST /auth/logout`
Invalidate the session. `204 No Content`.

### `GET /auth/me`
Return the authenticated `User` (replaces the `localStorage` bootstrap). `200` → `User`.

---

## Users & profiles

### `GET /users/:id` → `User`
Full user record including role-specific fields, gamification (`points`, `badges`,
`achievements`, `certificates`), counts, `skills`, `interests`.

### `GET /users` → paginated `User[]`
Query: `?role=`, `?q=` (name/headline search), pagination.

### `PATCH /users/:id` → `User`
Update own profile (headline, bio, location, skills, interests, avatar). Self or admin only.

### `GET /users/:id/badges` → `Badge[]`
### `GET /users/:id/achievements` → `Achievement[]`
### `GET /users/:id/certificates` → `Certificate[]`

### `POST /users/:id/follow` / `DELETE /users/:id/follow`
Follow/unfollow. Adjusts `followers_count` / `following_count`. `204 No Content`.

---

## Feed — posts & comments

### `GET /posts` → paginated `Post[]`
Query: `?authorRole=`, `?tag=`, `?q=`. Mirrors `Feed` filtering. Each `Post` carries
`likes`, `likedBy`, `comments`, `shares`, `tags`, and optional `imageUrl` / `linkPreview`.

### `POST /posts` → `Post`
```json
{ "type": "text|image|link", "content": "string",
  "imageUrl": "…", "linkPreview": { "url": "…", "title": "…", "description": "…" },
  "tags": ["…"] }
```
`authorId` is taken from the session, not the body (matches `usePosts.addPost`).

### `POST /posts/:id/like` / `DELETE /posts/:id/like`
Toggle the current user's like. Returns updated `{ likes, likedBy }`.

### `POST /posts/:id/share` → `{ shares }`

### `GET /posts/:id/comments` → `Comment[]`
### `POST /posts/:id/comments` → `Comment`
```json
{ "content": "string" }
```

---

## Jobs

### `GET /jobs` → paginated `JobListing[]`
Query: `?q=`, `?type=` (repeatable), `?department=` (repeatable). Supports the
`useJobFilter` semantics (search across title/description/skills/hardware, multi-select
type + department).

### `GET /jobs/:id` → `JobListing`

### `POST /jobs` → `JobListing`  *(company / admin)*

### `POST /jobs/:id/apply` → `{ applicationId, status }`
Creates a `job_application`; `409` if the user already applied (the schema enforces
`UNIQUE(job_id, user_id)`).

### `GET /jobs/match?userId=:id` → `MatchResult[]`
Server-side equivalent of `utils/nlpMatcher.ts`, returning `score`, `matchPercentage`,
`matchedSkills`, `missingSkills`, `explanation` per job. (May remain client-side; documented
here for when matching moves server-side over the full corpus.)

---

## Bounties

### `GET /bounties` → paginated `Bounty[]`
Query: `?status=open|reviewing|closed`, `?tag=`, `?q=`.

### `GET /bounties/:id` → `Bounty`
Includes `requirements`, `submissionRequirements`, `tags`, `reward`, `duration`,
`deadline`, `applicationCount`, `appliedBy`, `status`.

### `POST /bounties` → `Bounty`  *(company / admin)*
Backs the `PostBounty` page.

### `POST /bounties/:id/apply` → `{ applicationId, status }`
`409` on duplicate (`UNIQUE(bounty_id, user_id)`).

---

## Projects

### `GET /projects` → paginated `Project[]`
Query: `?authorId=` (for `/projects/mine`), `?tag=`, `?q=`.

### `POST /projects` → `Project`
### `POST /projects/:id/like` / `DELETE /projects/:id/like` → `{ likes, likedBy }`

---

## GitHub portfolio

To keep the GitHub token server-side, proxy GitHub through the backend.

### `GET /portfolio/:username` → `GitHubPortfolioData`
Backend fetches via GitHub GraphQL (mirroring `fetchGitHubPortfolio`) and returns
`repositoryList`, `contributionGraph` (with `contributionDays` levels 0–4, PR/issue counts),
`collaborationMetrics`, `profileUrl`, `lastFetched`.

Error responses use the GitHub error taxonomy:
```json
{ "type": "PRIVATE_PROFILE|RATE_LIMIT|NOT_FOUND|API_ERROR|NO_DATA",
  "message": "…", "retryable": true }
```

### `GET /portfolio/:username/validate` → `{ valid: boolean }`

---

## Community & events

### `GET /communities` → `Community[]`  ·  `GET /communities/:id`
### `POST /communities/:id/join` / `DELETE /communities/:id/join` → `{ memberCount, isJoined }`
### `GET /communities/:id/events` → `CommunityEvent[]`
### `POST /events/:id/register` / `DELETE /events/:id/register` → `{ attendeeCount, isRegistered }`

---

## News digest

### `GET /news` → paginated `NewsArticle[]`
Query: `?category=`, `?q=`, `?saved=true`.

### `POST /news/:id/upvote` / `DELETE /news/:id/upvote` → `{ upvotes, upvotedBy }`
### `POST /news/:id/save` / `DELETE /news/:id/save` → `{ saved }`

---

## WE feed & chatbot

### `GET /we-feed` → `WEFeedItem[]`
Query: `?category=news|product|service|event|blog|career`, `?q=`. Backs the WE chatbot and
Products surface (today served from `data/weFeed.ts`).

---

## Educator / Chair portal

### `GET /materials` → `LectureMaterial[]`  ·  `POST /materials`  ·  `PATCH /materials/:id`
### `GET /qa-channels` → `QAChannel[]`
### `GET /initiatives` → `StudentInitiative[]`  ·  `PATCH /initiatives/:id` (endorse / status)
### `GET /deadlines?userId=:id` → `Deadline[]`

---

## Admin (RBAC: `corporate_admin` only)

> Every endpoint below **must** verify the `corporate_admin` role server-side and append an
> entry to `admin_activity_logs`. The frontend `AdminGuard` is not a security boundary.

### Analytics
- `GET /admin/analytics/metrics` → `AnalyticsMetric[]`
- `GET /admin/analytics/roi` → `ROIDataPoint[]`

### GDPR / compliance
- `GET /admin/gdpr` → `GDPRRecord[]` (query `?status=`, `?q=`)
- `PATCH /admin/gdpr/:id` `{ status }` → `GDPRRecord`
- `DELETE /admin/gdpr/:id` → `204`
- `GET /admin/gdpr/:id/audit` → `AuditEntry[]`

### Opportunities
Hardware bounties:
- `GET /admin/hardware-bounties` → `HardwareBounty[]`
- `POST /admin/hardware-bounties` → `HardwareBounty`
- `PATCH /admin/hardware-bounties/:id` → `HardwareBounty`
- `POST /admin/hardware-bounties/:id/publish` → `{ status: "published" }`
- `DELETE /admin/hardware-bounties/:id` → `204`

Micro-internships (same shape):
- `GET|POST /admin/micro-internships`, `PATCH|DELETE /admin/micro-internships/:id`,
  `POST /admin/micro-internships/:id/publish`

### Verification
- `GET /admin/validations` → `ProjectValidation[]`
- `PATCH /admin/validations/:id` `{ status, validationNotes }` →
  status ∈ `approved | rejected | needs-revision`
- `GET /admin/verification-audit` → `VerificationAuditEntry[]`
- `GET /admin/activity-logs` → `AdminActivityLog[]`

---

## Mapping to the frontend

| Frontend source | Replace with |
|---|---|
| `usePosts` → `MOCK_POSTS` | `GET /posts`, `POST /posts`, like/comment/share endpoints |
| `useJobFilter` input + `jobsMockData` | `GET /jobs` |
| `useAdminActions` → `adminMockData` | the `/admin/**` endpoints above |
| `githubService` (client token) | `GET /portfolio/:username` proxy |
| `AuthContext` `localStorage` bootstrap | `GET /auth/me` |

Because hooks own the data, wiring is a per-hook change; component props are unaffected.
