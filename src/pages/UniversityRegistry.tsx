import { useState, useMemo } from 'react';
import { UNIVERSITY_PROJECTS } from '../data/universityProjects';
import type { UniversityProject, UniversityProjectStatus, UniversityProjectDomain } from '../types';

// ─── Badge configs ────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<UniversityProjectStatus, { bg: string; text: string; border: string; dot: string; icon: string }> = {
  'In Progress':             { bg: 'bg-status-warn/10',    text: 'text-status-warn',    border: 'border-status-warn/30',    dot: 'bg-status-warn',    icon: '⚙' },
  'Completed':               { bg: 'bg-status-success/10', text: 'text-status-success', border: 'border-status-success/30', dot: 'bg-status-success', icon: '✓' },
  'Seeking Hardware Sponsor':{ bg: 'bg-accent-deepest',    text: 'text-[#f2a0a0]',      border: 'border-accent/30',         dot: 'bg-accent',         icon: '🔍' },
};

const DOMAIN_STYLE: Record<UniversityProjectDomain, { bg: string; text: string; border: string; icon: string }> = {
  'Electrical Engineering': { bg: 'bg-[#0d2a45]', text: 'text-[#5eaeff]', border: 'border-[#1e4d7b]', icon: '⚡' },
  'Electronics':            { bg: 'bg-[#1a0d2a]', text: 'text-[#c4a0ff]', border: 'border-[#4a1e7b]', icon: '🔌' },
};

const STATUS_OPTIONS: (UniversityProjectStatus | 'all')[] = [
  'all', 'In Progress', 'Completed', 'Seeking Hardware Sponsor',
];
const DOMAIN_OPTIONS: (UniversityProjectDomain | 'all')[] = [
  'all', 'Electrical Engineering', 'Electronics',
];

// ─── Stat strip ───────────────────────────────────────────────────────────────

