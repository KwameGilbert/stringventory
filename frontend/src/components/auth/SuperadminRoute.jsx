import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function SuperadminRoute({ children }) {
  const { user, isSuperAdmin } = useAuth();

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/" replace />;
  }

  if (!isSuperAdmin()) {
    // Logged in but not superadmin, redirect to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User is superadmin, render the protected content
  return children;
}
