-- ============================================================================
-- STUDENT–INDUSTRY ENGINEERING PLATFORM — RELATIONAL SCHEMA (PostgreSQL)
-- Derived from: mockData.ts, weFeed.ts, adminMockData.ts,
--               githubMockData.ts, jobsMockData.ts, nexusData.ts
--
-- Conventions
--   • Surrogate PKs: UUID (gen_random_uuid). External/string ids from the
--     mock data (e.g. dicebear seeds, github repo ids) are kept as columns.
--   • snake_case identifiers, plural table names.
--   • created_at / updated_at on mutable entities.
--   • Many-to-many relations are modelled with explicit junction tables.
--   • Cross-cutting taxonomy (tags / skills / interests) is normalised once
--     and reused via per-entity link tables.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()

-- ============================================================================
-- 0. ENUM TYPES
-- ============================================================================

CREATE TYPE user_role          AS ENUM ('student','company','educator','corporate_admin');

CREATE TYPE post_type          AS ENUM ('text','image','link');

CREATE TYPE badge_tier         AS ENUM ('bronze','silver','gold','platinum');
CREATE TYPE badge_category     AS ENUM ('contribution','community','learning','achievement','special');

CREATE TYPE job_type           AS ENUM ('Internship','Full-time','Contract','Working Student','Research Assistant','HiWi');
CREATE TYPE we_department      AS ENUM ('Power Modules','Wireless Connectivity & Sensors','Embedded Systems');

CREATE TYPE bounty_status      AS ENUM ('open','reviewing','closed','draft','published','completed');
CREATE TYPE application_status AS ENUM ('applied','reviewing','accepted','rejected','withdrawn');

CREATE TYPE initiative_status  AS ENUM ('active','pending-review','completed');
CREATE TYPE validation_status  AS ENUM ('pending','approved','needs-revision','rejected');

CREATE TYPE material_type      AS ENUM ('slides','lab','notes','recording');
CREATE TYPE deadline_type      AS ENUM ('lab-submission','bounty','assignment','project-review');
CREATE TYPE priority_level     AS ENUM ('low','medium','high');

CREATE TYPE community_category AS ENUM ('research-club','study-group','open-source','industry-connect',
                                        'mentorship-circle','hackathon-team');
CREATE TYPE event_type         AS ENUM ('workshop','hackathon','networking','talk');

CREATE TYPE we_item_category   AS ENUM ('news','product','service','event','blog','career');

CREATE TYPE collab_role        AS ENUM ('collaborator','contributor','owner');

CREATE TYPE member_status      AS ENUM ('engaged','near-levelup','momentum','highvalue','atrisk');

CREATE TYPE gdpr_category      AS ENUM ('profile','activity','connections','applications');
CREATE TYPE gdpr_status        AS ENUM ('active','pending-deletion','archived');
CREATE TYPE audit_action       AS ENUM ('verified','flagged','approved','rejected');
CREATE TYPE audit_entity       AS ENUM ('project','user','institution','company');
CREATE TYPE severity_level     AS ENUM ('low','medium','high');
CREATE TYPE log_status         AS ENUM ('success','failed');
CREATE TYPE trend_dir          AS ENUM ('up','down','flat');

-- ============================================================================
-- 1. IDENTITY & PROFILES
-- ============================================================================

CREATE TABLE institutions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL UNIQUE,        -- 'MIT', 'TU Munich', ...
    is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role            user_role NOT NULL,
    name            TEXT NOT NULL,
    email           TEXT UNIQUE,
    avatar_url      TEXT,
    headline        TEXT,
    bio             TEXT,
    location        TEXT,
    points          INTEGER NOT NULL DEFAULT 0,   -- platform XP
    followers_count INTEGER NOT NULL DEFAULT 0,   -- denormalised counters
    following_count INTEGER NOT NULL DEFAULT 0,
    joined_at       DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_users_role ON users(role);

-- Role-specific attributes split into 1:1 extension tables -------------------

CREATE TABLE student_profiles (
    user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    institution_id  UUID REFERENCES institutions(id) ON DELETE SET NULL,
    university       TEXT,                        -- kept for free-text legacy
    graduation_year SMALLINT
);

CREATE TABLE company_profiles (
    user_id    UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    industry   TEXT,
    size       TEXT,                              -- '51–200 employees'
    website    TEXT
);

