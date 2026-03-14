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
import Swal from 'sweetalert2';
import BusinessOverview from './tabs/BusinessOverview';
import BusinessUsers from './tabs/BusinessUsers';
import BusinessActivity from './tabs/BusinessActivity';
import BusinessSettings from './tabs/BusinessSettings';
import superadminService from '../../../services/superadminService';

const extractBusiness = (response) => {
  const payload = response?.data || response || {};

  if (payload?.business) return payload.business;
  if (payload?.data?.business) return payload.data.business;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;

  return payload;
};

const normalizeBusiness = (business) => ({
  ...business,
  id: business?.id,
  name: business?.name || business?.businessName || 'Unnamed Business',
  email: business?.email || business?.ownerEmail || '',
  owner_name: business?.owner_name || business?.ownerName || business?.owner?.name || 'Owner',
  phone: business?.phone || business?.ownerPhone || 'N/A',
  industry: business?.industry || 'N/A',
  country: business?.country || 'N/A',
  subscription_plan: business?.subscription_plan || business?.subscriptionPlan || business?.plan || 'starter',
  status: String(business?.status || 'active').toLowerCase(),
  current_usage: {
    total_users:
      Number(business?.current_usage?.total_users) ||
      Number(business?.currentUsage?.totalUsers) ||
      Number(business?.totalUsers) ||
      0,
    total_products:
      Number(business?.current_usage?.total_products) ||
      Number(business?.currentUsage?.totalProducts) ||
      Number(business?.totalProducts) ||
      0,
    storage_used:
      Number(business?.current_usage?.storage_used) ||
      Number(business?.currentUsage?.storageUsed) ||
      0,
  },
  usage_limits: {
    maxUsers:
      Number(business?.usage_limits?.maxUsers) ||
      Number(business?.usageLimits?.maxUsers) ||
      Number(business?.planLimits?.maxUsers) ||
      0,
    maxProducts:
      Number(business?.usage_limits?.maxProducts) ||
      Number(business?.usageLimits?.maxProducts) ||
      Number(business?.planLimits?.maxProducts) ||
      0,
    maxStorage:
      Number(business?.usage_limits?.maxStorage) ||
      Number(business?.usageLimits?.maxStorage) ||
      Number(business?.planLimits?.maxStorage) ||
      0,
  },
  mrr:
    Number(business?.mrr) ||
    Number(business?.monthlyRecurringRevenue) ||
    Number(business?.revenue?.mrr) ||
    0,
  next_billing_date: business?.next_billing_date || business?.nextBillingDate || null,
  created_at: business?.created_at || business?.createdAt || new Date().toISOString(),
});

const normalizeBusinessUsers = (business) => {
  const users = business?.users || business?.teamMembers || [];

  if (!Array.isArray(users)) return [];

  return users.map((user, index) => ({
    id: user?.id || index + 1,
    name: user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || 'Unknown User',
    email: user?.email || 'N/A',
    role: user?.role || user?.roleName || 'Member',
    status: String(user?.status || 'active').toLowerCase() === 'active' ? 'Active' : 'Inactive',
    lastActive: user?.lastActive || user?.lastLoginAt || 'N/A',
  }));
};

const normalizeActivityLogs = (business) => {
  const logs = business?.activityLogs || business?.activities || [];
  if (!Array.isArray(logs)) return [];

  return logs.map((log, index) => ({
    id: log?.id || index + 1,
    action: log?.action || log?.title || 'Activity',
    description: log?.description || log?.message || 'No description',
    timestamp: log?.timestamp || log?.createdAt || new Date().toISOString(),
    type: log?.type || 'settings',
  }));
};

export default function BusinessDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    betaFeatures: false,
    manualOverride: false,

    maintenanceMode: false,
    verifiedStatus: true
  });
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getBusinessById(id);
      const found = normalizeBusiness(extractBusiness(response));

      if (!found?.id) {
        navigate('/superadmin/businesses');
        return;
      }

      setBusiness(found);
      setUsers(normalizeBusinessUsers(found));
      setActivityLogs(normalizeActivityLogs(found));
    } catch (error) {
      console.error('Error fetching business details:', error);
      Swal.fire('Failed to load business details', error?.message || 'Please try again later.', 'error').then(() => {
        navigate('/superadmin/businesses');
      });
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
            if (!result.isConfirmed) return;

            const run = async () => {
              try {
                if (isSuspended) {
                  await superadminService.reactivateBusiness(id);
                } else {
                  await superadminService.suspendBusiness(id);
                }
                setBusiness(prev => ({ ...prev, status: isSuspended ? 'active' : 'suspended' }));
                Swal.fire('Updated!', `Business has been ${isSuspended ? 'activated' : 'suspended'}.`, 'success');
              } catch (error) {
                Swal.fire('Update failed', error?.message || 'Unable to update business status.', 'error');
              }
            };

            run();
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
                const run = async () => {
                  try {
                    await superadminService.deleteBusiness(id);
                    Swal.fire('Deleted!', 'Business has been deleted.', 'success').then(() => {
                        navigate('/superadmin/businesses');
                    });
                  } catch (error) {
                    Swal.fire('Delete failed', error?.message || 'Unable to delete business.', 'error');
                  }
                };

                run();
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
        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
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
                            ? 'border-emerald-600 text-emerald-600' 
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
      <div className="min-h-100">
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
