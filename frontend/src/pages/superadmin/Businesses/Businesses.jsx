import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import axios from 'axios';
import BusinessStats from './components/BusinessStats';
import BusinessFilters from './components/BusinessFilters';
import BusinessTable from './components/BusinessTable';

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
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      const response = await axios.get('/data/businesses.json');
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      // Mock data
      setBusinesses([
        {
          id: '1',
          name: 'Acme Innovations Inc.',
          email: 'contact@acme.com',
          subscription_plan: 'professional',
          status: 'active',
          current_usage: { total_users: 8, total_products: 1247 },
          usage_limits: { maxUsers: 15, maxProducts: 5000 },
          mrr: 149,
          created_at: ' 2023-10-26'
        },
        {
          id: '2',
          name: 'TechStart Solutions',
          email: 'hello@techstart.com',
          subscription_plan: 'starter',
          status: 'active',
          current_usage: { total_users: 3, total_products: 185 },
          usage_limits: { maxUsers: 5, maxProducts: 500 },
          mrr: 49,
          created_at: '2023-10-25'
        },
        {
          id: '3',
          name: 'Global Retail Co.',
          email: 'admin@globalretail.com',
          subscription_plan: 'enterprise',
          status: 'active',
          current_usage: { total_users: 25, total_products: 5420 },
          usage_limits: { maxUsers: -1, maxProducts: -1 },
          mrr: 499,
          created_at: '2023-10-24'
        },
        {
          id: '4',
          name: 'SmallBiz Store',
          email: 'owner@smallbiz.com',
          subscription_plan: 'starter',
          status: 'trial',
          current_usage: { total_users: 1, total_products: 45 },
          usage_limits: { maxUsers: 5, maxProducts: 500 },
          mrr: 0,
          created_at: '2023-10-23'
        },
        {
          id: '5',
          name: 'Suspended Business',
          email: 'test@suspended.com',
          subscription_plan: 'professional',
          status: 'suspended',
          current_usage: { total_users: 5, total_products: 320 },
          usage_limits: { maxUsers: 15, maxProducts: 5000 },
          mrr: 0,
          created_at: '2023-09-15'
        }
      ]);
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

  const handleDeleteBusiness = (business) => {
    if (window.confirm(`Are you sure you want to delete ${business.name}? This action cannot be undone.`)) {
      setBusinesses(prev => prev.filter(b => b.id !== business.id));
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
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
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
