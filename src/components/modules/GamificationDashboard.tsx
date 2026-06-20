import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * MODULE 3: ENGAGEMENT, ALGORITHMIC FEEDS & GAMIFICATION
 * 
 * Component Layer: Frontend UI
 * 
 * Features:
 * - QR code validation for event attendance
 * - Badge showcase and pinning
 * - XP ledger visualization
 * - Personalized feed preferences
 */

interface Badge {
  id: number;
  badgeName: string;
  tier: string;
  category: string;
  earnedAt: string;
  pinnedAt?: string;
}

interface XpTransaction {
  id: number;
  activityType: string;
  activityId: string;
  xpDelta: number;
  totalXpAfter: number;
  description: string;
  createdAt: string;
}

export function GamificationDashboard() {
  const { currentUser } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [xpLedger, setXpLedger] = useState<XpTransaction[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch gamification data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch badges
        const badgesResponse = await fetch('/api/gamification/badges', {
          headers: {
            'X-User-Role': currentUser?.role || 'student',
            'X-User-ID': '1',
          },
        });

        const badgesData = await badgesResponse.json();
        if (badgesData.success) {
          setBadges(badgesData.badges);
        }

        // Fetch XP ledger
        const xpResponse = await fetch('/api/gamification/xp-ledger?limit=20', {
          headers: {
            'X-User-Role': currentUser?.role || 'student',
            'X-User-ID': '1',
          },
        });

        const xpData = await xpResponse.json();
        if (xpData.success) {
          setXpLedger(xpData.ledger);
          setTotalXp(xpData.totalXp);
        }
      } catch (error) {
        console.error('Error fetching gamification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.role]);

  const handleQrValidation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/gamification/qr-validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'student',
          'X-User-ID': '1',
        },
        body: JSON.stringify({
          qrCode: qrInput,
          eventId: 'event_123',
          eventName: 'PCIM Europe 2025',
          eventDate: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setQrInput('');
        alert(`✓ Event attendance confirmed! +${data.xpAwarded} XP`);
      }
    } catch (error) {
      console.error('Error validating QR:', error);
    }
  };

  const handlePinBadge = async (badgeId: number) => {
    try {
      const response = await fetch('/api/gamification/badges/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUser?.role || 'student',
          'X-User-ID': '1',
        },
        body: JSON.stringify({ badgeId }),
      });

      const data = await response.json();
      if (data.success) {
        // Update UI
        setBadges((prev) =>
          prev.map((b) => (b.id === badgeId ? { ...b, pinnedAt: new Date().toISOString() } : b))
        );
      }
    } catch (error) {
      console.error('Error pinning badge:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading gamification data...</div>;
  }

  const pinnedBadges = badges.filter((b) => b.pinnedAt);
  const unpinnedBadges = badges.filter((b) => !b.pinnedAt);

  return (
    <div className="space-y-6 pb-20">
      {/* XP Counter */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="text-sm opacity-90">Total XP</div>
        <div className="text-4xl font-bold mt-2">{totalXp.toLocaleString()}</div>
        <div className="text-sm opacity-75 mt-2">🎯 Keep completing bounties and validating events!</div>
      </div>

      {/* QR Code Validation */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Event Check-In (QR Code)</h3>

        <form onSubmit={handleQrValidation} className="space-y-3">
          <div>
            <label className="text-sm text-text-muted mb-2 block">Scan QR Code</label>
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Paste QR code here..."
              className="w-full bg-surface-secondary border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={!qrInput.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Validate Event Attendance
          </button>
        </form>

        <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm">
          💡 Scan QR codes at Würth events and conferences to earn XP instantly!
        </div>
      </div>

      {/* Pinned Badges */}
      {pinnedBadges.length > 0 && (
        <div className="bg-surface-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Featured Badges</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pinnedBadges.map((badge) => (
              <div key={badge.id} className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <div className="font-semibold text-sm">{badge.badgeName}</div>
                <div className="text-xs text-text-muted capitalize">{badge.tier}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Badges */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">All Badges ({badges.length})</h3>

        {badges.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            No badges yet. Complete bounties and validate events to earn badges!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {unpinnedBadges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => handlePinBadge(badge.id)}
                className="p-3 bg-surface-secondary border border-border rounded-lg hover:border-blue-500 transition text-center group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition">🎖️</div>
                <div className="font-semibold text-xs">{badge.badgeName}</div>
                <div className="text-xs text-text-muted capitalize mt-1">{badge.tier}</div>
                <div className="text-xs text-blue-400 mt-2 opacity-0 group-hover:opacity-100 transition">
                  Click to pin
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* XP Ledger */}
      <div className="bg-surface-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

        <div className="space-y-2">
          {xpLedger.length === 0 ? (
            <div className="text-center py-8 text-text-muted">No activity yet</div>
          ) : (
            xpLedger.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border/50 hover:bg-surface-hover transition"
              >
                <div>
                  <div className="font-medium text-sm">{transaction.description}</div>
                  <div className="text-xs text-text-muted">
                    {transaction.activityType === 'bounty' && '🎯 Bounty'}
                    {transaction.activityType === 'event' && '🎪 Event'}
                    {transaction.activityType === 'contribution' && '💡 Contribution'}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-bold ${
                      transaction.xpDelta > 0 ? 'text-green-400' : 'text-gray-400'
                    }`}
                  >
                    {transaction.xpDelta > 0 ? '+' : ''}{transaction.xpDelta} XP
                  </div>
                  <div className="text-xs text-text-muted">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default GamificationDashboard;
