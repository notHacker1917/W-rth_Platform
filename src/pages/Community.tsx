import { useState } from 'react';
import { MOCK_COMMUNITIES, MOCK_EVENTS } from '../data/mockData';
import { NEXUS_MEMBERS, NEXUS_THREADS, NEXUS_ANNOUNCEMENTS, STATUS_CONFIG } from '../data/nexusData';
import type { Community, CommunityEvent, CommunityCategory, EventType } from '../types';

// ─── Helpers ───────────────────────────────────────────────────────────────

const CAT_LABELS: Record<CommunityCategory, string> = {
  'study-group':       'Study Group',
  'research-club':     'Research Club',
  'hackathon-team':    'Hackathon Team',
  'industry-connect':  'Industry Connect',
  'open-source':       'Open Source',
  'mentorship-circle': 'Mentorship Circle',
};

const CAT_COLOR: Record<CommunityCategory, string> = {
  'study-group':       'bg-blue-500/10 text-blue-400 border-blue-400/20',
  'research-club':     'bg-accent/10 text-[#f2a0a0] border-accent/20',
  'hackathon-team':    'bg-orange-500/10 text-orange-400 border-orange-400/20',
  'industry-connect':  'bg-green-500/10 text-green-400 border-green-400/20',
  'open-source':       'bg-purple-500/10 text-purple-400 border-purple-400/20',
  'mentorship-circle': 'bg-pink-500/10 text-pink-400 border-pink-400/20',
};

const EVENT_TYPE_COLOR: Record<EventType, string> = {
  workshop:    'bg-blue-500/10 text-blue-400 border-blue-400/20',
  hackathon:   'bg-orange-500/10 text-orange-400 border-orange-400/20',
  talk:        'bg-accent/10 text-[#f2a0a0] border-accent/20',
  networking:  'bg-green-500/10 text-green-400 border-green-400/20',
  competition: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20',
};

