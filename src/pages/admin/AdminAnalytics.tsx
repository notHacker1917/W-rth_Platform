import { useMemo } from 'react';
import { MOCK_ANALYTICS_METRICS, MOCK_ROI_DATA } from '../../data/adminMockData';
import type { ROIDataPoint } from '../../types/admin';

// ─── SVG Line + Bar Chart ─────────────────────────────────────────────────────

function ROIChart({ data }: { data: ROIDataPoint[] }) {
  const W = 620, H = 200, PAD = { top: 16, right: 16, bottom: 32, left: 52 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxRevenue  = Math.max(...data.map(d => d.revenue));
  const maxROI      = Math.max(...data.map(d => d.roi));
  const barWidth    = innerW / data.length;

  const xOf = (i: number) => PAD.left + i * barWidth + barWidth / 2;
  const yRevenue  = (v: number) => PAD.top + innerH - (v / maxRevenue) * innerH;
  const yROI      = (v: number) => PAD.top + innerH - (v / maxROI) * innerH;

  const roiPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yROI(d.roi)}`)
    .join(' ');

  const roiArea = `${roiPath} L ${xOf(data.length - 1)} ${PAD.top + innerH} L ${xOf(0)} ${PAD.top + innerH} Z`;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320 }} aria-label="ROI Chart">
        {/* Y-axis revenue ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = PAD.top + innerH - t * innerH;
          return (
            <g key={t}>
              <line x1={PAD.left - 4} y1={y} x2={W - PAD.right} y2={y}
                stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3,3" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="8"
                fill="var(--color-text-muted)">
                ${((t * maxRevenue) / 1000).toFixed(0)}K
              </text>
            </g>
          );
        })}

        {/* Revenue bars */}
        {data.map((d, i) => (
          <rect
            key={i}
            x={PAD.left + i * barWidth + barWidth * 0.2}
            y={yRevenue(d.revenue)}
            width={barWidth * 0.6}
            height={PAD.top + innerH - yRevenue(d.revenue)}
            fill="var(--color-accent)"
            opacity="0.25"
            rx="2"
          >
            <title>{d.month}: ${(d.revenue / 1000).toFixed(0)}K revenue</title>
          </rect>
        ))}

        {/* ROI area fill */}
        <path d={roiArea} fill="#3b82f6" opacity="0.12" />

        {/* ROI line */}
        <path d={roiPath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />

        {/* ROI dots */}
        {data.map((d, i) => (
          <circle key={i} cx={xOf(i)} cy={yROI(d.roi)} r="3"
            fill="#3b82f6" stroke="var(--color-surface-card)" strokeWidth="1.5">
            <title>{d.month}: {d.roi}% ROI</title>
          </circle>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="8"
            fill="var(--color-text-muted)">
            {d.month}
          </text>
        ))}

        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + innerH}
          stroke="var(--color-border)" strokeWidth="1" />
        <line x1={PAD.left} y1={PAD.top + innerH} x2={W - PAD.right} y2={PAD.top + innerH}
          stroke="var(--color-border)" strokeWidth="1" />
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm" style={{ backgroundColor: 'var(--color-accent)', opacity: 0.6 }} />
          <span className="text-[10px] text-text-muted">Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded bg-blue-400" />
          <span className="text-[10px] text-text-muted">ROI %</span>
        </div>
      </div>
    </div>
  );
}

// ─── Engagement Sparkline ─────────────────────────────────────────────────────

function EngagementSparkline({ data }: { data: ROIDataPoint[] }) {
  const W = 180, H = 40, PAD = 6;
  const vals = data.map(d => d.engagement);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const stepX = (W - PAD * 2) / (vals.length - 1);
  const yOf = (v: number) => H - PAD - ((v - min) / range) * (H - PAD * 2);
  const path = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${PAD + i * stepX} ${yOf(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10">
      <path d={path} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminAnalyticsDashboard() {
  const metrics = useMemo(() => MOCK_ANALYTICS_METRICS, []);
  const roiData = useMemo(() => MOCK_ROI_DATA, []);

  const totalRevenue   = roiData.reduce((s, d) => s + d.revenue, 0);
  const avgEngagement  = (roiData.reduce((s, d) => s + d.engagement, 0) / roiData.length).toFixed(1);
  const avgROI         = (roiData.reduce((s, d) => s + d.roi, 0) / roiData.length).toFixed(1);
  const peakROI        = Math.max(...roiData.map(d => d.roi));

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Executive Analytics</h1>
        <p className="text-sm text-text-muted mt-0.5">ROI tracking, revenue trends, and engagement metrics</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue (12M)', value: `$${(totalRevenue / 1_000_000).toFixed(2)}M`, icon: '💰' },
          { label: 'Avg Engagement',      value: `${avgEngagement}%`,                           icon: '📊' },
          { label: 'Average ROI',          value: `${avgROI}%`,                                  icon: '📈' },
          { label: 'Peak ROI Month',       value: `${peakROI}%`,                                 icon: '🏆' },
        ].map(c => (
          <div key={c.label} className="bg-surface-card border border-border rounded-xl p-4">
            <p className="text-xl mb-2">{c.icon}</p>
            <p className="text-xl font-bold text-text-primary">{c.value}</p>
            <p className="text-[10px] text-text-muted">{c.label}</p>
          </div>
        ))}
      </div>

      {/* KPI cards */}
      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-3">Key Performance Indicators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {metrics.map(m => {
            const up   = m.trend === 'up';
            const down = m.trend === 'down';
            return (
              <div key={m.id} className="bg-surface-card border border-border rounded-xl p-4">
                <p className="text-xs text-text-muted mb-1">{m.label}</p>
                <p className="text-xl font-bold text-text-primary">{m.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-xs font-semibold ${up ? 'text-green-400' : down ? 'text-red-400' : 'text-text-muted'}`}>
                    {up ? '↑' : down ? '↓' : '→'} {Math.abs(m.change)}%
                  </span>
                  <span className="text-[10px] text-text-muted">{m.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROI Chart */}
      <div className="bg-surface-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Monthly ROI & Revenue Trend</h2>
            <p className="text-[10px] text-text-muted">12-month rolling view · bars = revenue, line = ROI %</p>
          </div>
          <span className="text-[10px] px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg">
            Power BI Stream LIVE
          </span>
        </div>
        <ROIChart data={roiData} />
      </div>

      {/* Engagement sparkline + table side-by-side */}
      <div className="grid lg:grid-cols-[220px_1fr] gap-4">
        <div className="bg-surface-card border border-border rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-text-primary">Engagement Trend</p>
          <EngagementSparkline data={roiData} />
          <p className="text-[10px] text-text-muted">12-month engagement rate sparkline</p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <p className="text-base font-bold text-text-primary">{Math.max(...roiData.map(d => d.engagement))}%</p>
              <p className="text-[9px] text-text-muted">Peak</p>
            </div>
            <div>
              <p className="text-base font-bold text-text-primary">{avgEngagement}%</p>
              <p className="text-[9px] text-text-muted">Average</p>
            </div>
          </div>
        </div>

        {/* Monthly table */}
        <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">Monthly Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {['Month', 'Revenue', 'Engagement', 'ROI'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-text-muted font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roiData.map((d, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-surface-elevated transition-colors">
                    <td className="px-4 py-2 font-medium text-text-primary">{d.month}</td>
                    <td className="px-4 py-2 text-text-muted">${(d.revenue / 1000).toFixed(0)}K</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                          <div className="h-full bg-accent/60 rounded-full" style={{ width: `${d.engagement}%` }} />
                        </div>
                        <span className="text-text-muted">{d.engagement}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`font-semibold ${d.roi >= Number(avgROI) ? 'text-green-400' : 'text-text-muted'}`}>
                        {d.roi}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
