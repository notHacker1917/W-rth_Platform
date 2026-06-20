import { useState } from 'react';
import { useAdminActions } from '../../hooks/useAdminActions';
import type { ProjectValidation } from '../../types/admin';
import { MOCK_VERIFICATION_AUDIT_TRAIL } from '../../data/adminMockData';
import './AdminVerification.css';

/**
 * AdminVerificationHub: Institutional Veracity Hub
 * 
 * Project validation and institutional audit trail management.
 * Features:
 * - Pending project review queue
 * - Approval/rejection/revision workflows
 * - Verification audit trail
 * - Institutional integrity tracking
 */
export default function AdminVerificationHub() {
  const { projectValidations, approveProjectValidation, rejectProjectValidation, requestProjectRevision } = useAdminActions();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProjectValidation['status'] | 'all'>('all');
  const [noteText, setNoteText] = useState('');
  const auditTrail = MOCK_VERIFICATION_AUDIT_TRAIL;

  const filteredValidations =
    selectedStatus === 'all'
      ? projectValidations
      : projectValidations.filter(v => v.status === selectedStatus);

  const selectedProjectData = selectedProject
    ? projectValidations.find(p => p.id === selectedProject)
    : null;

  const handleApprove = () => {
    if (selectedProject) {
      approveProjectValidation(selectedProject, noteText);
      setNoteText('');
      setSelectedProject(null);
    }
  };

  const handleReject = () => {
    if (selectedProject && noteText.trim()) {
      rejectProjectValidation(selectedProject, noteText);
      setNoteText('');
      setSelectedProject(null);
    }
  };

  const handleRequestRevision = () => {
    if (selectedProject && noteText.trim()) {
      requestProjectRevision(selectedProject, noteText);
      setNoteText('');
      setSelectedProject(null);
    }
  };

  return (
    <div className="admin-verification">
      <header className="verification-header">
        <h2>Institutional Veracity Hub</h2>
        <p>Review and validate student projects, maintain audit trails, and ensure institutional integrity</p>
      </header>

      <div className="verification-container">
        {/* Left: Validation Queue */}
        <section className="validation-queue">
          <div className="queue-header">
            <h3 className="section-title">Project Review Queue</h3>
            <div className="status-filters">
              {(['all', 'pending', 'approved', 'rejected', 'needs-revision'] as const).map(
                status => (
                  <button
                    key={status}
                    className={`status-filter ${selectedStatus === status ? 'active' : ''}`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status === 'all' ? 'All' : status.replace('-', ' ')}
                    <span className="filter-count">
                      {status === 'all'
                        ? projectValidations.length
                        : projectValidations.filter(v => v.status === status).length}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          <div className="projects-list">
            {filteredValidations.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={selectedProject === project.id}
                onSelect={() => setSelectedProject(project.id)}
              />
            ))}
            {filteredValidations.length === 0 && (
              <div className="empty-state">
                <p>No projects in this category</p>
              </div>
            )}
          </div>
        </section>

        {/* Right: Review Panel */}
        <section className="review-panel">
          {selectedProjectData ? (
            <ReviewForm
              project={selectedProjectData}
              noteText={noteText}
              onNoteChange={setNoteText}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestRevision={handleRequestRevision}
            />
          ) : (
            <div className="no-selection">
              <p>Select a project to review</p>
            </div>
          )}
        </section>
      </div>

      {/* Audit Trail Section */}
      <section className="audit-section">
        <h3 className="section-title">Verification Audit Trail</h3>
        <div className="audit-timeline">
          {auditTrail.slice(0, 6).map(entry => (
            <AuditEntry key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      {/* Verification Stats */}
      <section className="verification-stats">
        <h3 className="section-title">Verification Statistics</h3>
        <div className="stats-grid">
          <StatBox
            label="Total Reviewed"
            value={projectValidations.filter(p => p.status !== 'pending').length}
            color="#0066cc"
          />
          <StatBox
            label="Pending Review"
            value={projectValidations.filter(p => p.status === 'pending').length}
            color="#f59e0b"
          />
          <StatBox
            label="Approved"
            value={projectValidations.filter(p => p.status === 'approved').length}
            color="#059669"
          />
          <StatBox
            label="Rejected"
            value={projectValidations.filter(p => p.status === 'rejected').length}
            color="#ef4444"
          />
          <StatBox
            label="Needs Revision"
            value={projectValidations.filter(p => p.status === 'needs-revision').length}
            color="#9ca3af"
          />
          <StatBox
            label="Avg Review Time"
            value="2.4 days"
            color="#0066cc"
          />
        </div>
      </section>
    </div>
  );
}

/**
 * ProjectCard: Individual project in review queue
 */
function ProjectCard({
  project,
  isSelected,
  onSelect,
}: {
  project: ProjectValidation;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const statusIcon = {
    pending: '⏳',
    approved: '✅',
    rejected: '❌',
    'needs-revision': '🔄',
  };

  const statusColor = {
    pending: '#f59e0b',
    approved: '#059669',
    rejected: '#ef4444',
    'needs-revision': '#9ca3af',
  };

  return (
    <button
      className={`project-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={isSelected ? { borderLeftColor: statusColor[project.status] } : {}}
    >
      <div className="card-status">{statusIcon[project.status]}</div>
      <div className="card-content">
        <h4 className="card-title">{project.projectTitle}</h4>
        <p className="card-author">{project.authorName}</p>
        <span className="card-date">
          Submitted {new Date(project.submittedAt).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}

/**
 * ReviewForm: Project review and decision panel
 */
function ReviewForm({
  project,
  noteText,
  onNoteChange,
  onApprove,
  onReject,
  onRequestRevision,
}: {
  project: ProjectValidation;
  noteText: string;
  onNoteChange: (text: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestRevision: () => void;
}) {
  return (
    <div className="review-form">
      <div className="review-header">
        <h4>Review: {project.projectTitle}</h4>
        <span className={`status-badge status-${project.status}`}>
          {project.status.replace('-', ' ')}
        </span>
      </div>

      <div className="review-info">
        <div className="info-row">
          <span className="label">Author:</span>
          <span className="value">{project.authorName}</span>
        </div>
        <div className="info-row">
          <span className="label">Submitted:</span>
          <span className="value">
            {new Date(project.submittedAt).toLocaleString()}
          </span>
        </div>
        {project.validatedAt && (
          <div className="info-row">
            <span className="label">Reviewed by:</span>
            <span className="value">{project.validatedBy}</span>
          </div>
        )}
      </div>

      {project.validationNotes && (
        <div className="review-notes">
          <h5>Review Notes</h5>
          <p>{project.validationNotes}</p>
        </div>
      )}

      {project.attachments.length > 0 && (
        <div className="review-attachments">
          <h5>Attachments</h5>
          <ul>
            {project.attachments.map((file, idx) => (
              <li key={idx}>📎 {file}</li>
            ))}
          </ul>
        </div>
      )}

      {project.status === 'pending' && (
        <div className="review-actions">
          <div className="notes-section">
            <label htmlFor="review-notes">Review Notes:</label>
            <textarea
              id="review-notes"
              className="review-textarea"
              placeholder="Add feedback or reason for decision..."
              value={noteText}
              onChange={e => onNoteChange(e.target.value)}
            />
          </div>

          <div className="action-buttons">
            <button className="btn-approve" onClick={onApprove}>
              ✅ Approve
            </button>
            <button className="btn-revision" onClick={onRequestRevision} disabled={!noteText.trim()}>
              🔄 Request Revision
            </button>
            <button className="btn-reject" onClick={onReject} disabled={!noteText.trim()}>
              ❌ Reject
            </button>
          </div>
        </div>
      )}

      {project.status !== 'pending' && (
        <div className="review-closed">
          <p>Review is complete. Project status: <strong>{project.status}</strong></p>
        </div>
      )}
    </div>
  );
}

/**
 * AuditEntry: Individual audit trail entry
 */
function AuditEntry({
  entry,
}: {
  entry: {
    id: string;
    entityType: string;
    entityName: string;
    action: string;
    reviewedBy: string;
    timestamp: string;
    severity: string;
  };
}) {
  const severityColor = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };

  return (
    <div className="audit-entry-item">
      <div className="timeline-dot" style={{ backgroundColor: severityColor[entry.severity as keyof typeof severityColor] }} />
      <div className="entry-content">
        <div className="entry-header">
          <span className="entry-action">{entry.action}</span>
          <span className="entry-type">{entry.entityType}</span>
        </div>
        <p className="entry-entity">{entry.entityName}</p>
        <div className="entry-footer">
          <span className="entry-reviewer">{entry.reviewedBy}</span>
          <span className="entry-date">
            {new Date(entry.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * StatBox: Statistics box
 */
function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="stat-box">
      <div className="stat-icon" style={{ backgroundColor: color + '20', color }}>
        📊
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  );
}
