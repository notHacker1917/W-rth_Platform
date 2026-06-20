import { useState } from 'react';
import { useJobFilter } from '../hooks/useJobFilter';
import { jobListings } from '../data/jobsMockData';
import { WE_EVENTS } from '../data/weFeed';
import type { WEFeedItem } from '../data/weFeed';
import { useAuth } from '../context/AuthContext';
import { getJobRecommendationsForUser } from '../data/jobRecommendationsMockData';

// Inline type definitions to avoid Vite module resolution issues
type JobCategory = 'Working Student' | 'Internship' | 'Research Assistant' | 'HiWi';
type Department = 'Power Modules' | 'Wireless Connectivity & Sensors' | 'Embedded Systems';

const JOB_CATEGORIES: JobCategory[] = ['Working Student', 'Internship', 'Research Assistant', 'HiWi'];
const DEPARTMENTS: Department[] = ['Power Modules', 'Wireless Connectivity & Sensors', 'Embedded Systems'];

export default function Jobs() {
  const { currentUser } = useAuth();
  const [useRecommendations, setUseRecommendations] = useState(false);
  const recommendations = currentUser ? getJobRecommendationsForUser(currentUser.id) : [];

  const {
    filteredJobs,
    searchQuery,
    selectedTypes,
    selectedDepartments,
    setSearchQuery,
    toggleJobType,
    toggleDepartment,
    clearFilters,
  } = useJobFilter(jobListings);

  // Helper to get recommendation for a job
  const getRecForJob = (jobId: string) => {
    return recommendations.find(r => r.jobId === jobId);
  };

  // Sort and filter display jobs
  const displayJobs = useRecommendations
    ? [...filteredJobs]
        .map(job => {
          const rec = getRecForJob(job.id);
          return {
            ...job,
            rec,
            matchPercentage: rec ? rec.matchPercentage : Math.floor(Math.random() * 20) + 10 // baseline match
          };
        })
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
    : filteredJobs;


  return (
    <div className="min-h-screen bg-surface-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border-b border-border px-8 py-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">💼 Job Opportunities</h1>
        <p className="text-text-muted">Find internships, working student positions, and research roles at Würth Electronics</p>
      </div>

      <div className="flex gap-8 p-8 max-w-7xl mx-auto">
        {/* Sidebar Filters */}
        <aside className="w-72 flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* Search Box */}
            <div className="bg-surface-card border border-border rounded-lg p-4">
              <label className="block text-sm font-semibold text-text-primary mb-3">Search</label>
              <input
                type="text"
                placeholder="Skills, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-surface-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>

            {/* Job Type Filter */}
            <div className="bg-surface-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Job Type</h3>
              <div className="space-y-2">
                {JOB_CATEGORIES.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer p-2 hover:bg-surface-background rounded-md transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.has(type)}
                      onChange={() => toggleJobType(type)}
                      className="w-4 h-4 rounded border-border accent-accent-primary"
                    />
                    <span className="text-sm text-text-primary">{type}</span>
                    <span className="ml-auto text-xs text-text-muted">
                      {jobListings.filter((job) => job.type === type).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Department Filter */}
            <div className="bg-surface-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Department</h3>
              <div className="space-y-2">
                {DEPARTMENTS.map((dept) => (
                  <label
                    key={dept}
                    className="flex items-center gap-2 cursor-pointer p-2 hover:bg-surface-background rounded-md transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDepartments.has(dept)}
                      onChange={() => toggleDepartment(dept)}
                      className="w-4 h-4 rounded border-border accent-accent-primary"
                    />
                    <span className="text-sm text-text-primary">{dept}</span>
                    <span className="ml-auto text-xs text-text-muted">
                      {jobListings.filter((job) => job.department === dept).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || selectedTypes.size > 0 || selectedDepartments.size > 0) && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-surface-background border border-border text-text-primary rounded-lg hover:bg-surface-card transition text-sm font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main Content - Job Grid */}
        <main className="flex-1">
          {/* Results Count and NLP Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-text-muted text-sm">
              Showing <span className="font-semibold text-text-primary">{displayJobs.length}</span> of{' '}
              <span className="font-semibold text-text-primary">{jobListings.length}</span> opportunities
            </p>
            {currentUser?.role === 'student' && (
              <div className="flex p-1 bg-surface-card border border-border rounded-lg text-xs font-medium w-fit">
                <button
                  onClick={() => setUseRecommendations(false)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    !useRecommendations
                      ? 'bg-accent-primary text-white shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  All Opportunities
                </button>
                <button
                  onClick={() => setUseRecommendations(true)}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                    useRecommendations
                      ? 'bg-gradient-to-r from-accent-primary to-orange-600 text-white shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  ✨ NLP Smart Match
                </button>
              </div>
            )}
          </div>

          {displayJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {displayJobs.map((jobOrRec) => {
                const job = jobOrRec as typeof jobListings[0] & { matchPercentage?: number; rec?: any };
                const isMatched = useRecommendations && job.matchPercentage !== undefined;
                const rec = job.rec;

                return (
                  <div
                    key={job.id}
                    className={`bg-surface-card border rounded-lg p-6 transition relative overflow-hidden ${
                      isMatched && job.matchPercentage && job.matchPercentage >= 75
                        ? 'border-green-500/40 hover:border-green-500/60 shadow-[0_0_12px_rgba(34,197,94,0.05)]'
                        : 'border-border hover:border-accent-primary/50 hover:shadow-lg'
                    }`}
                  >
                    {/* Visual match badge */}
                    {isMatched && job.matchPercentage && (
                      <div className="absolute top-0 right-0">
                        <div
                          className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-bl-lg text-white ${
                            job.matchPercentage >= 80
                              ? 'bg-gradient-to-r from-green-600 to-emerald-500'
                              : job.matchPercentage >= 60
                              ? 'bg-gradient-to-r from-yellow-600 to-amber-500'
                              : 'bg-gradient-to-r from-gray-600 to-slate-500'
                          }`}
                        >
                          🎯 {job.matchPercentage}% Match
                        </div>
                      </div>
                    )}

                    {/* Header with Title and Type Badge */}
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <div className="flex-1 pr-16">
                        <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
                          {job.title}
                        </h2>
                        <p className="text-text-muted text-sm mb-3">{job.location}</p>
                      </div>
                      {!isMatched && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeBadgeStyle(job.type)}`}>
                          {job.type}
                        </span>
                      )}
                    </div>

                    {/* Department and Description */}
                    <div className="mb-4">
                      <div className="inline-flex gap-2 mb-3 items-center">
                        <div className="px-2 py-1 bg-surface-background border border-border rounded text-xs font-medium text-text-primary">
                          {job.department}
                        </div>
                        {isMatched && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getTypeBadgeStyle(job.type)}`}>
                            {job.type}
                          </span>
                        )}
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{job.description}</p>
                    </div>

                    {/* NLP Reasoning Block if matched */}
                    {isMatched && rec && (
                      <div className="mb-4 p-3 bg-surface-background border border-border rounded-lg text-xs leading-relaxed text-text-secondary">
                        <div className="font-semibold text-text-primary mb-1 flex items-center gap-1">
                          🤖 NLP Match Insight:
                        </div>
                        {rec.explanation}
                      </div>
                    )}

                    {/* Required / Matched Skills */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-text-primary mb-2">
                        {isMatched ? 'Skills Alignment:' : 'Required Skills:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill, idx) => {
                          const isSkillMatched = rec?.matchedSkills?.includes(skill) || 
                            (!rec && currentUser?.skills?.includes(skill));
                          return (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded text-xs font-medium border flex items-center gap-1 ${
                                isMatched
                                  ? isSkillMatched
                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30'
                                    : 'bg-gray-500/10 text-text-muted border-border line-through'
                                  : 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
                              }`}
                            >
                              {isMatched && (isSkillMatched ? '✓' : '×')} {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Hardware Stack - Industry Theme */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-text-primary mb-2">Hardware Stack:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.hardwareStack.map((hardware, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium"
                          >
                            ⚡ {hardware}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-border flex justify-end">
                      <a
                        href={job.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition font-medium text-sm"
                      >
                        Apply Now →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-surface-card border border-border rounded-lg p-12 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-text-primary font-semibold mb-2">No opportunities found</p>
              <p className="text-text-muted text-sm">Try adjusting your filters or search query</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-accent-primary/20 text-accent-primary rounded-lg hover:bg-accent-primary/30 transition text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* ── Würth Elektronik Events & Seminars ── */}
          {WE_EVENTS.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://www.we-online.com/files/png1/favicon_we_2022.png"
                  alt="Würth Elektronik"
                  className="w-5 h-5 rounded"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <h2 className="text-lg font-bold text-text-primary">Würth Elektronik Events & Opportunities</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20 font-semibold">LIVE FEED</span>
              </div>
              <p className="text-sm text-text-muted mb-5">Seminars, trade shows, and career events from Würth Elektronik.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WE_EVENTS.map(item => <WEEventCard key={item.id} item={item} />)}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─── WE Event Card ────────────────────────────────────────────────────────
function WEEventCard({ item }: { item: WEFeedItem }) {
  const icon = item.category === 'career' ? '💼' : '📅';
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-surface-card border border-border rounded-lg p-5 hover:border-accent-primary/40 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl">{icon}</span>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-500/10 text-orange-400 border border-orange-400/20 capitalize">
            {item.category}
          </span>
        </div>
        <span className="text-xs text-text-muted shrink-0">
          {new Date(item.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
      <h3 className="text-base font-bold text-text-primary mb-1 group-hover:text-accent-primary transition-colors line-clamp-2">
        {item.title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed mb-3 line-clamp-3">{item.summary}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.tags.slice(0, 4).map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-text-muted">📍 {item.source}</span>
        <span className="text-xs text-accent-primary font-medium group-hover:underline">Learn more →</span>
      </div>
    </a>
  );
}

// Helper function to get badge styling based on job type
function getTypeBadgeStyle(type: JobCategory): string {
  const styles: Record<JobCategory, string> = {
    'Working Student': 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30',
    Internship: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30',
    'Research Assistant': 'bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/30',
    HiWi: 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-500/30',
  };
  return styles[type];
}
