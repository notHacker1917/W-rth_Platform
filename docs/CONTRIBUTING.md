# Contributing

Conventions and workflow for working in this codebase.

---

## Getting set up

```bash
npm install
npm run dev      # http://localhost:5173
```

Before opening a PR:

```bash
npm run lint     # ESLint must pass
npm run build    # tsc -b + vite build must pass (type errors fail the build)
```

---

## Project conventions

**TypeScript is strict.** `tsconfig.app.json` enables `noUnusedLocals`,
`noUnusedParameters`, `noFallthroughCasesInSwitch`, and `verbatimModuleSyntax`. Notable
consequences:

- Use type-only imports for types: `import type { User } from '../types';`.
- Remove unused locals/params or prefix with `_`.
- Module resolution is `bundler` with `allowImportingTsExtensions` — keep relative imports
  consistent with the existing files.

**Layering (enforced by convention, see [ARCHITECTURE.md](ARCHITECTURE.md)):**

- Network I/O lives in `services/` only. Components and pages never call `fetch` directly.
- Stateful domain logic lives in `hooks/`. Pages compose hooks + components.
- Pure functions live in `utils/` and should be unit-testable in isolation.
- Shared shapes live in `types/`. Add a type there before using it across files.

**Styling:**

- Use Tailwind utilities backed by the `@theme` tokens in `index.css`
  (`bg-surface-card`, `text-text-muted`, `bg-accent`, …).
- Do not hard-code hex colors in components; add new colors to `@theme` instead.
- Admin pages use co-located `.css` files (`pages/admin/*.css`) — follow that pattern there.

**Naming:**

- Components and pages: PascalCase files (`PostCard.tsx`, `BountyDetail.tsx`).
- Hooks: `useX.ts`. Utilities and services: camelCase files.
- Mock fixtures live in `data/` and are exported as `MOCK_*` constants.

---

## Common tasks

### Add a route/page
See [FRONTEND.md → How to add a new page](FRONTEND.md#how-to-add-a-new-page).

### Add a backend-backed feature
1. Define the request/response shape in `types/` and mirror it in
   [API.md](API.md) + [DATABASE.md](DATABASE.md).
2. Add the network call to `services/`.
3. Expose state + mutations through a hook in `hooks/` (read a fixture first if the endpoint
   isn't ready, so the UI can be built in parallel).
4. Build presentational components that take data + callbacks as props.

### Add an admin screen
1. Create `pages/admin/MyScreen.tsx` (+ `MyScreen.css`).
2. Add a nested route under the `<AdminGuard>` tree in `App.tsx`.
3. Use `useAdminActions()` (or extend it) for state.
4. Ensure the corresponding API route enforces `corporate_admin` and logs to
   `admin_activity_logs`.

---

## Commit & PR guidelines

- Keep PRs focused; one feature or fix per PR.
- Write imperative commit subjects (`Add bounty application flow`).
- A PR should pass `lint` and `build`, update relevant docs in `docs/`, and avoid
  introducing client-side secrets.
- When you change a domain shape, update `types/`, [API.md](API.md), and
  [DATABASE.md](DATABASE.md) together so the three stay in sync.

---

## Testing

No test framework is configured in this repository yet. When adding one:

- `utils/nlpMatcher.ts` and `utils/time.ts` are pure and the natural first targets.
- Hooks (`usePosts`, `useJobFilter`, `useAdminActions`) can be tested with React Testing
  Library + a hooks renderer.
- Wire `npm test` into the CI pipeline alongside `lint` and `build`.
