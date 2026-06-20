import { useState, useCallback } from 'react';
import type {
  GDPRRecord,
  HardwareBounty,
  MicroInternship,
  ProjectValidation,
  AdminFilters,
} from '../types/admin';
import {
  MOCK_GDPR_RECORDS,
  MOCK_HARDWARE_BOUNTIES,
  MOCK_MICRO_INTERNSHIPS,
  MOCK_PROJECT_VALIDATIONS,
} from '../data/adminMockData';

/**
 * useAdminActions: Central state management hook for admin operations
 * 
 * Provides actions for managing bounties, internships, GDPR records, and validations.
 * Built with React hooks for easy integration into functional components.
 */
export function useAdminActions() {
  const [gdprRecords, setGDPRRecords] = useState<GDPRRecord[]>(MOCK_GDPR_RECORDS);
  const [hardwareBounties, setHardwareBounties] = useState<HardwareBounty[]>(
    MOCK_HARDWARE_BOUNTIES
  );
  const [microInternships, setMicroInternships] = useState<MicroInternship[]>(
    MOCK_MICRO_INTERNSHIPS
  );
  const [projectValidations, setProjectValidations] = useState<ProjectValidation[]>(
    MOCK_PROJECT_VALIDATIONS
  );
  const [filters, setFilters] = useState<AdminFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── GDPR Record Operations ────────────────────────────────────────────────

  const updateGDPRRecordStatus = useCallback(
    (recordId: string, newStatus: GDPRRecord['status']) => {
      setLoading(true);
      try {
        setGDPRRecords(prev =>
          prev.map(record =>
            record.id === recordId
              ? {
                  ...record,
                  status: newStatus,
                  modifiedAt: new Date().toISOString(),
                }
              : record
          )
        );
        setError(null);
      } catch (err) {
        setError('Failed to update GDPR record');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteGDPRRecord = useCallback((recordId: string) => {
    setLoading(true);
    try {
      setGDPRRecords(prev => prev.filter(record => record.id !== recordId));
      setError(null);
    } catch (err) {
      setError('Failed to delete GDPR record');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Hardware Bounty Operations ─────────────────────────────────────────────

  const createHardwareBounty = useCallback((bounty: Omit<HardwareBounty, 'id'>) => {
    setLoading(true);
    try {
      const newBounty: HardwareBounty = {
        ...bounty,
        id: `hb-${Date.now()}`,
      };
      setHardwareBounties(prev => [...prev, newBounty]);
      setError(null);
      return newBounty;
    } catch (err) {
      setError('Failed to create hardware bounty');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHardwareBounty = useCallback(
    (bountyId: string, updates: Partial<HardwareBounty>) => {
      setLoading(true);
      try {
        setHardwareBounties(prev =>
          prev.map(bounty =>
            bounty.id === bountyId ? { ...bounty, ...updates } : bounty
          )
        );
        setError(null);
      } catch (err) {
        setError('Failed to update hardware bounty');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteHardwareBounty = useCallback((bountyId: string) => {
    setLoading(true);
    try {
      setHardwareBounties(prev => prev.filter(bounty => bounty.id !== bountyId));
      setError(null);
    } catch (err) {
      setError('Failed to delete hardware bounty');
    } finally {
      setLoading(false);
    }
  }, []);

  const publishHardwareBounty = useCallback((bountyId: string) => {
    updateHardwareBounty(bountyId, { status: 'published' });
  }, [updateHardwareBounty]);

  // ─── Micro-Internship Operations ────────────────────────────────────────────

  const createMicroInternship = useCallback((internship: Omit<MicroInternship, 'id'>) => {
    setLoading(true);
    try {
      const newInternship: MicroInternship = {
        ...internship,
        id: `mi-${Date.now()}`,
      };
      setMicroInternships(prev => [...prev, newInternship]);
      setError(null);
      return newInternship;
    } catch (err) {
      setError('Failed to create micro-internship');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMicroInternship = useCallback(
    (internshipId: string, updates: Partial<MicroInternship>) => {
      setLoading(true);
      try {
        setMicroInternships(prev =>
          prev.map(internship =>
            internship.id === internshipId ? { ...internship, ...updates } : internship
          )
        );
        setError(null);
      } catch (err) {
        setError('Failed to update micro-internship');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteMicroInternship = useCallback((internshipId: string) => {
    setLoading(true);
    try {
      setMicroInternships(prev => prev.filter(i => i.id !== internshipId));
      setError(null);
    } catch (err) {
      setError('Failed to delete micro-internship');
    } finally {
      setLoading(false);
    }
  }, []);

  const publishMicroInternship = useCallback((internshipId: string) => {
    updateMicroInternship(internshipId, { status: 'published' });
  }, [updateMicroInternship]);

  // ─── Project Validation Operations ──────────────────────────────────────────

  const updateProjectValidation = useCallback(
    (validationId: string, updates: Partial<ProjectValidation>) => {
      setLoading(true);
      try {
        setProjectValidations(prev =>
          prev.map(validation =>
            validation.id === validationId
              ? {
                  ...validation,
                  ...updates,
                  validatedAt: new Date().toISOString(),
                }
              : validation
          )
        );
        setError(null);
      } catch (err) {
        setError('Failed to update project validation');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const approveProjectValidation = useCallback(
    (validationId: string, notes: string) => {
      updateProjectValidation(validationId, {
        status: 'approved',
        validationNotes: notes,
      });
    },
    [updateProjectValidation]
  );

  const rejectProjectValidation = useCallback(
    (validationId: string, notes: string) => {
      updateProjectValidation(validationId, {
        status: 'rejected',
        validationNotes: notes,
      });
    },
    [updateProjectValidation]
  );

  const requestProjectRevision = useCallback(
    (validationId: string, notes: string) => {
      updateProjectValidation(validationId, {
        status: 'needs-revision',
        validationNotes: notes,
      });
    },
    [updateProjectValidation]
  );

  // ─── Filter Operations ─────────────────────────────────────────────────────

  const applyFilters = useCallback((newFilters: AdminFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // ─── Helper: Filter data based on current filters ───────────────────────────

  const filterData = useCallback(
    <T extends { id: string; status?: string }>(data: T[]): T[] => {
      let filtered = [...data];

      if (filters.status) {
        filtered = filtered.filter(item => item.status === filters.status);
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(item =>
          JSON.stringify(item).toLowerCase().includes(query)
        );
      }

      return filtered;
    },
    [filters]
  );

  return {
    // State
    gdprRecords,
    hardwareBounties,
    microInternships,
    projectValidations,
    filters,
    loading,
    error,

    // GDPR operations
    updateGDPRRecordStatus,
    deleteGDPRRecord,

    // Hardware bounty operations
    createHardwareBounty,
    updateHardwareBounty,
    deleteHardwareBounty,
    publishHardwareBounty,

    // Micro-internship operations
    createMicroInternship,
    updateMicroInternship,
    deleteMicroInternship,
    publishMicroInternship,

    // Project validation operations
    updateProjectValidation,
    approveProjectValidation,
    rejectProjectValidation,
    requestProjectRevision,

    // Filter operations
    applyFilters,
    clearFilters,
    filterData,
  };
}
