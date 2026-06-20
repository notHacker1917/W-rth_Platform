// Inline types to avoid Vite module resolution issues
type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

interface ActivityMatrixProps {
  contributionDays: ContributionDay[];
  totalContributions: number;
}

const CONTRIBUTION_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-surface-elevated',
  1: 'bg-green-600/30 border-green-600/40',
  2: 'bg-green-600/60 border-green-600/70',
  3: 'bg-green-600/80 border-green-600/90',
  4: 'bg-green-600 border-green-700',
};

const CONTRIBUTION_LABELS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'No contribution',
  1: 'Low',
  2: 'Moderate',
  3: 'High',
  4: 'Very High',
};

export function ActivityMatrix({ contributionDays, totalContributions }: ActivityMatrixProps) {
  // Group contributions by week (starting from Sunday)
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  // Fill starting days if first day isn't a Sunday
  const firstDate = new Date(contributionDays[0].date);
  const startingDayOfWeek = firstDate.getDay();
  for (let i = 0; i < startingDayOfWeek; i++) {
    currentWeek.push({ date: '', count: 0, level: 0 });
  }

  for (const day of contributionDays) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate month boundaries for labels
  const monthBoundaries: Map<number, { monthIndex: number; weekIndex: number }> = new Map();
  weeks.forEach((week, weekIdx) => {
    if (week[0].date) {
      const monthIndex = new Date(week[0].date).getMonth();
      if (!monthBoundaries.has(monthIndex) || monthBoundaries.get(monthIndex)!.weekIndex > weekIdx) {
        monthBoundaries.set(monthIndex, { monthIndex, weekIndex: weekIdx });
      }
    }
  });

  return (
    <div className="bg-surface-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Annual Contribution Activity</h3>
          <p className="text-xs text-text-muted mt-1">{totalContributions.toLocaleString()} contributions in the last year</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex gap-1 mb-2">
            <div className="w-8" />
            {weeks.map((_, weekIdx) => {
              const monthData = Array.from(monthBoundaries.values()).find((m) => m.weekIndex === weekIdx);
              return (
                <div key={weekIdx} className="w-3 text-center">
                  {monthData && <span className="text-xs text-text-muted">{MONTH_LABELS[monthData.monthIndex]}</span>}
                </div>
              );
            })}
          </div>

          {/* Day-of-week labels and grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1">
              {DAY_LABELS.map((label, idx) => (
                <div key={idx} className="h-3 w-8 flex items-center text-right">
                  {idx % 2 === 0 && <span className="text-xs text-text-muted">{label}</span>}
                </div>
              ))}
            </div>

            {/* Contribution grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((day, dayIdx) => (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      title={day.date ? `${day.count} contributions on ${day.date}` : ''}
                      className={`w-3 h-3 rounded border border-opacity-50 transition-all hover:ring-1 hover:ring-offset-1 hover:ring-accent-primary cursor-default ${
                        day.date
                          ? CONTRIBUTION_COLORS[day.level]
                          : 'bg-transparent border-transparent'
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border flex-wrap text-xs">
        <span className="text-text-muted">Less</span>
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <div
            key={level}
            title={CONTRIBUTION_LABELS[level]}
            className={`w-2.5 h-2.5 rounded border ${CONTRIBUTION_COLORS[level]}`}
          />
        ))}
        <span className="text-text-muted">More</span>
      </div>
    </div>
  );
}
