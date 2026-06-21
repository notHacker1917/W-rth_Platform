import { Router } from 'express';
import { z } from 'zod';
import { db, store, type StoredUser } from '../lib/store.js';
import { signToken, comparePassword, hashPassword, publicUser } from '../lib/auth.js';
import { asyncHandler, ApiError, genId, nowIso } from '../lib/http.js';
import { requireAuth } from '../middleware/index.js';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().min(1, 'email is required'),
  password: z.string().min(1, 'password is required'),
});

/**
 * POST /api/auth/login
 * Matches the frontend `LoginResponse` contract: { role, email, id }.
 * A JWT is also returned as `token` for authenticated routes. The frontend
 * accepts login by email; the seeded demo accounts also accept their id
 * (e.g. "u1") as the email field for convenience.
 */
authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const identifier = email.toLowerCase();
    const user = db().users.find(
      (u) => u.email.toLowerCase() === identifier || u.id.toLowerCase() === identifier,
    );
    if (!user || !comparePassword(password, user.passwordHash)) {
      throw new ApiError(401, 'Invalid email or password');
    }
    const token = signToken(user);
    res.json({ id: user.id, email: user.email, role: user.role, token, user: publicUser(user) });
  }),
);

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'password must be at least 6 characters'),
  name: z.string().min(1),
  role: z.enum(['student', 'company', 'educator', 'corporate_admin']).default('student'),
});

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);
    const email = input.email.toLowerCase();
    if (db().users.some((u) => u.email.toLowerCase() === email)) {
      throw new ApiError(409, 'An account with that email already exists');
    }
    const user: StoredUser = {
      id: genId('u'),
      email,
      passwordHash: hashPassword(input.password),
      role: input.role,
      name: input.name,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(input.name)}`,
      headline: '',
      location: '',
      bio: '',
      followersCount: 0,
      followingCount: 0,
      joinedAt: nowIso(),
      points: 0,
      badges: [],
      achievements: [],
      certificates: [],
      interests: [],
    };
    db().users.push(user);
    store.save();
    const token = signToken(user);
    res.status(201).json({ id: user.id, email: user.email, role: user.role, token, user: publicUser(user) });
  }),
);

/** GET /api/auth/me — current authenticated user. */
authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = db().users.find((u) => u.id === req.user!.sub);
    if (!user) throw new ApiError(404, 'User not found');
    res.json(publicUser(user));
  }),
);

/** POST /api/auth/logout — stateless JWT, so this is a client-side no-op. */
authRouter.post('/logout', (_req, res) => {
  res.json({ success: true });
});
