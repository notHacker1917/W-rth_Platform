import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * MODULE 4: ENTERPRISE INTELLIGENCE, DATA ARCHITECTURE & ANALYTICS
 * 
 * Component Layer: Frontend UI (Admin Only)
 * 
 * Features:
 * - Real-time KPI dashboard
 * - Power BI export scheduling
 * - Content moderation queue
 * - Semantic graph visualization
 */

interface KpiBanner {
  label: string;
  value: string | number;
  trend?: string;
  icon: string;
}

interface ModerationItem {
  id: number;
  contentType: string;
  profanityScore: number;
  spamScore: number;
  toxicityScore: number;
  flagged: boolean;
}

export function AnalyticsDashboard() {
  const { currentUser } = useAuth();
  const [kpis, setKpis] = useState<any>(null);
  const [modQueue, setModQueue] = useState<ModerationItem[]>([]);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Only admins can access
  useEffect(() => {
    if (currentUser?.role !== 'sys_admin') {
      return;
    }

    const fetchAnalytics = async () => {
      try {
        // Fetch KPIs
        const kpiResponse = await fetch('/api/analytics/kpi-dashboard', {
          headers: {
            'X-User-Role': 'sys_admin',
            'X-User-ID': '1',
          },
        });

        const kpiData = await kpiResponse.json();
        if (kpiData.success) {
          setKpis(kpiData.kpis);
        }

        // Fetch moderation queue
        const modResponse = await fetch('/api/content-moderation/queue', {
          headers: {
            'X-User-Role': 'sys_admin',
            'X-User-ID': '1',
          },
        });

        const modData = await modResponse.json();
        if (modData.success) {
          setModQueue(modData.queue);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentUser?.role]);

  const handlePowerBiExport = async () => {
    setExporting(true);

    try {
      const response = await fetch('/api/analytics/export-powerbi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': 'sys_admin',
          'X-User-ID': '1',
        },
        body: JSON.stringify({
          reportName: 'Würth Platform Weekly KPIs',
          reportType: 'kpi_dashboard',
          scheduleFrequency: 'weekly',
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✓ Export scheduled! Data will sync to Power BI shortly.');
      }
    } catch (error) {
      console.error('Error exporting to Power BI:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleModerationApprove = async (itemId: number) => {
    try {
      const response = await fetch('/api/content-moderation/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': 'sys_admin',
          'X-User-ID': '1',
        },
        body: JSON.stringify({
          moderationId: itemId,
          action: 'approved',
          notes: 'Approved by admin',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setModQueue((prev) => prev.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.error('Error approving content:', error);
    }
  };

  const handleModerationRemove = async (itemId: number) => {
    try {
      const response = await fetch('/api/content-moderation/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': 'sys_admin',
          'X-User-ID': '1',
        },
        body: JSON.stringify({
          moderationId: itemId,
          action: 'removed',
          notes: 'Removed for policy violation',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setModQueue((prev) => prev.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.error('Error removing content:', error);
    }
  };

  if (currentUser?.role !== 'sys_admin') {
    return (
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <div className="text-center py-12">
          <div className="text-2xl font-bold text-red-400 mb-2">Access Denied</div>
          <div className="text-text-muted">Analytics dashboard is restricted to system administrators</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* KPI Banners */}
      {kpis && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-muted">Active Users Today</div>
                  <div className="text-3xl font-bold mt-2">{kpis.totalActiveUsers}</div>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-muted">Bounties Completed</div>
                  <div className="text-3xl font-bold mt-2">{kpis.totalBountiesCompleted}</div>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </div>

            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-muted">XP Awarded</div>
                  <div className="text-3xl font-bold mt-2">{kpis.totalXpAwarded}</div>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
            </div>

            <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-text-muted">Viable Hires</div>
                  <div className="text-3xl font-bold mt-2">{kpis.viableHiresThisPeriod}</div>
                </div>
                <div className="text-4xl">💼</div>
              </div>
            </div>
          </div>

          {/* Top Event Source */}
          <div className="bg-surface-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Highest Volume Event</h3>

            <div className="bg-surface-secondary p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold">{kpis.topEventByVolume?.eventName}</div>
                  <div className="text-sm text-text-muted mt-1">
                    Generated {kpis.topEventByVolume?.attendees} event attendances
                  </div>
                </div>
                <div className="text-5xl">🎪</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-text-muted">Active Users</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {kpis.topEventByVolume?.activeUsers}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-muted">Bounties Completed</div>
                  <div className="text-2xl font-bold text-green-400">
                    {kpis.topEventByVolume?.boundtiesCompleted}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-text-muted">
              💡 Use this data to plan future recruitment events and identify high-ROI venues
            </div>
          </div>

          {/* Engagement Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-card border border-border rounded-xl p-6">
              <h4 className="font-semibold mb-4">User Growth</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-muted">Students</span>
                  <span className="font-bold">{kpis.studentCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Mentors</span>
                  <span className="font-bold">{kpis.mentorCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">New This Period</span>
                  <span className="font-bold text-green-400">+{kpis.newUsersThisPeriod}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-card border border-border rounded-xl p-6">
              <h4 className="font-semibold mb-4">Hiring Pipeline</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-muted">Offers Made</span>
                  <span className="font-bold">{kpis.totalOffersMade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Acceptance Rate</span>
                  <span className="font-bold text-green-400">{kpis.offerAcceptanceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Viable Candidates</span>
                  <span className="font-bold">{kpis.viableHiresThisPeriod}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Power BI Export */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Power BI Export</h3>

        <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm">
          📊 Schedule automatic exports of KPI dashboards to Microsoft Power BI for enterprise
          reporting
        </div>

        <button
          onClick={handlePowerBiExport}
          disabled={exporting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
        >
          {exporting ? 'Scheduling Export...' : 'Export to Power BI'}
        </button>
      </div>

      {/* Content Moderation */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          Content Moderation Queue ({modQueue.length})
        </h3>

        {modQueue.length === 0 ? (
          <div className="text-center py-8 text-text-muted">All content is verified ✓</div>
        ) : (
          <div className="space-y-3">
            {modQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-surface-secondary border border-yellow-500/30 rounded-lg hover:bg-surface-hover transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold capitalize">
                      {item.contentType} · {item.flagged ? '🚩 Flagged' : '⚠️ Review'}
                    </div>
                    <div className="text-sm text-text-muted mt-1">Content ID: {item.id}</div>
                  </div>
                </div>

                {/* Risk Scores */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-xs bg-red-500/20 p-2 rounded">
                    <div className="text-text-muted">Profanity</div>
                    <div className="font-bold text-red-400">
                      {(item.profanityScore * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-xs bg-orange-500/20 p-2 rounded">
                    <div className="text-text-muted">Spam</div>
                    <div className="font-bold text-orange-400">
                      {(item.spamScore * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-xs bg-yellow-500/20 p-2 rounded">
                    <div className="text-text-muted">Toxicity</div>
                    <div className="font-bold text-yellow-400">
                      {(item.toxicityScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleModerationApprove(item.id)}
                    className="flex-1 bg-green-600/30 hover:bg-green-600/50 border border-green-500/50 text-green-400 py-2 rounded text-sm font-medium transition"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleModerationRemove(item.id)}
                    className="flex-1 bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-400 py-2 rounded text-sm font-medium transition"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
