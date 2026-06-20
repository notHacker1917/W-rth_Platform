import { useState } from 'react';

// ─── Mock data ─────────────────────────────────────────────────────────────

const METRICS = {
  talentPool: {
    total: 2847,
    breakdown: [
      { label: 'Electrical Engineering', count: 642 },
      { label: 'Computer Science', count: 591 },
      { label: 'Mechanical Engineering', count: 488 },
      { label: 'Industrial Design', count: 312 },
      { label: 'Physics & Materials', count: 274 },
      { label: 'Other (440 chairs)', count: 540 },
    ],
    prevMonth: 2611,
    chairs: 445,
  },
  costPerStudent: {
    value: 142.5,
    totalSpend: 405_225,
    activeUsers: 2843,
    prevMonth: 159.8,
    currency: 'USD',
  },
  ingestionRate: {
    rate: 73.2,
    ordered: 2843,
    inActiveProjects: 2081,
    prevMonth: 68.4,
  },
};

// Weekly funnel snapshots — last 4 weeks
const FUNNEL_PERIODS = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'] as const;
type Period = typeof FUNNEL_PERIODS[number];

const FUNNEL_DATA: Record<Period, { stage: string; count: number; desc: string }[]> = {
  'Last 7 days': [
    { stage: 'Event Scan',          count: 1_847, desc: 'QR / NFC scans at Würth events & booths' },
    { stage: 'Document Download',   count: 1_162, desc: 'Datasheets, specs or project kits downloaded' },
    { stage: 'Bounty Completion',   count:   189, desc: 'Micro-internship or bounty marked Completed' },
    { stage: 'Hired Status',        count:    54, desc: 'Student confirmed hired by a Würth company' },
  ],
  'Last 30 days': [
    { stage: 'Event Scan',          count: 6_320, desc: 'QR / NFC scans at Würth events & booths' },
    { stage: 'Document Download',   count: 3_981, desc: 'Datasheets, specs or project kits downloaded' },
    { stage: 'Bounty Completion',   count:   724, desc: 'Micro-internship or bounty marked Completed' },
    { stage: 'Hired Status',        count:   198, desc: 'Student confirmed hired by a Würth company' },
  ],
  'Last 90 days': [
    { stage: 'Event Scan',          count: 12_440, desc: 'QR / NFC scans at Würth events & booths' },
    { stage: 'Document Download',   count:  7_832, desc: 'Datasheets, specs or project kits downloaded' },
    { stage: 'Bounty Completion',   count:  1_247, desc: 'Micro-internship or bounty marked Completed' },
    { stage: 'Hired Status',        count:    384, desc: 'Student confirmed hired by a Würth company' },
  ],
  'All time': [
    { stage: 'Event Scan',          count: 41_200, desc: 'QR / NFC scans at Würth events & booths' },
    { stage: 'Document Download',   count: 25_648, desc: 'Datasheets, specs or project kits downloaded' },
    { stage: 'Bounty Completion',   count:  3_912, desc: 'Micro-internship or bounty marked Completed' },
    { stage: 'Hired Status',        count:  1_140, desc: 'Student confirmed hired by a Würth company' },
  ],
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return n.toLocaleString();
}

function pct(a: number, b: number) {
  return b === 0 ? '—' : `${((a / b) * 100).toFixed(1)}%`;
}

// ─── Trend badge ───────────────────────────────────────────────────────────

