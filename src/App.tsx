import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Feed from './pages/Feed';
import Jobs from './pages/Jobs';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import Bounties from './pages/Bounties';
import BountyDetail from './pages/BountyDetail';
import PostBounty from './pages/PostBounty';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import ChairPortal from './pages/ChairPortal';
import StudentSandbox from './pages/StudentSandbox';
import Leaderboard from './pages/Leaderboard';
import Community from './pages/Community';
import NewsDigest from './pages/NewsDigest';
import Products from './pages/Products';
import { AdminGuard } from './guards/adminGuard';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminCompliance from './pages/admin/AdminCompliance';
import AdminOpportunities from './pages/admin/AdminOpportunities';
import AdminVerification from './pages/admin/AdminVerification';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Platform Routes */}
          <Route element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/new" element={<Jobs />} />
            <Route path="bounties" element={<Bounties />} />
            <Route path="bounties/new" element={<PostBounty />} />
            <Route path="bounties/:bountyId" element={<BountyDetail />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/mine" element={<Projects />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="analytics" element={<ExecutiveDashboard />} />
            <Route path="chair-portal" element={<ChairPortal />} />
            <Route path="sandbox" element={<StudentSandbox />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="community" element={<Community />} />
            <Route path="news" element={<NewsDigest />} />
            <Route path="products" element={<Products />} />
          </Route>

          {/* Admin Dashboard Routes (RBAC Protected) */}
          <Route
            path="/admin/*"
            element={
              <AdminGuard>
                <Routes>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="compliance" element={<AdminCompliance />} />
                    <Route path="opportunities" element={<AdminOpportunities />} />
                    <Route path="verification" element={<AdminVerification />} />
                  </Route>
                </Routes>
              </AdminGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
