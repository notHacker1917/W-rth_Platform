import type { ReactNode } from 'react';
import TopNav from './TopNav';
import SideNav from './SideNav';
import MobileNav from './MobileNav';
import { useSearch } from '@/context/SearchContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { searchQuery, setSearchQuery } = useSearch();
  return (
    <div className="min-h-screen bg-surface-base">
      <TopNav searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <SideNav />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
