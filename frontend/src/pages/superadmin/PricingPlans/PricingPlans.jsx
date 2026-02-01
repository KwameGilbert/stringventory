import { useState, useEffect } from 'react';
import { Edit, Users, DollarSign, TrendingUp, Check, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRICING_PLANS } from '../../../constants/plans';

export default function PricingPlans() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    totalMRR: 0,
    activePlans: 0,
    avgRevenuePerUser: 0,
    planStats: {}
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/data/pricing-stats.json');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching pricing stats:', error);
      }
    };

    fetchStats();
  }, []);

  const getSubscriberCount = (planId) => {
    return stats.planStats[planId]?.subscribers || 0;
  };

  const getMonthlyRevenue = (planId) => {
    const plan = PRICING_PLANS.find(p => p.id === planId);
    const count = getSubscriberCount(planId);
    return plan && plan.priceMonthly ? plan.priceMonthly * count : 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing Plans</h1>
          <p className="text-gray-600">Manage subscription tiers and pricing</p>
        </div>
        <button
          onClick={() => navigate('/superadmin/pricing-plans/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalMRR)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-gray-900">{PRICING_PLANS.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Revenue/User</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.avgRevenuePerUser)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_PLANS.map((plan) => {
          const subscribers = getSubscriberCount(plan.id);
          const revenue = getMonthlyRevenue(plan.id);

          return (
            <div
              key={plan.id}
              className="bg-white rounded-xl shadow-sm border-2 hover:shadow-lg transition-all cursor-pointer"
              style={{ borderColor: plan.color }}
              onClick={() => navigate(`/superadmin/pricing-plans/${plan.id}`)}
            >
              {/* Plan Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/superadmin/pricing-plans/${plan.id}/edit`);
                    }}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  {plan.priceMonthly === 0 ? (
                    <span className="text-3xl font-bold text-gray-900">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        {formatCurrency(plan.priceMonthly)}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Subscribers</span>
                    <span className="font-semibold text-gray-900">{subscribers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Revenue</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(revenue)}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Key Features
                </p>
                <ul className="space-y-2">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className="text-xs text-gray-500 pl-6">
                      +{plan.features.length - 5} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Limits */}
              <div className="p-6 bg-gray-50 rounded-b-xl">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Limits
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Users</span>
                    <span className="font-medium text-gray-900">
                      {plan.limits?.maxUsers === -1 ? 'Unlimited' : plan.limits?.maxUsers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Products</span>
                    <span className="font-medium text-gray-900">
                      {plan.limits?.maxProducts === -1 ? 'Unlimited' : (plan.limits?.maxProducts || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-medium text-gray-900">
                      {plan.limits?.maxStorageMB === -1 
                        ? 'Unlimited' 
                        : plan.limits?.maxStorageMB >= 1024 
                          ? `${(plan.limits.maxStorageMB / 1024).toFixed(0)} GB` 
                          : `${plan.limits?.maxStorageMB} MB`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Details Modal (simple version) */}
      {selectedPlan && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPlan(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.name} Plan</h2>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">{selectedPlan.description}</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">All Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                  Edit Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
