import NavLink from '@/components/ui/NavLink';
import { useAuth } from '@/context/AuthContext';

interface NavItem { label: string; to: string; icon: React.ReactNode; roleOnly?: 'student' | 'company' | 'educator'; badge?: string; }

const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BriefcaseIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const FolderIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>;
const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BountyIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AnalyticsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const PortalIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const SandboxIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

export default function SideNav() {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const navItems: NavItem[] = [
    { label: 'Home', to: '/', icon: <HomeIcon /> },
    { label: 'Jobs', to: '/jobs', icon: <BriefcaseIcon /> },
    { label: 'Bounties', to: '/bounties', icon: <BountyIcon />, badge: 'New' },
    { label: 'Projects', to: '/projects', icon: <FolderIcon /> },
    { label: 'My Profile', to: '/profile', icon: <UserIcon /> },
    { label: 'Post a Job', to: '/jobs/new', icon: <PlusIcon />, roleOnly: 'company' },
    { label: 'Analytics', to: '/analytics', icon: <AnalyticsIcon />, roleOnly: 'company' },
    { label: 'My Projects', to: '/projects/mine', icon: <FolderIcon />, roleOnly: 'student' },
    { label: 'My Sandbox', to: '/sandbox', icon: <SandboxIcon />, roleOnly: 'student' },
    { label: 'Chair Portal', to: '/chair-portal', icon: <PortalIcon />, roleOnly: 'educator' },
  ];

  const visible = navItems.filter(item => !item.roleOnly || item.roleOnly === role);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    ['flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
      isActive ? 'bg-accent-deepest text-[#f2a0a0] border-l-2 border-accent pl-[10px]'
               : 'text-text-muted hover:bg-surface-elevated hover:text-text-primary'].join(' ');

  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <div className="sticky top-20">
        {currentUser && (
          <div className="mb-4 p-3 bg-surface-card border border-border rounded-xl">
            <div className="flex items-center gap-3">
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full ring-1 ring-border" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{currentUser.name}</p>
                <p className="text-xs text-text-muted truncate">{currentUser.headline}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-3 text-xs text-text-muted">
              <span><strong className="text-text-primary">{currentUser.followersCount.toLocaleString()}</strong> followers</span>
              <span><strong className="text-text-primary">{currentUser.followingCount}</strong> following</span>
            </div>
          </div>
        )}
        <nav className="space-y-0.5">
          {visible.map(item => (
            <NavLink key={item.to} href={item.to} end={item.to === '/'} className={linkClass}>
              {item.icon}
              {item.label}
              {item.badge && (
                <span className="ml-auto text-xs bg-accent text-text-primary px-1.5 py-0.5 rounded-full font-semibold">{item.badge}</span>
              )}
              {item.roleOnly === 'company' && !item.badge && (
                <span className="ml-auto text-xs bg-surface-elevated text-text-muted border border-border px-1.5 py-0.5 rounded-full">Co.</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
