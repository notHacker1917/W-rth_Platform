/**
 * buildSeed.ts
 * Imports the original frontend mock-data modules (copied verbatim into
 * src/seed/source) and serializes every exported dataset to a single
 * seed.json that the backend store loads on first boot.
 *
 * The source files use only `import type` statements, so esbuild/tsx strip
 * them cleanly and the runtime objects are captured with full fidelity
 * (including resolved spreads like { ...getBadgeById(...) }).
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import * as mock from './source/mockData.js';
import * as admin from './source/adminMockData.js';
import * as jobs from './source/jobsMockData.js';
import * as github from './source/githubMockData.js';
import * as nexus from './source/nexusData.js';
import * as weFeed from './source/weFeed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const seed = {
  badges: mock.ALL_BADGES,
  users: mock.MOCK_USERS,
  posts: mock.MOCK_POSTS,
  jobs: mock.MOCK_JOBS,
  bounties: mock.MOCK_BOUNTIES,
  projects: mock.MOCK_PROJECTS,
  lectureMaterials: mock.MOCK_LECTURE_MATERIALS,
  initiatives: mock.MOCK_INITIATIVES,
  qaChannels: mock.MOCK_QA_CHANNELS,
  deadlines: mock.MOCK_DEADLINES,
  communities: mock.MOCK_COMMUNITIES,
  events: mock.MOCK_EVENTS,
  news: mock.MOCK_NEWS,
  jobListings: jobs.jobListings,
  githubPortfolios: { [github.mockGitHubPortfolio.username.toLowerCase()]: github.mockGitHubPortfolio },
  admin: {
    analyticsMetrics: admin.MOCK_ANALYTICS_METRICS,
    roiData: admin.MOCK_ROI_DATA,
    gdprRecords: admin.MOCK_GDPR_RECORDS,
    hardwareBounties: admin.MOCK_HARDWARE_BOUNTIES,
    microInternships: admin.MOCK_MICRO_INTERNSHIPS,
    projectValidations: admin.MOCK_PROJECT_VALIDATIONS,
    verificationAudit: admin.MOCK_VERIFICATION_AUDIT_TRAIL,
    activityLogs: admin.MOCK_ADMIN_ACTIVITY_LOGS,
  },
  nexus: {
    members: nexus.NEXUS_MEMBERS,
    threads: nexus.NEXUS_THREADS,
    announcements: nexus.NEXUS_ANNOUNCEMENTS,
  },
  weFeed: weFeed.WE_FEED_ITEMS,
};

const out = join(__dirname, '..', '..', 'data', 'seed.json');
writeFileSync(out, JSON.stringify(seed, null, 2));

const counts = Object.entries(seed)
  .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length : 'obj'}`)
  .join(', ');
console.log('Seed written to', out);
console.log(counts);
