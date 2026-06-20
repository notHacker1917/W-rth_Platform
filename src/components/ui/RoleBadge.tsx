import type { UserRole } from '../../types';
interface RoleBadgeProps { role: UserRole; size?: 'sm' | 'md'; }

const ROLE_CFG: Record<UserRole, { label: string; cls: string }> = {
  student:  { label: 'Student',  cls: 'bg-accent-deepest text-[#f2a0a0] border border-accent-deep' },
  company:  { label: 'Company',  cls: 'bg-surface-elevated text-text-muted border border-border' },
  educator: { label: 'Educator', cls: 'bg-status-success/10 text-status-success border border-status-success/20' },
};

export default function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const { label, cls } = ROLE_CFG[role] ?? ROLE_CFG.student;
  const sizeClass = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';
  return <span className={`inline-flex items-center font-medium rounded-full ${cls} ${sizeClass}`}>{label}</span>;
}