CREATE TABLE educator_profiles (
    user_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    university      TEXT
);

-- Social graph (self-referential many-to-many) ------------------------------

CREATE TABLE follows (
    follower_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followee_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (follower_id, followee_id),
    CHECK (follower_id <> followee_id)
);

-- ============================================================================
-- 2. SHARED TAXONOMY  (tags / skills / interests reused everywhere)
-- ============================================================================

CREATE TABLE tags (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug  TEXT NOT NULL UNIQUE                    -- 'distributed-systems', 'SiC'
);

CREATE TABLE skills (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name  TEXT NOT NULL UNIQUE                    -- 'TypeScript', 'KiCAD'
);

CREATE TABLE interests (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug  TEXT NOT NULL UNIQUE                    -- 'machine-learning'
);

CREATE TABLE user_skills (
    user_id  UUID NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE user_interests (
    user_id     UUID NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
);

-- ============================================================================
-- 3. GAMIFICATION (badges catalogue, earned badges, achievements, certs)
-- ============================================================================

CREATE TABLE badges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        TEXT NOT NULL UNIQUE,             -- 'bg-first-post'
    name        TEXT NOT NULL,
    description TEXT,
    icon        TEXT,
    tier        badge_tier NOT NULL,
    category    badge_category NOT NULL
);

CREATE TABLE user_badges (
    user_id   UUID NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    badge_id  UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (user_id, badge_id)
);

-- Achievements are per-user awarded instances (not a shared catalogue)
CREATE TABLE achievements (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    description TEXT,
    icon        TEXT,
    points      INTEGER NOT NULL DEFAULT 0,
    unlocked_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_achievements_user ON achievements(user_id);

CREATE TABLE certificates (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    issuer        TEXT NOT NULL,                  -- 'TU Munich · Prof. Hartmann'
    issuer_id     UUID REFERENCES users(id) ON DELETE SET NULL,  -- educator, if on-platform
    credential_id TEXT,
    badge_url     TEXT,
    issued_at     DATE NOT NULL
);
CREATE INDEX idx_certificates_user ON certificates(user_id);

CREATE TABLE certificate_skills (
    certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
    skill_id       UUID NOT NULL REFERENCES skills(id)       ON DELETE CASCADE,
    PRIMARY KEY (certificate_id, skill_id)
);

-- ============================================================================
-- 4. SOCIAL FEED (posts, comments, likes, shares)
-- ============================================================================

CREATE TABLE posts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        post_type NOT NULL,
    content     TEXT NOT NULL,
    image_url   TEXT,                             -- type = 'image'
    -- link preview (type = 'link')
    link_url           TEXT,
    link_title         TEXT,
    link_description   TEXT,
    link_image_url     TEXT,
    shares_count INTEGER NOT NULL DEFAULT 0,
    likes_count  INTEGER NOT NULL DEFAULT 0,      -- denormalised
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

CREATE TABLE post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id  UUID NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE post_likes (
    post_id  UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    liked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE comments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_comments_post ON comments(post_id);

CREATE TABLE comment_likes (
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    PRIMARY KEY (comment_id, user_id)
);

-- ============================================================================
-- 5. OPPORTUNITIES — JOBS, BOUNTIES, MICRO-INTERNSHIPS, HARDWARE BOUNTIES
-- ============================================================================

-- 5a. Company-posted jobs (mockData) + Würth jobs board (jobsMockData) -------
CREATE TABLE jobs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id       UUID REFERENCES users(id) ON DELETE CASCADE,  -- NULL for external WE jobs
    title            TEXT NOT NULL,
    type             job_type NOT NULL,
    location         TEXT NOT NULL,
    department       we_department,               -- only for WE jobs board
    salary           TEXT,                        -- free-text range
    description      TEXT NOT NULL,
    application_url  TEXT,                         -- external apply link (WE)
    application_count INTEGER NOT NULL DEFAULT 0,
    posted_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_jobs_company ON jobs(company_id);

CREATE TABLE job_requirements (         -- ordered free-text requirements
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id    UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    position  SMALLINT NOT NULL,
    text      TEXT NOT NULL
);

CREATE TABLE job_tags (
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, tag_id)
);

CREATE TABLE job_required_skills (      -- jobsMockData.requiredSkills
    job_id   UUID NOT NULL REFERENCES jobs(id)   ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, skill_id)
);

