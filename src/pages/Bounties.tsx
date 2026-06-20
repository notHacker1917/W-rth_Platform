import { useState, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import type { Bounty, BountyStatus } from '../types';
import { MOCK_BOUNTIES, getUserById } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import { formatRelativeTime } from '../utils/time';

interface OutletCtx { searchQuery: string; }

// ─── BountyCard ────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: BountyStatus }) {
  const cfg = {
    open:      { label: 'Open',      cls: 'bg-status-success/10 text-status-success border-status-success/20' },
    reviewing: { label: 'Reviewing', cls: 'bg-status-warn/10 text-status-warn border-status-warn/20' },
    closed:    { label: 'Closed',    cls: 'bg-surface-elevated text-text-muted border-border' },
  }[status];
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function BountyCard({ bounty }: { bounty: Bounty }) {
  const company = getUserById(bounty.companyId);
  if (!company) return null;

  const deadline = new Date(bounty.deadline);
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86_400_000));
  const isUrgent = daysLeft <= 7 && bounty.status === 'open';

  return (
    <Link
      to={`/bounties/${bounty.id}`}
      className="block bg-surface-card border border-border rounded-xl p-5 hover:border-accent/50
                 hover:shadow-md hover:shadow-accent/10 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar src={company.avatarUrl} alt={company.name} size="sm" />
          <span className="text-xs text-text-muted truncate">{company.name}</span>
        </div>
        <StatusPill status={bounty.status} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors leading-snug mb-2">
        {bounty.title}
      </h3>

      {/* Description excerpt */}
      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-3">
        {bounty.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {bounty.tags.slice(0, 4).map(tag => (
          <span key={tag} className="text-xs bg-surface-elevated text-text-muted px-2 py-0.5 rounded-md border border-border">
            {tag}
          </span>
        ))}
        {bounty.tags.length > 4 && (
          <span className="text-xs text-text-muted px-1">+{bounty.tags.length - 4}</span>
        )}
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
        <div className="flex items-center gap-3">
          {/* Reward */}
          <div className="flex items-center gap-1 text-accent font-semibold text-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {bounty.reward}
          </div>
          {/* Duration */}
          <span className="text-xs text-text-muted">· {bounty.duration}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted shrink-0">
          {/* Deadline */}
          <span className={isUrgent ? 'text-status-warn font-medium' : ''}>
            {daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
          </span>
          {/* Applicants */}
          <span>{bounty.applicationCount} applied</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Filter bar ────────────────────────────────────────────────────────────

type StatusFilter = 'all' | BountyStatus;
const STATUS_OPTS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Closed', value: 'closed' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Bounties() {
  const { searchQuery } = useOutletContext<OutletCtx>();
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [bounties, setBounties] = useState<Bounty[]>(MOCK_BOUNTIES);

  const filtered = useMemo(() => {
    let result = bounties;
    if (statusFilter !== 'all') result = result.filter(b => b.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => {
        const company = getUserById(b.companyId);
        return (
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some(t => t.toLowerCase().includes(q)) ||
          company?.name.toLowerCase().includes(q)
        );
      });
    }
    return result;
  }, [bounties, statusFilter, searchQuery]);

  const handleNewBounty = (bounty: Bounty) => {
    setBounties(prev => [bounty, ...prev]);
  };

  return (
    <div className="space-y-4 pb-20 lg:pb-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Bounties & Micro-Internships</h1>
          <p className="text-xs text-text-muted mt-0.5">Short-term paid opportunities from companies</p>
        </div>
        {currentUser?.role === 'company' && (
          <Link
            to="/bounties/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover
                       text-text-primary text-sm font-semibold transition-colors shrink-0 min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post Bounty
          </Link>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex gap-1 bg-surface-card border border-border rounded-xl p-1">
        {STATUS_OPTS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={[
              'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
              statusFilter === opt.value
                ? 'bg-accent text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Stats strip */}
      <div className="flex gap-4 text-xs text-text-muted px-1">
        <span><strong className="text-text-primary">{bounties.filter(b => b.status === 'open').length}</strong> open</span>
        <span><strong className="text-text-primary">{filtered.length}</strong> showing</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-surface-card border border-border rounded-xl p-12 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-medium text-text-primary">No bounties found</p>
          <p className="text-sm text-text-muted mt-1">
            {searchQuery ? `No results for "${searchQuery}"` : 'Check back soon for new opportunities.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map(b => <BountyCard key={b.id} bounty={b} />)}
        </div>
      )}
    </div>
  );
}
