/**
 * CourseHub.tsx
 * Academic Credits & Course Hub — student dashboard component.
 * Sections: Active Corporate Courses · Completed ECTS Milestones · Calendar
 */
import { useState } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────

type CourseStatus = 'active' | 'paused';
type EventKind    = 'lecture' | 'deadline' | 'lab';

interface Course {
  id: string;
  title: string;
  chair: string;
  company: string;
  ectsEarned: number;
  ectsTotal: number;
  status: CourseStatus;
  nextSession: string; // ISO date string
}

interface Milestone {
  id: string;
  title: string;
  chair: string;
  company: string;
  ectsAwarded: number;
  completedOn: string;
  grade: string;
}

interface CalEvent {
  id: string;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:MM'
  title: string;
  kind: EventKind;
  location?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'RF & Antenna Design Fundamentals',
    chair: 'Chair of RF & Microwave Engineering',
    company: 'Würth Elektronik',
    ectsEarned: 3,
    ectsTotal: 5,
    status: 'active',
    nextSession: '2026-06-25',
  },
  {
    id: 'c2',
    title: 'Industrial Network Architectures',
    chair: 'Chair of Network Architectures',
    company: 'Würth Elektronik',
    ectsEarned: 2,
    ectsTotal: 5,
    status: 'active',
    nextSession: '2026-06-23',
  },
  {
    id: 'c3',
    title: 'Power Electronics & EMC Compliance',
    chair: 'Chair of Power Systems',
    company: 'Würth Elektronik',
    ectsEarned: 4,
    ectsTotal: 5,
    status: 'active',
    nextSession: '2026-06-27',
  },
  {
    id: 'c4',
    title: 'Embedded Systems & Firmware Dev',
    chair: 'Chair of Embedded Systems',
    company: 'Würth Elektronik',
    ectsEarned: 1,
    ectsTotal: 5,
    status: 'paused',
    nextSession: '2026-07-10',
  },
];

const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    title: 'Component Selection Mastery',
    chair: 'Chair of Electronic Components',
    company: 'Würth Elektronik',
    ectsAwarded: 5,
    completedOn: '2026-05-14',
    grade: 'A',
  },
  {
    id: 'm2',
    title: 'PCB Design & Layout Certification',
    chair: 'Chair of Microelectronics',
    company: 'Würth Elektronik',
    ectsAwarded: 5,
    completedOn: '2026-04-02',
    grade: 'A+',
  },
  {
    id: 'm3',
    title: 'Industrial IoT Protocols',
    chair: 'Chair of Network Architectures',
    company: 'Würth Elektronik',
    ectsAwarded: 5,
    completedOn: '2026-02-20',
    grade: 'B+',
  },
  {
    id: 'm4',
    title: 'Signal Integrity & Noise Reduction',
    chair: 'Chair of RF & Microwave Engineering',
    company: 'Würth Elektronik',
    ectsAwarded: 5,
    completedOn: '2026-01-10',
    grade: 'A',
  },
];

