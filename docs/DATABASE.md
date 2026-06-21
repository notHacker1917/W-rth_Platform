# Database Schema

The backend persists to **PostgreSQL** using the schema in `schema.sql`. This document
explains the design, the enum catalog, and each domain group of tables. The schema was
derived from the frontend mock data (`mockData.ts`, `weFeed.ts`, `adminMockData.ts`,
`githubMockData.ts`, `jobsMockData.ts`, `nexusData.ts`) and is the authoritative storage
contract behind the [API](API.md).

## Conventions

- **Primary keys** are surrogate `UUID`s (`gen_random_uuid()` from the `pgcrypto`
  extension). External/string ids from source systems (GitHub repo ids, dicebear avatar
  seeds) are retained as separate columns.
- **Naming**: `snake_case` identifiers, plural table names.
- **Timestamps**: `created_at` / `updated_at` (`TIMESTAMPTZ`) on mutable entities; `DATE`
  where only a day is meaningful (e.g. `joined_at`).
- **Many-to-many** relations use explicit junction tables.
- **Taxonomy** (`tags`, `skills`, `interests`) is normalized once and reused via per-entity
  link tables.
- **Denormalized counters** (`likes_count`, `followers_count`, `member_count`, …) are kept
  on parent rows for read performance and must be maintained transactionally (or via
  triggers) alongside the underlying link rows.

Prerequisite:
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

## Enum catalog

| Enum | Values |
|---|---|
| `user_role` | student, company, educator, corporate_admin |
| `post_type` | text, image, link |
| `badge_tier` | bronze, silver, gold, platinum |
| `badge_category` | contribution, community, learning, achievement, special |
| `job_type` | Internship, Full-time, Contract, Working Student, Research Assistant, HiWi |
| `we_department` | Power Modules, Wireless Connectivity & Sensors, Embedded Systems |
| `bounty_status` | open, reviewing, closed, draft, published, completed |
| `application_status` | applied, reviewing, accepted, rejected, withdrawn |
| `initiative_status` | active, pending-review, completed |
| `validation_status` | pending, approved, needs-revision, rejected |
| `material_type` | slides, lab, notes, recording |
| `deadline_type` | lab-submission, bounty, assignment, project-review |
| `priority_level` | low, medium, high |
| `community_category` | research-club, study-group, open-source, industry-connect, mentorship-circle, hackathon-team |
| `event_type` | workshop, hackathon, networking, talk |
| `we_item_category` | news, product, service, event, blog, career |
| `collab_role` | collaborator, contributor, owner |
| `member_status` | engaged, near-levelup, momentum, highvalue, atrisk |
| `gdpr_category` | profile, activity, connections, applications |
| `gdpr_status` | active, pending-deletion, archived |
| `audit_action` | verified, flagged, approved, rejected |
| `audit_entity` | project, user, institution, company |
| `severity_level` | low, medium, high |
| `log_status` | success, failed |
| `trend_dir` | up, down, flat |

---

## Domain groups

### 1. Identity & profiles

- **`institutions`** — universities (`name` unique, `is_verified`).
- **`users`** — central identity. `role`, `name`, unique `email`, `avatar_url`, `headline`,
  `bio`, `location`, `points` (platform XP), denormalized `followers_count` /
  `following_count`, `joined_at`, audit timestamps. Indexed by `role`.
- **`student_profiles`** / **`company_profiles`** / **`educator_profiles`** — 1:1
  extensions keyed on `user_id`. Students link to `institutions` (`ON DELETE SET NULL`) and
  keep a legacy free-text `university` + `graduation_year`. Companies hold `industry`,
  `size`, `website`.
- **`follows`** — directed social graph. Composite PK `(follower_id, followee_id)` with a
  `CHECK (follower_id <> followee_id)` to forbid self-follows.

### 2. Taxonomy

