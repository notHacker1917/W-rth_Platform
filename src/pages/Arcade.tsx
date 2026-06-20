import { useState } from 'react';
import PixelSpaceShooter from '../components/PixelSpaceShooter';

export default function Arcade() {
  const [lastScore, setLastScore] = useState<number | null>(null);

  const handleGameOver = (score: number) => {
    setLastScore(score);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Arcade</h1>
        <p className="text-sm text-text-muted mt-1">
          Take a break — shoot some aliens, earn your rank.
        </p>
      </div>

      {lastScore !== null && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-surface-card border border-border text-sm text-text-muted flex items-center justify-between">
          <span>
            Last run: <strong className="text-text-primary">{lastScore.toLocaleString()} pts</strong>
            {lastScore >= 2000 && <span className="ml-2">🏆 Legendary</span>}
            {lastScore >= 1000 && lastScore < 2000 && <span className="ml-2">🥇 Ace Pilot</span>}
            {lastScore >= 500 && lastScore < 1000 && <span className="ml-2">🥈 Sharp Shot</span>}
          </span>
          <span className="text-xs opacity-50">Score not yet synced to leaderboard</span>
        </div>
      )}

      <div className="flex justify-center">
        <PixelSpaceShooter onGameOver={handleGameOver} />
      </div>
    </div>
  );
}
