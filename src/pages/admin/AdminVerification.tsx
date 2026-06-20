import { useState } from 'react';
import { useAdminActions } from '../../hooks/useAdminActions';
import type { ProjectValidation } from '../../types/admin';
import { MOCK_VERIFICATION_AUDIT_TRAIL } from '../../data/adminMockData';

type VStatus = ProjectValidation['status'];

const STATUS_META: Record<VStatus, { icon: string; cls: string; dot: string }> = {
  pending:          { icon: '⏳', cls: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10', dot: 'bg-yellow-400' },
  approved:         { icon: '✅', cls: 'text-green-400  border-green-400/30  bg-green-400/10',  dot: 'bg-green-400' },
  rejected:         { icon: '❌', cls: 'text-red-400    border-red-400/30    bg-red-400/10',    dot: 'bg-red-400'   },
  'needs-revision': { icon: '🔄', cls: 'text-blue-400   border-blue-400/30   bg-blue-400/10',   dot: 'bg-blue-400'  },
};

const SEVERITY_CLS: Record<string, string> = {
  low:    'bg-green-400',
  medium: 'bg-yellow-400',
  high:   'bg-red-400',
};

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, selected, onSelect }: {
  project: ProjectValidation; selected: boolean; onSelect: () => void;
}) {
  const meta = STATUS_META[project.status];
  return (
    <button onClick={onSelect}
      className={`w-full text-left p-3 rounded-xl border transition-colors flex gap-3 items-start
        ${selected ? 'border-accent/30 bg-accent/5' : 'border-border hover:border-border hover:bg-surface-elevated'}`}>
      <span className="text-base mt-0.5">{meta.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-text-primary truncate">{project.projectTitle}</p>
        <p className="text-[10px] text-text-muted">{project.authorName}</p>
        <p className="text-[9px] text-text-muted mt-0.5">
          Submitted {new Date(project.submittedAt).toLocaleDateString()}
        </p>
      </div>
      <span className={`text-[9px] px-1.5 py-0.5 rounded-full border shrink-0 font-semibold ${meta.cls}`}>
        {project.status.replace('-', ' ')}
      </span>
    </button>
  );
}

// ─── Review Panel ─────────────────────────────────────────────────────────────

function ReviewPanel({ project, onApprove, onReject, onRevision }: {
  project: ProjectValidation;
  onApprove: (note: string) => void;
  onReject: (note: string) => void;
  onRevision: (note: string) => void;
}) {
  const [note, setNote] = useState('');
  const meta = STATUS_META[project.status];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{project.projectTitle}</h3>
          <p className="text-xs text-text-muted">{project.authorName}</p>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold shrink-0 ${meta.cls}`}>
          {meta.icon} {project.status.replace('-', ' ')}
        </span>
      </div>

      <div className="space-y-2 text-xs bg-surface-elevated border border-border rounded-xl p-3">
        <div className="flex justify-between">
          <span className="text-text-muted">Author</span>
          <span className="text-text-primary font-medium">{project.authorName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Submitted</span>
          <span className="text-text-primary">{new Date(project.submittedAt).toLocaleString()}</span>
        </div>
        {project.validatedBy && (
          <div className="flex justify-between">
            <span className="text-text-muted">Reviewed by</span>
            <span className="text-text-primary">{project.validatedBy}</span>
          </div>
        )}
      </div>

      {project.validationNotes && (
        <div className="bg-surface-elevated border border-border rounded-xl p-3">
          <p className="text-[10px] font-semibold text-text-muted mb-1">Review Notes</p>
          <p className="text-xs text-text-primary">{project.validationNotes}</p>
        </div>
      )}

      {project.attachments.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-text-muted">Attachments</p>
          {project.attachments.map((f, i) => (
            <p key={i} className="text-xs text-text-muted flex items-center gap-1.5">📎 {f}</p>
          ))}
        </div>
      )}

      {project.status === 'pending' && (
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-text-muted block mb-1">Review Notes</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add feedback or reason for decision..."
              rows={3}
              className="w-full text-xs bg-surface-elevated border border-border rounded-xl p-3 text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent/30"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => { onApprove(note); setNote(''); }}
              className="py-2 rounded-xl bg-green-400/10 border border-green-400/30 text-green-400 text-xs hover:bg-green-400/20 transition-colors">
              ✅ Approve
            </button>
            <button onClick={() => { if (note.trim()) { onRevision(note); setNote(''); } }}
              disabled={!note.trim()}
              className="py-2 rounded-xl bg-blue-400/10 border border-blue-400/30 text-blue-400 text-xs hover:bg-blue-400/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              🔄 Revise
            </button>
            <button onClick={() => { if (note.trim()) { onReject(note); setNote(''); } }}
              disabled={!note.trim()}
              className="py-2 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 text-xs hover:bg-red-400/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              ❌ Reject
            </button>
          </div>
        </div>
      )}

      {project.status !== 'pending' && (
        <div className="bg-surface-elevated border border-border rounded-xl p-3 text-center">
          <p className="text-xs text-text-muted">Review complete · status: <strong className="text-text-primary">{project.status}</strong></p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminVerificationHub() {
  const { projectValidations, approveProjectValidation, rejectProjectValidation, requestProjectRevision } = useAdminActions();
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<VStatus | 'all'>('all');
  const [note, setNote]               = useState('');
  const auditTrail                    = MOCK_VERIFICATION_AUDIT_TRAIL;

  const filtered = statusFilter === 'all'
    ? projectValidations
    : projectValidations.filter(v => v.status === statusFilter);

  const selected = selectedId ? projectValidations.find(p => p.id === selectedId) : null;

  const handleApprove  = (n: string) => { approveProjectValidation(selectedId!, n);       setSelectedId(null); };
  const handleReject   = (n: string) => { rejectProjectValidation(selectedId!, n);        setSelectedId(null); };
  const handleRevision = (n: string) => { requestProjectRevision(selectedId!, n);         setSelectedId(null); };

  const filterTabs = ['all', 'pending', 'approved', 'rejected', 'needs-revision'] as const;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Institutional Veracity Hub</h1>
        <p className="text-sm text-text-muted mt-0.5">Project validation, institutional audits and verification</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: 'Total',          val: projectValidations.length,                                             cls: 'text-text-primary' },
          { label: 'Pending',        val: projectValidations.filter(p => p.status === 'pending').length,         cls: 'text-yellow-400'   },
          { label: 'Approved',       val: projectValidations.filter(p => p.status === 'approved').length,        cls: 'text-green-400'    },
          { label: 'Rejected',       val: projectValidations.filter(p => p.status === 'rejected').length,        cls: 'text-red-400'      },
          { label: 'Needs Revision', val: projectValidations.filter(p => p.status === 'needs-revision').length,  cls: 'text-blue-400'     },
          { label: 'Avg Time',       val: '2.4d',                                                                cls: 'text-text-muted'   },
        ].map(c => (
          <div key={c.label} className="bg-surface-card border border-border rounded-xl p-3 text-center">
            <p className={`text-xl font-bold ${c.cls}`}>{c.val}</p>
            <p className="text-[9px] text-text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-4">
        {/* Left: queue */}
        <div className="space-y-3">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1.5">
            {filterTabs.map(t => (
              <button key={t} onClick={() => { setStatusFilter(t); setSelectedId(null); }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors
                  ${statusFilter === t ? 'bg-accent/10 border-accent/30 text-accent' : 'border-border text-text-muted hover:border-accent/20'}`}>
                {t === 'all' ? 'All' : t.replace('-', ' ')}
                <span className="ml-1 opacity-60">
                  {t === 'all' ? projectValidations.length : projectValidations.filter(v => v.status === t).length}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map(p => (
              <ProjectCard key={p.id} project={p} selected={selectedId === p.id} onSelect={() => setSelectedId(p.id)} />
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-text-muted text-center py-4">No projects in this category</p>
            )}
          </div>
        </div>

        {/* Right: review panel */}
        <div className="bg-surface-card border border-border rounded-xl p-5 min-h-[300px]">
          {selected
            ? <ReviewPanel project={selected} onApprove={handleApprove} onReject={handleReject} onRevision={handleRevision} />
            : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-8">
                <span className="text-3xl">📋</span>
                <p className="text-sm text-text-muted">Select a project to review</p>
              </div>
            )
          }
        </div>
      </div>

      {/* Audit trail */}
      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-3">Verification Audit Trail</h2>
        <div className="bg-surface-card border border-border rounded-xl divide-y divide-border">
          {auditTrail.slice(0, 6).map((e) => {
            const entry = e as { id: string; entityType: string; entityName: string; action: string; reviewedBy: string; timestamp: string; severity: string };
            return (
              <div key={entry.id} className="flex items-start gap-4 p-4">
                <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${SEVERITY_CLS[entry.severity] ?? 'bg-text-muted'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-text-primary">{entry.action}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{entry.entityType}</span>
                  </div>
                  <p className="text-xs text-text-muted">{entry.entityName}</p>
                  <p className="text-[10px] text-text-muted">{entry.reviewedBy}</p>
                </div>
                <span className="text-[10px] text-text-muted shrink-0 whitespace-nowrap">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
