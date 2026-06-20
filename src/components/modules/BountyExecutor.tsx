import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * MODULE 2: ZERO-TRUST MICRO-INTERNSHIPS & SANDBOX BOUNTIES
 * 
 * Component Layer: Frontend UI
 * 
 * RBAC Rules:
 * - Students: Can execute bounties and submit solutions
 * - Admins: Can create bounties, verify submissions, award rewards
 * - Bounty execution is sandboxed and isolated per user
 */

interface Bounty {
  id: number;
  title: string;
  description: string;
  difficultyLevel: string;
  category: string;
  xpReward: number;
  componentBudgetSubsidy: number;
  status: string;
}

interface ExecutionResult {
  executionId: number;
  status: string;
  testsPassed: number;
  testsTotal: number;
}

export function BountyExecutor() {
  const { currentUser } = useAuth();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [code, setCode] = useState('');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch active bounties
  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await fetch('/api/bounties?active=true', {
          headers: {
            'X-User-Role': currentUser?.role || 'student',
            'X-User-ID': '1',
          },
        });

        const data = await response.json();
        if (data.success) {
          setBounties(data.bounties);
          if (data.bounties.length > 0) {
            setSelectedBounty(data.bounties[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching bounties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, [currentUser?.role]);

  const handleExecute = async () => {
    if (!selectedBounty || !code.trim()) return;

    setExecuting(true);
    setResult(null);

    try {
      const response = await fetch('/api/bounties/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'student',
          'X-User-ID': '1',
        },
        body: JSON.stringify({
          bountyId: selectedBounty.id,
          submittedCode: code,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult({
          executionId: data.executionId,
          status: data.status,
          testsPassed: data.testsPassed,
          testsTotal: data.testsTotal,
        });
      }
    } catch (error) {
      console.error('Error executing bounty:', error);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading bounties...</div>;
  }

  if (currentUser?.role !== 'student') {
    return (
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <div className="text-center py-12">
          <div className="text-2xl font-bold mb-2">Admin Bounty Management</div>
          <div className="text-text-muted">
            Use the admin dashboard to create and verify bounties
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Bounty Selection */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Available Bounties</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bounties.map((bounty) => (
            <button
              key={bounty.id}
              onClick={() => {
                setSelectedBounty(bounty);
                setResult(null);
                setCode('');
              }}
              className={`p-4 rounded-lg border-2 transition text-left ${
                selectedBounty?.id === bounty.id
                  ? 'border-blue-500 bg-surface-secondary'
                  : 'border-border bg-surface-secondary hover:border-border-hover'
              }`}
            >
              <div className="font-semibold">{bounty.title}</div>
              <div className="text-sm text-text-muted mt-1">{bounty.description}</div>

              <div className="flex items-center gap-4 mt-3">
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                  {bounty.difficultyLevel}
                </span>
                <span className="text-sm font-bold text-green-400">{bounty.xpReward} XP</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      {selectedBounty && (
        <div className="bg-surface-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Submit Solution</h3>

          <div className="mb-4">
            <div className="text-sm text-text-muted mb-2">Problem</div>
            <div className="bg-surface-secondary p-4 rounded-lg border border-border text-sm">
              {selectedBounty.description}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-text-muted mb-2 block">Your Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your solution here..."
              className="w-full h-64 bg-surface-secondary border border-border rounded-lg p-4 font-mono text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleExecute}
            disabled={executing || !code.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
          >
            {executing ? 'Executing...' : 'Run Tests'}
          </button>
        </div>
      )}

      {/* Execution Results */}
      {result && (
        <div className="bg-surface-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Execution Results</h3>

          <div
            className={`p-4 rounded-lg mb-4 ${
              result.testsPassed === result.testsTotal
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-yellow-500/20 border border-yellow-500/30'
            }`}
          >
            <div className="font-bold">
              {result.testsPassed === result.testsTotal ? '✓ All Tests Passed!' : '✗ Some Tests Failed'}
            </div>
            <div className="text-sm mt-1">
              {result.testsPassed}/{result.testsTotal} test cases passed
            </div>
          </div>

          {result.testsPassed === result.testsTotal && (
            <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-lg">
              <div className="font-bold text-green-400 mb-2">🎉 Bounty Completed!</div>
              <div className="text-sm text-text-muted mb-4">
                Your solution has been submitted for verification. An admin will review it and award
                rewards within 24 hours.
              </div>

              <div className="flex gap-4 text-sm">
                <div>
                  <div className="text-text-muted">Pending XP</div>
                  <div className="font-bold text-green-400">{selectedBounty?.xpReward}</div>
                </div>
                {selectedBounty?.componentBudgetSubsidy && (
                  <div>
                    <div className="text-text-muted">Component Budget</div>
                    <div className="font-bold text-green-400">
                      ${selectedBounty.componentBudgetSubsidy}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BountyExecutor;
