/**
 * NewsDigest.tsx
 * Würth Elektronik proprietary news feed — exclusively sourced from
 * https://rss.app/feeds/v1.1/1S6y5xcPbR8OEhcm.json
 */
import { useState } from 'react';
import { WE_FEED_ITEMS, WE_TRENDING_TAGS } from '../data/weFeed';
import type { WEFeedItem, WEItemCategory } from '../data/weFeed';

// ─── Category config ────────────────────────────────────────────────────────

const CATEGORIES: { key: WEItemCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all',     label: 'All Updates',   icon: '📡' },
  { key: 'news',    label: 'News',          icon: '📰' },
  { key: 'product', label: 'Products',      icon: '⚙️' },
  { key: 'service', label: 'Services',      icon: '🛠' },
  { key: 'blog',    label: 'Blog',          icon: '✍️' },
  { key: 'event',   label: 'Events',        icon: '📅' },
  { key: 'career',  label: 'Career',        icon: '💼' },
];

const CAT_STYLE: Record<WEItemCategory, { bg: string; text: string; border: string; label: string; icon: string }> = {
  news:    { bg: 'bg-[#0d2a45]',       text: 'text-[#5eaeff]',   border: 'border-[#1e4d7b]',        label: 'News',     icon: '📰' },
  product: { bg: 'bg-accent-deepest',   text: 'text-[#f2a0a0]',  border: 'border-accent-deep/40',   label: 'Product',  icon: '⚙️' },
  service: { bg: 'bg-status-warn/10',   text: 'text-status-warn', border: 'border-status-warn/25',  label: 'Service',  icon: '🛠' },
  blog:    { bg: 'bg-surface-elevated', text: 'text-text-muted',  border: 'border-border',           label: 'Blog',     icon: '✍️' },
  event:   { bg: 'bg-status-success/10',text: 'text-status-success',border:'border-status-success/25',label:'Event',   icon: '📅' },
  career:  { bg: 'bg-[#2a1f0d]',        text: 'text-status-warn', border: 'border-status-warn/25',  label: 'Career',   icon: '💼' },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffH  = Math.floor(diffMs / 3_600_000);
  if (diffH < 1)  return `${Math.floor(diffMs / 60_000)}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function readTime(text: string) {
  return Math.max(1, Math.ceil(text.split(' ').length / 200));
}

// ─── Featured card ───────────────────────────────────────────────────────────

function FeaturedCard({ item, onVote, onSave, voted, saved }:
  { item: WEFeedItem; onVote: () => void; onSave: () => void; voted: boolean; saved: boolean }) {
  const s = CAT_STYLE[item.category];
  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-colors group">
      {item.image && (
        <div className="h-52 overflow-hidden bg-surface-base">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }}
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${s.bg} ${s.text} ${s.border}`}>
            {s.icon} {s.label}
          </span>
          <span className="text-xs text-text-muted">{item.source}</span>
          <span className="text-xs text-text-muted ml-auto">{timeAgo(item.publishedAt)}</span>
        </div>
        <h3 className="font-bold text-text-primary text-lg leading-snug mb-2 group-hover:text-accent transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-3">{item.summary}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 5).map(t => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-3 border-t border-border flex-wrap">
          <button
            onClick={onVote}
            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${voted ? 'text-accent' : 'text-text-muted hover:text-accent'}`}
          >
            ▲ {item.upvotes + (voted ? 1 : 0)}
          </button>
          <span className="text-xs text-text-muted">⏱ {readTime(item.summary)} min read</span>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={onSave}
              className={`text-sm font-medium transition-colors ${saved ? 'text-accent' : 'text-text-muted hover:text-accent'}`}
            >
              {saved ? '🔖 Saved' : '○ Save'}
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-accent hover:underline"
            >
              Read more →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Compact card ────────────────────────────────────────────────────────────

function CompactCard({ item, onVote, onSave, voted, saved }:
  { item: WEFeedItem; onVote: () => void; onSave: () => void; voted: boolean; saved: boolean }) {
  const s = CAT_STYLE[item.category];
  return (
    <div className="group flex gap-4 bg-surface-card border border-border rounded-xl p-4 hover:border-accent/30 transition-colors">
      {item.image && (
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 hidden sm:block bg-surface-base">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${s.bg} ${s.text} ${s.border}`}>
            {s.icon} {s.label}
          </span>
          <span className="text-[10px] text-text-muted">{item.source}</span>
          <span className="text-[10px] text-text-muted ml-auto">{timeAgo(item.publishedAt)}</span>
        </div>
        <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1 group-hover:text-accent transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-text-muted line-clamp-2 mb-2">{item.summary}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[9px] px-1 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onVote}
            className={`flex items-center gap-1 text-xs font-semibold transition-colors ${voted ? 'text-accent' : 'text-text-muted hover:text-accent'}`}
          >
            ▲ {item.upvotes + (voted ? 1 : 0)}
          </button>
          <span className="text-[10px] text-text-muted">⏱ {readTime(item.summary)} min</span>
          <button
            onClick={onSave}
            className={`ml-auto text-xs transition-colors ${saved ? 'text-accent' : 'text-text-muted hover:text-accent'}`}
          >
            {saved ? '🔖' : '◻ Save'}
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-accent transition-colors"
          >
            ↗
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar panels ──────────────────────────────────────────────────────────

