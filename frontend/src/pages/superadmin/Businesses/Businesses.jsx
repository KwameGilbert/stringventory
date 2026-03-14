import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import BusinessStats from './components/BusinessStats';
import BusinessFilters from './components/BusinessFilters';
import BusinessTable from './components/BusinessTable';
import superadminService from '../../../services/superadminService';
import { showError, showSuccess } from '../../../utils/alerts';

const extractBusinesses = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.businesses)) return payload.businesses;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.businesses)) return payload.data.businesses;

  return [];
};

const normalizeBusiness = (business) => ({
  ...business,
  id: business?.id,
  name: business?.name || business?.businessName || 'Unnamed Business',
  email: business?.email || business?.ownerEmail || '',
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
  },
  mrr:
    Number(business?.mrr) ||
    Number(business?.monthlyRecurringRevenue) ||
    Number(business?.revenue?.mrr) ||
    0,
  created_at: business?.created_at || business?.createdAt || new Date().toISOString(),
});

export default function Businesses() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const filterBusinesses = useCallback(() => {
    // Ensure businesses is an array before filtering
    if (!Array.isArray(businesses)) {
      setFilteredBusinesses([]);
      return;
    }

    let filtered = businesses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(business =>
        String(business?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(business?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(business => business.status === statusFilter);
    }

    // Plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(business => business.subscription_plan === planFilter);
    }

    setFilteredBusinesses(filtered);
  }, [businesses, searchTerm, statusFilter, planFilter]);

  useEffect(() => {
    filterBusinesses();
  }, [filterBusinesses]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getBusinesses();
      setBusinesses(extractBusinesses(response).map(normalizeBusiness));
    } catch (error) {
      console.error('Error fetching businesses:', error);
      showError(error?.message || 'Failed to fetch businesses');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };


  const handleViewBusiness = (id) => {
    navigate(`/superadmin/businesses/${id}`);
  };

  const handleEditBusiness = (id) => {
    navigate(`/superadmin/businesses/edit/${id}`);
  };

  const handleDeleteBusiness = async (business) => {
    if (!window.confirm(`Are you sure you want to delete ${business.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await superadminService.deleteBusiness(business.id);
      setBusinesses(prev => prev.filter(b => b.id !== business.id));
      showSuccess('Business deleted successfully');
    } catch (error) {
      console.error('Error deleting business:', error);
      showError(error?.message || 'Failed to delete business');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Businesses</h1>
          <p className="text-gray-600">Manage all businesses on your platform</p>
        </div>
        <button
          onClick={() => navigate('/superadmin/businesses/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Business
        </button>
      </div>

      {/* Filters */}
      <BusinessFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
      />

      {/* Stats */}
      <BusinessStats businesses={businesses} />

      {/* Businesses Table */}
      <BusinessTable
        businesses={filteredBusinesses}
        loading={loading}
        onView={handleViewBusiness}
        onEdit={handleEditBusiness}
        onDelete={handleDeleteBusiness}
      />
    </div>
  );
}
