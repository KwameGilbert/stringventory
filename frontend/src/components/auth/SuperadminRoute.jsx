import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function SuperadminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/" replace />;
  }

  // System now uses one dashboard with role-based access.
  return <Navigate to="/dashboard" replace />;
}