CREATE TABLE hardware_components (       -- shared dictionary for hardware stacks
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE             -- 'MOSFETs', 'Antennas', 'WE-SFIA'
);

CREATE TABLE job_hardware_stack (
    job_id       UUID NOT NULL REFERENCES jobs(id)                ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES hardware_components(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, component_id)
);

CREATE TABLE job_applications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id     UUID NOT NULL REFERENCES jobs(id)  ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status     application_status NOT NULL DEFAULT 'applied',
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id, user_id)
);

-- 5b. Bounties (mockData) ----------------------------------------------------
CREATE TABLE bounties (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title                    TEXT NOT NULL,
    description              TEXT NOT NULL,
    submission_requirements  TEXT,
    reward                   TEXT NOT NULL,        -- '$750 cash'
    duration                 TEXT,                 -- '2–3 weeks'
    status                   bounty_status NOT NULL DEFAULT 'open',
    application_count        INTEGER NOT NULL DEFAULT 0,
    deadline                 TIMESTAMPTZ,
    posted_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bounties_company ON bounties(company_id);
CREATE INDEX idx_bounties_status  ON bounties(status);

CREATE TABLE bounty_requirements (
    id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bounty_id UUID NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
    position SMALLINT NOT NULL,
    text     TEXT NOT NULL
);

CREATE TABLE bounty_tags (
    bounty_id UUID NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
    tag_id    UUID NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
    PRIMARY KEY (bounty_id, tag_id)
);

CREATE TABLE bounty_applications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bounty_id  UUID NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    status     application_status NOT NULL DEFAULT 'applied',
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (bounty_id, user_id)
);

-- 5c. Micro-internships (adminMockData) --------------------------------------
CREATE TABLE micro_internships (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         TEXT NOT NULL,
    description   TEXT,
    company_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    company_name  TEXT NOT NULL,                  -- denormalised label
    duration      TEXT,                           -- '4 weeks'
    compensation  TEXT,                           -- '$1,200'
    status        bounty_status NOT NULL DEFAULT 'draft',
    applicant_count INTEGER NOT NULL DEFAULT 0,
    deadline      DATE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE micro_internship_applications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    micro_internship_id UUID NOT NULL REFERENCES micro_internships(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id)             ON DELETE CASCADE,
    status              application_status NOT NULL DEFAULT 'applied',
    applied_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (micro_internship_id, user_id)
);

