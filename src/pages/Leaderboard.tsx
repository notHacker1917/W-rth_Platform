import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_USERS } from '../data/mockData';
import type { User, BadgeTier } from '../types';

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

function xpPercent(points: number) {
  const lvl = getLevel(points);
  if (lvl.maxXP === Infinity) return 100;
  return Math.round(((points - lvl.minXP) / (lvl.maxXP - lvl.minXP)) * 100);
}

const TIER_COLOR: Record<BadgeTier, string> = {
  bronze:   'text-[#cd7f32] bg-[#cd7f32]/10 border-[#cd7f32]/30',
  silver:   'text-[#a8a9ad] bg-[#a8a9ad]/10 border-[#a8a9ad]/30',
  gold:     'text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]/30',
  platinum: 'text-[#e5e4e2] bg-[#851a1a]/20 border-[#851a1a]/40',
};

// ─── Sub-components ────────────────────────────────────────────────────────

function BadgePip({ tier, icon, name }: { tier: BadgeTier; icon: string; name: string }) {
  return (
    <span
      title={name}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-sm ${TIER_COLOR[tier]}`}
    >
      {icon}
    </span>
  );
}

function XPBar({ points, color }: { points: number; color: string }) {
  const pct = xpPercent(points);
  return (
    <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

const PODIUM_RINGS = ['ring-[#ffd700]', 'ring-[#a8a9ad]', 'ring-[#cd7f32]'];
const PODIUM_BG    = ['bg-[#ffd700]/10', 'bg-[#a8a9ad]/10', 'bg-[#cd7f32]/10'];
const PODIUM_LABEL = ['🥇', '🥈', '🥉'];

function PodiumCard({ user, rank }: { user: User; rank: number }) {
  const lvl = getLevel(user.points ?? 0);
  return (
    <div className={`flex flex-col items-center gap-2 p-5 rounded-xl border border-border ${PODIUM_BG[rank]} text-center`}>
      <span className="text-2xl">{PODIUM_LABEL[rank]}</span>
      <img
        src={user.avatarUrl}
        alt={user.name}
        className={`w-16 h-16 rounded-full ring-2 ${PODIUM_RINGS[rank]}`}
      />
      <div>
        <p className="font-bold text-text-primary text-sm">{user.name}</p>
        <p className="text-xs text-text-muted">{user.headline.slice(0, 40)}…</p>
      </div>
      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: lvl.color, background: `${lvl.color}18`, border: `1px solid ${lvl.color}40` }}>
        Lv.{lvl.level} {lvl.title}
      </span>
      <p className="text-lg font-extrabold text-text-primary">{(user.points ?? 0).toLocaleString()} <span className="text-xs text-text-muted font-normal">XP</span></p>
      <div className="flex flex-wrap gap-1 justify-center mt-1">
        {(user.badges ?? []).slice(0, 4).map(b => (
          <BadgePip key={b.id} tier={b.tier} icon={b.icon} name={b.name} />
        ))}
      </div>
    </div>
  );
}

function RankRow({ user, rank }: { user: User; rank: number }) {
  const lvl  = getLevel(user.points ?? 0);
  const pts  = user.points ?? 0;
  const badges = user.badges ?? [];
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-surface-elevated transition-colors">
      {/* rank */}
      <span className="w-6 text-center font-bold text-text-muted text-sm shrink-0">{rank}</span>
      {/* avatar */}
      <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full ring-1 ring-border shrink-0" />
      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/profile/${user.id}`} className="text-sm font-semibold text-text-primary hover:text-accent transition-colors truncate">
            {user.name}
          </Link>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
            style={{ color: lvl.color, background: `${lvl.color}18`, border: `1px solid ${lvl.color}40` }}>
            Lv.{lvl.level} {lvl.title}
          </span>
        </div>
        <XPBar points={pts} color={lvl.color} />
      </div>
      {/* badges */}
      <div className="hidden sm:flex gap-1 shrink-0">
        {badges.slice(0, 3).map(b => (
          <BadgePip key={b.id} tier={b.tier} icon={b.icon} name={b.name} />
        ))}
        {badges.length > 3 && (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-elevated border border-border text-xs text-text-muted">
            +{badges.length - 3}
          </span>
        )}
      </div>
      {/* XP */}
      <span className="text-sm font-bold text-text-primary w-20 text-right shrink-0">
        {pts.toLocaleString()} <span className="text-xs text-text-muted font-normal">XP</span>
      </span>
    </div>
  );
}

// ─── Badge Catalogue Panel ─────────────────────────────────────────────────

import { ALL_BADGES } from '../data/mockData';

