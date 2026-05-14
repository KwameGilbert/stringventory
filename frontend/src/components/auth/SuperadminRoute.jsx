import { Navigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthContext';

/**
 * SuperadminRoute — protects all /superadmin/* pages.
 * 
 * Rules:
 *  - Not authenticated → redirect to /login
 *  - Authenticated but not a superadmin → redirect to /dashboard
 *  - Authenticated superadmin → render children
 */
export default function SuperadminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not a superadmin
  if (!user.isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
