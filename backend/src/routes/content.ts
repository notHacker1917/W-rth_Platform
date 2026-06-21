import { Router } from 'express';
import { z } from 'zod';
import { db, store } from '../lib/store.js';
import { asyncHandler, ApiError, genId, nowIso, paginate } from '../lib/http.js';
import { requireAuth } from '../middleware/index.js';

// ─── Projects ───────────────────────────────────────────────────────────────
export const projectsRouter = Router();

projectsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(paginate(db().projects, req.query as any, ['title', 'description']));
  }),
);

projectsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const p = db().projects.find((x) => x.id === req.params.id);
    if (!p) throw new ApiError(404, 'Project not found');
    res.json(p);
  }),
);

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  liveUrl: z.string().optional(),
});

projectsRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = createProjectSchema.parse(req.body);
    const project = {
      id: genId('proj'),
      authorId: req.user!.sub,
      ...input,
      createdAt: nowIso(),
      likes: 0,
      likedBy: [] as string[],
    };
    db().projects.unshift(project);
    store.save();
    res.status(201).json(project);
  }),
);

projectsRouter.post(
  '/:id/like',
  requireAuth,
  asyncHandler(async (req, res) => {
    const p = db().projects.find((x) => x.id === req.params.id);
    if (!p) throw new ApiError(404, 'Project not found');
    p.likedBy = p.likedBy ?? [];
    const uid = req.user!.sub;
    const i = p.likedBy.indexOf(uid);
    if (i === -1) p.likedBy.push(uid);
    else p.likedBy.splice(i, 1);
    p.likes = p.likedBy.length;
    store.save();
    res.json({ likes: p.likes, liked: i === -1 });
  }),
);

// ─── Read-only catalogues ───────────────────────────────────────────────────
function readOnlyList(getItems: () => any[], searchable: string[]) {
  const router = Router();
  router.get(
    '/',
    asyncHandler(async (req, res) => {
      res.json(paginate(getItems(), req.query as any, searchable as any));
    }),
  );
  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const item = getItems().find((x) => x.id === req.params.id);
      if (!item) throw new ApiError(404, 'Not found');
      res.json(item);
    }),
  );
  return router;
}

export const lectureMaterialsRouter = readOnlyList(() => db().lectureMaterials, ['title', 'course']);
export const initiativesRouter = readOnlyList(() => db().initiatives, ['teamName', 'projectTitle']);
export const qaChannelsRouter = readOnlyList(() => db().qaChannels, ['topic', 'course']);
export const deadlinesRouter = readOnlyList(() => db().deadlines, ['title', 'course']);
export const weFeedRouter = readOnlyList(() => db().weFeed, ['title', 'summary']);

// ─── Community Nexus ────────────────────────────────────────────────────────
export const nexusRouter = Router();
nexusRouter.get('/members', asyncHandler(async (_req, res) => res.json(db().nexus.members)));
nexusRouter.get('/threads', asyncHandler(async (_req, res) => res.json(db().nexus.threads)));
nexusRouter.get('/announcements', asyncHandler(async (_req, res) => res.json(db().nexus.announcements)));

// ─── GitHub portfolio analytics ─────────────────────────────────────────────
export const githubRouter = Router();
githubRouter.get(
  '/:username/portfolio',
  asyncHandler(async (req, res) => {
    const key = req.params.username.toLowerCase();
    const portfolio = db().githubPortfolios[key];
    if (!portfolio) {
      // Mirror the frontend's typed error contract.
      throw new ApiError(404, `No GitHub portfolio data for "${req.params.username}"`);
    }
    res.json(portfolio);
  }),
);
