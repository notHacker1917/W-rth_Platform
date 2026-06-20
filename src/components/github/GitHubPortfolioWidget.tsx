import { useState, useEffect } from 'react';
import { ActivityMatrix } from './ActivityMatrix';
import { FeaturedRepositoriesGrid } from './FeaturedRepositoriesGrid';
import { CollaborationBadgeSystem } from './CollaborationBadgeSystem';
import { GitHubErrorFallback } from './GitHubErrorFallback';
import { mockGitHubPortfolio } from '../../data/githubMockData';

// Inline types to avoid Vite module resolution issues
type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

interface ContributionGraph {
  totalContributions: number;
  contributionDays: ContributionDay[];
  pullRequestsCount: number;
  pullRequestsMerged: number;
  issuesOpened: number;
  issuesClosed: number;
}

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

interface CollaborationMetric {
  repositoryName: string;
  repositoryUrl: string;
  pullRequestsCount: number;
  commitsCount: number;
  role: 'collaborator' | 'contributor' | 'owner';
  organization?: string;
}

interface GitHubPortfolioData {
  username: string;
  repositoryList: GitHubRepository[];
  contributionGraph: ContributionGraph;
  collaborationMetrics: CollaborationMetric[];
  profileUrl: string;
  lastFetched: string;
}

type GitHubAnalyticsErrorType = 'PRIVATE_PROFILE' | 'RATE_LIMIT' | 'NOT_FOUND' | 'API_ERROR' | 'NO_DATA';

interface GitHubAnalyticsError {
  type: GitHubAnalyticsErrorType;
  message: string;
  retryable: boolean;
}

interface GitHubPortfolioWidgetProps {
  githubUsername?: string;
  onDataLoaded?: (data: GitHubPortfolioData) => void;
}

export function GitHubPortfolioWidget({ githubUsername = 'alex-mueller', onDataLoaded }: GitHubPortfolioWidgetProps) {
  const [portfolioData, setPortfolioData] = useState<GitHubPortfolioData | null>(null);
  const [error, setError] = useState<GitHubAnalyticsError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching GitHub data
  useEffect(() => {
    const fetchGitHubData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data loading - in production, this would call a real API
        // For now, we simulate different scenarios based on a random condition
        const shouldSucceed = Math.random() > 0.1; // 90% success rate for demo

        if (!shouldSucceed) {
          // Simulate different error scenarios
          const errorType = ['PRIVATE_PROFILE', 'RATE_LIMIT', 'API_ERROR'][Math.floor(Math.random() * 3)];
          throw {
            type: errorType as GitHubAnalyticsError['type'],
            message: `Failed to load GitHub data: ${errorType}`,
            retryable: true,
          };
        }

        // Use mock data for demonstration
        const data = mockGitHubPortfolio;
        setPortfolioData(data);
        onDataLoaded?.(data);
      } catch (err: any) {
        const apiError: GitHubAnalyticsError = {
          type: err.type || 'API_ERROR',
          message: err.message || 'Failed to load GitHub portfolio data',
          retryable: err.retryable !== false,
        };
        setError(apiError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubData();
  }, [githubUsername, onDataLoaded]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    // Trigger a refetch
    const fetchEvent = new Event('github-portfolio-retry');
    window.dispatchEvent(fetchEvent);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-surface-card border border-border rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-surface-elevated rounded w-1/2" />
            <div className="grid grid-cols-7 gap-1">
              {[...Array(49)].map((_, i) => (
                <div key={i} className="aspect-square bg-surface-elevated rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return <GitHubErrorFallback error={error} onRetry={handleRetry} />;
  }

  // Success State
  if (!portfolioData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with GitHub Link */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span>🐙</span> GitHub Portfolio Analytics
          </h2>
          <p className="text-xs text-text-muted mt-1">Technical competence verified through GitHub contributions</p>
        </div>
        <a
          href={portfolioData.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-xs font-medium text-accent-primary hover:text-accent-primary/80 border border-accent-primary/30 rounded-lg hover:border-accent-primary/50 transition flex items-center gap-1"
        >
          View Profile →
        </a>
      </div>

      {/* Component A: Activity Matrix */}
      <ActivityMatrix
        contributionDays={portfolioData.contributionGraph.contributionDays}
        totalContributions={portfolioData.contributionGraph.totalContributions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component B: Featured Repositories Grid (takes 2 columns on larger screens) */}
        <div className="lg:col-span-2">
          <FeaturedRepositoriesGrid repositories={portfolioData.repositoryList} />
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-4">
          <div className="bg-surface-card border border-border rounded-lg p-4">
            <p className="text-xs font-semibold text-text-primary mb-3">Quick Stats</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Public Repos</span>
                <span className="font-bold text-text-primary">{portfolioData.repositoryList.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-border pt-3">
                <span className="text-text-muted">Stars Earned</span>
                <span className="font-bold text-text-primary">
                  {portfolioData.repositoryList.reduce((sum, r) => sum + r.stargazersCount, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-border pt-3">
                <span className="text-text-muted">Contributions</span>
                <span className="font-bold text-text-primary">{portfolioData.contributionGraph.totalContributions}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-border pt-3">
                <span className="text-text-muted">Collaborations</span>
                <span className="font-bold text-text-primary">{portfolioData.collaborationMetrics.length}</span>
              </div>
            </div>
          </div>

          {/* Pull Request Stats */}
          <div className="bg-surface-card border border-border rounded-lg p-4">
            <p className="text-xs font-semibold text-text-primary mb-3">PR Activity</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Opened</span>
                <span className="font-bold">{portfolioData.contributionGraph.pullRequestsCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Merged</span>
                <span className="font-bold text-status-success">{portfolioData.contributionGraph.pullRequestsMerged}</span>
              </div>
              <div className="text-xs text-text-muted mt-2 pt-2 border-t border-border">
                Merge rate:{' '}
                <span className="font-bold text-text-primary">
                  {Math.round(
                    (portfolioData.contributionGraph.pullRequestsMerged / portfolioData.contributionGraph.pullRequestsCount) *
                      100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component C: Collaboration Badge System */}
      {portfolioData.collaborationMetrics.length > 0 && (
        <CollaborationBadgeSystem
          metrics={portfolioData.collaborationMetrics}
          totalPullRequests={portfolioData.contributionGraph.pullRequestsCount}
          pullRequestsMerged={portfolioData.contributionGraph.pullRequestsMerged}
        />
      )}
    </div>
  );
}
