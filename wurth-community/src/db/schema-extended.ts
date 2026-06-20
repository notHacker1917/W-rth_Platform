import { 
  sqliteTable, text, integer, real, index, primaryKey 
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 1: EMPIRICAL TELEMETRY & HARDWARE PORTFOLIO API
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Captures student's "digital twin" — hardware metrics, simulation data, technical progress
 */
export const hardwareProfiles = sqliteTable('hardware_profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull(),
  componentType: text('component_type', { 
    enum: ['mcu', 'sensor', 'power_stage', 'signal_chain', 'integration'] 
  }).notNull(),
  hardwareVersion: text('hardware_version'),
  schematicHash: text('schematic_hash'), // For tracking design changes
  calibrationDate: integer('calibration_date', { mode: 'timestamp' }),
  lastUpdated: integer('last_updated', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const telemetryRecords = sqliteTable('telemetry_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull(),
  profileId: integer('profile_id').notNull(),
  
  // Hardware telemetry (REDEXPERT-style)
  impedanceMagnitude: real('impedance_magnitude'), // Ω
  impedancePhase: real('impedance_phase'), // degrees
  powerLoss: real('power_loss'), // mW
  thermalTemp: real('thermal_temp'), // °C
  
  // Simulation metadata
  simulationToolchain: text('simulation_toolchain', { 
    enum: ['ltspice', 'cadence', 'ansys', 'comsol', 'custom'] 
  }),
  designIteration: integer('design_iteration'),
  convergenceMetrics: text('convergence_metrics'), // JSON: {iterations, tolerance, residual}
  
  // Behavioral data
  testDurationMs: integer('test_duration_ms'),
  passedValidation: integer('passed_validation', { mode: 'boolean' }),
  errorFlag: integer('error_flag', { mode: 'boolean' }).default(0),
  errorDescription: text('error_description'),
  
  timestamp: integer('timestamp', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const portfolioSnapshots = sqliteTable('portfolio_snapshots', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull(),
  
  // Portfolio metadata
  title: text('title'), // e.g., "Wireless Charging RX IC - Winter 2025"
  description: text('description'),
  technologies: text('technologies'), // JSON array: ["Power Electronics", "Signal Processing"]
  difficulty: text('difficulty', { enum: ['beginner', 'intermediate', 'advanced', 'expert'] }),
  
  // Derived metrics from telemetry
  designQualityScore: real('design_quality_score'), // 0-100
  reliabilityIndex: real('reliability_index'), // pass_rate / total_tests
  innovationScore: real('innovation_score'), // measured against peer cohort
  
  // Time-series summary
  totalTestRuns: integer('total_test_runs'),
  averagePowerLoss: real('average_power_loss'),
  maxThermalTemp: real('max_thermal_temp'),
  
  // Portfolio classification
  public: integer('public', { mode: 'boolean' }).default(0),
  featuredAt: integer('featured_at', { mode: 'timestamp' }),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 2: ZERO-TRUST MICRO-INTERNSHIPS & SANDBOX BOUNTIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Bounties: Real-world, skills-based tasks with isolated execution sandbox
 */
export const bounties = sqliteTable('bounties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  creatorId: integer('creator_id').notNull(), // Corporate admin or mentor
  
  // Task definition
  title: text('title').notNull(),
  description: text('description'),
  skillsRequired: text('skills_required'), // JSON array
  difficultyLevel: text('difficulty_level', { enum: ['easy', 'medium', 'hard', 'expert'] }),
  category: text('category', { 
    enum: ['bug_fix', 'data_analysis', 'system_design', 'code_optimization', 'testing'] 
  }),
  
  // Sandbox configuration
  sandboxType: text('sandbox_type', { enum: ['python', 'nodejs', 'rust', 'docker', 'custom'] }),
  starterCode: text('starter_code'), // Base code template
  testCases: text('test_cases'), // JSON: [{input, expected_output, description}]
  maxExecutionTimeMs: integer('max_execution_time_ms').default(5000),
  
  // Rewards
  xpReward: integer('xp_reward').notNull(),
  componentBudgetSubsidy: real('component_budget_subsidy'), // $ value
  badge: text('badge'), // Optional badge ID on completion
  
  // Lifecycle
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  status: text('status', { enum: ['draft', 'active', 'closed'] }).default('draft'),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const bountyExecutions = sqliteTable('bounty_executions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bountyId: integer('bounty_id').notNull(),
  studentId: integer('student_id').notNull(),
  
  // Execution state
  status: text('status', { 
    enum: ['pending', 'running', 'completed', 'failed', 'timed_out'] 
  }).default('pending'),
  
  // Submission
  submittedCode: text('submitted_code'),
  submittedAt: integer('submitted_at', { mode: 'timestamp' }),
  
  // Execution results
  executionLogs: text('execution_logs'), // JSON: {stdout, stderr}
  testPassCount: integer('test_pass_count'),
  testTotalCount: integer('test_total_count'),
  executionTimeMs: integer('execution_time_ms'),
  
  // Verification
  verifiedBy: integer('verified_by'), // Admin ID
  verifiedAt: integer('verified_at', { mode: 'timestamp' }),
  verificationNotes: text('verification_notes'),
  
  // Rewards tracked
  xpAwarded: integer('xp_awarded'),
  componentBudgetAwarded: real('component_budget_awarded'),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const sandboxSessions = sqliteTable('sandbox_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bountyExecutionId: integer('bounty_execution_id').notNull(),
  studentId: integer('student_id').notNull(),
  
  // Session isolation
  containerId: text('container_id'), // Docker container ID or similar
  sessionKey: text('session_key'), // Unique session identifier
  
  // Environment
  environmentVars: text('environment_vars'), // JSON (sanitized, no secrets)
  resourceLimits: text('resource_limits'), // JSON: {cpuMb, memoryMb}
  
  // Telemetry
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  cpuUsagePercent: real('cpu_usage_percent'),
  memoryUsageMb: real('memory_usage_mb'),
  
  // Security
  exitCode: integer('exit_code'),
  signalTerminated: text('signal_terminated'),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const rewardsLedger = sqliteTable('rewards_ledger', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull(),
  
  // Reward source
  sourceType: text('source_type', { 
    enum: ['bounty_completion', 'event_attendance', 'milestone', 'referral', 'manual_award'] 
  }),
  sourceId: text('source_id'), // References bounty, event, etc.
  
  // Reward amounts
  xpDelta: integer('xp_delta'),
  componentBudgetDelta: real('component_budget_delta'),
  badgeId: text('badge_id'),
  
  // Metadata
  description: text('description'),
  issuedBy: integer('issued_by'), // Admin ID
  approvedAt: integer('approved_at', { mode: 'timestamp' }),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 3: ENGAGEMENT, ALGORITHMIC FEEDS & GAMIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Algorithmic feed personalization and QR-code ephemeral validation
 */
export const feedPreferences = sqliteTable('feed_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull(),
  
  // Academic/career interests
  majorCategory: text('major_category', { 
    enum: ['electrical_engineering', 'computer_science', 'mechanical', 'industrial_design', 'physics_materials', 'other'] 
  }),
  minorInterests: text('minor_interests'), // JSON array
  careerPath: text('career_path', { enum: ['hardware', 'software', 'systems', 'entrepreneurship', 'academic'] }),
  
  // Content preferences
  contentTypes: text('content_types'), // JSON: ["short_form", "tutorials", "case_studies"]
  industryFocus: text('industry_focus'), // JSON: ["power_electronics", "iot", "automotive"]
  
  // NLP embeddings for recommendations
  interestEmbedding: text('interest_embedding'), // JSON vector (768-dim from model)
  
  // Algorithm hints
  algorithmVersion: integer('algorithm_version').default(1),
  lastRecalculatedAt: integer('last_recalculated_at', { mode: 'timestamp' }),
  
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const qrValidations = sqliteTable('qr_validations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull(),
  
  // QR code metadata
  qrCode: text('qr_code').notNull(), // Hash of QR content
  qrType: text('qr_type', { enum: ['guest_lecture', 'event', 'workshop', 'career_fair'] }),
  
  // Event reference
  eventId: text('event_id'),
  eventName: text('event_name'),
  eventDate: integer('event_date', { mode: 'timestamp' }),
  
  // Ephemeral properties
  generatedAt: integer('generated_at', { mode: 'timestamp' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  isExpired: integer('is_expired', { mode: 'boolean' }).default(0),
  
  // Validation result
  validatedAt: integer('validated_at', { mode: 'timestamp' }),
  validatedBy: integer('validated_by'), // Admin/mentor ID (optional remote validation)
  xpAwarded: integer('xp_awarded'),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const userBadges = sqliteTable('user_badges', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull(),
  badgeId: text('badge_id').notNull(),
  
  // Badge properties
  badgeName: text('badge_name'),
  tier: text('tier', { enum: ['bronze', 'silver', 'gold', 'platinum'] }),
  category: text('category', { 
    enum: ['contribution', 'community', 'learning', 'achievement', 'special'] 
  }),
  
  // Achievement tracking
  earnedAt: integer('earned_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  progress: integer('progress').default(0), // 0-100
  
  // Display
  pinnedAt: integer('pinned_at', { mode: 'timestamp' }), // User-pinned badges show first
  displayOrder: integer('display_order'),
});

export const xpLedger = sqliteTable('xp_ledger', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  studentId: integer('student_id').notNull(),
  
  // XP source
  activityType: text('activity_type', { 
    enum: ['bounty', 'qr_validation', 'contribution', 'milestone', 'event', 'referral'] 
  }),
  activityId: text('activity_id'),
  
  // XP transaction
  xpDelta: integer('xp_delta'),
  totalXpAfter: integer('total_xp_after'),
  multiplier: real('multiplier').default(1.0), // e.g., 1.5x during event week
  
  // Metadata
  description: text('description'),
  transactionId: text('transaction_id'),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 4: ENTERPRISE INTELLIGENCE, DATA ARCHITECTURE & ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Analytics, content filtering, and enterprise integration
 */
export const contentModeration = sqliteTable('content_moderation', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Content source
  contentType: text('content_type', { enum: ['post', 'comment', 'profile', 'project'] }),
  contentId: text('content_id'),
  authorId: integer('author_id'),
  
  // Moderation checks
  profanityScore: real('profanity_score'), // 0-1
  spamScore: real('spam_score'), // 0-1
  toxicityScore: real('toxicity_score'), // 0-1
  
  // Flags
  flagged: integer('flagged', { mode: 'boolean' }).default(0),
  flagReason: text('flag_reason'), // JSON: ["profanity", "spam"]
  
  // Action
  moderationAction: text('moderation_action', { 
    enum: ['approved', 'hidden', 'removed', 'pending_review'] 
  }).default('pending_review'),
  reviewedBy: integer('reviewed_by'), // Admin ID
  reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
  reviewNotes: text('review_notes'),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const analyticsSnapshots = sqliteTable('analytics_snapshots', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // KPI snapshot
  snapshotDate: integer('snapshot_date', { mode: 'timestamp' }),
  period: text('period', { enum: ['daily', 'weekly', 'monthly'] }),
  
  // User KPIs
  totalActiveUsers: integer('total_active_users'),
  newUsersThisperiod: integer('new_users_this_period'),
  studentCount: integer('student_count'),
  mentorCount: integer('mentor_count'),
  corpAdminCount: integer('corp_admin_count'),
  
  // Engagement KPIs
  totalBountiesCompleted: integer('total_bounties_completed'),
  totalXpAwarded: integer('total_xp_awarded'),
  avgXpPerUser: real('avg_xp_per_user'),
  totalEventAttendances: integer('total_event_attendances'),
  
  // Hiring KPIs
  viableHiresThisPeriod: integer('viable_hires_this_period'),
  totalOffersMade: integer('total_offers_made'),
  offerAcceptanceRate: real('offer_acceptance_rate'),
  
  // Event source KPIs
  highestVolEventId: text('highest_vol_event_id'),
  highestVolEventName: text('highest_vol_event_name'),
  highestVolEventAttendees: integer('highest_vol_event_attendees'),
  
  // Content KPIs
  totalPostsPublished: integer('total_posts_published'),
  avgEngagementRate: real('avg_engagement_rate'),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const semanticGraph = sqliteTable('semantic_graph', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Neo4j-style entity relationships
  fromEntityType: text('from_entity_type', { 
    enum: ['topic', 'project', 'skill', 'student', 'company'] 
  }),
  fromEntityId: text('from_entity_id'),
  
  toEntityType: text('to_entity_type', { 
    enum: ['topic', 'project', 'skill', 'student', 'company'] 
  }),
  toEntityId: text('to_entity_id'),
  
  // Relationship
  relationshipType: text('relationship_type', { 
    enum: ['related_to', 'prerequisite', 'collaborates_with', 'uses_skill', 'builds_on'] 
  }),
  weight: real('weight'), // Confidence/strength: 0-1
  
  // Metadata
  sourceEngine: text('source_engine', { enum: ['nlp', 'user_tagged', 'collaboration', 'manual'] }),
  lastUpdated: integer('last_updated', { mode: 'timestamp' }),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

export const powerBiExports = sqliteTable('powerbi_exports', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Export configuration
  reportName: text('report_name'),
  reportType: text('report_type', { enum: ['kpi_dashboard', 'hiring_pipeline', 'engagement_funnel'] }),
  
  // Export schedule
  scheduleFrequency: text('schedule_frequency', { enum: ['daily', 'weekly', 'monthly', 'on_demand'] }),
  lastExportedAt: integer('last_exported_at', { mode: 'timestamp' }),
  nextScheduledAt: integer('next_scheduled_at', { mode: 'timestamp' }),
  
  // Export result
  exportedDataPath: text('exported_data_path'), // Cloud storage path or URL
  exportStatus: text('export_status', { enum: ['pending', 'success', 'failed'] }),
  exportedRows: integer('exported_rows'),
  
  // Metadata
  createdBy: integer('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});

// ═══════════════════════════════════════════════════════════════════════════════
// Indexes for performance
// ═══════════════════════════════════════════════════════════════════════════════

export const telemetryIdx = index('idx_telemetry_student_timestamp')
  .on(telemetryRecords.studentId, telemetryRecords.timestamp);

export const bountyExecutionIdx = index('idx_bounty_execution_student_status')
  .on(bountyExecutions.studentId, bountyExecutions.status);

export const xpLedgerIdx = index('idx_xp_ledger_student')
  .on(xpLedger.studentId, xpLedger.createdAt);

export const contentModerationIdx = index('idx_content_moderation_flagged')
  .on(contentModeration.flagged, contentModeration.flagReason);
