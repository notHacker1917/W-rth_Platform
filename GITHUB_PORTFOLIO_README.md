# GitHub Portfolio Analytics Module

## Overview

The GitHub Portfolio Analytics module provides a comprehensive system to showcase student technical competence through GitHub contributions, repositories, and collaboration metrics. It reduces hiring noise by providing verified, quantifiable evidence of engineering skills.

## Architecture

### Components

#### 1. **ActivityMatrix** (`components/github/ActivityMatrix.tsx`)
- Displays a GitHub-style contribution heat map showing the last 12 months of commits
- **Features:**
  - Color-coded intensity levels (0-4)
  - Scannable weekly grid layout
  - Month labels for context
  - Hover tooltips with contribution counts
  - Fully responsive design

#### 2. **FeaturedRepositoriesGrid** (`components/github/FeaturedRepositoriesGrid.tsx`)
- 2-column grid showcasing top 4 repositories
- **Features:**
  - Language tags with color-coded icons (C++, Python, VHDL, etc.)
  - Star and fork counts
  - Fork indicators
  - Direct GitHub links
  - "View all repositories" link

#### 3. **CollaborationBadgeSystem** (`components/github/CollaborationBadgeSystem.tsx`)
- Displays teamwork metrics and shared project contributions
- **Features:**
  - Role indicators (Collaborator, Contributor, Owner)
  - PR and commit statistics per repository
  - Merge rate calculation
  - Organization badges
  - Verified contribution highlights

#### 4. **GitHubErrorFallback** (`components/github/GitHubErrorFallback.tsx`)
- Clean error handling with guidance for different scenarios
- **Supported Error Types:**
  - `PRIVATE_PROFILE`: GitHub profile is private
  - `RATE_LIMIT`: API rate limit exceeded
  - `NOT_FOUND`: GitHub username not found
  - `API_ERROR`: General API failure
  - `NO_DATA`: No public repositories or contributions

#### 5. **GitHubPortfolioWidget** (`components/github/GitHubPortfolioWidget.tsx`)
- Main orchestrator component that coordinates all sub-components
- **Features:**
  - Manages loading states
  - Handles error scenarios with fallback UI
  - Fetches and displays all data
  - Quick stats sidebar
  - PR activity metrics
  - Responsive layout

## TypeScript Interfaces

### GitHubRepository
```typescript
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
```

### ContributionDay & ContributionGraph
```typescript
type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface ContributionDay {
  date: string; // YYYY-MM-DD
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
```

### CollaborationMetric
```typescript
interface CollaborationMetric {
  repositoryName: string;
  repositoryUrl: string;
  pullRequestsCount: number;
  commitsCount: number;
  role: 'collaborator' | 'contributor' | 'owner';
  organization?: string;
}
```

### GitHubPortfolioData
```typescript
interface GitHubPortfolioData {
  username: string;
  repositoryList: GitHubRepository[];
  contributionGraph: ContributionGraph;
  collaborationMetrics: CollaborationMetric[];
  profileUrl: string;
  lastFetched: string;
}
```

## Integration with Real GitHub APIs

### Setup

1. **Create a GitHub Personal Access Token:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Create a token with `public_repo` and `read:user` scopes
   - Store securely in environment variables

2. **Configure Environment Variables:**
   ```env
   VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx
   VITE_GITHUB_API_ENDPOINT=https://api.github.com/graphql
   ```

### Using the GitHub Service

```typescript
import { fetchGitHubPortfolio } from '../services/githubService';

// In your component or hook
const portfolioData = await fetchGitHubPortfolio('username', {
  token: import.meta.env.VITE_GITHUB_TOKEN,
  timeout: 30000, // 30 seconds
});
```

### GraphQL Query Example

The service uses this GraphQL query to fetch portfolio data:

```graphql
query GetUserPortfolio($userName:String!) {
  user(login: $userName) {
    repositories(first: 30, orderBy: {field: STARGAZERS, direction: DESC}, privacy: PUBLIC) {
      nodes {
        id
        name
        description
        primaryLanguage { name }
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
```

## Error Handling Strategy

The module implements a **graceful degradation** approach:

1. **Primary Flow**: Attempt to fetch GitHub data
2. **Error Detection**: Identify specific error type
3. **User Feedback**: Display tailored error message with next steps
4. **Fallback Option**: Offer manual project upload form as alternative

### Error Scenarios

| Error | Cause | User Action | Retryable |
|-------|-------|-------------|-----------|
| PRIVATE_PROFILE | GitHub profile visibility set to private | Make profile public in GitHub settings | Yes |
| RATE_LIMIT | API rate limit exceeded (60 req/hr unauthenticated) | Wait a few minutes and retry | Yes |
| NOT_FOUND | GitHub username doesn't exist | Verify username in profile settings | No |
| API_ERROR | Network or server error | Try again or contact support | Yes |
| NO_DATA | No public repos or contributions | Create repositories and make contributions | No |

## Integration in Profile Page

The GitHub Portfolio Analytics is integrated as a new tab in the Profile component:

```typescript
// In Profile.tsx
import { GitHubPortfolioWidget } from '../components/github/GitHubPortfolioWidget';

// Add to tab navigation
const TABS: { key: ProfileTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'github-portfolio', label: 'GitHub Portfolio' }, // ← New tab
  // ... other tabs
];

// Render widget when tab is selected
{tab === 'github-portfolio' && (
  <GitHubPortfolioWidget githubUsername={user.name.toLowerCase().replace(/\s+/g, '-')} />
)}
```

## Mock Data

Mock data is provided in `data/githubMockData.ts` for development and testing without API calls:

```typescript
import { mockGitHubPortfolio } from '../data/githubMockData';

// Use in components during development
const portfolioData = mockGitHubPortfolio;
```

## Styling & Theming

The module uses Tailwind CSS classes with semantic color variables:

- **Primary**: `accent-primary` (brand color)
- **Success**: `status-success` (green for merged PRs)
- **Language Colors**: Custom colors for each programming language
- **Role Colors**: 
  - Collaborator: Blue (`bg-blue-600/20`)
  - Contributor: Green (`bg-green-600/20`)
  - Owner: Purple (`bg-purple-600/20`)

## Performance Considerations

1. **Caching**: Consider caching GitHub data with a 1-hour TTL
2. **Pagination**: Uses first 30 repositories (adjust in GraphQL query)
3. **Load States**: Shows skeleton loaders while fetching
4. **Error Boundaries**: Component gracefully handles all error scenarios

## Future Enhancements

1. **Trending Repositories**: Show which repos had the most recent activity
2. **Language Distribution**: Pie chart of language breakdown
3. **Contribution Streak**: Highlight current contribution streaks
4. **Organization Affiliations**: Show GitHub organizations the user belongs to
5. **Collaborator Network**: Visualize co-contributors across projects
6. **Issue Tracker Stats**: Show bug-fixing and feature request engagement
7. **Code Quality Metrics**: Integrate with services like Codacy or SonarQube

## Testing

The module includes error simulation for testing:

```typescript
// In GitHubPortfolioWidget.tsx
const shouldSucceed = Math.random() > 0.1; // 90% success rate
// Simulate different error types for QA testing
```

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliant (WCAG AA)
- Tooltips provide context for icons

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive and touch-friendly

## Security

- GitHub tokens stored in environment variables (never in code)
- HTTPS only for API calls
- No sensitive data exposed in UI
- Token scoped to minimum required permissions
