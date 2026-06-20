import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function TopNav({ searchQuery, onSearchChange }: TopNavProps) {
  const { currentUser, switchAccount, logout, availableAccounts } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-surface-elevated border-b border-border shadow-sm shadow-black/40">
      <div className="h-0.5 bg-gradient-to-r from-accent-deepest via-accent to-accent-deepest" />
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-deepest flex items-center justify-center shadow-sm">
            <span className="text-text-primary text-sm font-bold">W</span>
          </div>
          <span className="font-semibold text-text-primary text-sm hidden sm:block tracking-wide">Würth</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs, projects, people…"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-surface-card text-text-primary placeholder-text-muted
                         border border-border rounded-full focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* Notification stub */}
          <button className="relative p-2 rounded-full hover:bg-surface-card transition-colors" title="Notifications">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>

          {/* Messages stub */}
          <button className="p-2 rounded-full hover:bg-surface-card transition-colors" title="Messages">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          {/* Account switcher */}
          {currentUser && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-surface-card transition-colors"
              >
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-7 h-7 rounded-full bg-surface-card ring-1 ring-border" />
                <span className="text-sm font-medium text-text-primary hidden md:block max-w-24 truncate">{currentUser.name}</span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full hidden md:block ${
                  currentUser.role === 'student'
                    ? 'bg-accent-deepest text-[#f2a0a0]'
                    : currentUser.role === 'corporate_admin'
                    ? 'bg-accent text-white'
                    : 'bg-surface-card text-text-muted border border-border'}`}>
                  {currentUser.role === 'student' ? 'Student' : currentUser.role === 'corporate_admin' ? 'Admin' : 'Company'}
                </span>
                <svg className="w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-surface-elevated border border-border rounded-xl shadow-xl shadow-black/60 py-2 z-50">
                  <div className="px-3 pb-2 mb-1 border-b border-border">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Switch account</p>
                  </div>
                  {availableAccounts.map(account => (
                    <button
                      key={account.id}
                      onClick={() => { switchAccount(account.id); setMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-card transition-colors text-left ${account.id === currentUser?.id ? 'bg-surface-card' : ''}`}
                    >
                      <img src={account.avatarUrl} alt={account.name} className="w-8 h-8 rounded-full bg-surface-card shrink-0 ring-1 ring-border" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{account.name}</p>
                        <p className="text-xs text-text-muted truncate">{account.headline}</p>
                      </div>
                      {account.id === currentUser?.id && (
                        <svg className="w-4 h-4 text-accent shrink-0 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-status-error hover:bg-surface-card transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
