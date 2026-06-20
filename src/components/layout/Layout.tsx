import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import SideNav from './SideNav';
import MobileNav from './MobileNav';
import WEChatbot from '../chatbot/WEChatbot';
import CommunityNexus from '../community-nexus/CommunityNexus';

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="min-h-screen bg-surface-base">
      <TopNav searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <SideNav />
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
      <MobileNav />
      <WEChatbot />
      <CommunityNexus />
    </div>
  );
}
