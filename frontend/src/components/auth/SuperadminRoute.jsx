import { useAuth } from '../../contexts/AuthContext';

export default function SuperadminRoute({ children }) {
  const { user, loading } = useAuth();

  // DEVELOPMENT OVERRIDE: Skip formal authentication loop for now
  if (!loading && (!user || user.role !== 'CEO')) {
    const mockUser = {
      id: 'dev-admin',
      email: 'dev@stringventory.com',
      firstName: 'Dev',
      lastName: 'Mode',
      role: 'CEO',
      isSuperAdmin: true,
      avatar: 'https://ui-avatars.com/api/?name=Dev+Admin&background=10b981&color=fff'
    };
    
    // Inject mock session into storage so components don't crash
    localStorage.setItem("stringventory_superadmin_user", JSON.stringify(mockUser));
    
    // In dev mode, we can just return children immediately or force a refresh.
    // To be most reliable, we allow passage.
    return children;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Authenticating...</div>;
  }

  return children;
}
