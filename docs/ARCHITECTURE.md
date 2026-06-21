# Architecture

## 1. System overview

The Würth Platform is a three-tier system:

```
┌────────────────────────────────────────────────────────────┐
│  Browser (PWA)                                               │
│  React 19 SPA · React Router · Tailwind v4 · service worker  │
└───────────────┬──────────────────────────┬─────────────────┘
                │ REST (JSON)               │ GraphQL / REST
                ▼                            ▼
     ┌────────────────────┐        ┌──────────────────────┐
     │  Application API     │        │  GitHub API           │
     │  (Next.js, assumed)  │        │  (portfolio analytics)│
     └─────────┬───────────┘        └──────────────────────┘
               │ SQL
               ▼
     ┌────────────────────┐
     │  PostgreSQL          │
     │  (schema.sql)        │
     └────────────────────┘
```

This repository implements the browser tier. The Application API and PostgreSQL database
are the assumed backend; the database contract is fully specified in
[`DATABASE.md`](DATABASE.md) and the HTTP contract in [`API.md`](API.md).

The GitHub integration is special: `src/services/githubService.ts` calls GitHub's GraphQL
endpoint directly from the client today. In production this should be proxied through the
backend so the GitHub token is never exposed to the browser (see
[Security](#7-security-considerations)).

---

## 2. Frontend layering

The frontend is organized into clear horizontal layers. Dependencies flow downward only.

| Layer | Location | Responsibility |
|---|---|---|
| **Routing / shell** | `App.tsx`, `components/layout/*` | Route table, nav chrome, page outlet |
| **Pages** | `pages/*`, `pages/admin/*` | One screen per route; compose components + hooks |
| **Feature components** | `components/feed`, `components/github`, `components/modules`, … | Reusable, feature-scoped UI |
| **UI primitives** | `components/ui/*` | `Avatar`, `RoleBadge`, etc. |
| **Hooks** | `hooks/*` | Stateful logic (`usePosts`, `useJobFilter`, `useAdminActions`) |
| **Services** | `services/*` | Network I/O (`api.ts`, `githubService.ts`) |
| **Utils** | `utils/*` | Pure functions (`nlpMatcher`, `time`) |
| **Domain types** | `types/*` | Shared TypeScript contracts |
| **Data** | `data/*` | Mock fixtures (replaced by service calls in production) |
| **Cross-cutting** | `context/AuthContext`, `guards/adminGuard` | Identity and access control |

### Why this matters

Each page currently imports a `data/*` fixture directly (e.g. `Feed` → `usePosts` →
`MOCK_POSTS`). The migration path to a live backend is therefore mechanical: swap the
fixture import inside the hook/page for a service call, keeping the component contract
unchanged. Hooks are the natural integration point because they already own the relevant
state and mutations.

---

## 3. Routing model

Routing is defined declaratively in `App.tsx` using React Router v6. There are two route
trees:

**Main application** — wrapped by `<Layout />`, which renders the top nav, side nav, mobile
nav, the floating WE chatbot, and the Community Nexus around an `<Outlet />`:

```
/                      Feed
/jobs, /jobs/new       Jobs
/bounties              Bounties
/bounties/new          PostBounty
/bounties/:bountyId    BountyDetail
/projects, /projects/mine   Projects
/profile, /profile/:userId  Profile
/analytics             ExecutiveDashboard
/chair-portal          ChairPortal
/sandbox               StudentSandbox
/leaderboard           Leaderboard
/community             Community
/news                  NewsDigest
/products              Products
```

**Admin back office** — mounted at `/admin/*`, wrapped in `<AdminGuard>` and a nested
`<AdminLayout />`:

```
/admin                 AdminDashboard
/admin/analytics       AdminAnalytics
/admin/compliance      AdminCompliance
/admin/opportunities   AdminOpportunities
/admin/verification    AdminVerification
```

The admin tree is a nested `<Routes>` rendered only after the guard passes, so unauthorized
users never mount admin pages.

`Layout` passes a `searchQuery` value to pages through the router outlet context; pages such
as `Feed` read it with `useOutletContext()` to filter their content against the global
search box.

---

## 4. Identity & access control

Authentication state lives in `context/AuthContext.tsx` and is exposed via the `useAuth()`
hook. It provides `currentUser`, `isAuthenticated`, `login`, `logout`, `switchAccount`,
`availableAccounts`, plus `isLoading` / `error`.

Behaviour:

- **Initialization** reads `currentUserId` from `localStorage`, resolving it against the
  mock user list; otherwise it defaults to the first mock user (demo convenience).
- **Login** — when a password is supplied, it calls `loginUser()` against the backend and,
  on success, persists the user id and email to `localStorage`. Without a password it falls
  back to selecting a mock user. The production version should drop the mock fallback and
  rely solely on the backend response (ideally a session cookie or token).
- **`switchAccount`** is a demo affordance for hopping between seeded personas.

**Authorization** is enforced by `guards/adminGuard.tsx`, which offers three tools:

- `<AdminGuard requiredRole="corporate_admin">` — redirects unauthorized users to `/` and
  logs a warning. Used to wrap the entire `/admin/*` subtree.
- `<AdminAccessWrapper>` — renders children only for admins (inline conditional UI).
- `useAdminAccess()` — boolean hook for imperative checks.

> Note: client-side guards protect the *UI*, not the *data*. Every admin endpoint must
> independently enforce the `corporate_admin` role on the server. See [API.md](API.md).

---

## 5. State management

There is no global store (Redux/Zustand). State is deliberately local:

- **Auth** is the only cross-cutting context.
- **Domain state** lives in feature hooks. `usePosts` owns the feed list and its mutations
  (add post, toggle like, add comment, increment shares). `useAdminActions` owns the admin
  entity collections (GDPR records, hardware bounties, micro-internships, project
  validations) with create/update/delete/publish operations plus a generic `filterData`
  helper. `useJobFilter` owns search + multi-select filter state and derives the visible
  job list with `useMemo`.
- **View state** (open modals, selected tabs, search text) is plain `useState` in the
  relevant page.

Mutations today operate on in-memory copies of the fixtures. When wired to the backend,
each mutation becomes an optimistic update plus a service call; the hook signatures are
designed so callers do not need to change.

---

## 6. Data flow example — the feed

```
Feed (page)
  ├─ useOutletContext() → searchQuery        (from Layout)
  ├─ usePosts()                              (hook owns post state + mutations)
  │     └─ MOCK_POSTS  ⟶  [replace with GET /posts]
  ├─ getUserById()                           (resolve author for each post)
  └─ renders:
        FeedFilter   → role/all filter
        ComposeBox   → onPost(addPost)
        PostCard[]   → onLike / onShare / onAddComment
```

The same shape recurs across features: a page pulls a hook, the hook owns a collection and
its mutators, components are pure presenters that receive data + callbacks. This is what
makes the backend swap low-risk.

---

## 7. Security considerations

These are the items to resolve before production:

1. **GitHub token exposure.** `githubService.ts` sends `Authorization: Bearer <token>`
   from the browser. Move all GitHub calls behind a backend endpoint
   (e.g. `GET /portfolio/:username`) so the token stays server-side.
2. **Server-side RBAC.** `AdminGuard` is cosmetic; the backend must verify the
   `corporate_admin` role on every `/admin/**` API route.
3. **Session handling.** Prefer httpOnly, secure cookies over storing identifiers in
   `localStorage`. The current `localStorage` use is a demo shortcut.
4. **GDPR surface.** The compliance module operates on personal data (`gdpr_records`,
   audit trails). Server endpoints must log every access/mutation to
   `admin_activity_logs` and honor retention periods.
5. **Input validation.** Compose box, bounty posting, and admin create forms must be
   validated server-side, not only in the UI.

---

## 8. Progressive Web App

`index.html` declares PWA metadata (theme color `#851a1a`, apple-mobile-web-app tags) and
links `manifest.json`. `main.tsx` registers `public/sw.js` on load; registration failure is
non-fatal. The app is installable and brand-themed (Würth red on a dark surface palette).

---

## 9. Design system

Theming is centralized in `src/index.css` using Tailwind v4's `@theme` block, which defines
CSS custom properties consumed as Tailwind color utilities:

- **Accent (brand red)** scale: `--color-accent` `#851a1a` through `--color-accent-deepest`.
- **Surfaces** (dark): `surface-base` `#141414`, `surface-card`, `surface-elevated`.
- **Text**: `text-primary`, `text-muted`.
- **Semantic**: `status-error`, `status-success`, `status-warn`.

Components reference these as utility classes (`bg-surface-card`, `text-text-muted`,
`border-border`, etc.), so a re-theme is a single-file change. See
[`FRONTEND.md`](FRONTEND.md#design-system) for usage conventions.