- **`tags`** (`slug` unique), **`skills`**, **`interests`** — shared dictionaries.
- Link tables: **`user_skills`**, **`user_interests`**, and the `*_tags` tables across
  posts, jobs, bounties, projects, communities, events, news, materials, Q&A, and the WE
  feed. This keeps every taxonomy reference normalized to a single source.

### 3. Gamification

- **`badges`** (`code` unique, `tier`, `category`) ← **`user_badges`** (PK
  `(user_id, badge_id)`, `earned_at`).
- **`achievements`** — per-user XP unlocks (indexed by `user_id`).
- **`certificates`** (indexed by `user_id`) ← **`certificate_skills`** link table.

### 4. Social feed

- **`posts`** — `author_id` (cascade), `type`, `content`, optional `image_url`, link-preview
  columns (`link_url/title/description/image_url`), denormalized `likes_count` /
  `shares_count`. Indexed by `author_id` and `created_at DESC` (feed ordering).
- **`post_tags`**, **`post_likes`** (who liked what), **`comments`** (indexed by `post_id`),
  **`comment_likes`**.

### 5. Jobs

- **`jobs`** — `company_id` (nullable for external Würth roles), `type`, `location`,
  optional `department` (Würth board), free-text `salary`, `application_url`,
  `application_count`. Indexed by `company_id`.
- **`job_requirements`** (ordered free text), **`job_tags`**, **`job_required_skills`**.
- **`hardware_components`** — shared dictionary; **`job_hardware_stack`** links jobs to
  components.
- **`job_applications`** — `status`, `applied_at`, `UNIQUE(job_id, user_id)` (one
  application per user per job).

### 6. Bounties & opportunities

- **`bounties`** — `company_id`, `reward`, `duration`, `submission_requirements`, `status`,
  `deadline`, `application_count`. Indexed by `company_id` and `status`.
- **`bounty_requirements`**, **`bounty_tags`**, **`bounty_applications`**
  (`UNIQUE(bounty_id, user_id)`).
- **`micro_internships`** + **`micro_internship_applications`** — admin-managed short
  placements.
- **`hardware_bounties`** + **`hardware_bounty_applications`** — admin-managed hardware
  challenges (back the admin Opportunities module).

### 7. Projects & validation

- **`projects`** — `author_id`, `repo_url`, `live_url`, `image_url`, `likes_count`. Indexed
  by `author_id`.
- **`project_tags`**, **`project_likes`**.
- **`project_validations`** — institutional review (`validation_status`, notes, validator).
  **`project_validation_attachments`** stores evidence files.
- **`student_initiatives`** + **`initiative_members`** + **`initiative_parts`** — team
  projects with parts used and endorsement/status.

### 8. Education

- **`courses`**, **`lecture_materials`** (`material_type`, downloads, file size, `published`;
  indexed by `course_id`) + **`lecture_material_tags`**.
- **`qa_channels`** + **`qa_channel_tags`** — course Q&A.
- **`deadlines`** — per-user (indexed), `deadline_type`, `priority_level`, optional
  `linked_id` to the related entity.

### 9. Community

- **`communities`** (`community_category`, denormalized `member_count`, `weekly_activity`,
  `is_verified`, `created_by`) + **`community_tags`** + **`community_members`**.
- **`community_events`** (`event_type`, attendee counts; indexed by `community_id`) +
  **`community_event_tags`** + **`event_registrations`** (resolves per-user `isRegistered`).

### 10. News & WE feed

- **`news_articles`** (`category`, `source`, `read_time`, denormalized `upvotes`; indexed by
  `published_at DESC`) + **`news_article_tags`** + **`news_article_upvotes`** +
  **`news_article_saves`** (per-user state).
- **`we_feed_items`** (`we_item_category`) + **`we_feed_item_tags`** +
  **`we_feed_item_saves`** — the corpus behind the WE chatbot and Products surface.

### 11. GitHub portfolio analytics

- **`github_portfolios`** — 1:1 with `users`; aggregate counters (`total_contributions`,
  PR/issue counts) + `last_fetched`.