function StatStrip() {
  const total      = UNIVERSITY_PROJECTS.length;
  const inProgress = UNIVERSITY_PROJECTS.filter(p => p.status === 'In Progress').length;
  const completed  = UNIVERSITY_PROJECTS.filter(p => p.status === 'Completed').length;
  const seeking    = UNIVERSITY_PROJECTS.filter(p => p.status === 'Seeking Hardware Sponsor').length;
  const totalContributors = UNIVERSITY_PROJECTS.reduce((s, p) => s + p.activeContributors, 0);

  const stats = [
    { label: 'Total Projects',   value: total,            color: 'text-text-primary' },
    { label: 'In Progress',      value: inProgress,       color: 'text-status-warn' },
    { label: 'Completed',        value: completed,        color: 'text-status-success' },
    { label: 'Seeking Sponsor',  value: seeking,          color: 'text-[#f2a0a0]' },
    { label: 'Contributors',     value: totalContributors,color: 'text-[#5eaeff]' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {stats.map(s => (
        <div key={s.label} className="bg-surface-card border border-border rounded-xl p-4 text-center">
          <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          <p className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wide font-semibold">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────

function RegistryCard({ project }: { project: UniversityProject }) {
  const [expanded, setExpanded] = useState(false);
  const ss = STATUS_STYLE[project.status];
  const ds = DOMAIN_STYLE[project.primaryDomain];

  return (
    <div className="bg-surface-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors group">

      {/* Badges row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${ds.bg} ${ds.text} ${ds.border}`}>
          {ds.icon} {project.primaryDomain}
        </span>
        <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${ss.bg} ${ss.text} ${ss.border} ml-auto`}>
          <span className={`w-1.5 h-1.5 rounded-full ${ss.dot} shrink-0`} />
          {project.status}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-text-primary leading-snug group-hover:text-accent transition-colors">
        {project.title}
      </h3>

      {/* Hosting chair */}
      <p className="text-[10px] text-text-muted font-medium leading-tight">
        🏛 {project.hostingChair}
      </p>

      {/* Contributors */}
      <div className="flex items-center gap-1.5">
        <div className="flex -space-x-1.5">
          {Array.from({ length: Math.min(project.activeContributors, 5) }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-card flex items-center justify-center text-[8px] text-text-muted font-bold"
              style={{ zIndex: 5 - i }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {project.activeContributors > 5 && (
            <div className="w-5 h-5 rounded-full bg-accent-deepest border border-surface-card flex items-center justify-center text-[8px] text-[#f2a0a0] font-bold">
              +{project.activeContributors - 5}
            </div>
          )}
        </div>
        <span className="text-[10px] text-text-muted">{project.activeContributors} active contributor{project.activeContributors !== 1 ? 's' : ''}</span>
      </div>

      {/* Summary */}
      <p className={`text-xs text-text-muted leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
        {project.summary}
      </p>
      {project.summary.length > 200 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-[10px] text-accent hover:underline self-start -mt-1"
        >
          {expanded ? 'Show less ↑' : 'Read more ↓'}
        </button>
      )}

      {/* Technical stack */}
      <div className="pt-3 border-t border-border">
        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-2">🔩 Technical Stack</p>
        <div className="flex flex-wrap gap-1">
          {project.technicalStack.map(t => (
            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-muted leading-tight">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UniversityRegistry() {
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<UniversityProjectStatus | 'all'>('all');
  const [domainFilter, setDomainFilter] = useState<UniversityProjectDomain | 'all'>('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return UNIVERSITY_PROJECTS.filter(p => {
      const matchSearch = !search
        || p.title.toLowerCase().includes(q)
        || p.hostingChair.toLowerCase().includes(q)
        || p.summary.toLowerCase().includes(q)
        || p.technicalStack.some(t => t.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchDomain = domainFilter === 'all' || p.primaryDomain === domainFilter;
      return matchSearch && matchStatus && matchDomain;
    });
  }, [search, statusFilter, domainFilter]);

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="bg-surface-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0d2a45] border border-[#1e4d7b] flex items-center justify-center text-xl shrink-0">
            🎓
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary">University–Würth Project Registry</h1>
            <p className="text-xs text-text-muted">Cross-faculty hardware initiatives · Würth Elektronik sponsored electronics</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-text-muted flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
            Live registry
          </span>
          <img
            src="https://www.we-online.com/files/png1/favicon_we_2022.png"
            alt="WE"
            className="w-5 h-5 rounded"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="font-semibold">Würth Elektronik Partner</span>
        </div>
      </div>

      {/* Stats */}
      <StatStrip />

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search projects, chairs, components, protocols…"
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 flex-1"
        />
        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value as UniversityProjectDomain | 'all')}
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent/50 shrink-0"
        >
          <option value="all">All Domains</option>
          {DOMAIN_OPTIONS.filter(d => d !== 'all').map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map(s => {
          const active = statusFilter === s;
          const style  = s !== 'all' ? STATUS_STYLE[s as UniversityProjectStatus] : null;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={[
                'text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors',
                active
                  ? style
                    ? `${style.bg} ${style.text} ${style.border}`
                    : 'bg-accent/10 text-accent border-accent/30'
                  : 'border-border text-text-muted hover:border-accent/20 hover:text-text-primary',
              ].join(' ')}
            >
              {s === 'all' ? `All (${UNIVERSITY_PROJECTS.length})` : s}
            </button>
          );
        })}
        <span className="ml-auto text-xs text-text-muted self-center">
          {filtered.length} of {UNIVERSITY_PROJECTS.length} project{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-surface-card border border-border rounded-xl p-12 text-center">
          <p className="text-4xl mb-3">🔭</p>
          <p className="font-semibold text-text-primary">No projects match your filters</p>
          <p className="text-sm text-text-muted mt-1">Try adjusting your search or clearing the filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <RegistryCard key={p.projectId} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