function TrendingPanel({ items }: { items: WEFeedItem[] }) {
  const top5 = [...items].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);
  return (
    <div className="bg-surface-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-bold text-text-primary">🔥 Trending</span>
        <span className="text-[10px] text-text-muted ml-auto">by upvotes</span>
      </div>
      <ol className="space-y-3">
        {top5.map((item, i) => {
          const s = CAT_STYLE[item.category];
          return (
            <li key={item.id} className="flex gap-2.5">
              <span className="text-xl font-black text-border/60 shrink-0 w-5 text-center leading-none pt-0.5">{i + 1}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary leading-snug line-clamp-2">{item.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[9px] font-bold px-1 py-0.5 rounded border ${s.bg} ${s.text} ${s.border}`}>{s.icon}</span>
                  <span className="text-[10px] text-text-muted">▲ {item.upvotes}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SavedPanel({ items }: { items: WEFeedItem[] }) {
  const saved = items.filter(i => i.saved);
  if (saved.length === 0) return null;
  return (
    <div className="bg-surface-card border border-border rounded-xl p-4">
      <p className="text-sm font-bold text-text-primary mb-3">🔖 Saved</p>
      <div className="space-y-2">
        {saved.map(item => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2 items-start group"
          >
            <span className="text-xs text-accent mt-0.5 shrink-0">▸</span>
            <p className="text-xs text-text-muted line-clamp-2 group-hover:text-text-primary transition-colors">{item.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function TagsPanel({ onTagClick }: { onTagClick: (tag: string) => void }) {
  return (
    <div className="bg-surface-card border border-border rounded-xl p-4">
      <p className="text-sm font-bold text-text-primary mb-3">🏷 Topics</p>
      <div className="flex flex-wrap gap-1.5">
        {WE_TRENDING_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatsPanel({ items }: { items: WEFeedItem[] }) {
  return (
    <div className="bg-surface-card border border-border rounded-xl p-4">
      <p className="text-sm font-bold text-text-primary mb-3">📂 By Category</p>
      <div className="space-y-1.5">
        {CATEGORIES.filter(c => c.key !== 'all').map(cat => {
          const count = items.filter(i => i.category === cat.key).length;
          const pct   = Math.round((count / items.length) * 100);
          return (
            <div key={cat.key} className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted w-16 shrink-0">{cat.icon} {cat.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-surface-base overflow-hidden">
                <div className="h-full rounded-full bg-accent/60" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[10px] text-text-muted font-mono w-4 text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page header ─────────────────────────────────────────────────────────────

function DigestHeader({ total }: { total: number }) {
  const day = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="bg-surface-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 flex-wrap">
      <img
        src="https://www.we-online.com/files/png1/favicon_we_2022.png"
        alt="Würth Elektronik"
        className="w-10 h-10 rounded-lg"
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
      <div>
        <h2 className="text-base font-bold text-text-primary leading-tight">Würth Elektronik News & Updates</h2>
        <p className="text-xs text-text-muted">{day} · Official feed from we-online.com</p>
      </div>
      <div className="ml-auto flex items-center gap-4 text-xs text-text-muted flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
          Live feed
        </span>
        <span>📄 {total} updates</span>
        <a
          href="https://www.we-online.com/en/news-center/overview"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline font-medium"
        >
          we-online.com →
        </a>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NewsDigest() {
  const [activeCategory, setActiveCat] = useState<WEItemCategory | 'all'>('all');
  const [search,         setSearch]    = useState('');
  const [showSaved,      setShowSaved] = useState(false);

  // Per-item voted/saved state (keyed by id)
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>(
    Object.fromEntries(WE_FEED_ITEMS.filter(i => i.saved).map(i => [i.id, true]))
  );

  const toggleVote = (id: string) => setVoted(v => ({ ...v, [id]: !v[id] }));
  const toggleSave = (id: string) => setSaved(s => ({ ...s, [id]: !s[id] }));

  const filtered = WE_FEED_ITEMS.filter(item => {
    const matchesCat   = activeCategory === 'all' || item.category === activeCategory;
    const matchesSaved = !showSaved || saved[item.id];
    const q            = search.toLowerCase();
    const matchSearch  = !search
      || item.title.toLowerCase().includes(q)
      || item.summary.toLowerCase().includes(q)
      || item.tags.some(t => t.toLowerCase().includes(q))
      || item.source.toLowerCase().includes(q);
    return matchesCat && matchesSaved && matchSearch;
  });

  // Sort: saved first, then by upvotes descending
  const sorted = [...filtered].sort((a, b) => {
    if (saved[a.id] && !saved[b.id]) return -1;
    if (!saved[a.id] && saved[b.id]) return 1;
    return (b.upvotes + (voted[b.id] ? 1 : 0)) - (a.upvotes + (voted[a.id] ? 1 : 0));
  });

  const featured = sorted[0];
  const rest     = sorted.slice(1);

  return (
    <div className="space-y-5">
      <DigestHeader total={WE_FEED_ITEMS.length} />

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCat(cat.key as WEItemCategory | 'all')}
            className={[
              'text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors',
              activeCategory === cat.key
                ? 'bg-accent/10 text-accent border-accent/30'
                : 'border-border text-text-muted hover:border-accent/20 hover:text-text-primary',
            ].join(' ')}
          >
            {cat.icon} {cat.label}
            <span className="ml-1.5 text-[10px] opacity-60">
              {cat.key === 'all' ? WE_FEED_ITEMS.length : WE_FEED_ITEMS.filter(i => i.category === cat.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search + saved toggle */}
      <div className="flex gap-2 items-center flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search articles, tags, products…"
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 flex-1 min-w-48"
        />
        <button
          onClick={() => setShowSaved(v => !v)}
          className={[
            'text-sm px-3 py-2 rounded-lg border transition-colors whitespace-nowrap',
            showSaved ? 'bg-accent/10 text-accent border-accent/30' : 'border-border text-text-muted hover:text-text-primary',
          ].join(' ')}
        >
          🔖 Saved
        </button>
        <span className="text-xs text-text-muted">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-muted bg-surface-card border border-border rounded-xl">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold text-text-primary">No results found</p>
          <p className="text-sm mt-1">Try a different filter or clear your search</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_280px] gap-5">

          {/* Main feed */}
          <div className="space-y-4 min-w-0">
            {featured && (
              <FeaturedCard
                item={featured}
                onVote={() => toggleVote(featured.id)}
                onSave={() => toggleSave(featured.id)}
                voted={!!voted[featured.id]}
                saved={!!saved[featured.id]}
              />
            )}
            <div className="space-y-3">
              {rest.map(item => (
                <CompactCard
                  key={item.id}
                  item={item}
                  onVote={() => toggleVote(item.id)}
                  onSave={() => toggleSave(item.id)}
                  voted={!!voted[item.id]}
                  saved={!!saved[item.id]}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <TrendingPanel items={WE_FEED_ITEMS} />
            <SavedPanel    items={WE_FEED_ITEMS.map(i => ({ ...i, saved: !!saved[i.id] }))} />
            <StatsPanel    items={WE_FEED_ITEMS} />
            <TagsPanel     onTagClick={tag => setSearch(tag)} />
          </div>
        </div>
      )}
    </div>
  );
}
