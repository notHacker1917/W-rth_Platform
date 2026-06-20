import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Deadline, DeadlineType } from '../types';
import {
  MOCK_DEADLINES,
  MOCK_LECTURE_MATERIALS,
  MOCK_QA_CHANNELS,
  MOCK_BOUNTIES,
  getUserById,
} from '../data/mockData';
import { formatRelativeTime } from '../utils/time';

// ─── Deadline helpers ──────────────────────────────────────────────────────

const DEADLINE_META: Record<DeadlineType, { label: string; icon: React.ReactNode; color: string }> = {
  'bounty': {
    label: 'Bounty',
    color: 'text-accent bg-accent-deepest border-accent-deep/40',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
  'assignment': {
    label: 'Assignment',
    color: 'text-status-warn bg-status-warn/10 border-status-warn/20',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>,
  },
  'lab-submission': {
    label: 'Lab',
    color: 'text-[#f87171] bg-[#f87171]/10 border-[#f87171]/20',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>,
  },
  'project-review': {
    label: 'Review',
    color: 'text-status-success bg-status-success/10 border-status-success/20',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>,
  },
};

const PRIORITY_DOT: Record<Deadline['priority'], string> = {
  high:   'bg-[#f87171]',
  medium: 'bg-status-warn',
  low:    'bg-surface-elevated border border-border',
};

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

function fmtDue(iso: string) {
  const d = daysUntil(iso);
  if (d < 0) return 'Overdue';
  if (d === 0) return 'Due today';
  if (d === 1) return 'Due tomorrow';
  return `${d}d left`;
}

// ─── Bounty Board card ─────────────────────────────────────────────────────

type AccessType = 'components' | 'workspace' | 'feedback';

const ACCESS_BADGE: Record<AccessType, { label: string; icon: React.ReactNode; cls: string }> = {
  components: {
    label: 'Component Access',
    cls: 'text-accent bg-accent-deepest border-accent-deep/40',
    icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>,
  },
  workspace: {
    label: 'Workspace Access',
    cls: 'text-status-success bg-status-success/10 border-status-success/20',
    icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
  feedback: {
    label: 'Technical Feedback',
    cls: 'text-status-warn bg-status-warn/10 border-status-warn/20',
    icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  },
};

// Map bounty IDs to the perk they feature prominently
const BOUNTY_PERKS: Record<string, AccessType> = {
  b1: 'workspace',
  b2: 'feedback',
  b3: 'components',
  b4: 'feedback',
  b5: 'workspace',
  b6: 'components',
};

// ─── Page ──────────────────────────────────────────────────────────────────

export default function StudentSandbox() {
  const [deadlines] = useState<Deadline[]>(
    [...MOCK_DEADLINES].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
  );

  const [boardFilter, setBoardFilter] = useState<AccessType | 'all'>('all');

  const recentMaterials = useMemo(
    () => MOCK_LECTURE_MATERIALS.filter(m => m.published).slice(0, 4),
    []
  );

  const openBounties = useMemo(() => {
    let list = MOCK_BOUNTIES.filter(b => b.status === 'open');
    if (boardFilter !== 'all') list = list.filter(b => (BOUNTY_PERKS[b.id] ?? 'components') === boardFilter);
    return list;
  }, [boardFilter]);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-1 h-8 rounded-full bg-accent shrink-0 mt-0.5" />
        <div>
          <h1 className="text-xl font-bold text-text-primary">Student Sandbox</h1>
          <p className="text-xs text-text-muted mt-0.5">Your workspace, deadlines, and live opportunities</p>
        </div>
      </div>

      {/* ══ THE HUB ═══════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">The Hub</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">

          {/* ── Upcoming Deadlines ──────────────────────────────────────── */}
          <div className="bg-surface-card border border-border rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wide">Upcoming Deadlines</h3>
              <span className="text-xs bg-accent-deepest text-[#f2a0a0] border border-accent-deep/40 px-2 py-0.5 rounded-full font-semibold">
                {deadlines.filter(d => daysUntil(d.dueAt) <= 7).length} this week
              </span>
            </div>

            <div className="space-y-2.5">
              {deadlines.slice(0, 5).map(dl => {
                const meta = DEADLINE_META[dl.type];
                const d = daysUntil(dl.dueAt);
                const urgent = d <= 3;
                return (
                  <div key={dl.id} className="flex items-start gap-2.5">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${PRIORITY_DOT[dl.priority]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md border ${meta.color}`}>
                          {meta.icon}{meta.label}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-text-primary mt-0.5 line-clamp-1">{dl.title}</p>
                      {dl.course && <p className="text-xs text-text-muted truncate">{dl.course}</p>}
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${urgent ? 'text-[#f87171]' : 'text-text-muted'}`}>
                      {fmtDue(dl.dueAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Downloaded Materials ────────────────────────────────────── */}
          <div className="bg-surface-card border border-border rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wide">Lecture Materials</h3>
              <span className="text-xs text-text-muted">{recentMaterials.length} available</span>
            </div>

            <div className="space-y-2.5">
              {recentMaterials.map(mat => {
                const typeColors: Record<string, string> = {
                  slides: 'text-accent',
                  notes: 'text-status-success',
                  lab: 'text-status-warn',
                  recording: 'text-[#f87171]',
                };
                return (
                  <a
                    key={mat.id}
                    href="#"
                    className="flex items-start gap-2.5 group"
                    onClick={e => e.preventDefault()}
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-base border border-border flex items-center justify-center shrink-0">
                      <svg className={`w-4 h-4 ${typeColors[mat.type] ?? 'text-text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary group-hover:text-accent transition-colors line-clamp-1">{mat.title}</p>
                      <p className="text-xs text-text-muted truncate">{mat.course}</p>
                      <p className="text-xs text-text-muted">{mat.fileSize} · {mat.downloads} downloads</p>
                    </div>
                    <svg className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── Open Q&A Channels ──────────────────────────────────────── */}
          <div className="bg-surface-card border border-border rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wide">Open Q&A Channels</h3>
              <span className="text-xs bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20 px-2 py-0.5 rounded-full font-semibold">
                {MOCK_QA_CHANNELS.reduce((s, c) => s + c.openQuestions, 0)} open
              </span>
            </div>

            <div className="space-y-2.5">
              {MOCK_QA_CHANNELS.map(ch => (
                <button key={ch.id} className="w-full text-left group">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent-deepest border border-accent-deep/40 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-[#f2a0a0]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                        {ch.topic}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-text-muted truncate">{ch.course}</span>
                        <span className="text-xs text-[#f87171] font-semibold shrink-0">{ch.openQuestions} unanswered</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button className="text-xs text-accent hover:text-[#f2a0a0] transition-colors font-medium mt-auto">
              Ask a new question →
            </button>
          </div>
        </div>
      </section>

      {/* ══ THE BOUNTY BOARD ══════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">The Bounty Board</span>
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted">{openBounties.length} active</span>
        </div>

        {/* Access type filter */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {(['all', 'components', 'workspace', 'feedback'] as const).map(f => {
            const badge = f !== 'all' ? ACCESS_BADGE[f] : null;
            return (
              <button
                key={f}
                onClick={() => setBoardFilter(f)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors min-h-[36px]',
                  boardFilter === f
                    ? 'bg-accent border-accent text-text-primary'
                    : 'bg-surface-card border-border text-text-muted hover:text-text-primary hover:border-accent/40',
                ].join(' ')}
              >
                {f === 'all' ? (
                  <>All Bounties</>
                ) : (
                  <>{badge!.icon} {badge!.label}</>
                )}
              </button>
            );
          })}
        </div>

        {/* Board grid */}
        {openBounties.length === 0 ? (
          <div className="bg-surface-card border border-border rounded-2xl p-10 text-center">
            <p className="text-lg mb-2">💰</p>
            <p className="text-sm font-medium text-text-primary">No bounties match this filter</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {openBounties.map(bounty => {
              const company = getUserById(bounty.companyId);
              const perk = BOUNTY_PERKS[bounty.id] ?? 'components';
              const perkBadge = ACCESS_BADGE[perk];
              const deadline = new Date(bounty.deadline);
              const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / 86_400_000));

              return (
                <Link
                  key={bounty.id}
                  to={`/bounties/${bounty.id}`}
                  className="block bg-surface-card border border-border rounded-2xl p-4 hover:border-accent/50
                             hover:shadow-md hover:shadow-accent/10 transition-all group relative overflow-hidden"
                >
                  {/* Subtle accent stripe */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Company + perk */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      {company && (
                        <img src={company.avatarUrl} alt={company.name}
                             className="w-5 h-5 rounded-full bg-surface-elevated ring-1 ring-border" />
                      )}
                      <span className="text-xs text-text-muted truncate">{company?.name}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0 ${perkBadge.cls}`}>
                      {perkBadge.icon} {perkBadge.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors leading-snug line-clamp-2 mb-2">
                    {bounty.title}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {bounty.tags.slice(0, 3).map(t => (
                      <span key={t} className="text-xs bg-surface-base border border-border text-text-muted px-1.5 py-0.5 rounded-md">
                        {t}
                      </span>
                    ))}
                    {bounty.tags.length > 3 && <span className="text-xs text-text-muted">+{bounty.tags.length - 3}</span>}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-border">
                    <span className="text-sm font-bold text-accent">{bounty.reward}</span>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <span>{bounty.duration}</span>
                      <span className={daysLeft <= 7 ? 'text-status-warn font-semibold' : ''}>
                        {daysLeft}d left
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
