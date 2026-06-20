import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard',              path: '/admin',               icon: '🏠' },
  { label: 'Executive Analytics',    path: '/admin/analytics',     icon: '📊' },
  { label: 'GDPR Compliance',        path: '/admin/compliance',    icon: '🔐' },
  { label: 'Bounties & Internships', path: '/admin/opportunities', icon: '💼' },
  { label: 'Institutional Hub',      path: '/admin/verification',  icon: '✅' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface-base flex flex-col">
      {/* Top bar */}
      <header className="h-14 bg-surface-card border-b border-border flex items-center px-6 gap-4 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-accent tracking-tight">NexusOS</span>
          <span className="text-text-muted text-sm">/</span>
          <span className="text-sm text-text-muted">Admin Control Centre</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 uppercase tracking-wider">
          Corporate Admin
        </span>
        <div className="ml-auto flex items-center gap-3">
          {currentUser && (
            <>
              <img src={currentUser.avatarUrl} alt={currentUser.name}
                className="w-7 h-7 rounded-full ring-1 ring-border" />
              <span className="text-sm text-text-muted hidden sm:block">{currentUser.name}</span>
            </>
          )}
          <button onClick={() => navigate('/')}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors">
            ← Platform
          </button>
          <button onClick={logout}
            className="text-xs px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors">
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <nav className="w-56 shrink-0 bg-surface-card border-r border-border flex flex-col py-4 px-2">
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-3 mb-2">
            Management
          </p>
          <div className="space-y-0.5">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  ['flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'text-text-muted hover:bg-surface-elevated hover:text-text-primary',
                  ].join(' ')
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-border mx-1">
            <div className="flex items-center gap-1.5 px-1 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-text-muted">System Operational</span>
            </div>
            <p className="text-[9px] text-text-muted px-1 leading-relaxed">
              RBAC enforced · Audit logged · GDPR compliant
            </p>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