- **`github_repositories`** — per-portfolio repos (`external_id` = GitHub repo id, stars,
  forks, `is_fork`, `is_private`). Indexed by `portfolio_id`.
- **`github_contribution_days`** — daily contribution heatmap rows (date, count, level 0–4).
- **`github_collaboration_metrics`** — `collab_role` per repository with PR/commit counts.

### 12. Community Nexus (engagement layer)

- **`nexus_members`** — gamified engagement record per user (`level`, `rep_points` /
  `rep_target`, `milestone`, `next_challenge`, `member_status`, streaks, weekly upvotes,
  optional `dm_draft` / `announcement`).
- **`nexus_progress_steps`** (ordered progress path), **`nexus_threads`** +
  **`nexus_thread_tags`**, **`nexus_announcements`**.

### 13. Admin, analytics & compliance

- **`analytics_metrics`** — KPI cards (`label`, free-text `value` like `'$2.4M'`, `change`,
  `trend_dir`, `captured_at`).
- **`roi_data_points`** — monthly revenue/engagement/ROI series.
- **`gdpr_records`** — personal-data registry (`gdpr_category`, `gdpr_status`,
  `retention_period`); `user_id` set null on user deletion to preserve the audit record.
- **`gdpr_audit_entries`** — per-record audit trail.
- **`verification_audit_trail`** — verification actions across entity types
  (`audit_entity`, `audit_action`, `severity_level`).
- **`admin_activity_logs`** — every admin action with a `changes` JSONB diff,
  `log_status`, `occurred_at`. Indexed by `admin_id` and `occurred_at DESC`. **Every admin
  API mutation should write a row here.**

---

## Relationship highlights

- `users` is the hub: profiles, follows, posts, comments, jobs (as company), bounties,
  projects, applications, badges, certificates, github portfolio, nexus membership, and
  admin logs all reference it.
- Deletion policy is mostly `ON DELETE CASCADE` for owned content (posts, comments, likes,
  applications) and `ON DELETE SET NULL` for records that must survive user deletion for
  audit/compliance reasons (`gdpr_records.user_id`, `admin_activity_logs.admin_id`,
  `communities.created_by`, `student_profiles.institution_id`).
- "Applied/registered/liked/saved/upvoted" relationships are modeled as link tables with
  unique constraints so the denormalized counters can be reconciled from source of truth.

---

## Indexing summary

Explicit indexes defined in the schema:

| Index | Table(column) | Purpose |
|---|---|---|
| `idx_users_role` | users(role) | role filtering |
| `idx_achievements_user` | achievements(user_id) | profile load |
| `idx_certificates_user` | certificates(user_id) | profile load |
| `idx_posts_author` | posts(author_id) | author timelines |
| `idx_posts_created` | posts(created_at DESC) | feed ordering |
| `idx_comments_post` | comments(post_id) | thread load |
| `idx_jobs_company` | jobs(company_id) | company jobs |
| `idx_bounties_company` / `idx_bounties_status` | bounties | listing + status filter |
| `idx_projects_author` | projects(author_id) | portfolio |
| `idx_materials_course` | lecture_materials(course_id) | course materials |
| `idx_deadlines_user` | deadlines(user_id) | per-user deadlines |
| `idx_events_community` | community_events(community_id) | community events |
| `idx_news_published` | news_articles(published_at DESC) | news ordering |
| `idx_repos_portfolio` | github_repositories(portfolio_id) | portfolio repos |
| `idx_admin_logs_admin` / `idx_admin_logs_time` | admin_activity_logs | audit queries |

Add further indexes on high-traffic junction tables (e.g. `post_likes(post_id)`,
`job_applications(user_id)`) as query patterns demand.

---

## Applying the schema

```bash
createdb wurth_platform
psql wurth_platform -f schema.sql
```

The frontend domain types in `src/types/` are the camelCase mirror of these tables and the
shapes returned by the [API](API.md).
