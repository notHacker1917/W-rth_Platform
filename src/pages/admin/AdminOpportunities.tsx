import { useState } from 'react';
import { useAdminActions } from '../../hooks/useAdminActions';
import type { HardwareBounty, MicroInternship } from '../../types/admin';

type BountyStatus    = HardwareBounty['status'];
type InternStatus    = MicroInternship['status'];

const STATUS_CLS: Record<string, string> = {
  draft:      'bg-surface-elevated text-text-muted border-border',
  published:  'bg-green-400/10 text-green-400 border-green-400/30',
  completed:  'bg-blue-400/10 text-blue-400 border-blue-400/30',
  archived:   'bg-text-muted/10 text-text-muted border-border',
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_CLS[status] ?? STATUS_CLS.archived}`}>
      {status}
    </span>
  );
}

// ─── Bounties Table ───────────────────────────────────────────────────────────

function BountiesSection({
  bounties, onDelete, onPublish,
}: {
  bounties: HardwareBounty[];
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}) {
  const totalValue    = bounties.reduce((s, b) => s + b.value, 0);
  const totalApps     = bounties.reduce((s, b) => s + b.applicants, 0);
  const published     = bounties.filter(b => b.status === 'published').length;

  return (
    <div className="space-y-4">
      {/* Mini stat row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Value',   value: `$${totalValue.toLocaleString()}` },
          { label: 'Published',     value: published },
          { label: 'Draft',         value: bounties.filter(b => b.status === 'draft').length },
          { label: 'Applicants',    value: totalApps },
        ].map(c => (
          <div key={c.label} className="bg-surface-elevated border border-border rounded-lg p-3">
            <p className="text-base font-bold text-text-primary">{c.value}</p>
            <p className="text-[9px] text-text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {['Title', 'Category', 'Value', 'Status', 'Applicants', 'Deadline', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-text-muted font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bounties.map(b => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-surface-elevated transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary max-w-[180px] truncate">{b.title}</td>
                  <td className="px-4 py-3 text-text-muted">{b.category}</td>
                  <td className="px-4 py-3 font-semibold text-accent">${b.value.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-text-muted">{b.applicants}</td>
                  <td className="px-4 py-3 text-text-muted">{new Date(b.deadline).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {b.status === 'draft' && (
                        <button onClick={() => onPublish(b.id)}
                          className="px-2 py-1 rounded-lg bg-green-400/10 border border-green-400/30 text-green-400 text-[10px] hover:bg-green-400/20 transition-colors">
                          📤 Publish
                        </button>
                      )}
                      <button className="w-6 h-6 rounded-lg border border-border text-text-muted hover:border-accent/20 flex items-center justify-center">
                        ✏️
                      </button>
                      <button onClick={() => onDelete(b.id)}
                        className="w-6 h-6 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors">
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bounties.length === 0 && (
            <div className="p-8 text-center text-text-muted text-sm">No bounties yet. Create one to get started.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Internships Table ────────────────────────────────────────────────────────

function InternshipsSection({
  internships, onDelete, onPublish,
}: {
  internships: MicroInternship[];
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}) {
  const totalApps = internships.reduce((s, i) => s + i.applicants, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Listings', value: internships.length },
          { label: 'Published',      value: internships.filter(i => i.status === 'published').length },
          { label: 'Draft',          value: internships.filter(i => i.status === 'draft').length },
          { label: 'Applicants',     value: totalApps },
        ].map(c => (
          <div key={c.label} className="bg-surface-elevated border border-border rounded-lg p-3">
            <p className="text-base font-bold text-text-primary">{c.value}</p>
            <p className="text-[9px] text-text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {['Title', 'Company', 'Duration', 'Comp.', 'Status', 'Applicants', 'Deadline', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-text-muted font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {internships.map(i => (
                <tr key={i.id} className="border-b border-border/50 hover:bg-surface-elevated transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary max-w-[160px] truncate">{i.title}</td>
                  <td className="px-4 py-3 text-text-muted">{i.company}</td>
                  <td className="px-4 py-3 text-text-muted">{i.duration}</td>
                  <td className="px-4 py-3 text-accent font-semibold">{i.compensation}</td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-4 py-3 text-text-muted">{i.applicants}</td>
                  <td className="px-4 py-3 text-text-muted">{new Date(i.deadline).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {i.status === 'draft' && (
                        <button onClick={() => onPublish(i.id)}
                          className="px-2 py-1 rounded-lg bg-green-400/10 border border-green-400/30 text-green-400 text-[10px] hover:bg-green-400/20 transition-colors">
                          📤 Publish
                        </button>
                      )}
                      <button className="w-6 h-6 rounded-lg border border-border text-text-muted hover:border-accent/20 flex items-center justify-center">✏️</button>
                      <button onClick={() => onDelete(i.id)}
                        className="w-6 h-6 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {internships.length === 0 && (
            <div className="p-8 text-center text-text-muted text-sm">No internships yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOpportunitiesController() {
  const {
    hardwareBounties, microInternships,
    createHardwareBounty, deleteHardwareBounty, publishHardwareBounty,
    createMicroInternship, deleteMicroInternship, publishMicroInternship,
  } = useAdminActions();

  const [tab, setTab]           = useState<'bounties' | 'internships'>('bounties');
  const [showModal, setModal]   = useState(false);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Bounties & Internships</h1>
          <p className="text-sm text-text-muted mt-0.5">Hardware bounties and micro-internship management</p>
        </div>
        <button onClick={() => setModal(true)}
          className="px-4 py-2 text-sm bg-accent/10 border border-accent/30 text-accent rounded-xl hover:bg-accent/20 transition-colors shrink-0">
          + New {tab === 'bounties' ? 'Bounty' : 'Internship'}
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 border-b border-border pb-0">
        {(['bounties', 'internships'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-accent text-accent'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}>
            {t === 'bounties' ? '🎯 Hardware Bounties' : '🏢 Micro-Internships'}
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted">
              {t === 'bounties' ? hardwareBounties.length : microInternships.length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'bounties'
        ? <BountiesSection bounties={hardwareBounties} onDelete={deleteHardwareBounty} onPublish={publishHardwareBounty} />
        : <InternshipsSection internships={microInternships} onDelete={deleteMicroInternship} onPublish={publishMicroInternship} />
      }

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModal(false)}>
          <div className="bg-surface-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl"
            onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-text-primary mb-2">
              Create New {tab === 'bounties' ? 'Bounty' : 'Internship'}
            </h2>
            <p className="text-sm text-text-muted mb-4">
              Full form integration coming soon. Use the table actions to manage existing listings.
            </p>
            <button onClick={() => setModal(false)}
              className="w-full py-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm hover:bg-accent/20 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
