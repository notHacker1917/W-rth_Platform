import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavItem { label: string; to: string; icon: React.ReactNode; roleOnly?: 'student' | 'company' | 'educator'; badge?: string; }

const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BriefcaseIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const FolderIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>;
const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BountyIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AnalyticsIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const PortalIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const SandboxIcon   = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const CoursesIcon   = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
const TrophyIcon    = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
const CommunityIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const NewsIcon      = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>;
const ProductsIcon  = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const RegistryIcon  = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;

export default function SideNav() {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const navItems: NavItem[] = [
    { label: 'Home',             to: '/',             icon: <HomeIcon />      },
    { label: 'Jobs',             to: '/jobs',         icon: <BriefcaseIcon /> },
    { label: 'Bounties',         to: '/bounties',     icon: <BountyIcon />,   badge: 'New' },
    { label: 'Project Registry', to: '/registry',     icon: <RegistryIcon />, badge: '🎓' },
    { label: 'My Profile',       to: '/profile',      icon: <UserIcon />      },
    { label: 'Post a Job',       to: '/jobs/new',     icon: <PlusIcon />,     roleOnly: 'company' },
    { label: 'Analytics',        to: '/analytics',    icon: <AnalyticsIcon />,roleOnly: 'company' },
    { label: 'My Sandbox',       to: '/sandbox',      icon: <SandboxIcon />,  roleOnly: 'student' },
    { label: 'Course Hub',       to: '/courses',      icon: <CoursesIcon />,  roleOnly: 'student' },
    { label: 'Chair Portal',     to: '/chair-portal', icon: <PortalIcon />,   roleOnly: 'educator' },
    { label: 'Leaderboard',      to: '/leaderboard',  icon: <TrophyIcon />    },
    { label: 'Community',        to: '/community',    icon: <CommunityIcon /> },
    { label: 'News Digest',      to: '/news',         icon: <NewsIcon />,     badge: '📡' },
    { label: 'WE Products',      to: '/products',     icon: <ProductsIcon />, badge: '🔩' },
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
            <div className="mt-3 flex gap-3 text-xs text-text-muted flex-wrap">
              <span><strong className="text-text-primary">{currentUser.followersCount.toLocaleString()}</strong> followers</span>
              <span><strong className="text-text-primary">{currentUser.followingCount}</strong> following</span>
            </div>
            {(currentUser.points ?? 0) > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">XP</span>
                  <span className="font-semibold text-text-primary">{(currentUser.points ?? 0).toLocaleString()}</span>
                </div>
                <div className="w-full h-1 rounded-full bg-surface-base overflow-hidden">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, ((currentUser.points ?? 0) % 1000) / 10)}%` }} />
                </div>
              </div>
            )}
          </div>
        )}
        <nav className="space-y-0.5">
          {visible.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
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
