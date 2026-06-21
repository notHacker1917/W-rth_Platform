import { Router } from 'express';
import { z } from 'zod';
import { db, store } from '../lib/store.js';
import { asyncHandler, ApiError, genId, nowIso, paginate } from '../lib/http.js';
import { requireAuth, optionalAuth } from '../middleware/index.js';

export const postsRouter = Router();

postsRouter.get(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const sorted = [...db().posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    res.json(paginate(sorted, req.query as any, ['content']));
  }),
);

postsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const post = db().posts.find((p) => p.id === req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');
    res.json(post);
  }),
);

const createPostSchema = z.object({
  type: z.enum(['text', 'image', 'link']).default('text'),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
  linkPreview: z.any().optional(),
  tags: z.array(z.string()).optional(),
});

postsRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = createPostSchema.parse(req.body);
    const post = {
      id: genId('p'),
      authorId: req.user!.sub,
      type: input.type,
      content: input.content,
      imageUrl: input.imageUrl,
      linkPreview: input.linkPreview,
      likes: 0,
      likedBy: [] as string[],
      comments: [] as any[],
      shares: 0,
      createdAt: nowIso(),
      tags: input.tags ?? [],
    };
    db().posts.unshift(post);
    store.save();
    res.status(201).json(post);
  }),
);

postsRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const idx = db().posts.findIndex((p) => p.id === req.params.id);
    if (idx === -1) throw new ApiError(404, 'Post not found');
    const post = db().posts[idx];
    if (post.authorId !== req.user!.sub && req.user!.role !== 'corporate_admin') {
      throw new ApiError(403, 'You can only delete your own posts');
    }
    db().posts.splice(idx, 1);
    store.save();
    res.json({ success: true });
  }),
);

/** Toggle like for the current user. */
postsRouter.post(
  '/:id/like',
  requireAuth,
  asyncHandler(async (req, res) => {
    const post = db().posts.find((p) => p.id === req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');
    const uid = req.user!.sub;
    post.likedBy = post.likedBy ?? [];
    const i = post.likedBy.indexOf(uid);
    if (i === -1) {
      post.likedBy.push(uid);
    } else {
      post.likedBy.splice(i, 1);
    }
    post.likes = post.likedBy.length;
    store.save();
    res.json({ likes: post.likes, liked: i === -1 });
  }),
);

postsRouter.post(
  '/:id/comments',
  requireAuth,
  asyncHandler(async (req, res) => {
    const post = db().posts.find((p) => p.id === req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');
    const content = z.string().min(1).parse(req.body?.content);
    const comment = {
      id: genId('c'),
      authorId: req.user!.sub,
      content,
      createdAt: nowIso(),
      likes: 0,
    };
    post.comments = post.comments ?? [];
    post.comments.push(comment);
    store.save();
    res.status(201).json(comment);
  }),
);

postsRouter.post(
  '/:id/share',
  requireAuth,
  asyncHandler(async (req, res) => {
    const post = db().posts.find((p) => p.id === req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');
    post.shares = (post.shares ?? 0) + 1;
    store.save();
    res.json({ shares: post.shares });
  }),
);
