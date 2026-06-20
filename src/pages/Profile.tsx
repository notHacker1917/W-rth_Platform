import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../data/mockData';
import { GitHubPortfolioWidget } from '../components/github/GitHubPortfolioWidget';
import type { User, Badge, Achievement, Certificate, BadgeTier } from '../types';

// ─── Helpers ───────────────────────────────────────────────────────────────

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Newcomer',    minXP: 0,    maxXP: 99,   color: '#9ca3af' },
  { level: 2, title: 'Explorer',    minXP: 100,  maxXP: 299,  color: '#60a5fa' },
  { level: 3, title: 'Contributor', minXP: 300,  maxXP: 599,  color: '#34d399' },
  { level: 4, title: 'Expert',      minXP: 600,  maxXP: 999,  color: '#fbbf24' },
  { level: 5, title: 'Champion',    minXP: 1000, maxXP: 1999, color: '#f87171' },
  { level: 6, title: 'Legend',      minXP: 2000, maxXP: Infinity, color: '#a78bfa' },
];

function getLevel(points: number) {
  return LEVEL_THRESHOLDS.slice().reverse().find(l => points >= l.minXP) ?? LEVEL_THRESHOLDS[0];
}

const TIER_COLOR: Record<BadgeTier, string> = {
  bronze:   'text-[#cd7f32] bg-[#cd7f32]/10 border-[#cd7f32]/30',
  silver:   'text-[#a8a9ad] bg-[#a8a9ad]/10 border-[#a8a9ad]/30',
  gold:     'text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]/30',
  platinum: 'text-[#e5e4e2] bg-[#851a1a]/20 border-[#851a1a]/40',
};

const TIER_LABEL: Record<BadgeTier, string> = {
  bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum',
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffD  = Math.floor(diffMs / 86_400_000);
  if (diffD < 1)  return 'Today';
  if (diffD < 30) return `${diffD}d ago`;
  if (diffD < 365) return `${Math.floor(diffD / 30)}mo ago`;
  return `${Math.floor(diffD / 365)}y ago`;
}

// ─── XP Level Bar ──────────────────────────────────────────────────────────

function LevelBar({ points }: { points: number }) {
  const lvl = getLevel(points);
  const pct = lvl.maxXP === Infinity ? 100 : Math.round(((points - lvl.minXP) / (lvl.maxXP - lvl.minXP)) * 100);
  const nextLvl = LEVEL_THRESHOLDS.find(l => l.level === lvl.level + 1);

  return (
    <div className="bg-surface-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ color: lvl.color, background: `${lvl.color}18`, border: `1px solid ${lvl.color}40` }}
          >
            Lv.{lvl.level} — {lvl.title}
          </span>
        </div>
        <span className="text-sm font-bold text-text-primary">
          {points.toLocaleString()} <span className="text-xs text-text-muted font-normal">XP</span>
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-surface-elevated overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: lvl.color }}
        />
      </div>
      {nextLvl && (
        <p className="text-xs text-text-muted mt-1.5">
          {(nextLvl.minXP - points).toLocaleString()} XP to <span className="font-semibold" style={{ color: nextLvl.color }}>Lv.{nextLvl.level} {nextLvl.title}</span>
        </p>
      )}
    </div>
  );
}

// ─── Badge Shelf ───────────────────────────────────────────────────────────

