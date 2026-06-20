import { Link } from 'react-router-dom';
import {
  MOCK_ANALYTICS_METRICS,
  MOCK_ADMIN_ACTIVITY_LOGS,
  MOCK_HARDWARE_BOUNTIES,
  MOCK_MICRO_INTERNSHIPS,
  MOCK_PROJECT_VALIDATIONS,
  MOCK_GDPR_RECORDS,
} from '../../data/adminMockData';
import type { AnalyticsMetric, AdminActivityLog } from '../../types/admin';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffM  = Math.floor(diffMs / 60_000);
  if (diffM < 60)  return `${diffM}m ago`;
  const diffH  = Math.floor(diffM / 60);
  if (diffH < 24)  return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ metric }: { metric: AnalyticsMetric }) {
  const up   = metric.trend === 'up';
  const down = metric.trend === 'down';
  return (
    <div className="bg-surface-card border border-border rounded-xl p-4 hover:border-accent/20 transition-colors">
      <p className="text-xs text-text-muted mb-2">{metric.label}</p>
      <p className="text-2xl font-bold text-text-primary mb-1">{metric.value}</p>
      <div className="flex items-center gap-1.5">
        <span className={`text-xs font-semibold ${up ? 'text-green-400' : down ? 'text-red-400' : 'text-text-muted'}`}>
          {up ? '↑' : down ? '↓' : '→'} {Math.abs(metric.change)}%
        </span>
        <span className="text-[10px] text-text-muted">vs last period</span>
      </div>
    </div>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────

function ModuleCard({ title, desc, icon, path, badge }: {
  title: string; desc: string; icon: string; path: string; badge: string;
}) {
  return (
    <Link to={path} className="group bg-surface-card border border-border rounded-xl p-5 hover:border-accent/30 transition-colors flex gap-4 items-start">
      <span className="text-3xl shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">{title}</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{badge}</span>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
      </div>
      <span className="text-text-muted group-hover:text-accent transition-colors shrink-0">→</span>
    </Link>
  );
}

// ─── Activity Log Row ─────────────────────────────────────────────────────────

function LogRow({ log }: { log: AdminActivityLog }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${log.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-primary font-medium">{log.action}</p>
        <p className="text-[10px] text-text-muted">{log.resourceType} · {log.adminName}</p>
      </div>
      <span className="text-[10px] text-text-muted shrink-0 whitespace-nowrap">{timeAgo(log.timestamp)}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const pendingValidations = MOCK_PROJECT_VALIDATIONS.filter(v => v.status === 'pending').length;
  const pendingDeletion    = MOCK_GDPR_RECORDS.filter(r => r.status === 'pending-deletion').length;
  const publishedBounties  = MOCK_HARDWARE_BOUNTIES.filter(b => b.status === 'published').length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Platform management and oversight centre · NexusOS Engine v2.4.1
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-text-muted bg-surface-card border border-border rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>All systems operational</span>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MOCK_ANALYTICS_METRICS.slice(0, 4).map(m => (
          <StatCard key={m.id} metric={m} />
        ))}
      </div>

      {/* Alerts */}
      {(pendingValidations > 0 || pendingDeletion > 0) && (
        <div className="flex gap-3 flex-wrap">
          {pendingValidations > 0 && (
            <Link to="/admin/verification"
              className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm text-yellow-400 hover:bg-yellow-500/20 transition-colors">
              ⚠️ <span><strong>{pendingValidations}</strong> project{pendingValidations !== 1 ? 's' : ''} pending validation</span>
              <span className="ml-1 text-xs">→</span>
            </Link>
          )}
          {pendingDeletion > 0 && (
            <Link to="/admin/compliance"
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 hover:bg-red-500/20 transition-colors">
              🔐 <span><strong>{pendingDeletion}</strong> GDPR deletion request{pendingDeletion !== 1 ? 's' : ''} pending</span>
              <span className="ml-1 text-xs">→</span>
            </Link>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Module nav */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text-primary">Management Modules</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <ModuleCard
              title="Executive Analytics"
              desc="ROI tracking, revenue trends, and engagement metrics"
              icon="📊" path="/admin/analytics"
              badge={`${MOCK_ANALYTICS_METRICS.length} metrics`}
            />
            <ModuleCard
              title="GDPR Compliance"
              desc="User data lifecycle, retention policies and audit trails"
              icon="🔐" path="/admin/compliance"
              badge={`${MOCK_GDPR_RECORDS.length} records`}
            />
            <ModuleCard
              title="Bounties & Internships"
              desc="Hardware bounties and micro-internship management"
              icon="💼" path="/admin/opportunities"
              badge={`${publishedBounties} live`}
            />
            <ModuleCard
              title="Institutional Hub"
              desc="Project validation, institutional audits and verification"
              icon="✅" path="/admin/verification"
              badge={`${pendingValidations} pending`}
            />
          </div>

          {/* Quick actions */}
          <div className="bg-surface-card border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-text-primary mb-3">⚡ Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Create Bounty',     path: '/admin/opportunities', icon: '➕' },
                { label: 'Review Projects',   path: '/admin/verification',  icon: '📋' },
                { label: 'Compliance Issues', path: '/admin/compliance',    icon: '⚠️' },
                { label: 'View Analytics',    path: '/admin/analytics',     icon: '📈' },
              ].map(a => (
                <Link key={a.label} to={a.path}
                  className="flex items-center gap-2 px-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-text-muted hover:text-text-primary hover:border-accent/20 transition-colors">
                  <span>{a.icon}</span>
                  <span>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Published Bounties',    value: MOCK_HARDWARE_BOUNTIES.filter(b => b.status === 'published').length, icon: '🎯', sub: 'Active' },
              { label: 'Micro-Internships',     value: MOCK_MICRO_INTERNSHIPS.filter(i => i.status === 'published').length, icon: '🏢', sub: 'Live' },
              { label: 'Total Applicants',      value: MOCK_HARDWARE_BOUNTIES.reduce((s, b) => s + b.applicants, 0) + MOCK_MICRO_INTERNSHIPS.reduce((s, i) => s + i.applicants, 0), icon: '👥', sub: 'Across all' },
            ].map(c => (
              <div key={c.label} className="bg-surface-card border border-border rounded-xl p-3 text-center">
                <p className="text-xl mb-1">{c.icon}</p>
                <p className="text-xl font-bold text-text-primary">{c.value}</p>
                <p className="text-[10px] text-text-muted">{c.label}</p>
                <p className="text-[9px] text-accent font-medium">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-text-primary">Recent Activity</h2>
          <div className="bg-surface-card border border-border rounded-xl p-4">
            {MOCK_ADMIN_ACTIVITY_LOGS.map(log => (
              <LogRow key={log.id} log={log} />
            ))}
          </div>

          {/* RBAC info */}
          <div className="bg-surface-card border border-border rounded-xl p-4 space-y-2.5">
            <p className="text-xs font-semibold text-text-primary">🛡 Security Status</p>
            {[
              { label: 'RBAC Enforcement',   status: 'Active',   ok: true  },
              { label: 'Content Moderation', status: 'Active',   ok: true  },
              { label: 'Audit Logging',      status: 'Active',   ok: true  },
              { label: 'GDPR Retention',     status: '90 days',  ok: true  },
              { label: 'Neo4j Graph DB',     status: 'Connected',ok: true  },
              { label: 'Power BI Stream',    status: 'Live',     ok: true  },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <span className="text-text-muted">{r.label}</span>
                <span className={`font-semibold ${r.ok ? 'text-green-400' : 'text-red-400'}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
