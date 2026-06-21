import { Router } from 'express';
import { z } from 'zod';
import { db, store } from '../lib/store.js';
import { asyncHandler, ApiError, genId, nowIso, paginate } from '../lib/http.js';
import { requireAuth, requireRole } from '../middleware/index.js';

export const adminRouter = Router();

// All admin routes require an authenticated corporate_admin.
adminRouter.use(requireAuth, requireRole('corporate_admin'));

adminRouter.get('/analytics/metrics', asyncHandler(async (_req, res) => res.json(db().admin.analyticsMetrics)));
adminRouter.get('/analytics/roi', asyncHandler(async (_req, res) => res.json(db().admin.roiData)));

adminRouter.get(
  '/gdpr',
  asyncHandler(async (req, res) => {
    let records = db().admin.gdprRecords;
    if (typeof req.query.status === 'string')
      records = records.filter((r) => r.status === req.query.status);
    res.json(paginate(records, req.query as any, ['userName', 'userEmail']));
  }),
);

adminRouter.patch(
  '/gdpr/:id',
  asyncHandler(async (req, res) => {
    const record = db().admin.gdprRecords.find((r) => r.id === req.params.id);
    if (!record) throw new ApiError(404, 'GDPR record not found');
    const status = z.enum(['active', 'deleted', 'archived', 'pending-deletion']).parse(req.body?.status);
    record.status = status;
    record.modifiedAt = nowIso();
    record.auditTrail = record.auditTrail ?? [];
    record.auditTrail.push({
      id: genId('audit'),
      action: `status changed to ${status}`,
      actor: req.user!.email,
      timestamp: nowIso(),
      details: req.body?.details ?? '',
    });
    store.save();
    res.json(record);
  }),
);

// ─── Hardware bounties (admin-managed) ──────────────────────────────────────
adminRouter.get(
  '/bounties',
  asyncHandler(async (req, res) => {
    res.json(paginate(db().admin.hardwareBounties, req.query as any, ['title', 'category']));
  }),
);

const hwBountySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  value: z.number(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  deadline: z.string(),
});

adminRouter.post(
  '/bounties',
  asyncHandler(async (req, res) => {
    const input = hwBountySchema.parse(req.body);
    const bounty = {
      id: genId('hwb'),
      ...input,
      applicants: 0,
      createdAt: nowIso(),
      createdBy: req.user!.email,
    };
    db().admin.hardwareBounties.unshift(bounty);
    store.save();
    res.status(201).json(bounty);
  }),
);

adminRouter.patch(
  '/bounties/:id',
  asyncHandler(async (req, res) => {
    const bounty = db().admin.hardwareBounties.find((b) => b.id === req.params.id);
    if (!bounty) throw new ApiError(404, 'Bounty not found');
    Object.assign(bounty, hwBountySchema.partial().parse(req.body));
    store.save();
    res.json(bounty);
  }),
);

adminRouter.delete(
  '/bounties/:id',
  asyncHandler(async (req, res) => {
    const list = db().admin.hardwareBounties;
    const idx = list.findIndex((b) => b.id === req.params.id);
    if (idx === -1) throw new ApiError(404, 'Bounty not found');
    list.splice(idx, 1);
    store.save();
    res.json({ success: true });
  }),
);

// ─── Micro-internships ──────────────────────────────────────────────────────
adminRouter.get(
  '/internships',
  asyncHandler(async (req, res) => {
    res.json(paginate(db().admin.microInternships, req.query as any, ['title', 'company']));
  }),
);

// ─── Project validations ────────────────────────────────────────────────────
adminRouter.get(
  '/validations',
  asyncHandler(async (req, res) => {
    let v = db().admin.projectValidations;
    if (typeof req.query.status === 'string') v = v.filter((x) => x.status === req.query.status);
    res.json(paginate(v, req.query as any, ['projectTitle', 'authorName']));
  }),
);

adminRouter.patch(
  '/validations/:id',
  asyncHandler(async (req, res) => {
    const v = db().admin.projectValidations.find((x) => x.id === req.params.id);
    if (!v) throw new ApiError(404, 'Validation not found');
    const body = z
      .object({
        status: z.enum(['pending', 'approved', 'rejected', 'needs-revision']).optional(),
        validationNotes: z.string().optional(),
      })
      .parse(req.body);
    if (body.status) {
      v.status = body.status;
      v.validatedAt = nowIso();
      v.validatedBy = req.user!.email;
    }
    if (body.validationNotes !== undefined) v.validationNotes = body.validationNotes;
    store.save();
    res.json(v);
  }),
);

adminRouter.get('/verification-audit', asyncHandler(async (_req, res) => res.json(db().admin.verificationAudit)));
adminRouter.get('/activity-log', asyncHandler(async (req, res) =>
  res.json(paginate(db().admin.activityLogs, req.query as any, ['adminName', 'action'])),
));
