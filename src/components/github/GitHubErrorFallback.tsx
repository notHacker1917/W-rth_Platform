// Inline types to avoid Vite module resolution issues
type GitHubAnalyticsErrorType = 'PRIVATE_PROFILE' | 'RATE_LIMIT' | 'NOT_FOUND' | 'API_ERROR' | 'NO_DATA';

interface GitHubAnalyticsError {
  type: GitHubAnalyticsErrorType;
  message: string;
  retryable: boolean;
}

interface GitHubErrorFallbackProps {
  error: GitHubAnalyticsError;
  onRetry?: () => void;
}

export function GitHubErrorFallback({ error, onRetry }: GitHubErrorFallbackProps) {
  const errorConfig = {
    PRIVATE_PROFILE: {
      icon: '🔒',
      title: 'GitHub Profile is Private',
      description: 'To showcase your technical competence, make your GitHub profile public. Public profiles help verify your skills and project work.',
      suggestion: 'Visit GitHub settings and change your profile visibility to public.',
    },
    RATE_LIMIT: {
      icon: '⏱️',
      title: 'API Rate Limit Exceeded',
      description: 'GitHub API is temporarily rate-limited. Please try again in a few moments.',
      suggestion: 'Wait a few minutes and refresh the page.',
    },
    NOT_FOUND: {
      icon: '🔍',
      title: 'GitHub Account Not Found',
      description: 'We couldn\'t find the GitHub account associated with your profile.',
      suggestion: 'Make sure your GitHub username is correctly linked in your profile settings.',
    },
    API_ERROR: {
      icon: '⚠️',
      title: 'Unable to Load GitHub Data',
      description: 'There was an issue connecting to GitHub. This might be a temporary service issue.',
      suggestion: 'Try refreshing the page or checking back later.',
    },
    NO_DATA: {
      icon: '📭',
      title: 'No GitHub Data Available',
      description: 'This GitHub account doesn\'t have any public repositories or contribution history yet.',
      suggestion: 'Start by creating your first repository or contributing to open-source projects.',
    },
  };

  const config = errorConfig[error.type];

  return (
    <div className="bg-surface-card border border-border rounded-lg p-8 text-center">
      {/* Icon */}
      <p className="text-5xl mb-4">{config.icon}</p>

      {/* Title and Description */}
      <h3 className="text-lg font-bold text-text-primary mb-2">{config.title}</h3>
      <p className="text-sm text-text-muted mb-4 max-w-md mx-auto leading-relaxed">{config.description}</p>

      {/* Suggestion */}
      <div className="bg-surface-background border border-border/50 rounded-lg p-4 mb-6 max-w-md mx-auto">
        <p className="text-xs text-text-muted">
          <span className="font-semibold text-text-primary">Suggestion: </span>
          {config.suggestion}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition font-medium text-sm"
          >
            Try Again
          </button>
        )}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-border text-text-primary rounded-lg hover:bg-surface-background transition font-medium text-sm"
        >
          Visit GitHub
        </a>
      </div>

      {/* Fallback Form Notice */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-text-muted mb-3">
          <span className="font-semibold">Alternative: </span>You can still showcase your work by uploading project documentation and hardware descriptions manually.
        </p>
        <button className="px-4 py-2 bg-surface-background border border-border text-text-primary rounded-lg hover:border-accent-primary/50 transition font-medium text-sm">
          Upload Project Manually
        </button>
      </div>
    </div>
  );
}
