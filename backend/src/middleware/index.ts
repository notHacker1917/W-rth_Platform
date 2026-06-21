import type { Request, Response, NextFunction } from 'express';
import { verifyToken, type JwtPayload } from '../lib/auth.js';
import { ApiError } from '../lib/http.js';
import { isProd } from '../lib/config.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return null;
}

/** Reject the request unless a valid Bearer token is present. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next(new ApiError(401, 'Authentication required'));
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

/** Attach req.user if a token is present, but never reject. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      /* ignore */
    }
  }
  next();
}

/** Require one of the given roles (use after requireAuth). */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'));
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }
    next();
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof ApiError ? err.status : 500;
  const message =
    err instanceof Error ? err.message : 'Internal server error';
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: { message, status },
    ...(isProd ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: { message: 'Route not found', status: 404 } });
}
