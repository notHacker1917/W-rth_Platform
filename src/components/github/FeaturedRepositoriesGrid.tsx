// Inline types to avoid Vite module resolution issues
interface GitHubRepository {
  id: string;
  name: string;
  description: string;
  primaryLanguage: string;
  stargazersCount: number;
  forksCount: number;
  url: string;
  isFork: boolean;
  isPrivate: boolean;
}

interface FeaturedRepositoriesGridProps {
  repositories: GitHubRepository[];
}

const LANGUAGE_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  'C++': { bg: 'bg-blue-600/20', text: 'text-blue-700 dark:text-blue-400', icon: '⚡' },
  Python: { bg: 'bg-yellow-600/20', text: 'text-yellow-700 dark:text-yellow-400', icon: '🐍' },
  C: { bg: 'bg-gray-600/20', text: 'text-gray-700 dark:text-gray-400', icon: '🔧' },
  VHDL: { bg: 'bg-purple-600/20', text: 'text-purple-700 dark:text-purple-400', icon: '⚙️' },
  TypeScript: { bg: 'bg-blue-500/20', text: 'text-blue-700 dark:text-blue-400', icon: '📘' },
  Rust: { bg: 'bg-orange-600/20', text: 'text-orange-700 dark:text-orange-400', icon: '🦀' },
  Go: { bg: 'bg-cyan-600/20', text: 'text-cyan-700 dark:text-cyan-400', icon: '🚀' },
};

export function FeaturedRepositoriesGrid({ repositories }: FeaturedRepositoriesGridProps) {
  const featured = repositories.slice(0, 4);

  const getLanguageStyle = (lang: string) => {
    return LANGUAGE_COLORS[lang] || {
      bg: 'bg-surface-elevated',
      text: 'text-text-secondary',
      icon: '💻',
    };
  };

  return (
    <div className="bg-surface-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-primary">Featured Repositories</h3>
        <p className="text-xs text-text-muted mt-1">Top open-source and hardware firmware projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featured.map((repo) => {
          const langStyle = getLanguageStyle(repo.primaryLanguage);
          return (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-border bg-surface-background hover:border-accent-primary/50 hover:shadow-md transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">📦</span>
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition truncate">
                      {repo.name}
                    </h4>
                  </div>
                </div>
                {repo.isFork && <span className="text-xs px-2 py-1 rounded bg-surface-elevated text-text-muted">Fork</span>}
              </div>

              {/* Description */}
              <p className="text-xs text-text-muted line-clamp-2 mb-3 leading-relaxed">{repo.description}</p>

              {/* Language Badge */}
              <div className="mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${langStyle.bg} ${langStyle.text} border-current border-opacity-30`}>
                  {langStyle.icon} {repo.primaryLanguage}
                </span>
              </div>

              {/* Stats Footer */}
              <div className="flex items-center gap-4 pt-3 border-t border-border/50 text-xs text-text-muted">
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span className="font-semibold text-text-primary">{repo.stargazersCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🍴</span>
                  <span className="font-semibold text-text-primary">{repo.forksCount}</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {repositories.length > 4 && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent-primary hover:underline font-medium"
          >
            View all {repositories.length} repositories →
          </a>
        </div>
      )}
    </div>
  );
}
