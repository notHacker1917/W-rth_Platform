import { useState } from 'react';
import { useAdminActions } from '../../hooks/useAdminActions';
import type { GDPRRecord } from '../../types/admin';
import './AdminCompliance.css';

/**
 * AdminComplianceCenter: GDPR & Data Compliance Center
 * 
 * Manages user data lifecycle with compliance audit trails.
 * Features:
 * - User data record management
 * - Data category organization
 * - Status tracking (active, archived, deleted, pending-deletion)
 * - Audit trail visibility
 * - Data deletion workflows
 */
export default function AdminComplianceCenter() {
  const { gdprRecords, updateGDPRRecordStatus, deleteGDPRRecord } = useAdminActions();
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<GDPRRecord['status'] | 'all'>('all');

  const filteredRecords =
    selectedFilter === 'all'
      ? gdprRecords
      : gdprRecords.filter(r => r.status === selectedFilter);

  const statusOptions = ['active', 'archived', 'pending-deletion', 'deleted'] as const;

  const handleStatusChange = (recordId: string, newStatus: GDPRRecord['status']) => {
    updateGDPRRecordStatus(recordId, newStatus);
  };

  const handleDelete = (recordId: string) => {
    if (confirm('Are you sure you want to permanently delete this record?')) {
      deleteGDPRRecord(recordId);
    }
  };

  return (
    <div className="admin-compliance">
      <header className="compliance-header">
        <h2>GDPR & Data Compliance Center</h2>
        <p>Manage user data lifecycle, retention policies, and compliance audits</p>
      </header>

      {/* Filter Tabs */}
      <section className="compliance-filters">
        <h3 className="section-title">Data Records</h3>
        <div className="filter-tabs">
          {(['all', ...statusOptions] as const).map(status => (
            <button
              key={status}
              className={`filter-tab ${selectedFilter === status ? 'active' : ''}`}
              onClick={() => setSelectedFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              <span className="tab-count">
                {status === 'all'
                  ? gdprRecords.length
                  : gdprRecords.filter(r => r.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Records Table */}
      <section className="compliance-records">
        <div className="records-wrapper">
          <table className="compliance-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Data Category</th>
                <th>Status</th>
                <th>Retention Period</th>
                <th>Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <RecordRow
                  key={record.id}
                  record={record}
                  expanded={expandedRecord === record.id}
                  onToggleExpand={() =>
                    setExpandedRecord(expandedRecord === record.id ? null : record.id)
                  }
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
          {filteredRecords.length === 0 && (
            <div className="empty-state">
              <p>No records found matching the selected filter</p>
            </div>
          )}
        </div>
      </section>

      {/* Compliance Info */}
      <section className="compliance-info">
        <h3 className="section-title">Compliance Guidelines</h3>
        <div className="info-cards">
          <InfoCard
            title="Data Retention"
            description="Keep records for 90-180 days unless user requests deletion sooner"
            icon="⏱️"
          />
          <InfoCard
            title="User Rights"
            description="Users can request data export or deletion anytime via their account settings"
            icon="👤"
          />
          <InfoCard
            title="Audit Trail"
            description="All data modifications are logged with timestamp and actor information"
            icon="📋"
          />
          <InfoCard
            title="Data Categories"
            description="Profile, Activity, Connections, and Applications data streams"
            icon="📁"
          />
        </div>
      </section>
    </div>
  );
}

/**
 * RecordRow: Individual compliance record row with expandable audit trail
 */
function RecordRow({
  record,
  expanded,
  onToggleExpand,
  onStatusChange,
  onDelete,
}: {
  record: GDPRRecord;
  expanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (recordId: string, status: GDPRRecord['status']) => void;
  onDelete: (recordId: string) => void;
}) {
  const statusColor = {
    active: '#10b981',
    archived: '#6b7280',
    'pending-deletion': '#f59e0b',
    deleted: '#ef4444',
  };

  return (
    <>
      <tr className={`record-row ${expanded ? 'expanded' : ''}`}>
        <td className="cell-user">
          <strong>{record.userName}</strong>
        </td>
        <td className="cell-email">{record.userEmail}</td>
        <td className="cell-category">
          <span className="category-badge">{record.dataCategory}</span>
        </td>
        <td className="cell-status">
          <select
            className="status-select"
            value={record.status}
            onChange={e =>
              onStatusChange(record.id, e.target.value as GDPRRecord['status'])
            }
            style={{
              borderColor: statusColor[record.status],
              color: statusColor[record.status],
            }}
          >
            {(['active', 'archived', 'pending-deletion', 'deleted'] as const).map(
              status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              )
            )}
          </select>
        </td>
        <td className="cell-retention">{record.retentionPeriod}</td>
        <td className="cell-modified">{new Date(record.modifiedAt).toLocaleDateString()}</td>
        <td className="cell-actions">
          <button
            className="btn-expand"
            onClick={onToggleExpand}
            title="View audit trail"
          >
            {expanded ? '▼' : '▶'}
          </button>
          <button
            className="btn-delete"
            onClick={() => onDelete(record.id)}
            title="Delete record"
          >
            🗑️
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="record-expansion">
          <td colSpan={7}>
            <AuditTrail entries={record.auditTrail} />
          </td>
        </tr>
      )}
    </>
  );
}

/**
 * AuditTrail: Display audit trail entries for a record
 */
function AuditTrail({ entries }: { entries: any[] }) {
  return (
    <div className="audit-trail">
      <h4>Audit Trail</h4>
      <div className="audit-entries">
        {entries.map(entry => (
          <div key={entry.id} className="audit-entry">
            <div className="audit-timestamp">
              {new Date(entry.timestamp).toLocaleString()}
            </div>
            <div className="audit-action">{entry.action}</div>
            <div className="audit-actor">by {entry.actor}</div>
            <div className="audit-details">{entry.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * InfoCard: Compliance guideline card
 */
function InfoCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="info-card">
      <div className="info-icon">{icon}</div>
      <div className="info-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}
