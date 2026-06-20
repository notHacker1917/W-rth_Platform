import type { NextApiRequest, NextApiResponse } from 'next';

// ═══════════════════════════════════════════════════════════════════════════════
// RBAC (Role-Based Access Control) Middleware
// ═══════════════════════════════════════════════════════════════════════════════

export type UserRole = 'sys_admin' | 'wurth_employee' | 'student';

/**
 * Middleware to extract and validate user role from request
 * In production, validate JWT token and extract claims
 */
export function extractUserRole(req: NextApiRequest): UserRole | null {
  const role = req.headers['x-user-role'] as string;
  
  if (!['sys_admin', 'wurth_employee', 'student'].includes(role)) {
    return null;
  }
  
  return role as UserRole;
}

/**
 * Extract user ID from request (from JWT or session)
 */
export function extractUserId(req: NextApiRequest): number | null {
  const userId = req.headers['x-user-id'] as string;
  const parsed = parseInt(userId, 10);
  
  return isNaN(parsed) ? null : parsed;
}

/**
 * RBAC permission model
 * Define which roles can perform which actions
 */
export const permissions = {
  // MODULE 1: Empirical Telemetry
  'telemetry:write': ['student'], // Students can write their own telemetry
  'telemetry:read_own': ['student'], // Students can read their own data
  'telemetry:read_all': ['sys_admin', 'wurth_employee'], // Admins can read all
  'portfolio:publish': ['student'],
  'portfolio:read_all': ['sys_admin', 'wurth_employee'],
  
  // MODULE 2: Sandbox Bounties
  'bounty:create': ['sys_admin', 'wurth_employee'], // Only admins/mentors create
  'bounty:execute': ['student'],
  'bounty:verify': ['sys_admin', 'wurth_employee'], // Only admins can verify submissions
  'sandbox:access': ['student'],
  'rewards:issue': ['sys_admin'],
  
  // MODULE 3: Feeds & Gamification
  'feed:read': ['student', 'wurth_employee', 'sys_admin'],
  'feed:write': ['student', 'wurth_employee'],
  'qr_validation:scan': ['student'],
  'badges:view': ['student', 'wurth_employee', 'sys_admin'],
  
  // MODULE 4: Analytics
  'analytics:read': ['sys_admin'],
  'analytics:export': ['sys_admin'],
  'content_moderation:review': ['sys_admin'],
  'graph:query': ['sys_admin', 'wurth_employee'],
} as const;

/**
 * Higher-order function to protect API endpoints with RBAC
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const role = extractUserRole(req);
      const userId = extractUserId(req);
      
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Role, X-User-ID');
      
      // Handle preflight
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
      
      // Validate authentication
      if (!role || !userId) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Missing or invalid user credentials'
        });
      }
      
      // Validate authorization
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: `This endpoint requires one of: ${allowedRoles.join(', ')}`
        });
      }
      
      // Attach to request for use in handler
      (req as any).userId = userId;
      (req as any).userRole = role;
      
      try {
        await handler(req, res);
      } catch (error) {
        console.error('API error:', error);
        res.status(500).json({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };
  };
}

/**
 * Utility: Check if user can access a specific resource
 */
export function canAccessResource(
  userRole: UserRole,
  userId: number,
  resourceOwnerId: number,
  action: 'read' | 'write' | 'delete'
): boolean {
  // Admins can access anything
  if (userRole === 'sys_admin') return true;
  
  // For student-owned resources, only owner or admin can modify
  if (action !== 'read' && userId !== resourceOwnerId && userRole !== 'sys_admin') {
    return false;
  }
  
  return true;
}

/**
 * Validate student owns a resource (for bounty submissions, telemetry, etc.)
 */
export function requireOwnership(userId: number, ownerId: number): boolean {
  return userId === ownerId;
}
