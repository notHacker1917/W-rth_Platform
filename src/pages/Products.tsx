import { useState } from 'react';
import { WE_FEED_ITEMS, WE_TRENDING_TAGS } from '../data/weFeed';
import type { WEFeedItem, WEItemCategory } from '../data/weFeed';

// ─── Helpers ───────────────────────────────────────────────────────────────

const CAT_CONFIG: Record<WEItemCategory, { label: string; icon: string; color: string }> = {
  product:  { label: 'Product',         icon: '🔩', color: 'bg-accent/10 text-[#f2a0a0] border-accent/20'         },
  service:  { label: 'Service',          icon: '🛠',  color: 'bg-blue-500/10 text-blue-400 border-blue-400/20'    },
  news:     { label: 'News',             icon: '📰',  color: 'bg-green-500/10 text-green-400 border-green-400/20' },
  blog:     { label: 'Blog',             icon: '✍️',  color: 'bg-purple-500/10 text-purple-400 border-purple-400/20'},
  event:    { label: 'Event',            icon: '📅',  color: 'bg-orange-500/10 text-orange-400 border-orange-400/20'},
  career:   { label: 'Career',           icon: '💼',  color: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20'},
};

function timeAgo(iso: string) {
  const diffH = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}d ago`;
  return `${Math.floor(diffD / 30)}mo ago`;
}

// ─── Item Card ─────────────────────────────────────────────────────────────

function ItemCard({ item, featured }: { item: WEFeedItem; featured?: boolean }) {
  const [saved, setSaved] = useState(item.saved);
  const [votes, setVotes] = useState(item.upvotes);
  const [voted, setVoted] = useState(false);
  const cfg = CAT_CONFIG[item.category];

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    setVoted(v => !v);
    setVotes(n => voted ? n - 1 : n + 1);
  };

  if (featured) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-surface-card border border-border rounded-xl overflow-hidden hover:border-accent/40 transition-colors col-span-full sm:col-span-2"
      >
        {item.image && (
          <div className="h-52 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }}
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${cfg.color}`}>
              {cfg.icon} {cfg.label}
            </span>
            <span className="text-xs text-text-muted">{item.source}</span>
            <span className="text-xs text-text-muted ml-auto">{timeAgo(item.publishedAt)}</span>
          </div>
          <h3 className="font-bold text-text-primary text-base leading-snug mb-2 group-hover:text-accent transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-3">{item.summary}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.slice(0, 5).map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-border">
            <button onClick={handleVote} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${voted ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
              ▲ {votes}
            </button>
            <button onClick={(e) => { e.preventDefault(); setSaved(v => !v); }}
              className={`text-sm transition-colors ml-auto ${saved ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
              {saved ? '🔖 Saved' : '◻ Save'}
            </button>
            <span className="text-xs text-accent font-medium">Read more →</span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-surface-card border border-border rounded-xl overflow-hidden hover:border-accent/40 transition-colors"
    >
      {item.image && (
        <div className="h-36 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          <span className="text-[10px] text-text-muted ml-auto">{timeAgo(item.publishedAt)}</span>
        </div>
        <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1.5 group-hover:text-accent transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-text-muted line-clamp-3 mb-3">{item.summary}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[9px] px-1 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2.5 border-t border-border">
          <button onClick={handleVote} className={`flex items-center gap-1 text-xs font-medium transition-colors ${voted ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
            ▲ {votes}
          </button>
          <button onClick={(e) => { e.preventDefault(); setSaved(v => !v); }}
            className={`text-xs transition-colors ${saved ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
            {saved ? '🔖' : '◻'}
          </button>
          <span className="text-xs text-accent font-medium ml-auto">→</span>
        </div>
      </div>
    </a>
  );
}

// ─── Filter config ─────────────────────────────────────────────────────────

type FilterKey = 'all' | WEItemCategory;

const FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'all',     label: 'All',               icon: '🌐' },
  { key: 'product', label: 'Products',           icon: '🔩' },
  { key: 'service', label: 'Services',           icon: '🛠' },
  { key: 'news',    label: 'News',               icon: '📰' },
  { key: 'blog',    label: 'Blog',               icon: '✍️' },
  { key: 'event',   label: 'Events',             icon: '📅' },
  { key: 'career',  label: 'Career',             icon: '💼' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function Products() {
  const [filter, setFilter]   = useState<FilterKey>('all');
  const [search, setSearch]   = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const filtered = WE_FEED_ITEMS.filter(item => {
    const matchesCat    = filter === 'all' || item.category === filter;
    const matchesTag    = !tagFilter || item.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase());
    const matchesSearch = !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.summary.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesTag && matchesSearch;
  });

  const featured = filtered[0];
  const rest     = filtered.slice(1);

  // Stats
  const counts = FILTERS.slice(1).map(f => ({
    ...f,
    count: WE_FEED_ITEMS.filter(i => i.category === f.key).length,
  }));

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <img
              src="https://www.we-online.com/files/png1/favicon_we_2022.png"
              alt="Würth Elektronik"
              className="w-6 h-6 rounded"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <h1 className="text-2xl font-bold text-text-primary">Würth Elektronik</h1>
          </div>
          <p className="text-sm text-text-muted">Live feed · Products, Services, News & Events · {WE_FEED_ITEMS.length} items</p>
        </div>
        <a
          href="https://www.we-online.com/en/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm px-4 py-2 rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
        >
          Visit we-online.com →
        </a>
      </div>

      {/* stats strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {counts.map(c => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key as FilterKey)}
            className={`p-3 rounded-xl border text-center transition-colors ${filter === c.key ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface-card hover:border-accent/20'}`}
          >
            <p className="text-xl">{c.icon}</p>
            <p className="text-lg font-bold text-text-primary">{c.count}</p>
            <p className="text-[10px] text-text-muted">{c.label}</p>
          </button>
        ))}
      </div>

      {/* search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products, services, news…"
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 flex-1"
        />
        <div className="flex gap-1 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                filter === f.key
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'border-border text-text-muted hover:border-accent/20 hover:text-text-primary'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* trending tags */}
      <div>
        <p className="text-xs font-semibold text-text-muted mb-2">🔥 Trending Tags</p>
        <div className="flex gap-1.5 flex-wrap">
          {WE_TRENDING_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                tagFilter === tag
                  ? 'bg-accent/10 text-accent border-accent/30'
                  : 'border-border text-text-muted hover:border-accent/20 hover:text-text-primary'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No items match your filters.</p>
          <button onClick={() => { setFilter('all'); setSearch(''); setTagFilter(''); }} className="mt-2 text-sm text-accent hover:underline">Clear filters</button>
        </div>
      ) : (
        <>
          <p className="text-xs text-text-muted">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured && <ItemCard key={featured.id} item={featured} featured />}
            {rest.map(item => <ItemCard key={item.id} item={item} />)}
          </div>
        </>
      )}
    </div>
  );
}