const EVENT_ICONS: Record<EventType, string> = {
  workshop:    '🔬',
  hackathon:   '⚡',
  talk:        '🎤',
  networking:  '🤝',
  competition: '🏆',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

// ─── Community Card ─────────────────────────────────────────────────────────

function CommunityCard({ community, onToggle }: { community: Community; onToggle: () => void }) {
  return (
    <div className="bg-surface-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors">
      {/* header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0">{community.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-text-primary">{community.name}</h3>
                {community.isVerified && (
                  <span title="Verified community" className="text-xs text-accent">✓</span>
                )}
              </div>
              <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full border mt-1 ${CAT_COLOR[community.category]}`}>
                {CAT_LABELS[community.category]}
              </span>
            </div>
            <button
              onClick={onToggle}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                community.isJoined
                  ? 'bg-accent/10 text-accent border-accent/30 hover:bg-accent/20'
                  : 'bg-surface-elevated border-border text-text-muted hover:border-accent/30 hover:text-text-primary'
              }`}
            >
              {community.isJoined ? '✓ Joined' : '+ Join'}
            </button>
          </div>
        </div>
      </div>

      {/* description */}
      <p className="text-sm text-text-muted leading-relaxed line-clamp-2">{community.description}</p>

      {/* tags */}
      <div className="flex flex-wrap gap-1.5">
        {community.tags.slice(0, 5).map(t => (
          <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-text-muted">
            {t}
          </span>
        ))}
      </div>

      {/* footer */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-1 border-t border-border">
        <span>👥 {community.memberCount.toLocaleString()} members</span>
        <span>💬 {community.weeklyActivity} posts/week</span>
      </div>
    </div>
  );
}

// ─── Event Card ─────────────────────────────────────────────────────────────

function EventCard({ event, onRegister }: { event: CommunityEvent; onRegister: () => void }) {
  const days     = daysUntil(event.date);
  const capacity = event.maxAttendees
    ? Math.round((event.attendeeCount / event.maxAttendees) * 100)
    : null;

  return (
    <div className="bg-surface-card border border-border rounded-xl p-4 hover:border-accent/30 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 mt-0.5">{EVENT_ICONS[event.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-text-primary leading-snug">{event.title}</h4>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize ${EVENT_TYPE_COLOR[event.type]}`}>
                  {event.type}
                </span>
                <span className="text-xs text-text-muted">📍 {event.location}</span>
              </div>
            </div>
            <button
              onClick={onRegister}
              className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                event.isRegistered
                  ? 'bg-status-success/10 text-status-success border-status-success/30'
                  : 'bg-surface-elevated border-border text-text-muted hover:border-accent/30 hover:text-text-primary'
              }`}
            >
              {event.isRegistered ? '✓ Registered' : 'Register'}
            </button>
          </div>

          <p className="text-xs text-text-muted mt-2 line-clamp-2">{event.description}</p>

          <div className="flex items-center gap-3 mt-2 text-xs text-text-muted flex-wrap">
            <span>🗓 {formatDate(event.date)}</span>
            <span className={`font-medium ${days <= 3 ? 'text-status-error' : days <= 7 ? 'text-status-warn' : 'text-text-muted'}`}>
              {days === 0 ? 'Today!' : days === 1 ? 'Tomorrow' : `In ${days} days`}
            </span>
            <span>👥 {event.attendeeCount}{event.maxAttendees ? `/${event.maxAttendees}` : ''}</span>
          </div>

          {capacity !== null && (
            <div className="mt-2">
              <div className="w-full h-1 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${capacity >= 90 ? 'bg-status-error' : capacity >= 70 ? 'bg-status-warn' : 'bg-status-success'}`}
                  style={{ width: `${capacity}%` }}
                />
              </div>
              <p className="text-[10px] text-text-muted mt-0.5">{capacity}% full</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

type Filter = 'all' | CommunityCategory;

export default function Community() {
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [events, setEvents]           = useState<CommunityEvent[]>(MOCK_EVENTS);
  const [filter, setFilter]           = useState<Filter>('all');
  const [search, setSearch]           = useState('');
  const [tab, setTab]                 = useState<'communities' | 'events' | 'nexus'>('communities');

  const toggleJoin = (id: string) => {
    setCommunities(cs =>
      cs.map(c => c.id === id ? { ...c, isJoined: !c.isJoined, memberCount: c.memberCount + (c.isJoined ? -1 : 1) } : c)
    );
  };

  const toggleRegister = (id: string) => {
    setEvents(evs =>
      evs.map(e => e.id === id ? { ...e, isRegistered: !e.isRegistered, attendeeCount: e.attendeeCount + (e.isRegistered ? -1 : 1) } : e)
    );
  };

  const filteredCommunities = communities.filter(c => {
    const matchesCat    = filter === 'all' || c.category === filter;
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const joinedCount = communities.filter(c => c.isJoined).length;
  const totalMembers = communities.reduce((s, c) => s + c.memberCount, 0);

  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Community</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {communities.length} communities · {totalMembers.toLocaleString()} total members · You've joined {joinedCount}
        </p>
      </div>

      {/* stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Communities',    value: communities.length,                  icon: '🏘' },
          { label: 'Joined',         value: joinedCount,                         icon: '✓' },
          { label: 'Upcoming Events',value: events.filter(e => daysUntil(e.date) >= 0).length, icon: '📅' },
          { label: 'Registered',     value: events.filter(e => e.isRegistered).length, icon: '🎟' },
        ].map(s => (
          <div key={s.label} className="bg-surface-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-xl font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div className="flex gap-1 p-1 bg-surface-card rounded-lg border border-border w-fit flex-wrap">
        {[
          { key: 'communities', label: '🏘 Communities' },
          { key: 'events',      label: '📅 Events' },
          { key: 'nexus',       label: '🏛 Nexus Spotlight' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as 'communities' | 'events' | 'nexus')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              tab === t.key ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'communities' && (
        <>
          {/* filters */}
          <div className="flex gap-2 flex-wrap items-center">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search communities or tags…"
              className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 w-52"
            />
            <div className="flex gap-1 flex-wrap">
              {(['all', 'study-group', 'research-club', 'hackathon-team', 'industry-connect', 'open-source', 'mentorship-circle'] as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors capitalize ${
                    filter === f
                      ? 'bg-accent/10 text-accent border-accent/30'
                      : 'border-border text-text-muted hover:border-accent/20 hover:text-text-primary'
                  }`}
                >
                  {f === 'all' ? '🌐 All' : CAT_LABELS[f as CommunityCategory]}
                </button>
              ))}
            </div>
          </div>

          {/* grid */}
          {filteredCommunities.length === 0 ? (
            <div className="text-center py-12 text-text-muted">No communities match your search.</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredCommunities.map(c => (
                <CommunityCard key={c.id} community={c} onToggle={() => toggleJoin(c.id)} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'events' && (
        <div className="space-y-3">
          {sortedEvents.map(e => (
            <EventCard key={e.id} event={e} onRegister={() => toggleRegister(e.id)} />
          ))}
        </div>
      )}

      {tab === 'nexus' && (
        <div className="space-y-6">
          {/* announcement feed */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📣</span>
              <h3 className="text-sm font-bold text-text-primary">This Week's Community Announcements</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-semibold ml-auto">LIVE</span>
            </div>
            <div className="space-y-2">
              {NEXUS_ANNOUNCEMENTS.map((a, i) => (
                <div key={i} className="flex items-start gap-3 bg-surface-card border border-border rounded-xl px-4 py-3 hover:border-accent/20 transition-colors">
                  <span className="text-lg shrink-0 mt-0.5">{a.icon}</span>
                  <p className="text-sm text-text-muted flex-1 leading-relaxed">{a.text}</p>
                  <span className="text-[10px] text-text-muted shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* member spotlight grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🏆</span>
              <h3 className="text-sm font-bold text-text-primary">Member Milestone Tracker</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {NEXUS_MEMBERS.map(m => {
                const cfg = STATUS_CONFIG[m.status];
                const pct = Math.min(100, Math.round((m.repPoints / m.repTarget) * 100));
                return (
                  <div key={m.id} className="bg-surface-card border border-border rounded-xl p-4 hover:border-accent/20 transition-colors">
                    <div className="flex items-center gap-2.5 mb-3">
                      <img src={m.avatar} alt={m.username} className="w-9 h-9 rounded-full bg-surface-elevated shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">@{m.username}</p>
                        <p className="text-xs text-text-muted">Lv {m.level} — {m.levelTitle}</p>
                      </div>
                      <span className={`shrink-0 flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded border ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{m.milestoneIcon}</span>
                      <p className="text-xs text-text-muted leading-snug">{m.milestone}</p>
                    </div>

                    {/* rep progress */}
                    <div className="mb-2">
                      <div className="flex justify-between text-[10px] text-text-muted mb-1">
                        <span>{m.repPoints} rep</span>
                        <span>{m.repTarget - m.repPoints} to {m.nextLevelTitle}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    {m.badgeUnlocked && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent">
                        🏅 {m.badgeUnlocked}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* unanswered thread monitor */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🧵</span>
              <h3 className="text-sm font-bold text-text-primary">Thread Monitor</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-400/20 font-semibold ml-auto">
                {NEXUS_THREADS.length} unanswered
              </span>
            </div>
            <div className="space-y-2">
              {NEXUS_THREADS.map(t => (
                <div key={t.id} className="bg-surface-card border border-border rounded-xl p-4 hover:border-accent/20 transition-colors">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-orange-500/10 text-orange-400 border-orange-400/20">
                      ⏱ {t.hoursUnanswered}h silent
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-blue-500/10 text-blue-400 border-blue-400/20">
                      {t.topic}
                    </span>
                    <span className="text-[10px] text-text-muted">@{t.authorUsername} · Lv {t.authorLevel}</span>
                    <span className="ml-auto text-[10px] text-accent font-semibold">AI Response Ready ✓</span>
                  </div>
                  <p className="text-sm text-text-primary font-medium leading-snug mb-2">"{t.question}"</p>
                  <div className="flex flex-wrap gap-1">
                    {t.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-3 text-center">
              Open the <span className="text-accent font-medium">🏛 Community Nexus panel</span> (bottom-left) to deploy AI responses
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
