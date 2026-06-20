import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminGuard: Role-Based Access Control wrapper
 * 
 * Restricts access to admin routes based on JWT-like role verification.
 * Only allows users with 'corporate_admin' role to access protected content.
 * 
 * Usage:
 *   <Route path="/admin/*" element={<AdminGuard><AdminLayout /></AdminGuard>} />
 */
interface AdminGuardProps {
  children: ReactNode;
  requiredRole?: 'corporate_admin';
}

export function AdminGuard({ children, requiredRole = 'corporate_admin' }: AdminGuardProps) {
  const { currentUser } = useAuth();

  // Check if user exists and has the required admin role
  const isAuthorized = currentUser && (currentUser.role as any) === requiredRole;

  if (!isAuthorized) {
    console.warn(
      `Access denied: User ${currentUser?.id} attempted to access admin panel without ${requiredRole} role`
    );
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/**
 * AdminAccessWrapper: Conditionally render admin content
 * 
 * Lightweight wrapper for checking admin access without navigation.
 * Useful for conditional rendering of admin UI elements.
 */
export function AdminAccessWrapper({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser && (currentUser.role as any) === 'corporate_admin';

  if (!isAdmin) return null;
  return <>{children}</>;
}

/**
 * useAdminAccess: Hook to check admin authorization
 * 
 * Returns boolean indicating if current user is an admin.
 */
export function useAdminAccess(): boolean {
  const { currentUser } = useAuth();
  return Boolean(currentUser && (currentUser.role as any) === 'corporate_admin');
}
