import 'dotenv/config';
import { join } from 'node:path';

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: num(process.env.PORT, 3000),
  // The frontend defaults to http://localhost:3000/api, so /api is the prefix
  // and /health sits at the root. Keep these in sync with the frontend.
  apiPrefix: process.env.API_PREFIX ?? '/api',

  jwtSecret: process.env.JWT_SECRET ?? 'dev-only-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',

  // Comma-separated list of allowed origins. '*' allows all (dev default).
  corsOrigins: (process.env.CORS_ORIGINS ?? '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  // Where seed.json lives and where the mutable db.json is written.
  dataDir: process.env.DATA_DIR ?? join(process.cwd(), 'data'),

  // Default password applied to every seeded demo user (so the existing
  // mock accounts can log in immediately). Override in production.
  seedPassword: process.env.SEED_PASSWORD ?? 'wurth1234',

  rateLimitWindowMs: num(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: num(process.env.RATE_LIMIT_MAX, 1000),
};

export const isProd = config.env === 'production';
