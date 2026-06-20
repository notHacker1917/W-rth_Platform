// ─── User ──────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'company' | 'educator';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  avatarUrl: string;
  headline: string;          // e.g. "CS Junior @ MIT" or "Hiring Engineers"
  location: string;
  // Student-specific
  university?: string;
  graduationYear?: number;
  skills?: string[];
  // Company-specific
  industry?: string;
  size?: string;             // e.g. "51–200 employees"
  website?: string;
  // Shared social
  followersCount: number;
  followingCount: number;
  bio: string;
  joinedAt: string;          // ISO date string
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
  likedBy: string[];         // user IDs
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
  appliedBy: string[];       // user IDs
}

// ─── Project ───────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  authorId: string;          // always a student
  title: string;
  description: string;
  tags: string[];            // tech stack / topics
  imageUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
}

// ─── Lecture Material ──────────────────────────────────────────────────────

export type MaterialType = 'slides' | 'notes' | 'lab' | 'recording';

export interface LectureMaterial {
  id: string;
  authorId: string;          // educator user ID
  title: string;
  course: string;            // e.g. "EE401 — Power Electronics"
  type: MaterialType;
  uploadedAt: string;
  downloads: number;
  fileSize: string;          // e.g. "4.2 MB"
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
  partsUsed: string[];       // component/part names from companies
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
  linkedId?: string;         // bountyId or course code
  priority: 'high' | 'medium' | 'low';
}

// ─── Bounty ────────────────────────────────────────────────────────────────

export type BountyStatus = 'open' | 'reviewing' | 'closed';

export interface Bounty {
  id: string;
  companyId: string;
  title: string;
  description: string;           // full brief
  submissionRequirements: string; // what to deliver
  requirements: string[];        // skill/prereq bullets
  tags: string[];                // skill tags
  reward: string;                // e.g. "$750 cash", "Certificate + $500"
  duration: string;              // e.g. "2–4 weeks"
  deadline: string;              // ISO date string
  postedAt: string;
  applicationCount: number;
  appliedBy: string[];           // user IDs
  status: BountyStatus;
}

// ─── Notification (stub) ───────────────────────────────────────────────────

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
