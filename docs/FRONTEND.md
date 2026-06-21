# Frontend Guide

A file-by-file tour of `src/`, the conventions used, and how to extend the app.

---

## Entry points

### `main.tsx`
Creates the React root and renders `<App />` inside `<StrictMode>`. Also registers the
service worker (`/sw.js`) on `window.load`; failures are swallowed (offline support is
progressive, not required).

### `App.tsx`
Wraps everything in `<AuthProvider>` and `<BrowserRouter>` and declares the full route
table (see [ARCHITECTURE.md §3](ARCHITECTURE.md#3-routing-model)). Two trees: the public app
under `<Layout />`, and the RBAC-gated `/admin/*` tree under `<AdminGuard>` + `<AdminLayout>`.

### `index.css`
`@import "tailwindcss";` plus the `@theme` design-token block and base element styles
(scrollbars, body background/color, font stack). This is the single source of truth for the
color system.

---

## Layout & navigation — `components/layout/`

| File | Role |
|---|---|
| `Layout.tsx` | App shell. Holds `searchQuery` state, renders `TopNav`, `SideNav`, `MobileNav`, the `WEChatbot`, `CommunityNexus`, and an `<Outlet />` that receives `{ searchQuery }` as context. |
| `TopNav.tsx` | Header with global search (controlled by `Layout`). |
| `SideNav.tsx` | Desktop primary navigation. |
| `MobileNav.tsx` | Bottom navigation for small viewports. |

Pages read the shared search term with:

```ts
const { searchQuery } = useOutletContext<{ searchQuery: string }>();
```

---

## Pages — `pages/`

Each page is a route target. They compose feature components and hooks; they own only view
state.

| Page | Route | Summary |
|---|---|---|
| `Feed` | `/` | Social feed: filter + compose + post cards. Reads `searchQuery` from outlet. |
| `Jobs` | `/jobs`, `/jobs/new` | Würth jobs board with department/type filters and profile-match scoring. |
| `Bounties` | `/bounties` | Browse open engineering bounties. |
| `PostBounty` | `/bounties/new` | Form to create a bounty. |
| `BountyDetail` | `/bounties/:bountyId` | Single bounty + application/submission flow. |
| `Projects` | `/projects`, `/projects/mine` | Project listing / portfolio. |
| `Profile` | `/profile`, `/profile/:userId` | User profile incl. badges, achievements, GitHub portfolio. |
| `ExecutiveDashboard` | `/analytics` | Executive KPIs and ROI charts. |
| `ChairPortal` | `/chair-portal` | Educator/chair view (materials, initiatives, Q&A). |
| `StudentSandbox` | `/sandbox` | Student workspace. |
| `Leaderboard` | `/leaderboard` | Gamification ranking. |
| `Community` | `/community` | Community groups and events. |
| `NewsDigest` | `/news` | Industry news with upvotes/saves. |
| `Products` | `/products` | Würth product catalog surface. |

### Admin pages — `pages/admin/`
Each ships with a co-located `.css` file and is only reachable through `AdminGuard`.

| Page | Route | Summary |
|---|---|---|
| `AdminDashboard` | `/admin` | Overview / entry point. |
| `AdminAnalytics` | `/admin/analytics` | Platform analytics + ROI. |
| `AdminCompliance` | `/admin/compliance` | GDPR records, retention, audit trails. |
| `AdminOpportunities` | `/admin/opportunities` | Manage hardware bounties + micro-internships. |
| `AdminVerification` | `/admin/verification` | Project/institution verification + audit. |

---

## Feature components — `components/`

### `feed/`
- `ComposeBox` — create a post; calls `onPost`.
- `PostCard` — renders a post with like/share/comment actions.
- `CommentSection` — thread under a post.
- `FeedFilter` — exports `FeedFilterValue`; filters by author role or `all`.
- `LinkPreview` — rich preview for `link`-type posts.

### `github/`
- `GitHubPortfolioWidget` — top-level portfolio container.
- `FeaturedRepositoriesGrid` — repo cards.
- `ActivityMatrix` — contribution heatmap (levels 0–4).
- `CollaborationBadgeSystem` — collaboration metrics → badges.
- `GitHubErrorFallback` — typed error states (`PRIVATE_PROFILE`, `RATE_LIMIT`, `NOT_FOUND`,
  `API_ERROR`, `NO_DATA`).
- `types.ts` — component-local GitHub types.

### `modules/`
Dashboard building blocks: `AnalyticsDashboard`, `BountyExecutor`, `GamificationDashboard`,
`PortfolioDashboard`.

### `community-nexus/`
- `CommunityNexus` — the engagement layer rendered globally by `Layout`, backed by
  `data/nexusData.ts`.

### `chatbot/`
- `WEChatbot` — floating assistant. Searches Würth feed content (`data/weFeed.ts`:
  products, news, events, FAQ, trending tags) and returns inline result cards. Pure
  client-side retrieval today; can be upgraded to a backend/LLM endpoint.

### `admin/`
- `AdminLayout` (+ `.css`) — chrome for the admin subtree (nav + `<Outlet />`).

### `ui/`
- `Avatar`, `RoleBadge` — shared primitives.

---

## Hooks — `hooks/`

### `usePosts()`
Owns the feed. Returns `{ posts, addPost, toggleLike, addComment, incrementShares }`.
Generates client ids, stamps `createdAt`, and attributes authorship to `currentUser`.
Replace the `MOCK_POSTS` seed and each mutation with API calls to wire the backend.

### `useJobFilter(jobs)`
Search + multi-select filtering for the jobs board. Maintains `searchQuery`,
`selectedTypes`, `selectedDepartments` (as `Set`s) and derives `filteredJobs` with
`useMemo`. Exposes `setSearchQuery`, `toggleJobType`, `toggleDepartment`, `clearFilters`.

### `useAdminActions()`
Central admin state machine. Owns `gdprRecords`, `hardwareBounties`, `microInternships`,
`projectValidations`, plus `filters`, `loading`, `error`. Operations include:
- GDPR: `updateGDPRRecordStatus`, `deleteGDPRRecord`
- Hardware bounties: `create/update/delete/publishHardwareBounty`
- Micro-internships: `create/update/delete/publishMicroInternship`
- Validations: `update/approve/reject/requestRevision`
- Filtering: `applyFilters`, `clearFilters`, generic `filterData<T>()`

Each mutation toggles `loading` and surfaces `error`, so it is already shaped for async
backend calls.

---

## Services — `services/`

### `api.ts`
- `loginUser({ email, password })` → `POST {VITE_API_URL}/auth/login`, returns
  `{ role, email?, id? }`; throws `Error` with the server message on failure.
- `checkBackendHealth()` → boolean probe of the health endpoint.
- `API_BASE_URL` resolves from `import.meta.env.VITE_API_URL`, defaulting to
  `http://localhost:3000/api`.

### `githubService.ts`
- `fetchGitHubPortfolio(username, { token, timeout })` — GraphQL query for repos,
  contribution calendar, merged PRs, closed issues; maps to `GitHubPortfolioData`; throws a
  typed `GitHubAnalyticsError`. Uses an `AbortController` timeout (default 30s).
- `fetchCollaborationMetrics(...)` — placeholder for multi-repo collaboration data.
- `validateGitHubUsername(username)` — REST existence check.
- `fetchGitHubUserStats(username)` — REST follower/repo counts.

> Production: proxy these through the backend so the GitHub token is never shipped to the
> client. See [ARCHITECTURE.md §7](ARCHITECTURE.md#7-security-considerations).

---

## Utilities — `utils/`

### `nlpMatcher.ts` — `computeProfileJobMatching(profile, jobs)`
A self-contained TF-IDF + cosine-similarity matcher. Pipeline:
1. Tokenize profile + jobs, removing stop words.
2. Restrict profile vocabulary to terms present in at least one job.
3. Compute document frequency → IDF across profile + all jobs.
4. Build TF-IDF vectors; score each job by `cosineSimilarity × lexicalCoverage`.
5. Scale so the top match presents as ~90%.

Returns per job: `score`, `matchPercentage`, `matchedSkills`, `missingSkills`, and a
human-readable `explanation`. It powers the "match %" on the jobs board and is pure/testable.

### `time.ts`
- `formatRelativeTime(iso)` → `"just now" | "3m" | "2h" | "4d" | "Jun 18"`.
- `formatFullDate(iso)` → long form for tooltips.

---

## Types — `types/`

- `index.ts` — domain contracts: `User`, `Badge`, `Achievement`, `Certificate`, `Post`,
  `Comment`, `Job`, `JobListing`, `Project`, `LectureMaterial`, `StudentInitiative`,
  `QAChannel`, `Deadline`, GitHub portfolio types, `Bounty`, `Community`, `CommunityEvent`,
  `NewsArticle`, `Notification`, `AuthState`, and the enums/unions they use.
- `admin.ts` — admin contracts: `AnalyticsMetric`, `ROIDataPoint`, `GDPRRecord`,
  `AuditEntry`, `HardwareBounty`, `MicroInternship`, `ProjectValidation`,
  `VerificationAuditEntry`, `AdminActivityLog`, `AdminFilters`.

These types are the canonical reference for the JSON shapes the API should return; they line
up with the SQL tables in [DATABASE.md](DATABASE.md).

---

## Data fixtures — `data/`

| File | Feeds |
|---|---|
| `mockData.ts` | Users, posts, projects, leaderboard, helpers like `getUserById`, `MOCK_USERS`, `MOCK_POSTS`. |
| `adminMockData.ts` | `MOCK_GDPR_RECORDS`, `MOCK_HARDWARE_BOUNTIES`, `MOCK_MICRO_INTERNSHIPS`, `MOCK_PROJECT_VALIDATIONS`. |
| `jobsMockData.ts` | Würth job listings. |
| `jobRecommendationsMockData.ts` | Recommendation seeds for matching. |
| `githubMockData.ts` | Portfolio fixtures. |
| `nexusData.ts` | Community Nexus members/threads/announcements. |
| `weFeed.ts` | WE chatbot corpus: products, news, events, FAQ, trending tags + `searchFeed`. |

In production these are replaced by the corresponding API responses; types stay identical.

---

## Design system

All colors come from `@theme` tokens in `index.css`. Use the Tailwind utilities they
generate rather than hard-coded hex values:

| Token | Utility examples |
|---|---|
| Brand red | `bg-accent`, `text-accent`, `hover:bg-accent-hover` |
| Surfaces | `bg-surface-base`, `bg-surface-card`, `bg-surface-elevated` |
| Text | `text-text-primary`, `text-text-muted` |
| Border | `border-border` |
| Status | `text-status-error`, `text-status-success`, `text-status-warn` |

Conventions:
- Dark theme is the baseline (`surface-base` `#141414`).
- Cards use `bg-surface-card` + `border border-border` + `rounded-xl`.
- Keep new colors in `@theme`; do not introduce ad-hoc hex values in components.

---

## How to add a new page

1. Create `pages/MyPage.tsx`.
2. Add a `<Route path="my-page" element={<MyPage />} />` inside the `<Layout />` tree in
   `App.tsx` (or under `<AdminGuard>` for admin-only screens).
3. Add a nav entry in `SideNav` / `MobileNav`.
4. If it needs data, add or extend a hook in `hooks/` that reads a fixture today and a
   service tomorrow — keep the network code in `services/`, never in the component.
5. Type any new shapes in `types/` and mirror them in [API.md](API.md) / [DATABASE.md](DATABASE.md).
