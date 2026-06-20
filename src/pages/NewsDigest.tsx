import { useState } from 'react';
import { MOCK_NEWS } from '../data/mockData';
import { WE_NEWS } from '../data/weFeed';
import type { WEFeedItem } from '../data/weFeed';
import { useAuth } from '../context/AuthContext';
import type { NewsArticle, NewsCategory } from '../types';

// ─── Helpers ───────────────────────────────────────────────────────────────

const CATEGORIES: { key: NewsCategory | 'all' | 'wurth'; label: string; icon: string }[] = [
  { key: 'all',              label: 'All',                icon: '📡' },
  { key: 'wurth',            label: 'Würth Elektronik',  icon: '🔩' },
  { key: 'semiconductors',   label: 'Semiconductors',     icon: '💎' },
  { key: 'power-electronics',label: 'Power Electronics',  icon: '⚡' },
  { key: 'iot-embedded',     label: 'IoT & Embedded',     icon: '🤖' },
  { key: 'pcb-design',       label: 'PCB Design',         icon: '🔌' },
  { key: 'rf-wireless',      label: 'RF & Wireless',      icon: '📶' },
  { key: 'automotive',       label: 'Automotive',         icon: '🚗' },
  { key: 'ai-hardware',      label: 'AI Hardware',        icon: '🧠' },
  { key: 'industry',         label: 'Industry',           icon: '🌍' },
];

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffH  = Math.floor(diffMs / 3_600_000);
  if (diffH < 1)  return `${Math.floor(diffMs / 60_000)}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
}

function publishedDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Article Card ──────────────────────────────────────────────────────────

const CAT_COLOR: Record<string, string> = {
  'semiconductors':    'bg-blue-500/10 text-blue-400 border-blue-400/20',
  'power-electronics': 'bg-accent/10 text-[#f2a0a0] border-accent/20',
  'iot-embedded':      'bg-green-500/10 text-green-400 border-green-400/20',
  'pcb-design':        'bg-purple-500/10 text-purple-400 border-purple-400/20',
  'rf-wireless':       'bg-sky-500/10 text-sky-400 border-sky-400/20',
  'automotive':        'bg-orange-500/10 text-orange-400 border-orange-400/20',
  'ai-hardware':       'bg-pink-500/10 text-pink-400 border-pink-400/20',
  'industry':          'bg-yellow-500/10 text-yellow-400 border-yellow-400/20',
};

const CAT_LABEL: Record<string, { label: string; icon: string }> = Object.fromEntries(
  CATEGORIES.filter(c => c.key !== 'all').map(c => [c.key, { label: c.label, icon: c.icon }])
);

interface ArticleCardProps {
  article: NewsArticle;
  featured?: boolean;
  onUpvote: () => void;
  onSave: () => void;
}

function ArticleCard({ article, featured, onUpvote, onSave }: ArticleCardProps) {
  const cat = CAT_LABEL[article.category];

  if (featured) {
    return (
      <div className="bg-surface-card border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-colors group">
        {article.imageUrl && (
          <div className="h-48 overflow-hidden">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${CAT_COLOR[article.category]}`}>
              {cat?.icon} {cat?.label}
            </span>
            <span className="text-xs text-text-muted">{article.sourceLogoEmoji} {article.source}</span>
            <span className="text-xs text-text-muted ml-auto">{timeAgo(article.publishedAt)}</span>
          </div>
          <h3 className="font-bold text-text-primary text-base leading-snug mb-2 group-hover:text-accent transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-3">{article.summary}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={onUpvote} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${article.upvotedBy.includes('u1') ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
              ▲ {article.upvotes}
            </button>
            <span className="text-xs text-text-muted">⏱ {article.readTime} min read</span>
            <div className="ml-auto flex gap-2">
              <button onClick={onSave} className={`text-sm transition-colors ${article.saved ? 'text-accent' : 'text-text-muted hover:text-accent'}`} title={article.saved ? 'Unsave' : 'Save'}>
                {article.saved ? '🔖' : '○'} {article.saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-border rounded-xl p-4 hover:border-accent/30 transition-colors group flex gap-4">
      {article.imageUrl && (
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 hidden sm:block">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${CAT_COLOR[article.category]}`}>
            {cat?.icon} {cat?.label}
          </span>
          <span className="text-xs text-text-muted">{article.sourceLogoEmoji} {article.source}</span>
          <span className="text-xs text-text-muted ml-auto">{timeAgo(article.publishedAt)}</span>
        </div>
        <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1 group-hover:text-accent transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-text-muted line-clamp-2 mb-2">{article.summary}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={onUpvote} className={`flex items-center gap-1 text-xs font-medium transition-colors ${article.upvotedBy.includes('u1') ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
            ▲ {article.upvotes}
          </button>
          <span className="text-xs text-text-muted">⏱ {article.readTime} min</span>
          <button onClick={onSave} className={`ml-auto text-xs transition-colors ${article.saved ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
            {article.saved ? '🔖' : '◻ Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WE Feed Card ──────────────────────────────────────────────────────────

function WEItemCard({ item }: { item: WEFeedItem }) {
  const [saved, setSaved] = useState(item.saved);
  const [votes, setVotes] = useState(item.upvotes);
  const [voted, setVoted] = useState(false);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 bg-surface-card border border-border rounded-xl p-4 hover:border-accent/30 transition-colors"
    >
      {item.image && (
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 hidden sm:block">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-accent/10 text-[#f2a0a0] border-accent/20">
            🔩 WE
          </span>
          <span className="text-[10px] text-text-muted uppercase font-medium">{item.category}</span>
          <span className="text-[10px] text-text-muted ml-auto">{timeAgo(item.publishedAt)}</span>
        </div>
        <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1 group-hover:text-accent transition-colors line-clamp-2">{item.title}</h3>
        <p className="text-xs text-text-muted line-clamp-2 mb-2">{item.summary}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags.slice(0, 3).map(t => (
            <span key={t} className="text-[9px] px-1 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={e => { e.preventDefault(); setVoted(v => !v); setVotes(n => voted ? n - 1 : n + 1); }}
            className={`flex items-center gap-1 text-xs font-medium transition-colors ${voted ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
            ▲ {votes}
          </button>
          <button onClick={e => { e.preventDefault(); setSaved(v => !v); }}
            className={`ml-auto text-xs transition-colors ${saved ? 'text-accent' : 'text-text-muted hover:text-accent'}`}>
            {saved ? '🔖' : '◻ Save'}
          </button>
        </div>
      </div>
    </a>
  );
}

// ─── Trending sidebar ───────────────────────────────────────────────────────

function TrendingPanel({ articles }: { articles: NewsArticle[] }) {
  const top5 = [...articles].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);
  return (
    <div className="bg-surface-card border border-border rounded-xl p-4">
      <p className="text-sm font-semibold text-text-primary mb-3">🔥 Trending Today</p>
      <ol className="space-y-3">
        {top5.map((a, i) => (
          <li key={a.id} className="flex gap-2.5">
            <span className="text-xl font-extrabold text-border shrink-0 w-5 text-center">{i + 1}</span>
            <div>
              <p className="text-xs font-medium text-text-primary leading-snug line-clamp-2">{a.title}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{a.sourceLogoEmoji} {a.source} · ▲ {a.upvotes}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SavedPanel({ articles }: { articles: NewsArticle[] }) {
  const saved = articles.filter(a => a.saved);
  if (saved.length === 0) return null;
  return (
    <div className="bg-surface-card border border-border rounded-xl p-4">
      <p className="text-sm font-semibold text-text-primary mb-3">🔖 Saved Articles</p>
      <div className="space-y-2">
        {saved.map(a => (
          <div key={a.id} className="flex gap-2 items-start">
            <span className="text-xs text-accent mt-0.5">▸</span>
            <p className="text-xs text-text-muted line-clamp-2">{a.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Digest Header ─────────────────────────────────────────────────────────

function DigestHeader() {
  const today = new Date();
  const day   = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="bg-surface-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 flex-wrap">
      <div className="text-4xl">📡</div>
      <div>
        <h2 className="text-lg font-bold text-text-primary">Daily Electronics Digest</h2>
        <p className="text-sm text-text-muted">{day} · Curated from EE Times, Hackaday, Embedded Computing Design & more</p>
      </div>
      <div className="ml-auto flex gap-4 text-xs text-text-muted">
        <span>📰 {MOCK_NEWS.length} articles</span>
        <span>⚡ Updated hourly</span>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function NewsDigest() {
  const { currentUser } = useAuth();
  const [articles, setArticles]  = useState<NewsArticle[]>(MOCK_NEWS);
  const [activeCategory, setActiveCat] = useState<NewsCategory | 'all' | 'wurth'>('all');
  const [search, setSearch]     = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const upvote = (id: string) => {
    setArticles(arts => arts.map(a => {
      if (a.id !== id) return a;
      const hasVoted = a.upvotedBy.includes(currentUser?.id ?? 'u1');
      return {
        ...a,
        upvotes: hasVoted ? a.upvotes - 1 : a.upvotes + 1,
        upvotedBy: hasVoted
          ? a.upvotedBy.filter(uid => uid !== (currentUser?.id ?? 'u1'))
          : [...a.upvotedBy, currentUser?.id ?? 'u1'],
      };
    }));
  };

  const save = (id: string) => {
    setArticles(arts => arts.map(a => a.id === id ? { ...a, saved: !a.saved } : a));
  };

  const showWurthTab = activeCategory === 'wurth';

  const filtered = showWurthTab ? [] : articles.filter(a => {
    const matchesCat    = activeCategory === 'all' || a.category === activeCategory;
    const matchesSaved  = !showSaved || a.saved;
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase()) || a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSaved && matchesSearch;
  });

  const weFiltered = (activeCategory === 'all' || showWurthTab)
    ? WE_NEWS.filter(item =>
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const featured  = filtered[0];
  const rest      = filtered.slice(1);

  return (
    <div className="space-y-5">
      <DigestHeader />

      {/* category tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCat(cat.key as NewsCategory | 'all')}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              activeCategory === cat.key
                ? 'bg-accent/10 text-accent border-accent/30'
                : 'border-border text-text-muted hover:border-accent/20 hover:text-text-primary'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* search + saved */}
      <div className="flex gap-2 flex-wrap items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search articles, tags, sources…"
          className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 flex-1 min-w-48"
        />
        <button
          onClick={() => setShowSaved(v => !v)}
          className={`text-sm px-3 py-2 rounded-lg border transition-colors ${showSaved ? 'bg-accent/10 text-accent border-accent/30' : 'border-border text-text-muted hover:text-text-primary'}`}
        >
          🔖 Saved only
        </button>
        <span className="text-xs text-text-muted">{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 && weFiltered.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">No articles match your filters.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_280px] gap-5">
          {/* main feed */}
          <div className="space-y-4">
            {/* Standard articles (hidden in wurth-only tab) */}
            {!showWurthTab && featured && (
              <ArticleCard
                key={featured.id}
                article={featured}
                featured
                onUpvote={() => upvote(featured.id)}
                onSave={() => save(featured.id)}
              />
            )}
            {!showWurthTab && (
              <div className="space-y-3">
                {rest.map(a => (
                  <ArticleCard
                    key={a.id}
                    article={a}
                    onUpvote={() => upvote(a.id)}
                    onSave={() => save(a.id)}
                  />
                ))}
              </div>
            )}

            {/* Würth Elektronik live feed section */}
            {weFiltered.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src="https://www.we-online.com/files/png1/favicon_we_2022.png"
                    alt="WE"
                    className="w-4 h-4 rounded"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <p className="text-sm font-semibold text-text-primary">Würth Elektronik Live Feed</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-semibold">LIVE</span>
                  <a href="https://www.we-online.com/en/" target="_blank" rel="noopener noreferrer"
                    className="ml-auto text-xs text-text-muted hover:text-accent transition-colors">we-online.com →</a>
                </div>
                {weFiltered.map(item => <WEItemCard key={item.id} item={item} />)}
              </div>
            )}
          </div>

          {/* sidebar */}
          <div className="space-y-4">
            {!showWurthTab && <TrendingPanel articles={articles} />}
            {!showWurthTab && <SavedPanel articles={articles} />}

            {/* category breakdown */}
            <div className="bg-surface-card border border-border rounded-xl p-4">
              <p className="text-sm font-semibold text-text-primary mb-3">📂 By Category</p>
              <div className="space-y-1.5">
                {CATEGORIES.filter(c => c.key !== 'all' && c.key !== 'wurth').map(cat => {
                  const count = articles.filter(a => a.category === cat.key).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCat(cat.key as NewsCategory | 'all' | 'wurth')}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-surface-elevated transition-colors"
                    >
                      <span className="text-xs text-text-muted">{cat.icon} {cat.label}</span>
                      <span className="text-xs font-semibold text-text-primary">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* tags cloud */}
            <div className="bg-surface-card border border-border rounded-xl p-4">
              <p className="text-sm font-semibold text-text-primary mb-3">🏷 Popular Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {[...new Set(articles.flatMap(a => a.tags))].slice(0, 24).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearch(tag)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
