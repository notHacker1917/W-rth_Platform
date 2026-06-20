import { useState } from 'react';
import { useJobFilter } from '../hooks/useJobFilter';
import { jobListings } from '../data/jobsMockData';
import { WE_EVENTS } from '../data/weFeed';
import type { WEFeedItem } from '../data/weFeed';

type JobCategory = 'Working Student' | 'Internship' | 'Research Assistant' | 'HiWi';
type Department  = 'Power Modules' | 'Wireless Connectivity & Sensors' | 'Embedded Systems';

const JOB_CATEGORIES: JobCategory[] = ['Working Student', 'Internship', 'Research Assistant', 'HiWi'];
const DEPARTMENTS: Department[]     = ['Power Modules', 'Wireless Connectivity & Sensors', 'Embedded Systems'];

function getTypeBadgeStyle(type: JobCategory): string {
  const styles: Record<JobCategory, string> = {
    'Working Student':    'bg-status-success/15 text-status-success border border-status-success/25',
    Internship:           'bg-[#1e4d7b]/30 text-[#5eaeff] border border-[#1e4d7b]/40',
    'Research Assistant': 'bg-accent-deepest text-[#f2a0a0] border border-accent-deep/40',
    HiWi:                 'bg-status-warn/15 text-status-warn border border-status-warn/25',
  };
  return styles[type];
}

export default function Jobs() {
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const activeFilterCount = selectedTypes.size + selectedDepartments.size + (searchQuery ? 1 : 0);

  const FiltersPanel = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-surface-card border border-border rounded-xl p-4">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-wide mb-2">Search</label>
        <input
          type="text"
          placeholder="Skills, keywords…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-surface-base text-text-primary placeholder-text-muted border border-border rounded-lg focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Job Type */}
      <div className="bg-surface-card border border-border rounded-xl p-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-3">Job Type</h3>
        <div className="space-y-1">
          {JOB_CATEGORIES.map(type => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-surface-elevated/40 transition">
              <input
                type="checkbox"
                checked={selectedTypes.has(type)}
                onChange={() => toggleJobType(type)}
                className="w-4 h-4 rounded border-border accent-accent"
              />
              <span className="text-sm text-text-primary flex-1">{type}</span>
              <span className="text-xs text-text-muted font-mono">{jobListings.filter(j => j.type === type).length}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Department */}
      <div className="bg-surface-card border border-border rounded-xl p-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wide mb-3">Department</h3>
        <div className="space-y-1">
          {DEPARTMENTS.map(dept => (
            <label key={dept} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-surface-elevated/40 transition">
              <input
                type="checkbox"
                checked={selectedDepartments.has(dept)}
                onChange={() => toggleDepartment(dept)}
                className="w-4 h-4 rounded border-border accent-accent"
              />
              <span className="text-sm text-text-primary flex-1">{dept}</span>
              <span className="text-xs text-text-muted font-mono">{jobListings.filter(j => j.department === dept).length}</span>
            </label>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full py-2 text-sm font-semibold text-accent border border-accent-deep/40 rounded-xl hover:bg-accent-deepest transition"
        >
          Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">Job Opportunities</h1>
        <p className="text-sm text-text-muted">Internships, working student positions, and research roles at Würth Electronics</p>
      </div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden px-4 pt-4 flex items-center justify-between">
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-text-primary">{filteredJobs.length}</span> of {jobListings.length} roles
        </p>
        <button
          onClick={() => setFiltersOpen(v => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-text-primary bg-surface-card border border-border px-3 py-1.5 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-accent text-text-primary text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter panel */}
      {filtersOpen && (
        <div className="lg:hidden px-4 pt-4">
          <FiltersPanel />
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <FiltersPanel />
          </div>
        </aside>

        {/* Job listings */}
        <div className="flex-1 min-w-0">
          {/* Desktop count */}
          <p className="hidden lg:block text-sm text-text-muted mb-4">
            Showing <span className="font-semibold text-text-primary">{filteredJobs.length}</span> of{' '}
            <span className="font-semibold text-text-primary">{jobListings.length}</span> opportunities
          </p>

          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <div
                  key={job.id}
                  className="bg-surface-card border border-border rounded-xl p-5 hover:border-accent/40 transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-lg font-bold text-text-primary mb-1 leading-tight">{job.title}</h2>
                      <p className="text-xs text-text-muted">{job.location}</p>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${getTypeBadgeStyle(job.type)}`}>
                      {job.type}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="inline-block px-2 py-0.5 bg-surface-elevated border border-border rounded text-xs font-medium text-text-muted mb-2">
                      {job.department}
                    </span>
                    <p className="text-sm text-text-muted leading-relaxed">{job.description}</p>
                  </div>

                  <div className="mb-3">
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-1.5">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-accent-deepest text-[#f2a0a0] border border-accent-deep/30 rounded text-[11px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-1.5">Hardware Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.hardwareStack.map((hw, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#0d2a45] text-[#5eaeff] border border-[#1e4d7b]/40 rounded text-[11px] font-medium">
                          ⚡ {hw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex justify-end">
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-accent text-text-primary rounded-lg hover:bg-accent-hover transition font-semibold text-sm"
                    >
                      Apply Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-card border border-border rounded-xl p-10 text-center">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-text-primary font-semibold mb-1">No opportunities found</p>
              <p className="text-text-muted text-sm mb-4">Try adjusting your filters or search query</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-accent-deepest text-accent rounded-lg border border-accent-deep/40 hover:bg-accent-deep/20 transition text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* WE Events */}
          {WE_EVENTS.length > 0 && (
            <div className="mt-10">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <img
                  src="https://www.we-online.com/files/png1/favicon_we_2022.png"
                  alt="Würth Elektronik"
                  className="w-5 h-5 rounded"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <h2 className="text-base font-bold text-text-primary">Würth Elektronik Events & Opportunities</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent-deepest text-accent border border-accent-deep/30 font-semibold">LIVE FEED</span>
              </div>
              <p className="text-sm text-text-muted mb-4">Seminars, trade shows, and career events from Würth Elektronik.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WE_EVENTS.map(item => <WEEventCard key={item.id} item={item} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WEEventCard({ item }: { item: WEFeedItem }) {
  const icon = item.category === 'career' ? '💼' : '📅';
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-surface-card border border-border rounded-xl p-4 hover:border-accent/30 transition"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg">{icon}</span>
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-status-warn/10 text-status-warn border border-status-warn/20 capitalize">
            {item.category}
          </span>
        </div>
        <span className="text-[11px] text-text-muted shrink-0">
          {new Date(item.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </span>
      </div>
      <h3 className="text-sm font-bold text-text-primary mb-1 line-clamp-2 group-hover:text-accent transition-colors">
        {item.title}
      </h3>
      <p className="text-xs text-text-muted leading-relaxed mb-2 line-clamp-2">{item.summary}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {item.tags.slice(0, 3).map(t => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-[11px] text-text-muted truncate">📍 {item.source}</span>
        <span className="text-[11px] text-accent font-semibold shrink-0 group-hover:underline">Learn more →</span>
      </div>
    </a>
  );
}
