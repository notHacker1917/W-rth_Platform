import { Router } from 'express';
import { db, store } from '../lib/store.js';
import { publicUser } from '../lib/auth.js';
import { asyncHandler, ApiError, paginate } from '../lib/http.js';
import { requireAuth } from '../middleware/index.js';

export const usersRouter = Router();

usersRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    let users = db().users;
    if (typeof req.query.role === 'string') {
      users = users.filter((u) => u.role === req.query.role);
    }
    const result = paginate(users.map(publicUser) as any[], req.query as any, ['name', 'headline', 'location']);
    res.json(result);
  }),
);

usersRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const user = db().users.find((u) => u.id === req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    res.json(publicUser(user));
  }),
);

usersRouter.patch(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (req.user!.sub !== req.params.id && req.user!.role !== 'corporate_admin') {
      throw new ApiError(403, 'You can only edit your own profile');
    }
    const user = db().users.find((u) => u.id === req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    // Whitelist editable fields; never allow id/email/passwordHash/role change here.
    const editable = ['name', 'avatarUrl', 'headline', 'location', 'bio', 'university',
      'graduationYear', 'skills', 'industry', 'size', 'website', 'interests'];
    for (const key of editable) {
      if (key in req.body) (user as any)[key] = req.body[key];
    }
    store.save();
    res.json(publicUser(user));
  }),
);

usersRouter.get(
  '/:id/badges',
  asyncHandler(async (req, res) => {
    const user = db().users.find((u) => u.id === req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    res.json((user as any).badges ?? []);
  }),
);

usersRouter.get(
  '/:id/achievements',
  asyncHandler(async (req, res) => {
    const user = db().users.find((u) => u.id === req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    res.json((user as any).achievements ?? []);
  }),
);

usersRouter.get(
  '/:id/certificates',
  asyncHandler(async (req, res) => {
    const user = db().users.find((u) => u.id === req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    res.json((user as any).certificates ?? []);
  }),
);