const CAT_LABELS: Record<string, string> = {
  contribution: '🛠 Contribution',
  community:    '🤝 Community',
  learning:     '📚 Learning',
  achievement:  '🏆 Achievement',
  special:      '🌟 Special',
};

function BadgeCatalogue() {
  const categories = [...new Set(ALL_BADGES.map(b => b.category))];
  return (
    <div className="space-y-4">
      {categories.map(cat => (
        <div key={cat}>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{CAT_LABELS[cat]}</p>
          <div className="grid grid-cols-1 gap-2">
            {ALL_BADGES.filter(b => b.category === cat).map(badge => (
              <div key={badge.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-elevated border border-border">
                <span className={`flex items-center justify-center w-9 h-9 rounded-full border text-lg shrink-0 ${TIER_COLOR[badge.tier]}`}>
                  {badge.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-semibold text-text-primary">{badge.name}</p>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${TIER_COLOR[badge.tier]}`}>
                      {badge.tier}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

type Tab = 'overall' | 'monthly';

const MONTHLY_MULTIPLIER: Record<string, number> = {
  u1: 0.6, u2: 0.4, u3: 0.7, u4: 0.3,
  u5: 0.5, u6: 0.25, u7: 0.55,
};

export default function Leaderboard() {
  const [tab, setTab]         = useState<Tab>('overall');
  const [showCat, setShowCat] = useState(false);

  const ranked = MOCK_USERS
    .filter(u => u.role !== 'corporate_admin')
    .map(u => {
      const base  = u.points ?? 0;
      const score = tab === 'monthly' ? Math.round(base * (MONTHLY_MULTIPLIER[u.id] ?? 0.4)) : base;
      return { ...u, score };
    })
    .sort((a, b) => b.score - a.score);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Leaderboard</h1>
          <p className="text-sm text-text-muted mt-0.5">Earn XP by contributing, completing bounties, and building community.</p>
        </div>
        <button
          onClick={() => setShowCat(v => !v)}
          className="text-sm px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
        >
          {showCat ? 'Hide' : '🎖 View'} All Badges
        </button>
      </div>

      {/* tab */}
      <div className="flex gap-1 p-1 bg-surface-card rounded-lg border border-border w-fit">
        {(['overall', 'monthly'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
              tab === t ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t === 'monthly' ? '📅 Monthly' : '🏆 Overall'}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          {/* podium */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {top3.map((u, i) => (
              <PodiumCard key={u.id} user={u} rank={i} />
            ))}
          </div>

          {/* rest of list */}
          <div className="bg-surface-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            <div className="px-4 py-2 flex items-center gap-4 text-xs text-text-muted uppercase tracking-wider font-semibold">
              <span className="w-6 text-center">#</span>
              <span className="flex-1">User</span>
              <span className="hidden sm:block w-24 text-right">Badges</span>
              <span className="w-20 text-right">XP</span>
            </div>
            {rest.map((u, i) => (
              <RankRow key={u.id} user={u} rank={i + 4} />
            ))}
          </div>

          {/* XP earn guide */}
          <div className="bg-surface-card border border-border rounded-xl p-4">
            <p className="text-sm font-semibold text-text-primary mb-3">How to earn XP</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                ['Post content',         '+10 XP'],
                ['Apply to a bounty',    '+50 XP'],
                ['Complete a bounty',    '+300 XP'],
                ['Answer a Q&A',         '+30 XP'],
                ['Get endorsed',         '+500 XP'],
                ['Earn a certificate',   '+200 XP'],
                ['Organise an event',    '+150 XP'],
                ['Join a community',     '+5 XP'],
                ['Daily login streak',   '+2 XP/day'],
              ].map(([action, xp]) => (
                <div key={action} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-surface-elevated text-xs">
                  <span className="text-text-muted">{action}</span>
                  <span className="font-bold text-status-success">{xp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* sidebar */}
        <div className="space-y-4">
          {/* level guide */}
          <div className="bg-surface-card border border-border rounded-xl p-4">
            <p className="text-sm font-semibold text-text-primary mb-3">Level Tiers</p>
            <div className="space-y-2">
              {LEVEL_THRESHOLDS.map(l => (
                <div key={l.level} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: `${l.color}20`, color: l.color, border: `1px solid ${l.color}40` }}>
                    {l.level}
                  </span>
                  <span className="text-sm font-medium text-text-primary flex-1">{l.title}</span>
                  <span className="text-xs text-text-muted">
                    {l.maxXP === Infinity ? `${l.minXP.toLocaleString()}+` : `${l.minXP}–${l.maxXP}`} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* badge catalogue toggle */}
          {showCat && (
            <div className="bg-surface-card border border-border rounded-xl p-4">
              <p className="text-sm font-semibold text-text-primary mb-3">Badge Catalogue</p>
              <BadgeCatalogue />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
