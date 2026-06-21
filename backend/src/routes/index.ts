import { Router } from 'express';
import { store } from '../lib/store.js';
import { isProd } from '../lib/config.js';
import { asyncHandler } from '../lib/http.js';
import { authRouter } from './auth.js';
import { usersRouter } from './users.js';
import { postsRouter } from './posts.js';
import { jobsRouter, jobListingsRouter, bountiesRouter } from './jobs.js';
import { communitiesRouter, eventsRouter, newsRouter } from './community.js';
import {
  projectsRouter,
  lectureMaterialsRouter,
  initiativesRouter,
  qaChannelsRouter,
  deadlinesRouter,
  weFeedRouter,
  nexusRouter,
  githubRouter,
} from './content.js';
import { adminRouter } from './admin.js';
import { requireAuth, requireRole } from '../middleware/index.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
apiRouter.use('/jobs', jobsRouter);
apiRouter.use('/job-listings', jobListingsRouter);
apiRouter.use('/bounties', bountiesRouter);
apiRouter.use('/projects', projectsRouter);
apiRouter.use('/communities', communitiesRouter);
apiRouter.use('/events', eventsRouter);
apiRouter.use('/news', newsRouter);
apiRouter.use('/lecture-materials', lectureMaterialsRouter);
apiRouter.use('/initiatives', initiativesRouter);
apiRouter.use('/qa-channels', qaChannelsRouter);
apiRouter.use('/deadlines', deadlinesRouter);
apiRouter.use('/we-feed', weFeedRouter);
apiRouter.use('/nexus', nexusRouter);
apiRouter.use('/github', githubRouter);
apiRouter.use('/admin', adminRouter);

// Convenience: list of mounted endpoints for quick discovery.
apiRouter.get('/', (_req, res) => {
  res.json({
    name: 'Würth Platform API',
    version: '1.0.0',
    endpoints: [
      'POST   /api/auth/login',
      'POST   /api/auth/register',
      'GET    /api/auth/me',
      'GET    /api/users',
      'GET    /api/posts',
      'POST   /api/posts',
      'GET    /api/jobs',
      'GET    /api/job-listings',
      'GET    /api/bounties',
      'GET    /api/projects',
      'GET    /api/communities',
      'GET    /api/events',
      'GET    /api/news',
      'GET    /api/lecture-materials',
      'GET    /api/initiatives',
      'GET    /api/qa-channels',
      'GET    /api/deadlines',
      'GET    /api/we-feed',
      'GET    /api/nexus/members',
      'GET    /api/github/:username/portfolio',
      'GET    /api/admin/* (corporate_admin only)',
    ],
  });
});

// Dev/demo utility: reset the DB back to seed state (admin only outside dev).
const resetGuards = isProd ? [requireAuth, requireRole('corporate_admin')] : [];
apiRouter.post(
  '/admin-tools/reset',
  ...resetGuards,
  asyncHandler(async (_req, res) => {
    store.reset();
    res.json({ success: true, message: 'Database reset to seed state' });
  }),
);
