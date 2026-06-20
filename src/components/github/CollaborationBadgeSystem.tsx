// Inline types to avoid Vite module resolution issues
interface CollaborationMetric {
  repositoryName: string;
  repositoryUrl: string;
  pullRequestsCount: number;
  commitsCount: number;
  role: 'collaborator' | 'contributor' | 'owner';
  organization?: string;
}

interface CollaborationBadgeSystemProps {
  metrics: CollaborationMetric[];
  totalPullRequests: number;
  pullRequestsMerged: number;
}

const ROLE_STYLES: Record<'collaborator' | 'contributor' | 'owner', { bg: string; text: string; icon: string }> = {
  collaborator: {
    bg: 'bg-blue-600/20',
    text: 'text-blue-700 dark:text-blue-400',
    icon: '👥',
  },
  contributor: {
    bg: 'bg-green-600/20',
    text: 'text-green-700 dark:text-green-400',
    icon: '🤝',
  },
  owner: {
    bg: 'bg-purple-600/20',
    text: 'text-purple-700 dark:text-purple-400',
    icon: '👑',
  },
};

export function CollaborationBadgeSystem({
  metrics,
  totalPullRequests,
  pullRequestsMerged,
}: CollaborationBadgeSystemProps) {
  const mergeRate = totalPullRequests > 0 ? Math.round((pullRequestsMerged / totalPullRequests) * 100) : 0;
  const totalTeamCommits = metrics.reduce((sum, m) => sum + m.commitsCount, 0);
  const totalTeamPRs = metrics.reduce((sum, m) => sum + m.pullRequestsCount, 0);

  return (
    <div className="bg-surface-card border border-border rounded-lg p-6">
      {/* Header with Key Metrics */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Team Collaboration Metrics</h3>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-surface-background border border-border/50">
            <div className="text-2xl font-bold text-accent-primary">{totalTeamPRs}</div>
            <div className="text-xs text-text-muted mt-1">Team PRs</div>
          </div>
          <div className="p-3 rounded-lg bg-surface-background border border-border/50">
            <div className="text-2xl font-bold text-status-success">{totalTeamCommits}</div>
            <div className="text-xs text-text-muted mt-1">Shared Commits</div>
          </div>
          <div className="p-3 rounded-lg bg-surface-background border border-border/50">
            <div className="text-2xl font-bold text-blue-600">{mergeRate}%</div>
            <div className="text-xs text-text-muted mt-1">Merge Rate</div>
          </div>
          <div className="p-3 rounded-lg bg-surface-background border border-border/50">
            <div className="text-2xl font-bold text-purple-600">{metrics.length}</div>
            <div className="text-xs text-text-muted mt-1">Projects</div>
          </div>
        </div>
      </div>

      {/* Collaboration Projects Grid */}
      <div className="space-y-3">
        {metrics.map((metric, idx) => {
          const roleStyle = ROLE_STYLES[metric.role];
          return (
            <a
              key={idx}
              href={metric.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg border border-border/50 bg-surface-background hover:border-accent-primary/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🔗</span>
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition truncate">
                      {metric.repositoryName}
                    </h4>
                  </div>
                  {metric.organization && (
                    <p className="text-xs text-text-muted mt-0.5">
                      📊 Organization: <span className="font-medium">{metric.organization}</span>
                    </p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold border whitespace-nowrap ${roleStyle.bg} ${roleStyle.text} border-current border-opacity-30`}
                >
                  {roleStyle.icon} {metric.role.charAt(0).toUpperCase() + metric.role.slice(1)}
                </span>
              </div>

              {/* Contribution Stats */}
              <div className="flex items-center gap-3 pt-3 border-t border-border/30 text-xs text-text-muted">
                <div className="flex items-center gap-1.5">
                  <span>🔀</span>
                  <span>
                    <span className="font-semibold text-text-primary">{metric.pullRequestsCount}</span> PRs
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>📝</span>
                  <span>
                    <span className="font-semibold text-text-primary">{metric.commitsCount}</span> commits
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Badge Section */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs font-semibold text-text-primary mb-3">Verified Contributions</p>
        <div className="flex flex-wrap gap-2">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${ROLE_STYLES[metric.role].bg} ${ROLE_STYLES[metric.role].text} border-current border-opacity-30 flex items-center gap-1.5`}
            >
              <span>{ROLE_STYLES[metric.role].icon}</span>
              <span>{metric.repositoryName}</span>
              <span className="opacity-70">•</span>
              <span className="font-bold">{metric.commitsCount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
