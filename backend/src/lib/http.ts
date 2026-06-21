import type { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Wrap async route handlers so thrown errors hit the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const genId = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const nowIso = () => new Date().toISOString();

/** Simple list helper: filter by ?q=, paginate with ?page= & ?limit=. */
export function paginate<T>(
  items: T[],
  query: Record<string, unknown>,
  searchableFields: (keyof T)[] = [],
) {
  let result = items;
  const q = typeof query.q === 'string' ? query.q.toLowerCase() : '';
  if (q && searchableFields.length) {
    result = result.filter((item) =>
      searchableFields.some((f) => {
        const v = item[f];
        return typeof v === 'string' && v.toLowerCase().includes(q);
      }),
    );
  }
  const total = result.length;
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 50));
  const start = (page - 1) * limit;
  const data = result.slice(start, start + limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}
