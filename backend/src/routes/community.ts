import { Router } from 'express';
import { db, store } from '../lib/store.js';
import { asyncHandler, ApiError, paginate } from '../lib/http.js';
import { requireAuth } from '../middleware/index.js';

// ─── Communities ────────────────────────────────────────────────────────────
export const communitiesRouter = Router();

communitiesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    let communities = db().communities;
    if (typeof req.query.category === 'string')
      communities = communities.filter((c) => c.category === req.query.category);
    res.json(paginate(communities, req.query as any, ['name', 'description']));
  }),
);

communitiesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const c = db().communities.find((x) => x.id === req.params.id);
    if (!c) throw new ApiError(404, 'Community not found');
    res.json(c);
  }),
);

communitiesRouter.post(
  '/:id/join',
  requireAuth,
  asyncHandler(async (req, res) => {
    const c = db().communities.find((x) => x.id === req.params.id);
    if (!c) throw new ApiError(404, 'Community not found');
    c.members = c.members ?? [];
    const uid = req.user!.sub;
    const joined = !c.members.includes(uid);
    if (joined) {
      c.members.push(uid);
      c.memberCount = (c.memberCount ?? 0) + 1;
    } else {
      c.members = c.members.filter((m: string) => m !== uid);
      c.memberCount = Math.max(0, (c.memberCount ?? 1) - 1);
    }
    c.isJoined = joined;
    store.save();
    res.json({ isJoined: joined, memberCount: c.memberCount });
  }),
);

// ─── Events ─────────────────────────────────────────────────────────────────
export const eventsRouter = Router();

eventsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    let events = db().events;
    if (typeof req.query.communityId === 'string')
      events = events.filter((e) => e.communityId === req.query.communityId);
    if (typeof req.query.type === 'string') events = events.filter((e) => e.type === req.query.type);
    res.json(paginate(events, req.query as any, ['title', 'description', 'location']));
  }),
);

eventsRouter.post(
  '/:id/register',
  requireAuth,
  asyncHandler(async (req, res) => {
    const e = db().events.find((x) => x.id === req.params.id);
    if (!e) throw new ApiError(404, 'Event not found');
    e.attendees = e.attendees ?? [];
    const uid = req.user!.sub;
    const registered = !e.attendees.includes(uid);
    if (registered) {
      if (e.maxAttendees && e.attendeeCount >= e.maxAttendees)
        throw new ApiError(409, 'Event is full');
      e.attendees.push(uid);
      e.attendeeCount = (e.attendeeCount ?? 0) + 1;
    } else {
      e.attendees = e.attendees.filter((a: string) => a !== uid);
      e.attendeeCount = Math.max(0, (e.attendeeCount ?? 1) - 1);
    }
    e.isRegistered = registered;
    store.save();
    res.json({ isRegistered: registered, attendeeCount: e.attendeeCount });
  }),
);

// ─── News ───────────────────────────────────────────────────────────────────
export const newsRouter = Router();

newsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    let news = db().news;
    if (typeof req.query.category === 'string')
      news = news.filter((n) => n.category === req.query.category);
    const sorted = [...news].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    res.json(paginate(sorted, req.query as any, ['title', 'summary', 'source']));
  }),
);

newsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const n = db().news.find((x) => x.id === req.params.id);
    if (!n) throw new ApiError(404, 'Article not found');
    res.json(n);
  }),
);

newsRouter.post(
  '/:id/upvote',
  requireAuth,
  asyncHandler(async (req, res) => {
    const n = db().news.find((x) => x.id === req.params.id);
    if (!n) throw new ApiError(404, 'Article not found');
    n.upvotedBy = n.upvotedBy ?? [];
    const uid = req.user!.sub;
    const i = n.upvotedBy.indexOf(uid);
    if (i === -1) n.upvotedBy.push(uid);
    else n.upvotedBy.splice(i, 1);
    n.upvotes = n.upvotedBy.length;
    store.save();
    res.json({ upvotes: n.upvotes, upvoted: i === -1 });
  }),
);

newsRouter.post(
  '/:id/save',
  requireAuth,
  asyncHandler(async (req, res) => {
    const n = db().news.find((x) => x.id === req.params.id);
    if (!n) throw new ApiError(404, 'Article not found');
    n.saved = !n.saved;
    store.save();
    res.json({ saved: n.saved });
  }),
);
