import { existsSync, readFileSync, writeFileSync, renameSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import bcrypt from 'bcryptjs';
import { config } from './config.js';

/**
 * A pragmatic, dependency-free persistence layer.
 *
 * On first boot it loads `data/seed.json` (extracted verbatim from the
 * frontend mock data), augments every user with a login email + bcrypt
 * password hash, and writes a mutable `data/db.json`. All subsequent reads
 * and writes go through db.json with debounced atomic saves.
 *
 * This keeps the backend genuinely deploy-anywhere (no DB server to
 * provision) while still persisting across restarts. The DB type is
 * intentionally loose (`any[]`) because it mirrors the frontend's rich,
 * evolving domain types without duplicating them here.
 */

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  name: string;
  [key: string]: unknown;
}

export interface DB {
  users: StoredUser[];
  badges: any[];
  posts: any[];
  jobs: any[];
  bounties: any[];
  projects: any[];
  lectureMaterials: any[];
  initiatives: any[];
  qaChannels: any[];
  deadlines: any[];
  communities: any[];
  events: any[];
  news: any[];
  jobListings: any[];
  githubPortfolios: Record<string, any>;
  notifications: any[];
  admin: {
    analyticsMetrics: any[];
    roiData: any[];
    gdprRecords: any[];
    hardwareBounties: any[];
    microInternships: any[];
    projectValidations: any[];
    verificationAudit: any[];
    activityLogs: any[];
  };
  nexus: { members: any[]; threads: any[]; announcements: any[] };
  weFeed: any[];
}

const slug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');

function buildFromSeed(): DB {
  const seedPath = join(config.dataDir, 'seed.json');
  if (!existsSync(seedPath)) {
    throw new Error(`seed.json not found at ${seedPath}. Run \`npm run seed\` first.`);
  }
  const seed = JSON.parse(readFileSync(seedPath, 'utf-8'));
  const hash = bcrypt.hashSync(config.seedPassword, 10);

  const usedEmails = new Set<string>();
  const users: StoredUser[] = (seed.users ?? []).map((u: any) => {
    let email = `${slug(u.name) || u.id}@wurth-platform.dev`;
    if (usedEmails.has(email)) email = `${slug(u.name)}.${u.id}@wurth-platform.dev`;
    usedEmails.add(email);
    return { ...u, email, passwordHash: hash };
  });

  return {
    users,
    badges: seed.badges ?? [],
    posts: seed.posts ?? [],
    jobs: seed.jobs ?? [],
    bounties: seed.bounties ?? [],
    projects: seed.projects ?? [],
    lectureMaterials: seed.lectureMaterials ?? [],
    initiatives: seed.initiatives ?? [],
    qaChannels: seed.qaChannels ?? [],
    deadlines: seed.deadlines ?? [],
    communities: seed.communities ?? [],
    events: seed.events ?? [],
    news: seed.news ?? [],
    jobListings: seed.jobListings ?? [],
    githubPortfolios: seed.githubPortfolios ?? {},
    notifications: [],
    admin: seed.admin ?? {
      analyticsMetrics: [], roiData: [], gdprRecords: [], hardwareBounties: [],
      microInternships: [], projectValidations: [], verificationAudit: [], activityLogs: [],
    },
    nexus: seed.nexus ?? { members: [], threads: [], announcements: [] },
    weFeed: seed.weFeed ?? [],
  };
}

class Store {
  private db: DB;
  private readonly dbPath: string;
  private saveTimer: NodeJS.Timeout | null = null;

  constructor() {
    mkdirSync(config.dataDir, { recursive: true });
    this.dbPath = join(config.dataDir, 'db.json');
    if (existsSync(this.dbPath)) {
      this.db = JSON.parse(readFileSync(this.dbPath, 'utf-8'));
    } else {
      this.db = buildFromSeed();
      this.flush();
    }
  }

  get data(): DB {
    return this.db;
  }

  /** Debounced, atomic save (write temp then rename). */
  save(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.flush(), 150);
  }

  private flush(): void {
    const tmp = `${this.dbPath}.tmp`;
    writeFileSync(tmp, JSON.stringify(this.db, null, 2));
    renameSync(tmp, this.dbPath);
  }

  /** Reset back to seed state — handy for demos and tests. */
  reset(): void {
    this.db = buildFromSeed();
    this.flush();
  }
}

export const store = new Store();
export const db = () => store.data;
