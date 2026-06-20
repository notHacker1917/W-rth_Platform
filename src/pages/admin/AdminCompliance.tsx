import { useState } from 'react';
import { useAdminActions } from '../../hooks/useAdminActions';
import type { GDPRRecord } from '../../types/admin';

const STATUS_COLORS: Record<GDPRRecord['status'], string> = {
  'active':           'text-green-400  border-green-400/30  bg-green-400/10',
  'archived':         'text-text-muted border-border         bg-surface-elevated',
  'pending-deletion': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  'deleted':          'text-red-400    border-red-400/30    bg-red-400/10',
};

const STATUS_DOT: Record<GDPRRecord['status'], string> = {
  'active':           'bg-green-400',
  'archived':         'bg-text-muted',
  'pending-deletion': 'bg-yellow-400',
  'deleted':          'bg-red-400',
};

// ─── Audit Trail ──────────────────────────────────────────────────────────────

function AuditTrailPanel({ entries }: { entries: { id: string; timestamp: string; action: string; actor: string; details: string }[] }) {
  return (
    <div className="mt-3 space-y-2 border-t border-border pt-3">
      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Audit Trail</p>
      {entries.map(e => (
        <div key={e.id} className="flex gap-3 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex gap-2">
              <span className="text-text-primary font-medium">{e.action}</span>
              <span className="text-text-muted">· {e.actor}</span>
            </div>
            <p className="text-text-muted text-[10px]">{e.details}</p>
          </div>
          <span className="text-[9px] text-text-muted shrink-0 whitespace-nowrap">
            {new Date(e.timestamp).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Record Row ───────────────────────────────────────────────────────────────

function RecordRow({
  record, expanded, onToggle, onStatusChange, onDelete,
}: {
  record: GDPRRecord;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, s: GDPRRecord['status']) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`bg-surface-card border rounded-xl overflow-hidden transition-colors ${expanded ? 'border-accent/20' : 'border-border'}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[record.status]}`} />
        <div className="flex-1 min-w-0 grid sm:grid-cols-[1fr_160px_100px_110px_80px] gap-2 items-center">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{record.userName}</p>
            <p className="text-[10px] text-text-muted truncate">{record.userEmail}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-text-muted w-fit">
            {record.dataCategory}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit ${STATUS_COLORS[record.status]}`}>
            {record.status.replace('-', ' ')}
          </span>
          <span className="text-[10px] text-text-muted">{record.retentionPeriod}</span>
          <span className="text-[10px] text-text-muted">{new Date(record.modifiedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={record.status}
            onChange={e => onStatusChange(record.id, e.target.value as GDPRRecord['status'])}
            className="text-[10px] bg-surface-elevated border border-border rounded px-1.5 py-1 text-text-muted cursor-pointer"
          >
            {(['active', 'archived', 'pending-deletion', 'deleted'] as const).map(s => (
              <option key={s} value={s}>{s.replace('-', ' ')}</option>
            ))}
          </select>
          <button onClick={onToggle}
            className={`w-7 h-7 rounded-lg border transition-colors flex items-center justify-center text-xs
              ${expanded ? 'border-accent/30 text-accent bg-accent/10' : 'border-border text-text-muted hover:border-accent/20'}`}>
            {expanded ? '▲' : '▼'}
          </button>
          <button onClick={() => { if (confirm('Permanently delete this record?')) onDelete(record.id); }}
            className="w-7 h-7 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center justify-center text-xs transition-colors">
            🗑
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4">
          <AuditTrailPanel entries={record.auditTrail as any[]} />
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminComplianceCenter() {
  const { gdprRecords, updateGDPRRecordStatus, deleteGDPRRecord } = useAdminActions();
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [filter, setFilter]       = useState<GDPRRecord['status'] | 'all'>('all');

  const filtered = filter === 'all' ? gdprRecords : gdprRecords.filter(r => r.status === filter);
  const tabs = ['all', 'active', 'archived', 'pending-deletion', 'deleted'] as const;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">GDPR Compliance</h1>
        <p className="text-sm text-text-muted mt-0.5">User data lifecycle, retention policies and audit trails</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Records',      val: gdprRecords.filter(r => r.status === 'active').length,           color: 'text-green-400'  },
          { label: 'Pending Deletion',    val: gdprRecords.filter(r => r.status === 'pending-deletion').length, color: 'text-yellow-400' },
          { label: 'Archived',            val: gdprRecords.filter(r => r.status === 'archived').length,         color: 'text-text-muted' },
          { label: 'Deleted',             val: gdprRecords.filter(r => r.status === 'deleted').length,          color: 'text-red-400'    },
        ].map(c => (
          <div key={c.label} className="bg-surface-card border border-border rounded-xl p-4">
            <p className={`text-2xl font-bold ${c.color}`}>{c.val}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
              ${filter === t
                ? 'bg-accent/10 border-accent/30 text-accent'
                : 'border-border text-text-muted hover:border-accent/20 hover:text-text-primary'}`}>
            {t.replace('-', ' ')} · {t === 'all' ? gdprRecords.length : gdprRecords.filter(r => r.status === t).length}
          </button>
        ))}
      </div>

      {/* Records */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="bg-surface-card border border-border rounded-xl p-8 text-center">
            <p className="text-text-muted text-sm">No records matching selected filter</p>
          </div>
        )}
        {filtered.map(r => (
          <RecordRow
            key={r.id} record={r}
            expanded={expanded === r.id}
            onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
            onStatusChange={updateGDPRRecordStatus}
            onDelete={deleteGDPRRecord}
          />
        ))}
      </div>

      {/* Guidelines */}
      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-3">Compliance Guidelines</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '⏱️', title: 'Data Retention',   desc: 'Keep records 90–180 days unless user requests earlier deletion' },
            { icon: '👤', title: 'User Rights',       desc: 'Users can request data export or deletion via account settings' },
            { icon: '📋', title: 'Audit Trail',       desc: 'All modifications are logged with timestamp and actor information' },
            { icon: '📁', title: 'Data Categories',   desc: 'Profile, Activity, Connections, and Applications data streams' },
          ].map(g => (
            <div key={g.title} className="bg-surface-card border border-border rounded-xl p-4 flex gap-3">
              <span className="text-2xl shrink-0">{g.icon}</span>
              <div>
                <p className="text-sm font-semibold text-text-primary">{g.title}</p>
                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