function BadgeShelf({ badges }: { badges: Badge[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? badges : badges.slice(0, 8);

  if (badges.length === 0) {
    return (
      <div className="bg-surface-card border border-border rounded-xl p-4 text-center py-6">
        <p className="text-2xl mb-2">🎖️</p>
        <p className="text-sm text-text-muted">No badges yet — start contributing to earn some!</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-text-primary">Badges ({badges.length})</p>
        {badges.length > 8 && (
          <button onClick={() => setExpanded(v => !v)} className="text-xs text-accent hover:underline">
            {expanded ? 'Show less' : `Show all ${badges.length}`}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {shown.map(badge => (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center ${TIER_COLOR[badge.tier]}`}
          >
            <span className="text-2xl">{badge.icon}</span>
            <p className="text-xs font-semibold leading-tight">{badge.name}</p>
            <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${TIER_COLOR[badge.tier]}`}>
              {TIER_LABEL[badge.tier]}
            </span>
            {badge.earnedAt && (
              <p className="text-[10px] text-text-muted/70">{timeAgo(badge.earnedAt)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Achievement Timeline ──────────────────────────────────────────────────

function AchievementTimeline({ achievements }: { achievements: Achievement[] }) {
  const sorted = [...achievements].sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
  if (sorted.length === 0) {
    return (
      <div className="bg-surface-card border border-border rounded-xl p-4 text-center py-6">
        <p className="text-sm text-text-muted">No achievements yet.</p>
      </div>
    );
  }
  return (
    <div className="bg-surface-card border border-border rounded-xl p-4">
      <p className="text-sm font-semibold text-text-primary mb-4">Achievements</p>
      <div className="relative pl-5">
        {/* timeline line */}
        <div className="absolute left-1.5 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {sorted.map(ach => (
            <div key={ach.id} className="flex gap-3 relative">
              {/* dot */}
              <div className="absolute -left-[19px] w-3 h-3 rounded-full bg-accent border-2 border-surface-base shrink-0 mt-1" />
              <span className="text-xl shrink-0">{ach.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-text-primary">{ach.name}</p>
                  <span className="text-xs font-bold text-status-success">+{ach.points} XP</span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">{ach.description}</p>
                <p className="text-[10px] text-text-muted/60 mt-1">{timeAgo(ach.unlockedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Certificates ──────────────────────────────────────────────────────────

function CertificateCard({ cert }: { cert: Certificate }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-surface-elevated hover:border-accent/30 transition-colors">
      <span className="text-3xl shrink-0 mt-0.5">{cert.badgeUrl ?? '📜'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text-primary">{cert.title}</p>
        <p className="text-xs text-text-muted mt-0.5">Issued by <span className="font-medium">{cert.issuer}</span></p>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className="text-xs text-text-muted">
            📅 {new Date(cert.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="text-xs font-mono text-text-muted/60">ID: {cert.credentialId}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {cert.skills.map(s => (
            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-card border border-border text-text-muted">{s}</span>
          ))}
        </div>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full bg-status-success/10 text-status-success border border-status-success/20 shrink-0 self-start">
        Verified
      </span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

type ProfileTab = 'overview' | 'badges' | 'achievements' | 'certificates' | 'github-portfolio';

export default function Profile() {
  const { userId }      = useParams<{ userId?: string }>();
  const { currentUser } = useAuth();
  const [tab, setTab]   = useState<ProfileTab>('overview');

  const user: User | null = userId
    ? (getUserById(userId) ?? null)
    : currentUser;

  if (!user) {
    return (
      <div className="bg-surface-card border border-border rounded-xl p-8 text-center">
        <p className="text-3xl mb-3">👤</p>
        <p className="text-text-muted">User not found.</p>
      </div>
    );
  }

  const isOwn     = !userId || userId === currentUser?.id;
  const points    = user.points ?? 0;
  const lvl       = getLevel(points);
  const badges    = user.badges ?? [];
  const achs      = user.achievements ?? [];
  const certs     = user.certificates ?? [];

  const TABS: { key: ProfileTab; label: string; count?: number }[] = [
    { key: 'overview',     label: 'Overview'                  },
    { key: 'github-portfolio', label: 'GitHub Portfolio'     },
    { key: 'badges',       label: 'Badges',       count: badges.length },
    { key: 'achievements', label: 'Achievements', count: achs.length   },
    { key: 'certificates', label: 'Certificates', count: certs.length  },
  ];

  return (
    <div className="space-y-5">
      {/* profile hero */}
      <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
        {/* banner */}
        <div className="h-24 w-full" style={{ background: `linear-gradient(135deg, #851a1a 0%, #3b0a0a 100%)` }} />
        <div className="px-5 pb-5 -mt-10 relative">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex items-end gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-surface-base ring-2 ring-border bg-surface-elevated shrink-0"
              />
              <div className="mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-text-primary">{user.name}</h1>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ color: lvl.color, background: `${lvl.color}18`, border: `1px solid ${lvl.color}40` }}
                  >
                    Lv.{lvl.level} {lvl.title}
                  </span>
                </div>
                <p className="text-sm text-text-muted mt-0.5">{user.headline}</p>
                <p className="text-xs text-text-muted mt-0.5">📍 {user.location}</p>
              </div>
            </div>
            {isOwn && (
              <button className="mb-1 text-sm px-4 py-2 rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors">
                Edit Profile
              </button>
            )}
          </div>

          {/* bio */}
          <p className="text-sm text-text-muted mt-4 leading-relaxed">{user.bio}</p>

          {/* stats */}
          <div className="flex gap-5 mt-4 text-sm flex-wrap">
            <div className="text-center">
              <p className="font-bold text-text-primary">{user.followersCount.toLocaleString()}</p>
              <p className="text-xs text-text-muted">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-text-primary">{user.followingCount}</p>
              <p className="text-xs text-text-muted">Following</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-text-primary">{points.toLocaleString()}</p>
              <p className="text-xs text-text-muted">XP</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-text-primary">{badges.length}</p>
              <p className="text-xs text-text-muted">Badges</p>
            </div>
            {certs.length > 0 && (
              <div className="text-center">
                <p className="font-bold text-text-primary">{certs.length}</p>
                <p className="text-xs text-text-muted">Certificates</p>
              </div>
            )}
          </div>

          {/* badges preview strip */}
          {badges.length > 0 && (
            <div className="flex gap-1.5 mt-4 flex-wrap">
              {badges.slice(0, 6).map(b => (
                <span
                  key={b.id}
                  title={b.name}
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-base ${TIER_COLOR[b.tier]}`}
                >
                  {b.icon}
                </span>
              ))}
              {badges.length > 6 && (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-elevated border border-border text-xs text-text-muted">
                  +{badges.length - 6}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* tabs */}
      <div className="flex gap-0.5 p-1 bg-surface-card rounded-lg border border-border w-fit flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              tab === t.key ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`text-[10px] font-bold px-1 py-0.5 rounded-full ${tab === t.key ? 'bg-white/20' : 'bg-surface-elevated'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* tab content */}
      {tab === 'overview' && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          <div className="space-y-4">
            <LevelBar points={points} />
            {/* top achievements preview */}
            {achs.length > 0 && (
              <div className="bg-surface-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-text-primary">Recent Achievements</p>
                  <button onClick={() => setTab('achievements')} className="text-xs text-accent hover:underline">See all</button>
                </div>
                <div className="space-y-3">
                  {achs.slice(0, 3).map(ach => (
                    <div key={ach.id} className="flex items-start gap-3">
                      <span className="text-xl shrink-0">{ach.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-text-primary">{ach.name}</p>
                          <span className="text-xs font-bold text-status-success">+{ach.points} XP</span>
                        </div>
                        <p className="text-xs text-text-muted">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* skills */}
            {user.skills && user.skills.length > 0 && (
              <div className="bg-surface-card border border-border rounded-xl p-4">
                <p className="text-sm font-semibold text-text-primary mb-3">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-text-muted">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* sidebar */}
          <div className="space-y-4">
            {/* badge shelf preview */}
            {badges.length > 0 && (
              <div className="bg-surface-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-text-primary">Top Badges</p>
                  <button onClick={() => setTab('badges')} className="text-xs text-accent hover:underline">View all</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {badges.slice(0, 8).map(b => (
                    <div key={b.id} className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center ${TIER_COLOR[b.tier]}`}>
                      <span className="text-xl">{b.icon}</span>
                      <p className="text-[9px] font-semibold leading-tight">{b.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* certs preview */}
            {certs.length > 0 && (
              <div className="bg-surface-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-text-primary">Certificates</p>
                  <button onClick={() => setTab('certificates')} className="text-xs text-accent hover:underline">View all</button>
                </div>
                <div className="space-y-2">
                  {certs.slice(0, 2).map(c => (
                    <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-surface-elevated border border-border">
                      <span className="text-xl">{c.badgeUrl}</span>
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{c.title}</p>
                        <p className="text-[10px] text-text-muted">{c.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* joined date */}
            <div className="bg-surface-card border border-border rounded-xl p-4 text-xs text-text-muted space-y-1">
              <p>📅 Joined {new Date(user.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
              {user.university && <p>🎓 {user.university}</p>}
              {user.graduationYear && <p>🏛 Class of {user.graduationYear}</p>}
              {user.website && <p>🌐 <a href={user.website} className="text-accent hover:underline">{user.website.replace('https://', '')}</a></p>}
            </div>
          </div>
        </div>
      )}

      {tab === 'badges'       && <BadgeShelf badges={badges} />}
      {tab === 'achievements' && <AchievementTimeline achievements={achs} />}
      {tab === 'github-portfolio' && (
        <GitHubPortfolioWidget githubUsername={user.name.toLowerCase().replace(/\s+/g, '-')} />
      )}
      {tab === 'certificates' && (
        <div className="space-y-3">
          {certs.length === 0 ? (
            <div className="bg-surface-card border border-border rounded-xl p-8 text-center">
              <p className="text-3xl mb-2">📜</p>
              <p className="text-sm text-text-muted">No certificates yet.</p>
            </div>
          ) : certs.map(c => <CertificateCard key={c.id} cert={c} />)}
        </div>
      )}
    </div>
  );
}
