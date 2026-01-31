import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Users,
  Edit,
  Clock,
  Shield,
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import BusinessOverview from './tabs/BusinessOverview';
import BusinessUsers from './tabs/BusinessUsers';
import BusinessActivity from './tabs/BusinessActivity';
import BusinessSettings from './tabs/BusinessSettings';

export default function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data Extension
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    betaFeatures: false,
    manualOverride: false,

    maintenanceMode: false,
    verifiedStatus: true
  });


  // Mock analytics/activity data
  const [activityLogs] = useState([
    { id: 1, action: 'User added', description: 'John Doe added to team', timestamp: '2023-10-28T14:30:00Z', type: 'user' },
    { id: 2, action: 'Subscription updated', description: 'Plan upgraded to Professional', timestamp: '2023-10-28T10:00:00Z', type: 'subscription' },
    { id: 3, action: 'Product added', description: 'Batch upload: 50 products', timestamp: '2023-10-27T15:20:00Z', type: 'product' },
    { id: 4, action: 'Settings updated', description: 'Business profile updated', timestamp: '2023-10-26T09:15:00Z', type: 'settings' },
    { id: 5, action: 'Login detected', description: 'New device login from NY, USA', timestamp: '2023-10-25T11:00:00Z', type: 'security' },
    { id: 6, action: 'Invoice generated', description: 'Invoice #INV-2023-001 created', timestamp: '2023-10-25T00:00:00Z', type: 'billing' }
  ]);

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/data/businesses.json');
      const found = response.data.find(b => b.id === id);
      
      if (found) {
        setBusiness(found);
        
        // Generate mock sub-data based on the business
        setUsers([
          { id: 1, name: found.owner_name, email: found.email, role: 'Owner', status: 'Active', lastActive: '2 mins ago' },
          { id: 2, name: 'Sarah Miller', email: 'sarah.m@example.com', role: 'Admin', status: 'Active', lastActive: '2 days ago' },
          { id: 3, name: 'Mike Wilson', email: 'mike.w@example.com', role: 'Editor', status: 'Inactive', lastActive: '1 week ago' },
        ]);

      }
    } catch (error) {
      console.error('Error fetching business details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'login_as':
        Swal.fire({
            title: 'Impersonating User',
            text: `Logging in as ${business.owner_name}...`,
            icon: 'info',
            timer: 1500,
            showConfirmButton: false
        });
        break;
      case 'reset_password':
        Swal.fire({
            title: 'Password Reset',
            text: `Password reset email sent to ${business.email}`,
            icon: 'success',
            timer: 1500
        });
        break;
      case 'suspend':
        const isSuspended = business.status === 'suspended';
        Swal.fire({
            title: isSuspended ? 'Activate Business?' : 'Suspend Business?',
            text: isSuspended ? 'This will restore access immediately.' : 'This will block all access for this business.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: isSuspended ? '#10b981' : '#ef4444',
            confirmButtonText: isSuspended ? 'Yes, Activate' : 'Yes, Suspend'
        }).then((result) => {
            if (result.isConfirmed) {
                setBusiness(prev => ({ ...prev, status: isSuspended ? 'active' : 'suspended' }));
                Swal.fire('Updated!', `Business has been ${isSuspended ? 'activated' : 'suspended'}.`, 'success');
            }
        });
        break;
      case 'delete':
        Swal.fire({
            title: 'Delete Business?',
            text: `Are you sure you want to permanently delete ${business.name}? This action cannot be undone.`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Yes, Delete Permanently'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Deleted!', 'Business has been deleted.', 'success').then(() => {
                    navigate('/superadmin/businesses');
                });
            }
        });
        break;
      default:
        break;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      trial: 'bg-blue-100 text-blue-800 border-blue-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };


  if (loading || !business) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/superadmin/businesses')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusBadge(business.status)} uppercase tracking-wide`}>
                    {business.status}
                </span>
            </div>
            <p className="text-gray-600 mt-1">{business.id} • {business.industry}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button
                onClick={() => navigate(`/superadmin/businesses/edit/${id}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
                <Edit className="w-4 h-4" /> Edit Details
            </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
            {[
                { id: 'overview', label: 'Overview', icon: Building2 },
                { id: 'users', label: 'Team Members', icon: Users },
                { id: 'activity', label: 'Activity Logs', icon: Clock },
                { id: 'settings', label: 'Settings', icon: Shield },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                        flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${activeTab === tab.id 
                            ? 'border-purple-600 text-purple-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
            <BusinessOverview 
                business={business} 
                handleAction={handleAction} 
            />
        )}
        {activeTab === 'users' && <BusinessUsers users={users} />}
        {activeTab === 'activity' && <BusinessActivity activityLogs={activityLogs} />}
        {activeTab === 'settings' && (
            <BusinessSettings 
                settings={settings} 
                setSettings={setSettings} 
                handleAction={handleAction} 
                businessStatus={business.status} 
            />
        )}
      </div>
    </div>
  );
}
