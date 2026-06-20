import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

/**
 * AdminLayout: Main layout container for admin dashboard
 * 
 * Provides consistent navigation, branding, and structure for all admin views.
 * Includes sidebar navigation with links to admin modules.
 */
export default function AdminLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'GDPR Compliance', path: '/admin/compliance' },
    { label: 'Bounties & Internships', path: '/admin/opportunities' },
    { label: 'Institutional Hub', path: '/admin/verification' },
  ];

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-branding">
            <h1>Admin Dashboard</h1>
            <span className="admin-badge">Corporate Admin</span>
          </div>
          <div className="admin-user-section">
            <span className="admin-user-name">{currentUser?.name}</span>
            <button
              className="admin-logout-btn"
              onClick={logout}
              aria-label="Logout"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        {/* Admin Sidebar */}
        <nav className="admin-sidebar">
          <div className="admin-nav-section">
            <h3 className="admin-nav-title">Management</h3>
            <ul className="admin-nav-list">
              {adminNavItems.map(item => (
                <li key={item.path}>
                  <button
                    className="admin-nav-link"
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="admin-nav-section admin-nav-footer">
            <button
              className="admin-back-link"
              onClick={() => navigate('/')}
            >
              ← Back to Platform
            </button>
          </div>
        </nav>

        {/* Admin Content */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