// Calendar events anchored relative to today so the widget is always populated
function buildEvents(): CalEvent[] {
  const base = new Date('2026-06-20');
  const d = (offset: number) => {
    const dt = new Date(base);
    dt.setDate(dt.getDate() + offset);
    return dt.toISOString().slice(0, 10);
  };
  return [
    { id: 'e1',  date: d(0),  time: '10:00', title: 'Guest Lecture: EMC Standards',        kind: 'lecture',  location: 'Room A3' },
    { id: 'e2',  date: d(1),  time: '14:00', title: 'Bounty: RF Filter Prototype',         kind: 'deadline' },
    { id: 'e3',  date: d(1),  time: '16:00', title: 'Lab Session: Oscilloscope Basics',    kind: 'lab',      location: 'Lab 2B' },
    { id: 'e4',  date: d(3),  time: '09:00', title: 'Guest Lecture: 5G Module Design',     kind: 'lecture',  location: 'Aula Magna' },
    { id: 'e5',  date: d(4),  time: '23:59', title: 'Bounty: PCB Layout Submission',       kind: 'deadline' },
    { id: 'e6',  date: d(5),  time: '14:00', title: 'Lab Session: SPICE Simulation',       kind: 'lab',      location: 'Lab 1A' },
    { id: 'e7',  date: d(7),  time: '11:00', title: 'Guest Lecture: Power Magnetics',      kind: 'lecture',  location: 'Room B1' },
    { id: 'e8',  date: d(8),  time: '15:30', title: 'Lab Session: Antenna Measurement',    kind: 'lab',      location: 'Anechoic Lab' },
    { id: 'e9',  date: d(9),  time: '23:59', title: 'Bounty: Network Architecture Report', kind: 'deadline' },
    { id: 'e10', date: d(10), time: '10:00', title: 'Guest Lecture: Industry 4.0 Trends',  kind: 'lecture',  location: 'Seminar Hall' },
    { id: 'e11', date: d(11), time: '13:00', title: 'Lab Session: EMI Pre-compliance',     kind: 'lab',      location: 'Lab 2B' },
    { id: 'e12', date: d(14), time: '23:59', title: 'Bounty: Firmware Integration',        kind: 'deadline' },
  ];
}

const EVENTS = buildEvents();

// ─── Constants ─────────────────────────────────────────────────────────────

const EVENT_META: Record<EventKind, { label: string; dot: string; bg: string; text: string; border: string }> = {
  lecture:  {
    label: 'Guest Lecture',
    dot:    'bg-[#1e4d7b]',
    bg:     'bg-[#0d2a45]',
    text:   'text-[#5eaeff]',
    border: 'border-[#1e4d7b]',
  },
  deadline: {
    label: 'Bounty Deadline',
    dot:    'bg-accent',
    bg:     'bg-accent-deepest',
    text:   'text-accent',
    border: 'border-accent-deep/50',
  },
  lab: {
    label: 'Lab Session',
    dot:    'bg-status-success',
    bg:     'bg-status-success/10',
    text:   'text-status-success',
    border: 'border-status-success/20',
  },
};

const TOTAL_ECTS_EARNED = MILESTONES.reduce((s, m) => s + m.ectsAwarded, 0);
const TOTAL_ECTS_POSSIBLE = MILESTONES.length * 5 + COURSES.filter(c => c.status === 'active').length * 5;

// ─── Helpers ───────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function fmtDay(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function gradeColor(g: string) {
  if (g.startsWith('A')) return 'text-status-success';
  if (g.startsWith('B')) return 'text-status-warn';
  return 'text-text-muted';
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <h2 className="text-sm font-bold text-text-primary tracking-wide uppercase">{title}</h2>
      {sub && <span className="text-xs text-text-muted">{sub}</span>}
    </div>
  );
}

