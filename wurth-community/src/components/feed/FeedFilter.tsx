export type FeedFilterValue = 'all' | 'student' | 'company';
interface FeedFilterProps { value: FeedFilterValue; onChange: (v: FeedFilterValue) => void; }
const TABS: { label: string; value: FeedFilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Students', value: 'student' },
  { label: 'Companies', value: 'company' },
];

export default function FeedFilter({ value, onChange }: FeedFilterProps) {
  return (
    <div className="flex gap-1 bg-surface-card border border-border rounded-xl p-1">
      {TABS.map(tab => (
        <button key={tab.value} onClick={() => onChange(tab.value)}
          className={['flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]',
            value === tab.value
              ? tab.value === 'company'
                ? 'bg-surface-elevated text-text-primary shadow-sm border border-border'
                : 'bg-accent text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated',
          ].join(' ')}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