function Trend({ current, prev, invert = false }: { current: number; prev: number; invert?: boolean }) {
  const delta = current - prev;
  const deltaPct = prev === 0 ? 0 : (Math.abs(delta) / prev) * 100;
  const positive = invert ? delta < 0 : delta > 0;
  const neutral = delta === 0;

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
      neutral ? 'text-text-muted bg-surface-elevated' :
      positive ? 'text-status-success bg-status-success/10' :
                 'text-status-error bg-status-error/10'
    }`}>
      {!neutral && (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d={positive ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
        </svg>
      )}
      {deltaPct.toFixed(1)}% MoM
    </span>
  );
}

// ─── Metric card ───────────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: string;
  sub: string;
  trend: React.ReactNode;
  icon: React.ReactNode;
  detail?: React.ReactNode;
}

function MetricCard({ title, value, sub, trend, icon, detail }: MetricCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-deepest border border-accent-deep/40 flex items-center justify-center shrink-0 text-[#f2a0a0]">
          {icon}
        </div>
        {trend}
      </div>
      <div>
        <p className="text-3xl font-bold text-text-primary tracking-tight">{value}</p>
        <p className="text-xs text-text-muted mt-0.5 font-medium uppercase tracking-wide">{title}</p>
      </div>
      <p className="text-xs text-text-muted leading-relaxed">{sub}</p>
      {detail && (
        <>
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-1 text-xs text-accent hover:text-[#f2a0a0] transition-colors font-medium w-fit"
          >
            {open ? 'Hide breakdown' : 'View breakdown'}
            <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open && <div className="border-t border-border pt-3">{detail}</div>}
        </>
      )}
    </div>
  );
}

// ─── Funnel chart ──────────────────────────────────────────────────────────

function FunnelChart({ data }: { data: { stage: string; count: number; desc: string }[] }) {
  const max = data[0].count;

  // Accent opacity steps for each stage bar
  const barColors = [
    'bg-accent',
    'bg-accent-hover',
    'bg-accent-press',
    'bg-accent-deep',
  ];

  return (
    <div className="space-y-3">
      {data.map((stage, i) => {
        const widthPct = (stage.count / max) * 100;
        const convFromPrev = i === 0 ? null : pct(stage.count, data[i - 1].count);
        const convFromTop  = i === 0 ? null : pct(stage.count, max);

        return (
          <div key={stage.stage}>
            {/* Stage row */}
            <div className="flex items-center gap-3 mb-1.5">
              {/* Step number */}
              <div className="w-6 h-6 rounded-full bg-surface-elevated border border-border text-xs font-bold
                              text-text-muted flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              {/* Stage label */}
              <div className="w-36 shrink-0">
                <p className="text-sm font-semibold text-text-primary truncate">{stage.stage}</p>
                <p className="text-xs text-text-muted truncate">{stage.desc}</p>
              </div>
              {/* Bar */}
              <div className="flex-1 h-9 bg-surface-base border border-border rounded-lg overflow-hidden relative">
                <div
                  className={`h-full ${barColors[i] ?? 'bg-accent-deepest'} transition-all duration-500 rounded-lg flex items-center px-3`}
                  style={{ width: `${widthPct}%` }}
                >
                  {widthPct > 20 && (
                    <span className="text-xs font-bold text-text-primary/90 tabular-nums">{fmt(stage.count)}</span>
                  )}
                </div>
                {widthPct <= 20 && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-primary tabular-nums">
                    {fmt(stage.count)}
                  </span>
                )}
              </div>
              {/* Count + conversions */}
              <div className="w-32 shrink-0 text-right">
                <p className="text-sm font-bold text-text-primary tabular-nums">{stage.count.toLocaleString()}</p>
                {convFromPrev && (
                  <p className="text-xs text-text-muted tabular-nums">
                    <span className="text-status-warn">{convFromPrev}</span> from prev
                  </p>
                )}
              </div>
            </div>

            {/* Drop-off arrow between stages */}
            {i < data.length - 1 && (
              <div className="flex items-center gap-3 mb-1 pl-9">
                <div className="w-36 shrink-0" />
                <div className="flex items-center gap-1.5 text-xs text-text-muted pl-2">
                  <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className="text-accent font-semibold">{pct(data[i + 1].count, stage.count)}</span>
                  <span>conversion → {data[i + 1].stage}</span>
                  <span className="ml-2 text-text-muted/60">·</span>
                  <span className="text-text-muted/60">{(stage.count - data[i + 1].count).toLocaleString()} dropped</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Summary row */}
      <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-xs text-text-muted">
        <div>
          <span className="text-text-primary font-semibold">{pct(data[data.length - 1].count, data[0].count)}</span>
          {' '}end-to-end conversion
        </div>
        <div>
          <span className="text-text-primary font-semibold">{(data[0].count - data[data.length - 1].count).toLocaleString()}</span>
          {' '}total drop-off
        </div>
        <div>
          <span className="text-text-primary font-semibold">{data[data.length - 1].count.toLocaleString()}</span>
          {' '}students hired
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ExecutiveDashboard() {
  const [period, setPeriod] = useState<Period>('Last 90 days');
  const funnelData = FUNNEL_DATA[period];

  const talentDelta = METRICS.talentPool.total - METRICS.talentPool.prevMonth;
  const costDelta   = METRICS.costPerStudent.value - METRICS.costPerStudent.prevMonth;
  const rateDelta   = METRICS.ingestionRate.rate - METRICS.ingestionRate.prevMonth;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 rounded-full bg-accent" />
            <h1 className="text-xl font-bold text-text-primary">Corporate Executive Panel</h1>
          </div>
          <p className="text-xs text-text-muted ml-3">
            Platform overview · {METRICS.talentPool.chairs} university chairs & institutes · Updated live
          </p>
        </div>
        {/* Export stub */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-text-muted
                           hover:text-text-primary hover:border-accent text-xs font-medium transition-colors min-h-[44px]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* ── Top metric cards ─────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* 1 · Active Talent Pool */}
        <MetricCard
          title="Active Talent Pool"
          value={METRICS.talentPool.total.toLocaleString()}
          sub={`Aggregated across ${METRICS.talentPool.chairs} chairs / institutes. ${talentDelta > 0 ? '+' : ''}${talentDelta.toLocaleString()} students onboarded this month.`}
          trend={<Trend current={METRICS.talentPool.total} prev={METRICS.talentPool.prevMonth} />}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          detail={
            <div className="space-y-2">
              {METRICS.talentPool.breakdown.map(row => (
                <div key={row.label} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-text-muted truncate">{row.label}</span>
                      <span className="text-text-primary font-semibold tabular-nums ml-2">{row.count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${(row.count / METRICS.talentPool.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        />

        {/* 2 · Cost-per-Engaged-Student */}
        <MetricCard
          title="Avg. Cost-per-Engaged-Student"
          value={`$${METRICS.costPerStudent.value.toFixed(2)}`}
          sub={`Total platform spend $${(METRICS.costPerStudent.totalSpend / 1000).toFixed(0)}k ÷ ${METRICS.costPerStudent.activeUsers.toLocaleString()} active users. Target: <$120.`}
          trend={<Trend current={METRICS.costPerStudent.value} prev={METRICS.costPerStudent.prevMonth} invert />}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          detail={
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Total spend (platform + events)</span>
                <span className="text-text-primary font-semibold">${METRICS.costPerStudent.totalSpend.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Active users (30-day)</span>
                <span className="text-text-primary font-semibold">{METRICS.costPerStudent.activeUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Previous month CPES</span>
                <span className="text-text-primary font-semibold">${METRICS.costPerStudent.prevMonth.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-muted pt-1 border-t border-border">
                <span>Monthly savings vs. prior</span>
                <span className="text-status-success font-semibold">
                  −${((METRICS.costPerStudent.prevMonth - METRICS.costPerStudent.value) * METRICS.costPerStudent.activeUsers).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          }
        />

        {/* 3 · Component Ingestion Rate */}
        <MetricCard
          title="Verified Component Ingestion Rate"
          value={`${METRICS.ingestionRate.rate}%`}
          sub={`${METRICS.ingestionRate.inActiveProjects.toLocaleString()} of ${METRICS.ingestionRate.ordered.toLocaleString()} parts ordered are confirmed in active student project builds.`}
          trend={<Trend current={METRICS.ingestionRate.rate} prev={METRICS.ingestionRate.prevMonth} />}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          }
          detail={
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-text-muted">Ingestion rate</span>
                  <span className="text-text-primary font-semibold">{METRICS.ingestionRate.rate}%</span>
                </div>
                <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${METRICS.ingestionRate.rate}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Parts ordered (total)</span>
                <span className="text-text-primary font-semibold">{METRICS.ingestionRate.ordered.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Verified in active builds</span>
                <span className="text-status-success font-semibold">{METRICS.ingestionRate.inActiveProjects.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Untracked / returned</span>
                <span className="text-status-warn font-semibold">
                  {(METRICS.ingestionRate.ordered - METRICS.ingestionRate.inActiveProjects).toLocaleString()}
                </span>
              </div>
            </div>
          }
        />
      </div>

      {/* ── Conversion funnel ─────────────────────────────────────────────── */}
      <div className="bg-surface-card border border-border rounded-2xl p-5">
        {/* Funnel header */}
        <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Talent Conversion Funnel</h2>
            <p className="text-xs text-text-muted mt-0.5">
              End-to-end pipeline from first touchpoint to confirmed hire
            </p>
          </div>
          {/* Period selector */}
          <div className="flex gap-1 bg-surface-base border border-border rounded-xl p-1">
            {FUNNEL_PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                  period === p
                    ? 'bg-accent text-text-primary'
                    : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated',
                ].join(' ')}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Funnel path label */}
        <div className="flex items-center gap-1.5 flex-wrap mb-5 px-9 text-xs font-mono text-text-muted">
          {funnelData.map((s, i) => (
            <span key={s.stage} className="flex items-center gap-1.5">
              <span className={i === 0 ? 'text-accent font-semibold' : ''}>{s.stage}</span>
              {i < funnelData.length - 1 && (
                <svg className="w-3.5 h-3.5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </span>
          ))}
        </div>

        <FunnelChart data={funnelData} />
      </div>

      {/* ── Footer note ───────────────────────────────────────────────────── */}
      <p className="text-xs text-text-muted text-center">
        Data aggregated across {METRICS.talentPool.chairs} participating chairs · Refreshed every 24 hours ·{' '}
        <span className="text-accent cursor-pointer hover:underline">Methodology →</span>
      </p>
    </div>
  );
}