function EctsBar({ earned, total }: { earned: number; total: number }) {
  const pct = Math.min(100, Math.round((earned / total) * 100));
  const color = pct >= 80 ? 'bg-status-success' : pct >= 50 ? 'bg-accent' : 'bg-[#1e4d7b]';
  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-text-muted font-mono tracking-wide">ECTS {earned}/{total}</span>
        <span className="text-[10px] font-bold text-text-muted">{pct}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-surface-base overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Active Courses Card ───────────────────────────────────────────────────

function ActiveCoursesCard() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated/30">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span className="text-sm font-bold text-text-primary tracking-tight">Active Corporate Courses</span>
        </div>
        <span className="text-xs text-text-muted bg-surface-base border border-border px-2 py-0.5 rounded-full font-mono">
          {COURSES.filter(c => c.status === 'active').length} active
        </span>
      </div>

      {/* Course rows */}
      <div className="divide-y divide-border">
        {COURSES.map(course => {
          const isOpen = expanded === course.id;
          const meta   = course.status === 'paused'
            ? 'text-text-muted bg-surface-base border-border'
            : '';

          return (
            <div
              key={course.id}
              className={`px-4 py-3 cursor-pointer transition-colors hover:bg-surface-elevated/20 ${isOpen ? 'bg-surface-elevated/10' : ''}`}
              onClick={() => setExpanded(isOpen ? null : course.id)}
            >
              {/* Row summary */}
              <div className="flex items-start gap-3">
                {/* ECTS donut indicator */}
                <div className="relative shrink-0 mt-0.5">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="13" fill="none" stroke="var(--color-surface-base)" strokeWidth="4" />
                    <circle
                      cx="16" cy="16" r="13" fill="none"
                      stroke={course.status === 'paused' ? 'var(--color-surface-elevated)' : '#1e4d7b'}
                      strokeWidth="4"
                      strokeDasharray={`${Math.round((course.ectsEarned / course.ectsTotal) * 81.7)} 81.7`}
                      strokeLinecap="round"
                      transform="rotate(-90 16 16)"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-text-primary">
                    {course.ectsEarned}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold text-text-primary truncate ${meta}`}>
                      {course.title}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {course.status === 'paused' && (
                        <span className="text-[10px] text-text-muted bg-surface-base border border-border px-1.5 py-0.5 rounded font-mono">Paused</span>
                      )}
                      <svg className={`w-3.5 h-3.5 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted truncate mt-0.5">{course.chair}</p>
                  <EctsBar earned={course.ectsEarned} total={course.ectsTotal} />
                </div>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="mt-3 ml-10 pt-3 border-t border-border grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-text-muted mb-0.5 uppercase tracking-wide font-semibold text-[10px]">Partner</p>
                    <p className="text-text-primary font-medium">{course.company}</p>
                  </div>
                  <div>
                    <p className="text-text-muted mb-0.5 uppercase tracking-wide font-semibold text-[10px]">Next Session</p>
                    <p className="text-text-primary font-medium">{fmtDate(course.nextSession)}</p>
                  </div>
                  <div>
                    <p className="text-text-muted mb-0.5 uppercase tracking-wide font-semibold text-[10px]">Credits Remaining</p>
                    <p className="text-text-primary font-medium">{course.ectsTotal - course.ectsEarned} ECTS</p>
                  </div>
                  <div>
                    <p className="text-text-muted mb-0.5 uppercase tracking-wide font-semibold text-[10px]">Status</p>
                    <p className={`font-semibold capitalize ${course.status === 'active' ? 'text-status-success' : 'text-text-muted'}`}>
                      {course.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="px-4 py-2.5 border-t border-border bg-surface-base/60 flex items-center gap-4 text-xs text-text-muted">
        <span>
          <strong className="text-text-primary font-bold">
            {COURSES.reduce((s, c) => s + c.ectsEarned, 0)}
          </strong> / {COURSES.reduce((s, c) => s + c.ectsTotal, 0)} ECTS in progress
        </span>
        <span className="text-border">·</span>
        <span>Click a row to expand</span>
      </div>
    </div>
  );
}

// ─── Completed Milestones Card ─────────────────────────────────────────────

function MilestonesCard() {
  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated/30">
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span className="text-sm font-bold text-text-primary tracking-tight">Completed ECTS Milestones</span>
        </div>
        <span className="text-xs font-bold text-status-success bg-status-success/10 border border-status-success/20 px-2 py-0.5 rounded-full">
          {TOTAL_ECTS_EARNED} ECTS earned
        </span>
      </div>

      {/* Milestone rows */}
      <div className="divide-y divide-border">
        {MILESTONES.map((m, i) => (
          <div key={m.id} className="px-4 py-3 flex items-center gap-3">
            {/* Rank badge */}
            <div className="w-7 h-7 rounded-lg bg-surface-base border border-border flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-text-muted">#{i + 1}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-text-primary truncate">{m.title}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold ${gradeColor(m.grade)}`}>{m.grade}</span>
                  <span className="text-xs font-bold text-status-success bg-status-success/10 border border-status-success/20 px-1.5 py-0.5 rounded font-mono">
                    +{m.ectsAwarded} ECTS
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-text-muted truncate">{m.chair}</p>
                <span className="text-text-muted opacity-30">·</span>
                <p className="text-xs text-text-muted shrink-0">{fmtDate(m.completedOn)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress towards degree */}
      <div className="px-4 py-3 border-t border-border bg-surface-base/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-text-muted font-semibold uppercase tracking-wide">Programme Progress</span>
          <span className="text-xs font-bold text-text-primary font-mono">{TOTAL_ECTS_EARNED} / {TOTAL_ECTS_POSSIBLE} ECTS</span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-base overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1e4d7b] to-status-success transition-all duration-700"
            style={{ width: `${Math.round((TOTAL_ECTS_EARNED / TOTAL_ECTS_POSSIBLE) * 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-text-muted mt-1.5">
          {Math.round((TOTAL_ECTS_EARNED / TOTAL_ECTS_POSSIBLE) * 100)}% of corporate module requirements fulfilled
        </p>
      </div>
    </div>
  );
}

// ─── Calendar Widget ───────────────────────────────────────────────────────

function CalendarWidget() {
  const today      = new Date('2026-06-20');
  const todayISO   = today.toISOString().slice(0, 10);
  const [filter, setFilter] = useState<EventKind | 'all'>('all');
  const [selected, setSelected] = useState<string | null>(todayISO);

  // Build 21-day window (3 weeks)
  const days: string[] = [];
  for (let i = 0; i < 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }

  const eventsOnDay = (iso: string) =>
    EVENTS.filter(e => e.date === iso && (filter === 'all' || e.kind === filter));

  const selectedEvents = selected ? eventsOnDay(selected) : [];

  const DOW = ['S','M','T','W','T','F','S'];

  return (
    <div className="bg-surface-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated/30">
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-bold text-text-primary tracking-tight">Upcoming Schedule</span>
          <span className="text-xs text-text-muted">Next 3 weeks</span>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1">
          {(['all', 'lecture', 'deadline', 'lab'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                'text-[10px] font-semibold px-2 py-1 rounded transition-colors border',
                filter === f
                  ? f === 'all'
                    ? 'bg-surface-elevated text-text-primary border-border'
                    : `${EVENT_META[f as EventKind]?.bg} ${EVENT_META[f as EventKind]?.text} ${EVENT_META[f as EventKind]?.border}`
                  : 'bg-transparent text-text-muted border-transparent hover:border-border hover:text-text-primary',
              ].join(' ')}
            >
              {f === 'all' ? 'All' : EVENT_META[f as EventKind].label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Day-of-week header */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DOW.map((d, i) => (
            <div key={i} className="text-center text-[10px] text-text-muted font-bold uppercase tracking-wide py-0.5">{d}</div>
          ))}
        </div>

        {/* Date grid — 21 days = 3 rows × 7 cols */}
        <div className="grid grid-cols-7 gap-1">
          {/* Offset: June 20 2026 is a Saturday (col index 6), so push by 6 empty cells if grid starts Sunday */}
          {/* First day = Saturday (index 6 in Sun-start week) */}
          {Array.from({ length: new Date(days[0]).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(iso => {
            const dayEvents  = eventsOnDay(iso);
            const isToday    = iso === todayISO;
            const isSelected = iso === selected;
            const hasLecture = dayEvents.some(e => e.kind === 'lecture');
            const hasDeadline= dayEvents.some(e => e.kind === 'deadline');
            const hasLab     = dayEvents.some(e => e.kind === 'lab');
            const dayNum     = parseInt(iso.slice(8), 10);

            return (
              <button
                key={iso}
                onClick={() => setSelected(isSelected ? null : iso)}
                className={[
                  'relative flex flex-col items-center pt-1.5 pb-2 rounded-lg border transition-all group',
                  isSelected
                    ? 'bg-surface-elevated border-border'
                    : isToday
                      ? 'border-accent/50 bg-accent-deepest/60 hover:bg-accent-deepest'
                      : 'border-transparent hover:bg-surface-elevated/40 hover:border-border/50',
                ].join(' ')}
              >
                <span className={[
                  'text-xs font-bold leading-none',
                  isToday    ? 'text-accent'       :
                  isSelected ? 'text-text-primary'  :
                  dayEvents.length ? 'text-text-primary' : 'text-text-muted',
                ].join(' ')}>
                  {dayNum}
                </span>
                {/* Event dots */}
                <div className="flex gap-0.5 mt-1.5 h-1.5">
                  {hasLecture  && <span className="w-1.5 h-1.5 rounded-full bg-[#1e4d7b]" />}
                  {hasDeadline && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  {hasLab      && <span className="w-1.5 h-1.5 rounded-full bg-status-success" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-1 border-t border-border">
          {Object.entries(EVENT_META).map(([kind, meta]) => (
            <div key={kind} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
              <span className="text-[10px] text-text-muted font-medium">{meta.label}</span>
            </div>
          ))}
        </div>

        {/* Selected day event list */}
        {selected && (
          <div className="border-t border-border pt-3">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wide mb-2">
              {fmtDay(selected)}
            </p>
            {selectedEvents.length === 0 ? (
              <p className="text-xs text-text-muted italic">No events {filter !== 'all' ? `of this type` : ''} on this day.</p>
            ) : (
              <div className="space-y-1.5">
                {selectedEvents.map(ev => {
                  const m = EVENT_META[ev.kind];
                  return (
                    <div
                      key={ev.id}
                      className={`flex items-start gap-2.5 px-2.5 py-2 rounded-lg border ${m.bg} ${m.border}`}
                    >
                      <span className={`w-1 h-full min-h-[36px] rounded-full self-stretch ${m.dot} opacity-70`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-semibold truncate ${m.text}`}>{ev.title}</p>
                          <span className="text-[10px] text-text-muted font-mono shrink-0">{ev.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-semibold uppercase tracking-wide ${m.text} opacity-70`}>{m.label}</span>
                          {ev.location && (
                            <>
                              <span className="text-text-muted opacity-30">·</span>
                              <span className="text-[10px] text-text-muted">{ev.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ECTS Summary Strip ────────────────────────────────────────────────────

function EctsSummaryStrip() {
  const inProgressEcts = COURSES.filter(c => c.status === 'active').reduce((s, c) => s + c.ectsEarned, 0);
  const stats = [
    { label: 'Earned ECTS',      value: TOTAL_ECTS_EARNED,  color: 'text-status-success' },
    { label: 'In Progress',       value: inProgressEcts,     color: 'text-[#5eaeff]' },
    { label: 'Active Courses',    value: COURSES.filter(c => c.status === 'active').length, color: 'text-text-primary' },
    { label: 'Milestones Done',   value: MILESTONES.length,  color: 'text-status-success' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className="bg-surface-card border border-border rounded-xl px-3 py-3 text-center">
          <p className={`text-2xl font-black leading-none ${s.color}`}>{s.value}</p>
          <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wide mt-1.5 leading-tight">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Root Component ────────────────────────────────────────────────────────

export default function CourseHub() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black text-text-primary tracking-tight">Academic Credits & Course Hub</h1>
          <p className="text-sm text-text-muted mt-0.5">Your Würth Elektronik corporate learning progress</p>
        </div>
        <span className="text-[10px] font-semibold text-text-muted bg-surface-card border border-border px-2.5 py-1.5 rounded-lg font-mono uppercase tracking-wider">
          Summer Term 2026
        </span>
      </div>

      {/* Summary strip */}
      <EctsSummaryStrip />

      {/* Main grid — courses + milestones left, calendar right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left column — courses & milestones stacked */}
        <div className="lg:col-span-3 space-y-4">
          <SectionHeader title="Active Corporate Courses" sub="Click to expand" />
          <ActiveCoursesCard />
          <SectionHeader title="Completed ECTS Milestones" sub={`${MILESTONES.length} certified`} />
          <MilestonesCard />
        </div>

        {/* Right column — calendar */}
        <div className="lg:col-span-2">
          <SectionHeader title="Schedule" sub="Next 3 weeks" />
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
}
