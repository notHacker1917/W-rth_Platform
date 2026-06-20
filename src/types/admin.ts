// ─── Admin Dashboard Types ──────────────────────────────────────────────────

/**
 * Extended user role to include admin roles
 */
export type ExtendedUserRole = 'student' | 'company' | 'educator' | 'corporate_admin';

/**
 * Analytics metrics for the Executive Dashboard
 */
export interface AnalyticsMetric {
  id: string;
  label: string;
  value: number | string;
  change: number; // percentage change
  trend: 'up' | 'down' | 'neutral';
  timestamp: string;
}

/**
 * ROI data point for analytics charts
 */
export interface ROIDataPoint {
  month: string;
  revenue: number;
  engagement: number;
  roi: number;
}

/**
 * GDPR compliance record
 */
export interface GDPRRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  dataCategory: 'profile' | 'activity' | 'connections' | 'applications';
  status: 'active' | 'deleted' | 'archived' | 'pending-deletion';
  createdAt: string;
  modifiedAt: string;
  retentionPeriod: string; // e.g., "90 days"
  auditTrail: AuditEntry[];
}

/**
 * Audit trail entry for data compliance
 */
export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

/**
 * Hardware Bounty listing for admin management
 */
export interface HardwareBounty {
  id: string;
  title: string;
  description: string;
  category: string;
  value: number;
  status: 'draft' | 'published' | 'archived';
  applicants: number;
  createdAt: string;
  createdBy: string;
  deadline: string;
}

/**
 * Micro-Internship listing for admin management
 */
export interface MicroInternship {
  id: string;
  title: string;
  description: string;
  company: string;
  duration: string;
  compensation: string;
  status: 'draft' | 'published' | 'completed' | 'archived';
  applicants: number;
  createdAt: string;
  deadline: string;
}

/**
 * Project validation record for institutional audit
 */
export interface ProjectValidation {
  id: string;
  projectId: string;
  projectTitle: string;
  authorName: string;
  submittedAt: string;
  validatedAt?: string;
  validatedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs-revision';
  validationNotes: string;
  attachments: string[];
}

/**
 * Institutional verification audit trail
 */
export interface VerificationAuditEntry {
  id: string;
  entityType: 'project' | 'user' | 'institution';
  entityId: string;
  entityName: string;
  action: 'verified' | 'flagged' | 'updated' | 'archived';
  reviewedBy: string;
  timestamp: string;
  reason?: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Admin activity log
 */
export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  changes?: Record<string, unknown>;
  status: 'success' | 'failed';
}

/**
 * Admin dashboard view state
 */
export interface AdminDashboardState {
  selectedMetric: AnalyticsMetric | null;
  filters: AdminFilters;
  loading: boolean;
  error: string | null;
}

/**
 * Common filter options for admin views
 */
export interface AdminFilters {
  dateRange?: {
    from: string;
    to: string;
  };
  status?: string;
  searchQuery?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
