// ─── User ──────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'company' | 'educator' | 'corporate_admin';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;           // emoji
  tier: BadgeTier;
  category: 'contribution' | 'community' | 'learning' | 'achievement' | 'special';
  earnedAt?: string;      // ISO date — present when awarded to a user
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;         // XP awarded
  unlockedAt: string;     // ISO date
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  expiresAt?: string;
  credentialId: string;
  skills: string[];
  badgeUrl?: string;      // visual badge image or emoji
}

export type UserLevel = {
  level: number;
  title: string;          // e.g. "Explorer", "Champion"
  minXP: number;
  maxXP: number;
  color: string;          // tailwind color class suffix
};

export interface User {
  id: string;
  role: UserRole;
  name: string;
  avatarUrl: string;
  headline: string;
  location: string;
  // Student-specific
  university?: string;
  graduationYear?: number;
  skills?: string[];
  // Company-specific
  industry?: string;
  size?: string;
  website?: string;
  // Shared social
  followersCount: number;
  followingCount: number;
  bio: string;
  joinedAt: string;
  // Gamification
  points?: number;
  badges?: Badge[];
  achievements?: Achievement[];
  certificates?: Certificate[];
  interests?: string[];   // for NLP feed ranking
}

// ─── Post ──────────────────────────────────────────────────────────────────

export type PostType = 'text' | 'image' | 'link';

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  content: string;
  imageUrl?: string;
  linkPreview?: {
    url: string;
    title: string;
    description: string;
    imageUrl?: string;
  };
  likes: number;
  likedBy: string[];
  comments: Comment[];
  shares: number;
  createdAt: string;
  tags?: string[];
}

// ─── Job ───────────────────────────────────────────────────────────────────

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote';

export interface Job {
  id: string;
  companyId: string;
  title: string;
  location: string;
  type: JobType;
  salary?: string;
  description: string;
  requirements: string[];
  tags: string[];
  postedAt: string;
  applicationCount: number;
  appliedBy: string[];
}

// ─── Job Listing (Würth-specific) ──────────────────────────────────────────

export type JobCategory = 'Working Student' | 'Internship' | 'Research Assistant' | 'HiWi';

export type Department = 'Power Modules' | 'Wireless Connectivity & Sensors' | 'Embedded Systems';

export interface JobListing {
  id: string;
  title: string;
  department: Department;
  type: JobCategory;
  location: string;
  description: string;
  requiredSkills: string[];
  hardwareStack: string[];
  applicationUrl: string;
}

// ─── Project ───────────────────────────────────────────────────────────────

export type ProjectComplexity = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Project {
  id: string;
  authorId: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  repoUrl?: string;      // also used as codeLink
  liveUrl?: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  // ── Engineering metadata (WE-aligned projects) ──
  category?: string;               // e.g. 'Power Electronics', 'RF Communications'
  hardwareUsed?: string[];         // Würth component types
  complexityScore?: ProjectComplexity;
}

// ─── Lecture Material ──────────────────────────────────────────────────────

export type MaterialType = 'slides' | 'notes' | 'lab' | 'recording';

export interface LectureMaterial {
  id: string;
  authorId: string;
  title: string;
  course: string;
  type: MaterialType;
  uploadedAt: string;
  downloads: number;
  fileSize: string;
  tags: string[];
  published: boolean;
}

// ─── Student Initiative ────────────────────────────────────────────────────

export type InitiativeStatus = 'active' | 'completed' | 'pending-review';

export interface StudentInitiative {
  id: string;
  teamName: string;
  memberNames: string[];
  projectTitle: string;
  description: string;
  partsUsed: string[];
  companyName: string;
  endorsed: boolean;
  submittedAt: string;
  status: InitiativeStatus;
}

// ─── Q&A Channel ───────────────────────────────────────────────────────────

export interface QAChannel {
  id: string;
  topic: string;
  course: string;
  openQuestions: number;
  participants: number;
  lastActivityAt: string;
  tags: string[];
}

// ─── Deadline ──────────────────────────────────────────────────────────────

export type DeadlineType = 'bounty' | 'assignment' | 'lab-submission' | 'project-review';

export interface Deadline {
  id: string;
  title: string;
  type: DeadlineType;
  dueAt: string;
  course?: string;
  linkedId?: string;
  priority: 'high' | 'medium' | 'low';
}

// ─── GitHub Portfolio Analytics ────────────────────────────────────────────

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

// ─── Bounty ────────────────────────────────────────────────────────────────

export type BountyStatus = 'open' | 'reviewing' | 'closed';

export interface Bounty {
  id: string;
  companyId: string;
  title: string;
  description: string;
  submissionRequirements: string;
  requirements: string[];
  tags: string[];
  reward: string;
  duration: string;
  deadline: string;
  postedAt: string;
  applicationCount: number;
  appliedBy: string[];
  status: BountyStatus;
}

// ─── Community ─────────────────────────────────────────────────────────────

export type CommunityCategory =
  | 'study-group'
  | 'research-club'
  | 'hackathon-team'
  | 'industry-connect'
  | 'open-source'
  | 'mentorship-circle';

export interface Community {
  id: string;
  name: string;
  description: string;
  category: CommunityCategory;
  memberCount: number;
  tags: string[];
  createdAt: string;
  isJoined?: boolean;    // local toggle state default
  icon: string;          // emoji
  weeklyActivity: number; // posts per week
  isVerified?: boolean;
}

export type EventType = 'workshop' | 'hackathon' | 'talk' | 'networking' | 'competition';

export interface CommunityEvent {
  id: string;
  communityId: string;
  title: string;
  description: string;
  type: EventType;
  date: string;           // ISO date
  location: string;       // "Online" or physical
  attendeeCount: number;
  maxAttendees?: number;
  tags: string[];
  isRegistered?: boolean;
}

// ─── News ──────────────────────────────────────────────────────────────────

export type NewsCategory =
  | 'semiconductors'
  | 'power-electronics'
  | 'iot-embedded'
  | 'pcb-design'
  | 'rf-wireless'
  | 'automotive'
  | 'ai-hardware'
  | 'industry';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceLogoEmoji: string;
  category: NewsCategory;
  publishedAt: string;
  readTime: number;       // minutes
  upvotes: number;
  upvotedBy: string[];    // user IDs
  saved: boolean;
  imageUrl?: string;
  url: string;
  tags: string[];
  isSponsored?: boolean;
}

// ─── University–Würth Project Registry ─────────────────────────────────────

export type UniversityProjectStatus =
  | 'In Progress'
  | 'Completed'
  | 'Seeking Hardware Sponsor';

export type UniversityProjectDomain =
  | 'Electrical Engineering'
  | 'Electronics';

export interface UniversityProject {
  projectId: string;
  title: string;
  hostingChair: string;
  primaryDomain: UniversityProjectDomain;
  activeContributors: number;
  status: UniversityProjectStatus;
  technicalStack: string[];
  summary: string;
}

// ─── Notification ──────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}
