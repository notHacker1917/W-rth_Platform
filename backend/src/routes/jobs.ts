import { Router } from 'express';
import { z } from 'zod';
import { db, store } from '../lib/store.js';
import { asyncHandler, ApiError, genId, nowIso, paginate } from '../lib/http.js';
import { requireAuth } from '../middleware/index.js';

export const jobsRouter = Router();

jobsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    let jobs = db().jobs;
    if (typeof req.query.type === 'string') jobs = jobs.filter((j) => j.type === req.query.type);
    if (typeof req.query.companyId === 'string') jobs = jobs.filter((j) => j.companyId === req.query.companyId);
    res.json(paginate(jobs, req.query as any, ['title', 'location', 'description']));
  }),
);

jobsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const job = db().jobs.find((j) => j.id === req.params.id);
    if (!job) throw new ApiError(404, 'Job not found');
    res.json(job);
  }),
);

const createJobSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  type: z.enum(['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote']),
  salary: z.string().optional(),
  description: z.string().min(1),
  requirements: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

jobsRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = createJobSchema.parse(req.body);
    const job = {
      id: genId('j'),
      companyId: req.user!.sub,
      ...input,
      postedAt: nowIso(),
      applicationCount: 0,
      appliedBy: [] as string[],
    };
    db().jobs.unshift(job);
    store.save();
    res.status(201).json(job);
  }),
);

jobsRouter.post(
  '/:id/apply',
  requireAuth,
  asyncHandler(async (req, res) => {
    const job = db().jobs.find((j) => j.id === req.params.id);
    if (!job) throw new ApiError(404, 'Job not found');
    const uid = req.user!.sub;
    job.appliedBy = job.appliedBy ?? [];
    if (!job.appliedBy.includes(uid)) {
      job.appliedBy.push(uid);
      job.applicationCount = job.appliedBy.length;
      store.save();
    }
    res.json({ applied: true, applicationCount: job.applicationCount });
  }),
);

// ─── Würth-specific job listings (read-only catalogue) ──────────────────────
export const jobListingsRouter = Router();

jobListingsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    let listings = db().jobListings;
    if (typeof req.query.department === 'string')
      listings = listings.filter((l) => l.department === req.query.department);
    if (typeof req.query.type === 'string')
      listings = listings.filter((l) => l.type === req.query.type);
    res.json(paginate(listings, req.query as any, ['title', 'location', 'description']));
  }),
);

jobListingsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const listing = db().jobListings.find((l) => l.id === req.params.id);
    if (!listing) throw new ApiError(404, 'Job listing not found');
    res.json(listing);
  }),
);

// ─── Bounties ───────────────────────────────────────────────────────────────
export const bountiesRouter = Router();

bountiesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    let bounties = db().bounties;
    if (typeof req.query.status === 'string')
      bounties = bounties.filter((b) => b.status === req.query.status);
    res.json(paginate(bounties, req.query as any, ['title', 'description']));
  }),
);

bountiesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const bounty = db().bounties.find((b) => b.id === req.params.id);
    if (!bounty) throw new ApiError(404, 'Bounty not found');
    res.json(bounty);
  }),
);

bountiesRouter.post(
  '/:id/apply',
  requireAuth,
  asyncHandler(async (req, res) => {
    const bounty = db().bounties.find((b) => b.id === req.params.id);
    if (!bounty) throw new ApiError(404, 'Bounty not found');
    const uid = req.user!.sub;
    bounty.appliedBy = bounty.appliedBy ?? [];
    if (!bounty.appliedBy.includes(uid)) {
      bounty.appliedBy.push(uid);
      bounty.applicationCount = bounty.appliedBy.length;
      store.save();
    }
    res.json({ applied: true, applicationCount: bounty.applicationCount });
  }),
);