-- 5d. Hardware bounties (adminMockData) --------------------------------------
CREATE TABLE hardware_bounties (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    description     TEXT,
    category        TEXT,                          -- 'Microcontroller'
    value           NUMERIC(10,2) NOT NULL,        -- cash value
    status          bounty_status NOT NULL DEFAULT 'draft',
    applicant_count INTEGER NOT NULL DEFAULT 0,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,  -- admin
    deadline        DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE hardware_bounty_applications (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hardware_bounty_id UUID NOT NULL REFERENCES hardware_bounties(id) ON DELETE CASCADE,
    user_id            UUID NOT NULL REFERENCES users(id)             ON DELETE CASCADE,
    status             application_status NOT NULL DEFAULT 'applied',
    applied_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (hardware_bounty_id, user_id)
);

-- ============================================================================
-- 6. PROJECTS, VALIDATIONS & STUDENT INITIATIVES
-- ============================================================================

CREATE TABLE projects (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT,
    image_url   TEXT,
    repo_url    TEXT,
    live_url    TEXT,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_projects_author ON projects(author_id);

CREATE TABLE project_tags (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag_id     UUID NOT NULL REFERENCES tags(id)     ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE project_likes (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id)
);

-- Admin verification of submitted projects (adminMockData) -------------------
CREATE TABLE project_validations (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id       UUID REFERENCES projects(id) ON DELETE SET NULL,
    project_title    TEXT NOT NULL,               -- snapshot label
    author_id        UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name      TEXT NOT NULL,
    status           validation_status NOT NULL DEFAULT 'pending',
    validation_notes TEXT,
    validated_by     UUID REFERENCES users(id) ON DELETE SET NULL,  -- reviewer
    validated_by_name TEXT,
    submitted_at     TIMESTAMPTZ NOT NULL,
    validated_at     TIMESTAMPTZ
);

CREATE TABLE project_validation_attachments (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    validation_id UUID NOT NULL REFERENCES project_validations(id) ON DELETE CASCADE,
    filename      TEXT NOT NULL
);

-- Team-based student initiatives (mockData) ----------------------------------
CREATE TABLE student_initiatives (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name     TEXT NOT NULL,
    project_title TEXT NOT NULL,
    description   TEXT,
    company_name  TEXT,                            -- sponsoring partner (Würth)
    endorsed      BOOLEAN NOT NULL DEFAULT FALSE,
    status        initiative_status NOT NULL DEFAULT 'pending-review',
    submitted_at  TIMESTAMPTZ NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Team members: linked user when known, otherwise free-text name
CREATE TABLE initiative_members (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID NOT NULL REFERENCES student_initiatives(id) ON DELETE CASCADE,
    user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    member_name   TEXT NOT NULL
);

CREATE TABLE initiative_parts (         -- partsUsed
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID NOT NULL REFERENCES student_initiatives(id) ON DELETE CASCADE,
    component_id  UUID REFERENCES hardware_components(id) ON DELETE SET NULL,
    part_label    TEXT NOT NULL        -- e.g. 'SiC MOSFET WMT3N120'
);

-- ============================================================================
-- 7. LEARNING (courses, lecture materials, Q&A, deadlines)
-- ============================================================================

CREATE TABLE courses (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code      TEXT NOT NULL UNIQUE,               -- 'EE401'
    title     TEXT NOT NULL                       -- 'EE401 — Power Electronics'
);

CREATE TABLE lecture_materials (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id   UUID NOT NULL REFERENCES users(id)   ON DELETE CASCADE,  -- educator
    course_id   UUID REFERENCES courses(id) ON DELETE SET NULL,
    title       TEXT NOT NULL,
    type        material_type NOT NULL,
    file_size   TEXT,                              -- '6.1 MB'
    downloads   INTEGER NOT NULL DEFAULT 0,
    published   BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_materials_course ON lecture_materials(course_id);

CREATE TABLE lecture_material_tags (
    material_id UUID NOT NULL REFERENCES lecture_materials(id) ON DELETE CASCADE,
    tag_id      UUID NOT NULL REFERENCES tags(id)             ON DELETE CASCADE,
    PRIMARY KEY (material_id, tag_id)
);

CREATE TABLE qa_channels (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id       UUID REFERENCES courses(id) ON DELETE SET NULL,
    topic           TEXT NOT NULL,
    open_questions  INTEGER NOT NULL DEFAULT 0,
    participants    INTEGER NOT NULL DEFAULT 0,
    last_activity_at TIMESTAMPTZ
);

CREATE TABLE qa_channel_tags (
    channel_id UUID NOT NULL REFERENCES qa_channels(id) ON DELETE CASCADE,
    tag_id     UUID NOT NULL REFERENCES tags(id)        ON DELETE CASCADE,
    PRIMARY KEY (channel_id, tag_id)
);

-- Per-student deadlines; may link to a bounty / project / assignment
CREATE TABLE deadlines (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,  -- owner (NULL = global)
    title       TEXT NOT NULL,
    type        deadline_type NOT NULL,
    course_id   UUID REFERENCES courses(id) ON DELETE SET NULL,
    linked_bounty_id UUID REFERENCES bounties(id) ON DELETE SET NULL,
    priority    priority_level NOT NULL DEFAULT 'medium',
    due_at      TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_deadlines_user ON deadlines(user_id);

-- ============================================================================
-- 8. COMMUNITIES & EVENTS
-- ============================================================================

CREATE TABLE communities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    description     TEXT,
    category        community_category NOT NULL,
    icon            TEXT,
    member_count    INTEGER NOT NULL DEFAULT 0,    -- denormalised
    weekly_activity INTEGER NOT NULL DEFAULT 0,
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE community_tags (
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    tag_id       UUID NOT NULL REFERENCES tags(id)        ON DELETE CASCADE,
    PRIMARY KEY (community_id, tag_id)
);

CREATE TABLE community_members (
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id      UUID NOT NULL REFERENCES users(id)       ON DELETE CASCADE,
    joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (community_id, user_id)
);

CREATE TABLE community_events (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id   UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    title          TEXT NOT NULL,
    description    TEXT,
    type           event_type NOT NULL,
    location       TEXT,                           -- 'Online (Zoom)'
    event_date     TIMESTAMPTZ NOT NULL,
    attendee_count INTEGER NOT NULL DEFAULT 0,
    max_attendees  INTEGER,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_events_community ON community_events(community_id);

CREATE TABLE community_event_tags (
    event_id UUID NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
    tag_id   UUID NOT NULL REFERENCES tags(id)            ON DELETE CASCADE,
    PRIMARY KEY (event_id, tag_id)
);

CREATE TABLE event_registrations (      -- resolves isRegistered per user
    event_id      UUID NOT NULL REFERENCES community_events(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES users(id)            ON DELETE CASCADE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (event_id, user_id)
);

-- ============================================================================
-- 9. CONTENT FEEDS (industry news + Würth Elektronik RSS feed)
-- ============================================================================

CREATE TABLE news_articles (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title        TEXT NOT NULL,
    summary      TEXT,
    source       TEXT,
    source_emoji TEXT,
    category     TEXT,                             -- 'semiconductors', ...
    url          TEXT,
    image_url    TEXT,
    read_time    SMALLINT,                         -- minutes
    upvotes      INTEGER NOT NULL DEFAULT 0,       -- denormalised
    published_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_news_published ON news_articles(published_at DESC);

CREATE TABLE news_article_tags (
    article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
    tag_id     UUID NOT NULL REFERENCES tags(id)          ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Per-user reactions (upvotedBy / saved) on news
CREATE TABLE news_article_upvotes (
    article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id)         ON DELETE CASCADE,
    PRIMARY KEY (article_id, user_id)
);

CREATE TABLE news_article_saves (
    article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id)         ON DELETE CASCADE,
    saved_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (article_id, user_id)
);

-- Würth Elektronik feed items (weFeed) ---------------------------------------
CREATE TABLE we_feed_items (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id  TEXT UNIQUE,                       -- 'we-fncs'
    url          TEXT NOT NULL,
    title        TEXT NOT NULL,
    summary      TEXT,
    image_url    TEXT,
    source       TEXT,
    category     we_item_category NOT NULL,
    upvotes      INTEGER NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE we_feed_item_tags (
    item_id UUID NOT NULL REFERENCES we_feed_items(id) ON DELETE CASCADE,
    tag_id  UUID NOT NULL REFERENCES tags(id)          ON DELETE CASCADE,
    PRIMARY KEY (item_id, tag_id)
);

CREATE TABLE we_feed_item_saves (
    item_id  UUID NOT NULL REFERENCES we_feed_items(id) ON DELETE CASCADE,
    user_id  UUID NOT NULL REFERENCES users(id)         ON DELETE CASCADE,
    PRIMARY KEY (item_id, user_id)
);

-- ============================================================================
-- 10. GITHUB INTEGRATION
-- ============================================================================

CREATE TABLE github_portfolios (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    username             TEXT NOT NULL,
    profile_url          TEXT,
    total_contributions  INTEGER NOT NULL DEFAULT 0,
    pull_requests_count  INTEGER NOT NULL DEFAULT 0,
    pull_requests_merged INTEGER NOT NULL DEFAULT 0,
    issues_opened        INTEGER NOT NULL DEFAULT 0,
    issues_closed        INTEGER NOT NULL DEFAULT 0,
    last_fetched         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE github_repositories (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id     UUID NOT NULL REFERENCES github_portfolios(id) ON DELETE CASCADE,
    external_id      TEXT,                          -- github repo id
    name             TEXT NOT NULL,
    description      TEXT,
    primary_language TEXT,
    stargazers_count INTEGER NOT NULL DEFAULT 0,
    forks_count      INTEGER NOT NULL DEFAULT 0,
    url              TEXT,
    is_fork          BOOLEAN NOT NULL DEFAULT FALSE,
    is_private       BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX idx_repos_portfolio ON github_repositories(portfolio_id);

CREATE TABLE github_contribution_days (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES github_portfolios(id) ON DELETE CASCADE,
    day          DATE NOT NULL,
    count        INTEGER NOT NULL DEFAULT 0,
    level        SMALLINT NOT NULL CHECK (level BETWEEN 0 AND 4),
    UNIQUE (portfolio_id, day)
);

CREATE TABLE github_collaboration_metrics (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id        UUID NOT NULL REFERENCES github_portfolios(id) ON DELETE CASCADE,
    repository_name     TEXT NOT NULL,
    repository_url      TEXT,
    organization        TEXT,
    role                collab_role NOT NULL,
    pull_requests_count INTEGER NOT NULL DEFAULT 0,
    commits_count       INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- 11. COMMUNITY NEXUS (engagement / progression layer)
-- ============================================================================

CREATE TABLE nexus_members (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    username             TEXT NOT NULL,
    avatar               TEXT,
    level                SMALLINT NOT NULL DEFAULT 0,
    level_title          TEXT,
    next_level_title     TEXT,
    days_active          INTEGER NOT NULL DEFAULT 0,
    rep_points           INTEGER NOT NULL DEFAULT 0,
    rep_target           INTEGER NOT NULL DEFAULT 100,
    milestone            TEXT,
    milestone_icon       TEXT,
    badge_unlocked       TEXT,
    next_challenge       TEXT,
    next_challenge_points INTEGER,
    announcement         TEXT,
    dm_draft             TEXT,
    status               member_status NOT NULL,
    weekly_upvotes       INTEGER,
    streak_days          INTEGER,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nexus_progress_steps (     -- ordered progressPath entries
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id  UUID NOT NULL REFERENCES nexus_members(id) ON DELETE CASCADE,
    position   SMALLINT NOT NULL,
    action     TEXT NOT NULL,
    points     INTEGER NOT NULL DEFAULT 0,
    time_label TEXT                       -- '~15 mins', 'Passive'
);

CREATE TABLE nexus_threads (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id          UUID REFERENCES users(id) ON DELETE SET NULL,
    author_username    TEXT NOT NULL,
    author_level       SMALLINT,
    author_level_title TEXT,
    question           TEXT NOT NULL,
    topic              TEXT,
    hours_unanswered   NUMERIC(5,1),
    nexus_response     TEXT,
    cta_for_author     TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE nexus_thread_tags (
    thread_id UUID NOT NULL REFERENCES nexus_threads(id) ON DELETE CASCADE,
    tag_id    UUID NOT NULL REFERENCES tags(id)          ON DELETE CASCADE,
    PRIMARY KEY (thread_id, tag_id)
);

CREATE TABLE nexus_announcements (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icon       TEXT,
    text       TEXT NOT NULL,
    member_id  UUID REFERENCES nexus_members(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 12. ADMIN, ANALYTICS & COMPLIANCE
-- ============================================================================

CREATE TABLE analytics_metrics (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label      TEXT NOT NULL,
    value      TEXT NOT NULL,                      -- '$2.4M', '18,450'
    change     NUMERIC(6,2),
    trend      trend_dir NOT NULL DEFAULT 'flat',
    captured_at DATE NOT NULL
);

CREATE TABLE roi_data_points (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month      TEXT NOT NULL,                      -- 'Jan'
    period_year SMALLINT,
    revenue    NUMERIC(14,2),
    engagement NUMERIC(5,2),
    roi        NUMERIC(6,2)
);

CREATE TABLE gdpr_records (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name        TEXT NOT NULL,
    user_email       TEXT NOT NULL,
    data_category    gdpr_category NOT NULL,
    status           gdpr_status NOT NULL DEFAULT 'active',
    retention_period TEXT,
    created_at       DATE NOT NULL,
    modified_at      DATE
);

CREATE TABLE gdpr_audit_entries (       -- per-record audit trail
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_id  UUID NOT NULL REFERENCES gdpr_records(id) ON DELETE CASCADE,
    action     TEXT NOT NULL,
    actor      TEXT NOT NULL,                      -- 'user:u1', 'admin:a1'
    details    TEXT,
    occurred_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE verification_audit_trail (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type audit_entity NOT NULL,
    entity_id   TEXT NOT NULL,                     -- references vary by type
    entity_name TEXT NOT NULL,
    action      audit_action NOT NULL,
    reviewed_by TEXT NOT NULL,
    reason      TEXT,
    severity    severity_level NOT NULL DEFAULT 'low',
    occurred_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE admin_activity_logs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id      UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_name    TEXT NOT NULL,
    action        TEXT NOT NULL,
    resource_type TEXT NOT NULL,                   -- 'HardwareBounty', ...
    resource_id   TEXT,
    changes       JSONB,                           -- diff payload
    status        log_status NOT NULL DEFAULT 'success',
    occurred_at   TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_admin_logs_admin ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_time  ON admin_activity_logs(occurred_at DESC);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
