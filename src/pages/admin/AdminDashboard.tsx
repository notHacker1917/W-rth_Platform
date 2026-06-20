import { Link } from 'react-router-dom';
import { MOCK_ANALYTICS_METRICS } from '../../data/adminMockData';
import './AdminDashboard.css';

/**
 * AdminDashboard: Main admin dashboard landing page
 * 
 * Provides quick overview and navigation to all admin modules.
 * Features:
 * - Quick stats and KPIs
 * - Module navigation cards
 * - Recent activity summary
 */
export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Platform management and oversight center</p>
      </header>

      {/* Quick Stats */}
      <section className="dashboard-stats">
        <h3 className="section-title">Quick Overview</h3>
        <div className="stats-grid">
          {MOCK_ANALYTICS_METRICS.slice(0, 4).map(metric => (
            <StatCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      {/* Module Navigation */}
      <section className="dashboard-modules">
        <h3 className="section-title">Management Modules</h3>
        <div className="modules-grid">
          <ModuleCard
            title="Executive Analytics"
            description="ROI tracking, revenue metrics, and engagement analytics"
            icon="📊"
            path="/admin/analytics"
            count="12 metrics"
          />
          <ModuleCard
            title="GDPR Compliance"
            description="User data lifecycle management and compliance audits"
            icon="🔐"
            path="/admin/compliance"
            count="4 records"
          />
          <ModuleCard
            title="Opportunities"
            description="Hardware bounties and micro-internship management"
            icon="💼"
            path="/admin/opportunities"
            count="8 listings"
          />
          <ModuleCard
            title="Verification"
            description="Project validation and institutional audit trails"
            icon="✔️"
            path="/admin/verification"
            count="12 pending"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-quick-actions">
        <h3 className="section-title">Quick Actions</h3>
        <div className="actions-grid">
          <ActionButton
            label="Create New Bounty"
            icon="➕"
            onClick={() => window.location.href = '/admin/opportunities'}
          />
          <ActionButton
            label="Review Pending Projects"
            icon="📋"
            onClick={() => window.location.href = '/admin/verification'}
          />
          <ActionButton
            label="View Compliance Issues"
            icon="⚠️"
            onClick={() => window.location.href = '/admin/compliance'}
          />
          <ActionButton
            label="Export Analytics Report"
            icon="📥"
            onClick={() => alert('Report export coming soon')}
          />
        </div>
      </section>

      {/* Info Boxes */}
      <section className="dashboard-info">
        <h3 className="section-title">Administration Guide</h3>
        <div className="info-grid">
          <InfoBox
            title="Role-Based Access"
            description="Only users with 'corporate_admin' role can access this dashboard. Access is controlled via JWT token verification."
            icon="🔑"
          />
          <InfoBox
            title="Data Management"
            description="All operations are logged in audit trails. User data deletion requests are processed within retention windows."
            icon="📁"
          />
          <InfoBox
            title="Project Validation"
            description="Review and approve student projects. Maintain institutional integrity through systematic verification."
            icon="✅"
          />
          <InfoBox
            title="Opportunity Management"
            description="Create and publish bounties and internships. Track applicants and manage listings across categories."
            icon="🎯"
          />
        </div>
      </section>
    </div>
  );
}

/**
 * StatCard: Quick stat display card
 */
function StatCard({ metric }: { metric: any }) {
  const trendIcon = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→';
  const trendColor = metric.trend === 'up' ? '#10b981' : metric.trend === 'down' ? '#ef4444' : '#9ca3af';

  return (
    <div className="stat-card">
      <h4 className="stat-label">{metric.label}</h4>
      <p className="stat-value">{metric.value}</p>
      <span className="stat-trend" style={{ color: trendColor }}>
        {trendIcon} {Math.abs(metric.change)}%
      </span>
    </div>
  );
}

/**
 * ModuleCard: Admin module navigation card
 */
function ModuleCard({
  title,
  description,
  icon,
  path,
  count,
}: {
  title: string;
  description: string;
  icon: string;
  path: string;
  count: string;
}) {
  return (
    <Link to={path} className="module-card">
      <div className="module-icon">{icon}</div>
      <div className="module-content">
        <h4 className="module-title">{title}</h4>
        <p className="module-description">{description}</p>
        <span className="module-count">{count}</span>
      </div>
      <div className="module-arrow">→</div>
    </Link>
  );
}

/**
 * ActionButton: Quick action button
 */
function ActionButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button className="action-button" onClick={onClick}>
      <span className="action-icon">{icon}</span>
      <span className="action-label">{label}</span>
    </button>
  );
}

/**
 * InfoBox: Information display box
 */
function InfoBox({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="info-box">
      <div className="info-icon">{icon}</div>
      <div className="info-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}
