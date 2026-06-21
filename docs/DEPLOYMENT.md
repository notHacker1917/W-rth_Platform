# Deployment

How to build, configure, and ship the frontend, plus the operational checklist for going to
production against a live backend.

---

## Prerequisites

- **Node.js 20+** and **npm**.
- A reachable backend exposing the [API](API.md), and a PostgreSQL database initialized from
  [`schema.sql`](DATABASE.md#applying-the-schema).

---

## Environment variables

Vite only exposes variables prefixed with `VITE_` to client code. Define them in
`.env.local` (local), or in your host's environment for CI/CD.

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Recommended | `http://localhost:3000/api` | Base URL of the backend API. Consumed by `services/api.ts`. |

> Never put secrets (GitHub tokens, DB credentials, JWT signing keys) in `VITE_*`
> variables — anything prefixed `VITE_` is shipped to the browser. The GitHub token in
> particular must live only on the backend; see
> [ARCHITECTURE.md §7](ARCHITECTURE.md#7-security-considerations).

Example `.env.production`:
```bash
VITE_API_URL=https://api.wurth-platform.example.com/api
```

---

## Production build

```bash
npm ci            # reproducible install from package-lock.json
npm run build     # tsc -b (type-check) then vite build → dist/
npm run preview   # optional: serve dist/ locally to verify
```

`npm run build` fails on type errors (it runs `tsc -b` first), so a green build is a
type-clean build. The output is a static bundle in `dist/`.

---

## Hosting the static bundle

The app is a static SPA; serve `dist/` from any static host or CDN (Netlify, Vercel,
Cloudflare Pages, S3 + CloudFront, Nginx, etc.).

**SPA fallback is required.** Because routing uses `BrowserRouter`, all unknown paths must
serve `index.html` so client-side routing can take over.

Nginx example:
```nginx
server {
  listen 80;
  root /var/www/wurth/dist;
  index index.html;

  # Cache hashed assets aggressively
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Do not cache the service worker
  location = /sw.js {
    add_header Cache-Control "no-cache";
  }
}
```

Static-host redirect rules (e.g. Netlify `_redirects`):
```
/*    /index.html   200
```

---

## PWA / service worker notes

- `public/sw.js` is registered in `main.tsx`. Serve it with `Cache-Control: no-cache` so
  clients pick up new versions promptly.
- `public/manifest.json` defines the installable app (name, theme `#851a1a`, background
  `#141414`). Update icons before release — the manifest references `/favicon.ico`.
- Test installability and offline behavior after each deploy; a stale SW is the most common
  PWA deployment bug.

---

## CORS & API connectivity

The browser calls `VITE_API_URL` directly, so the backend must allow the frontend origin:

```
Access-Control-Allow-Origin: https://app.wurth-platform.example.com
Access-Control-Allow-Credentials: true   # if using cookie sessions
```

If you use cookie-based sessions, also send credentials from the client (`fetch(..., {
credentials: 'include' })`) — note the current `services/api.ts` does not yet set this, so
add it when switching to cookie auth.

---

## Pre-production checklist

**Wiring**
- [ ] Replace mock data reads in hooks/pages with [API](API.md) calls.
- [ ] Swap `AuthContext` `localStorage` bootstrap for `GET /auth/me` + cookie session.
- [ ] Proxy all GitHub calls through the backend (`GET /portfolio/:username`); remove any
      client-side GitHub token usage.

**Security**
- [ ] Enforce `corporate_admin` server-side on every `/admin/**` endpoint.
- [ ] Validate all write payloads server-side (posts, bounties, admin forms).
- [ ] Set security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy).
- [ ] Serve over HTTPS only.

**Data / compliance**
- [ ] Initialize PostgreSQL from `schema.sql`; verify `pgcrypto` is enabled.
- [ ] Confirm GDPR retention jobs honor `gdpr_records.retention_period`.
- [ ] Ensure every admin mutation writes to `admin_activity_logs`.

**Build / ops**
- [ ] `npm run lint` and `npm run build` pass in CI.
- [ ] SPA fallback configured on the host.
- [ ] Service worker served with `no-cache`.
- [ ] Error monitoring + uptime checks on the backend `GET /health`.

---

## Suggested CI pipeline

```yaml
# .github/workflows/ci.yml (illustrative)
name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: { name: dist, path: dist }
```

Deploy the `dist` artifact to your static host on merges to the main branch.
