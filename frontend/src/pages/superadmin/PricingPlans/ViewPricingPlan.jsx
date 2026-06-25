import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  Edit, 
  Loader2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Globe,
  Database,
  Calendar,
  Gauge,
  Sparkles,
  Activity,
  Lock,
  BarChart3,
  Clock,
  Settings2,
  Plus
} from 'lucide-react';
import superadminService from '../../../services/platform/superadminService';
import { useCurrency } from '../../../utils/currencyUtils';
import { showError } from '../../../utils/alerts';
import { normalizePlan } from '../../../models/plan';

const colorMap = {
  emerald: { bg: '#ecfdf5', text: '#047857', border: '#d1fae5' },
  blue: { bg: '#eff6ff', text: '#1e40af', border: '#dbeafe' },
  purple: { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' },
  amber: { bg: '#fffbeb', text: '#b45309', border: '#fef3c7' },
  rose: { bg: '#fff5f7', text: '#be123c', border: '#ffe4e6' }
};

const getColorStyles = (colorName) => {
  return colorMap[colorName] || colorMap.emerald;
};

export default function ViewPricingPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        const response = await superadminService.getPricingPlanById(id);
        const planData = response?.data || response;
        const normalizedPlan = normalizePlan(planData);
        console.log('Normalized Plan:', normalizedPlan);
        setPlan(normalizedPlan);
      } catch (error) {
        console.error('Error fetching plan details:', error);
        showError('Failed to load plan details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading plan intelligence...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
          <Zap className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Plan Not Found</h2>
        <p className="text-slate-500 mb-6 text-center max-w-xs">The pricing plan you are looking for might have been retired or moved.</p>
        <button
          onClick={() => navigate('/superadmin/pricing-plans')}
          className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
        >
          Return to Pricing Plans
        </button>
      </div>
    );
  }

  const formatCurrency = (amount) => formatPrice(amount, "USD");

  const handleAction = (actionName) => {
    console.log(`Action: ${actionName}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Header Section ─── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/superadmin/pricing-plans')}
            className="p-3 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 rounded-lg shadow-sm transition-all group mt-1"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-4xl font-semibold text-slate-900">{plan?.name}</h1>
              {plan?.isPopular && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  Popular
                </span>
              )}
              {(() => {
                const colors = getColorStyles(plan?.color || 'emerald');
                return (
                  <span 
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                      borderColor: colors.border
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full border uppercase tracking-wider"
                  >
                    {plan?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                );
              })()}
            </div>
            <p className="text-lg text-slate-600 font-medium max-w-2xl">{plan?.description}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate(`/superadmin/pricing-plans/${id}/edit`)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Edit className="w-5 h-5" />
            Edit Plan
          </button>
          <button
            onClick={() => handleAction('configure')}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
          >
            <Settings2 className="w-5 h-5" />
            Configure
          </button>
        </div>
      </div>

      {/* ─── Pricing & Metrics Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Price */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly</span>
          </div>
          <div className="text-3xl font-semibold text-slate-900 mb-1">{formatCurrency(plan?.priceMonthly)}</div>
          <p className="text-xs text-slate-400 font-medium">/month billed monthly</p>
        </div>

        {/* Yearly Price */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Yearly</span>
          </div>
          <div className="text-3xl font-semibold text-slate-900 mb-1">{formatCurrency(plan?.priceYearly)}</div>
          <p className="text-xs text-slate-400 font-medium">/year billed annually</p>
        </div>

        {/* Active Subscribers */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subscribers</span>
          </div>
          <div className="text-3xl font-semibold text-slate-900 mb-1">{plan?.subscribers || 0}</div>
          <p className="text-xs text-slate-400 font-medium">Active businesses</p>
        </div>

        {/* Trial Period */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trial</span>
          </div>
          <div className="text-3xl font-semibold text-slate-900 mb-1">{plan?.trialDays}</div>
          <p className="text-xs text-slate-400 font-medium">days free trial</p>
        </div>
      </div>

      {/* ─── Tabs Navigation ─── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-wrap gap-0 border-b border-slate-100">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'features', label: 'Features', icon: ShieldCheck },
            { id: 'limits', label: 'System Limits', icon: Database },
            { id: 'details', label: 'Details', icon: Settings2 }
          ].map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-emerald-600 bg-emerald-50/30'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-2">Monthly Revenue</p>
                      <p className="text-3xl font-semibold text-slate-900">
                        {formatCurrency((plan?.monthlyRecurringRevenue || plan?.priceMonthly * (plan?.subscribers || 0)))}
                      </p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{plan?.subscribers || 0} × {formatCurrency(plan?.priceMonthly)}</p>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-2">Plan Status</p>
                      <p className="text-3xl font-semibold text-slate-900 capitalize">{plan?.status || 'Active'}</p>
                    </div>
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Current operational status</p>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-2">Last Updated</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {plan?.updatedAt ? new Date(plan.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {plan?.updatedAt ? new Date(plan.updatedAt).toLocaleTimeString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-8">
              {/* Marketing Features */}
              {plan?.features && plan.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    Included Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-emerald-50/30 border border-emerald-100/50 hover:bg-emerald-50/60 transition-colors group">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-slate-700 font-semibold text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature Flags */}
              {plan?.featureFlags && plan.featureFlags.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                    Feature Flags & API Access
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {plan.featureFlags.map((flag, index) => (
                      <div key={index} className="flex items-center gap-3 px-4 py-3 bg-blue-50/30 border border-blue-100/50 rounded-lg hover:bg-blue-50/60 transition-colors">
                        <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-slate-700 font-semibold text-sm">{flag.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!plan?.features?.length && !plan?.featureFlags?.length && (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-500">No features configured for this plan</p>
                </div>
              )}
            </div>
          )}

          {/* System Limits Tab */}
          {activeTab === 'limits' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                <Database className="w-6 h-6 text-slate-900" />
                Resource Limits
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Maximum Users', value: plan?.limits?.maxUsers, unit: 'users' },
                  { label: 'Product Inventory', value: plan?.limits?.maxProducts, unit: 'products' },
                  { label: 'Monthly Orders', value: plan?.limits?.maxOrdersPerMonth, unit: 'orders' },
                  { label: 'Cloud Storage', value: plan?.limits?.maxStorageMB, unit: 'MB', isStorage: true },
                  { label: 'Business Locations', value: plan?.limits?.maxLocations, unit: 'locations' },
                  { label: 'Max Categories', value: plan?.limits?.maxCategories, unit: 'categories' },
                  { label: 'Max Suppliers', value: plan?.limits?.maxSuppliers, unit: 'suppliers' },
                  { label: 'Max Customers', value: plan?.limits?.maxCustomers, unit: 'customers' }
                ].map((limit, index) => {
                  const value = limit.value;
                  const displayValue = value === -1 
                    ? 'Unlimited' 
                    : limit.isStorage 
                      ? (value >= 1024 ? `${(value/1024).toFixed(2)} GB` : `${value} MB`)
                      : (value || 0).toLocaleString();
                  
                  return (
                    <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{limit.label}</span>
                        <Gauge className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="text-2xl font-semibold text-slate-900 mb-3">{displayValue}</div>
                      {value !== -1 && value > 0 && (
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-sm" 
                            style={{ width: '100%' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                <Settings2 className="w-6 h-6 text-slate-900" />
                Plan Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plan ID */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Plan ID</p>
                  <p className="text-sm font-mono text-slate-900 break-all">{plan?.id || 'N/A'}</p>
                </div>

                {/* Status */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</p>
                  <p className="text-sm font-semibold text-slate-900 capitalize">{plan?.status || 'Active'}</p>
                </div>

                {/* Created Date */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Created</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {plan?.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                {/* Last Modified */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Last Modified</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {plan?.updatedAt ? new Date(plan.updatedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                {/* Popular Status */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Popular Badge</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${plan?.isPopular ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                    <p className="text-sm font-semibold text-slate-900">{plan?.isPopular ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {/* Color Theme */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Color Theme</p>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg border-2 border-slate-300"
                      style={{ backgroundColor: plan?.color }}
                    ></div>
                    <p className="text-sm font-semibold text-slate-900 capitalize">{plan?.color || 'Default'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
