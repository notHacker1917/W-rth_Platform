// GitHub Portfolio Analytics Types - Localized to avoid Vite module resolution issues

export interface GitHubRepository {
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

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
  level: ContributionLevel; // 0-4 intensity levels
}

export interface ContributionGraph {
  totalContributions: number;
  contributionDays: ContributionDay[];
  pullRequestsCount: number;
  pullRequestsMerged: number;
  issuesOpened: number;
  issuesClosed: number;
}

export interface CollaborationMetric {
  repositoryName: string;
  repositoryUrl: string;
  pullRequestsCount: number;
  commitsCount: number;
  role: 'collaborator' | 'contributor' | 'owner';
  organization?: string;
}

export interface GitHubPortfolioData {
  username: string;
  repositoryList: GitHubRepository[];
  contributionGraph: ContributionGraph;
  collaborationMetrics: CollaborationMetric[];
  profileUrl: string;
  lastFetched: string;
}

export type GitHubAnalyticsErrorType = 'PRIVATE_PROFILE' | 'RATE_LIMIT' | 'NOT_FOUND' | 'API_ERROR' | 'NO_DATA';

export interface GitHubAnalyticsError {
  type: GitHubAnalyticsErrorType;
  message: string;
  retryable: boolean;
}
