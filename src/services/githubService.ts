/**
 * GitHub API Integration Service
 * 
 * This service provides integration with GitHub's GraphQL API to fetch portfolio data.
 * In production, this would make real API calls to GitHub.
 * 
 * GraphQL Query Example:
 * ```graphql
 * query GetUserPortfolio($userName:String!) {
 *   user(login: $userName) {
 *     repositories(first: 10, orderBy: {field: STARGAZERS, direction: DESC}) {
 *       nodes {
 *         name
 *         description
 *         primaryLanguage { name }
 *         stargazerCount
 *         forkCount
 *         url
 *         isFork
 *         isPrivate
 *       }
 *     }
 *     contributionsCollection {
 *       contributionCalendar {
 *         totalContributions
 *         weeks {
 *           contributionDays {
 *             date
 *             contributionCount
 *           }
 *         }
 *       }
 *     }
 *     pullRequests(first: 100) {
 *       totalCount
 *       nodes {
 *         state
 *         merged
 *       }
 *     }
 *     issues(first: 100) {
 *       totalCount
 *       nodes {
 *         state
 *       }
 *     }
 *   }
 * }
 * ```
 */

import {
  GitHubPortfolioData,
  GitHubAnalyticsError,
  GitHubRepository,
  ContributionDay,
  ContributionGraph,
  CollaborationMetric,
} from '../types/index';

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

interface GitHubAPIConfig {
  token: string;
  timeout?: number;
}

/**
 * Converts GitHub API response to our ContributionDay format
 */
function mapContributionDays(apiResponse: any): ContributionDay[] {
  const days: ContributionDay[] = [];

  apiResponse?.weeks?.forEach((week: any) => {
    week.contributionDays?.forEach((day: any) => {
      const count = day.contributionCount;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0 && count <= 4) level = 1;
      else if (count > 4 && count <= 8) level = 2;
      else if (count > 8 && count <= 12) level = 3;
      else if (count > 12) level = 4;

      days.push({
        date: day.date,
        count,
        level,
      });
    });
  });

  return days;
}

/**
 * Converts GitHub repository API response to our format
 */
function mapRepositories(apiResponse: any[]): GitHubRepository[] {
  return apiResponse.map((repo) => ({
    id: repo.id || repo.name,
    name: repo.name,
    description: repo.description || '',
    primaryLanguage: repo.primaryLanguage?.name || 'Unknown',
    stargazersCount: repo.stargazerCount || 0,
    forksCount: repo.forkCount || 0,
    url: repo.url,
    isFork: repo.isFork,
    isPrivate: repo.isPrivate,
  }));
}

/**
 * Fetches user's GitHub portfolio data using GraphQL API
 * 
 * @param username - GitHub username
 * @param config - API configuration (token required)
 * @returns Promise<GitHubPortfolioData>
 * 
 * @throws GitHubAnalyticsError
 */
export async function fetchGitHubPortfolio(
  username: string,
  config: GitHubAPIConfig
): Promise<GitHubPortfolioData> {
  const timeout = config.timeout || 30000;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const query = `
      query GetUserPortfolio($userName:String!) {
        user(login: $userName) {
          repositories(first: 30, orderBy: {field: STARGAZERS, direction: DESC}, privacy: PUBLIC) {
            nodes {
              id
              name
              description
              primaryLanguage {
                name
              }
              stargazerCount
              forkCount
              url
              isFork
              isPrivate
            }
          }
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
          pullRequests(first: 100, states: MERGED) {
            totalCount
          }
          issues(first: 100, states: CLOSED) {
            totalCount
          }
        }
      }
    `;

    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`,
      },
      body: JSON.stringify({
        query,
        variables: { userName: username },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw {
          type: 'PRIVATE_PROFILE' as const,
          message: 'GitHub profile is private or token is invalid',
          retryable: true,
        };
      }
      if (response.status === 403) {
        throw {
          type: 'RATE_LIMIT' as const,
          message: 'GitHub API rate limit exceeded',
          retryable: true,
        };
      }
      throw {
        type: 'API_ERROR' as const,
        message: `GitHub API returned status ${response.status}`,
        retryable: true,
      };
    }

    const data = await response.json();

    if (data.errors?.[0]?.message?.includes('not found')) {
      throw {
        type: 'NOT_FOUND' as const,
        message: `GitHub user "${username}" not found`,
        retryable: false,
      };
    }

    if (data.errors) {
      throw {
        type: 'API_ERROR' as const,
        message: data.errors[0]?.message || 'GitHub API error',
        retryable: true,
      };
    }

    const userData = data.data?.user;

    if (!userData) {
      throw {
        type: 'NO_DATA' as const,
        message: 'No GitHub profile data available',
        retryable: false,
      };
    }

    const repositories = mapRepositories(userData.repositories.nodes || []);

    const contributionDays = mapContributionDays(
      userData.contributionsCollection?.contributionCalendar
    );

    const totalContributions =
      userData.contributionsCollection?.contributionCalendar?.totalContributions || 0;

    return {
      username,
      repositoryList: repositories,
      contributionGraph: {
        totalContributions,
        contributionDays,
        pullRequestsCount: userData.pullRequests?.totalCount || 0,
        pullRequestsMerged: userData.pullRequests?.totalCount || 0,
        issuesOpened: userData.issues?.totalCount || 0,
        issuesClosed: userData.issues?.totalCount || 0,
      },
      collaborationMetrics: [], // Would be populated from additional API calls
      profileUrl: `https://github.com/${username}`,
      lastFetched: new Date().toISOString(),
    };
  } catch (error: any) {
    // Handle network timeout
    if (error.name === 'AbortError') {
      throw {
        type: 'API_ERROR' as const,
        message: 'GitHub API request timed out',
        retryable: true,
      } as GitHubAnalyticsError;
    }

    // Re-throw if already a GitHubAnalyticsError
    if (error.type) {
      throw error;
    }

    throw {
      type: 'API_ERROR' as const,
      message: error.message || 'Failed to fetch GitHub portfolio data',
      retryable: true,
    } as GitHubAnalyticsError;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches collaboration metrics for a user across multiple repositories
 * Used to identify contributions to team projects, hackathon repos, etc.
 */
export async function fetchCollaborationMetrics(
  username: string,
  config: GitHubAPIConfig
): Promise<CollaborationMetric[]> {
  // This would query for repositories where the user has contributed but doesn't own
  // Implementation would be similar to fetchGitHubPortfolio

  return [];
}

/**
 * Validates if a GitHub username is accessible
 */
export async function validateGitHubUsername(username: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    return response.ok && response.status === 200;
  } catch {
    return false;
  }
}

/**
 * REST API alternative for simpler operations
 * Some data might be easier to fetch via REST API
 */
export async function fetchGitHubUserStats(username: string): Promise<{
  followers: number;
  following: number;
  publicRepos: number;
  profileUrl: string;
}> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error(`GitHub user not found: ${username}`);
    }

    const data = await response.json();

    return {
      followers: data.followers || 0,
      following: data.following || 0,
      publicRepos: data.public_repos || 0,
      profileUrl: data.html_url,
    };
  } catch (error) {
    throw {
      type: 'NOT_FOUND' as const,
      message: `Could not fetch GitHub user stats for "${username}"`,
      retryable: false,
    } as GitHubAnalyticsError;
  }
}
