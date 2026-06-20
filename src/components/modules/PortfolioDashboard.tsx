import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * MODULE 1: EMPIRICAL TELEMETRY & HARDWARE PORTFOLIO DASHBOARD
 * 
 * Component Layer: Frontend UI
 * 
 * RBAC Rules:
 * - Students: View their own portfolio + telemetry history
 * - Corporate Admins/Employees: View all student portfolios + leaderboard
 * - Can search candidates by design quality score, reliability index, etc.
 */

interface TelemetryRecord {
  id: number;
  studentId: number;
  impedanceMagnitude: number;
  powerLoss: number;
  thermalTemp: number;
  passedValidation: boolean;
  timestamp: string;
}

interface Portfolio {
  studentId: number;
  designQualityScore: number;
  reliabilityIndex: number;
  innovationScore: number;
  totalTestRuns: number;
  averagePowerLoss: number;
  maxThermalTemp: number;
}

interface LeaderboardEntry {
  studentId: number;
  studentName: string;
  designQualityScore: number;
  reliabilityIndex: number;
  totalTests: number;
}

export function PortfolioDashboard() {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/telemetry/portfolio', {
          headers: {
            'X-User-Role': currentUser?.role || 'student',
            'X-User-ID': '1', // In production, from JWT
          },
        });

        const data = await response.json();
        if (data.success) {
          setPortfolio(data.portfolio);
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      }
    };

    const fetchTelemetry = async () => {
      try {
        const response = await fetch('/api/telemetry/records?limit=10', {
          headers: {
            'X-User-Role': currentUser?.role || 'student',
            'X-User-ID': '1',
          },
        });

        const data = await response.json();
        if (data.success) {
          setTelemetry(data.records);
        }
      } catch (error) {
        console.error('Error fetching telemetry:', error);
      }
    };

    // Fetch leaderboard if admin
    const fetchLeaderboard = async () => {
      if (currentUser?.role === 'corporate_admin' || currentUser?.role === 'wurth_employee') {
        try {
          const response = await fetch('/api/telemetry/leaderboard', {
            headers: {
              'X-User-Role': currentUser.role,
              'X-User-ID': '1',
            },
          });

          const data = await response.json();
          if (data.success) {
            setLeaderboard(data.leaderboard);
          }
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
        }
      }
    };

    Promise.all([fetchPortfolio(), fetchTelemetry(), fetchLeaderboard()]).finally(
      () => setLoading(false)
    );
  }, [currentUser?.role]);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading portfolio...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Portfolio Overview */}
      {portfolio && (
        <div className="bg-surface-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Portfolio Metrics</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Design Quality Score */}
            <div className="bg-surface-secondary p-4 rounded-lg">
              <div className="text-sm text-text-muted mb-1">Design Quality Score</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-blue-500">
                  {portfolio.designQualityScore}
                </div>
                <div className="text-sm text-text-muted">/100</div>
              </div>
              <div className="text-xs text-text-muted mt-2">
                Based on {portfolio.totalTestRuns} test runs
              </div>
            </div>

            {/* Reliability Index */}
            <div className="bg-surface-secondary p-4 rounded-lg">
              <div className="text-sm text-text-muted mb-1">Reliability Index</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-green-500">
                  {portfolio.reliabilityIndex.toFixed(1)}%
                </div>
              </div>
              <div className="text-xs text-text-muted mt-2">Pass rate across all tests</div>
            </div>

            {/* Innovation Score */}
            <div className="bg-surface-secondary p-4 rounded-lg">
              <div className="text-sm text-text-muted mb-1">Innovation Score</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-purple-500">
                  {portfolio.innovationScore}
                </div>
                <div className="text-sm text-text-muted">/100</div>
              </div>
              <div className="text-xs text-text-muted mt-2">Relative to cohort</div>
            </div>
          </div>

          {/* Thermal/Power Metrics */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-surface-secondary p-4 rounded-lg">
              <div className="text-sm text-text-muted mb-1">Avg Power Loss</div>
              <div className="text-2xl font-bold">{portfolio.averagePowerLoss.toFixed(2)} mW</div>
            </div>
            <div className="bg-surface-secondary p-4 rounded-lg">
              <div className="text-sm text-text-muted mb-1">Max Thermal Temp</div>
              <div className="text-2xl font-bold">{portfolio.maxThermalTemp.toFixed(1)}°C</div>
            </div>
          </div>
        </div>
      )}

      {/* Telemetry History */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Telemetry Runs</h3>

        <div className="space-y-2">
          {telemetry.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              No telemetry data yet. Record your first test run!
            </div>
          ) : (
            telemetry.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border/50 hover:bg-surface-hover transition"
              >
                <div>
                  <div className="font-medium">
                    {record.passedValidation ? '✓' : '✗'} Test Run
                  </div>
                  <div className="text-sm text-text-muted">
                    Impedance: {record.impedanceMagnitude?.toFixed(2)} Ω | Power Loss:{' '}
                    {record.powerLoss?.toFixed(2)} mW | Temp: {record.thermalTemp?.toFixed(1)}°C
                  </div>
                </div>
                <div className="text-sm text-text-muted">
                  {new Date(record.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Leaderboard (Admin Only) */}
      {(currentUser?.role === 'corporate_admin' ||
        currentUser?.role === 'wurth_employee') && (
        <div className="bg-surface-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Top Designers (Recruiting Insights)</h3>

          <div className="space-y-2">
            {leaderboard.slice(0, 10).map((entry, index) => (
              <div
                key={entry.studentId}
                className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg hover:bg-surface-hover transition cursor-pointer"
                onClick={() => setSelectedStudent(entry.studentId)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="font-bold text-text-muted w-6">#{index + 1}</div>
                  <div>
                    <div className="font-medium">{entry.studentName}</div>
                    <div className="text-sm text-text-muted">{entry.totalTests} test runs</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-blue-500">{entry.designQualityScore}</div>
                    <div className="text-xs text-text-muted">Quality</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-500">
                      {entry.reliabilityIndex.toFixed(0)}%
                    </div>
                    <div className="text-xs text-text-muted">Reliability</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-text-muted">
            💡 Use these metrics to identify top talent for hardware engineering roles
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioDashboard;
