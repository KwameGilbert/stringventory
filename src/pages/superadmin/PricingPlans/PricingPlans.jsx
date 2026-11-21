import { useState, useEffect } from 'react';
import { Edit, Users, DollarSign, TrendingUp, Check, X, Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import superadminService from '../../../services/platform/superadminService';
import { showError } from '../../../utils/alerts';
import { useCurrency } from '../../../utils/currencyUtils';
import PlanComparisonTable from '../../../components/superadmin/PricingPlans/PlanComparisonTable';
import { extractPlans, normalizePlan } from '../../../models/plan';
import { extractAnalytics } from '../../../models/analytics';

export default function PricingPlans() {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    totalMRR: 0,
    activePlans: 0,
    avgRevenuePerUser: 0,
    planStats: {}
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch plans
        const plansRes = await superadminService.getPricingPlans();
        console.log('Plans Response:', plansRes);
        
        const fetchedPlans = extractPlans(plansRes).map(normalizePlan);
        console.log('Fetched & Normalized Plans:', fetchedPlans);
        
        setPlans(fetchedPlans);

        // Fetch analytics (non-critical)
        try {
          const analyticsRes = await superadminService.getPlatformAnalytics();
          const analytics = extractAnalytics(analyticsRes);
          const planStats = analytics?.planStats || {};

          const totalSubscribers =
            Number(analytics?.totalSubscribers) ||
            fetchedPlans.reduce((sum, plan) => {
              const fromStats = Number(planStats?.[plan.id]?.subscribers);
              return sum + (fromStats || Number(plan.subscribers) || 0);
            }, 0);

          const totalMRR =
            Number(analytics?.totalMRR) ||
            fetchedPlans.reduce((sum, plan) => {
              const subscribers = Number(planStats?.[plan.id]?.subscribers) || Number(plan.subscribers) || 0;
              return sum + subscribers * (Number(plan.priceMonthly) || 0);
            }, 0);

          const avgRevenuePerUser = totalSubscribers ? totalMRR / totalSubscribers : 0;

          setStats({
            totalSubscribers,
            totalMRR,
            activePlans: fetchedPlans.length,
            avgRevenuePerUser,
            planStats,
          });
        } catch (analyticsError) {
          console.warn('Analytics fetch failed, using defaults:', analyticsError);
          setStats({
            totalSubscribers: 0,
            totalMRR: 0,
            activePlans: fetchedPlans.length,
            avgRevenuePerUser: 0,
            planStats: {},
          });
        }

        // Fetch comparison data (non-critical)
        try {
          const comparisonRes = await superadminService.getPlanComparison();
          setComparisonData(comparisonRes?.data || []);
        } catch (comparisonError) {
          console.warn('Comparison data fetch failed:', comparisonError);
        }
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
        showError(error?.message || 'Failed to load pricing plans');
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getSubscriberCount = (planId) => {
    return stats.planStats[planId]?.subscribers || 0;
  };

  const getMonthlyRevenue = (planId) => {
    const plan = plans.find(p => p.id === planId);
    const count = getSubscriberCount(planId);
    return plan && plan.priceMonthly ? plan.priceMonthly * count : 0;
  };

  const formatCurrency = (amount) => formatPrice(amount, "USD");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Pricing Plans</h1>
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Plans Overview
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'comparison' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Comparison Matrix
          </button>
        </nav>
      </div>

      {activeTab === 'overview' ? (
        <>
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
              <p className="text-2xl font-bold text-gray-900">{stats.activePlans}</p>
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
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
          </div>
        ) : plans.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No pricing plans found</p>
          </div>
        ) : (
          plans.map((plan) => {
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    {plan.isPopular && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                        <Star className="w-3 h-3" /> Popular
                      </span>
                    )}
                  </div>
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
                {plan.trialDays > 0 && (
                  <p className="text-xs text-emerald-600 font-medium mt-2">
                    {plan.trialDays}-day free trial
                  </p>
                )}
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
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
                  {plan.limits?.maxOrdersPerMonth > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders/Month</span>
                      <span className="font-medium text-gray-900">
                        {plan.limits?.maxOrdersPerMonth === -1 ? 'Unlimited' : (plan.limits?.maxOrdersPerMonth || 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {plan.limits?.maxLocations > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Locations</span>
                      <span className="font-medium text-gray-900">
                        {plan.limits?.maxLocations === -1 ? 'Unlimited' : plan.limits?.maxLocations}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </>
  ) : (
    <PlanComparisonTable comparisonData={comparisonData} />
  )}

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
                <h2 className="text-2xl font-semibold text-gray-900">{selectedPlan.name} Plan</h2>
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
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
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
