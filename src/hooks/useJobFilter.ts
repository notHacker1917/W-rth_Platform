import { useState, useMemo } from 'react';

// Inline type definitions to avoid Vite module resolution issues
type JobCategory = 'Working Student' | 'Internship' | 'Research Assistant' | 'HiWi';
type Department = 'Power Modules' | 'Wireless Connectivity & Sensors' | 'Embedded Systems';

interface JobListing {
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

interface JobFilterState {
  searchQuery: string;
  selectedTypes: Set<JobCategory>;
  selectedDepartments: Set<Department>;
}

export function useJobFilter(jobs: JobListing[]) {
  const [filterState, setFilterState] = useState<JobFilterState>({
    searchQuery: '',
    selectedTypes: new Set(),
    selectedDepartments: new Set(),
  });

  // Filter and search jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search query filter
      const searchLower = filterState.searchQuery.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.requiredSkills.some((skill) => skill.toLowerCase().includes(searchLower)) ||
        job.hardwareStack.some((hardware) => hardware.toLowerCase().includes(searchLower));

      if (filterState.searchQuery && !matchesSearch) {
        return false;
      }

      // Job type filter
      if (filterState.selectedTypes.size > 0 && !filterState.selectedTypes.has(job.type)) {
        return false;
      }

      // Department filter
      if (filterState.selectedDepartments.size > 0 && !filterState.selectedDepartments.has(job.department)) {
        return false;
      }

      return true;
    });
  }, [jobs, filterState]);

  // Update search query
  const setSearchQuery = (query: string) => {
    setFilterState((prev) => ({ ...prev, searchQuery: query }));
  };

  // Toggle job type filter
  const toggleJobType = (type: JobCategory) => {
    setFilterState((prev) => {
      const newTypes = new Set(prev.selectedTypes);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      return { ...prev, selectedTypes: newTypes };
    });
  };

  // Toggle department filter
  const toggleDepartment = (dept: Department) => {
    setFilterState((prev) => {
      const newDepts = new Set(prev.selectedDepartments);
      if (newDepts.has(dept)) {
        newDepts.delete(dept);
      } else {
        newDepts.add(dept);
      }
      return { ...prev, selectedDepartments: newDepts };
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterState({
      searchQuery: '',
      selectedTypes: new Set(),
      selectedDepartments: new Set(),
    });
  };

  return {
    filteredJobs,
    searchQuery: filterState.searchQuery,
    selectedTypes: filterState.selectedTypes,
    selectedDepartments: filterState.selectedDepartments,
    setSearchQuery,
    toggleJobType,
    toggleDepartment,
    clearFilters,
  };
}
