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
  Database
} from 'lucide-react';
import superadminService from '../../../services/platform/superadminService';
import { useCurrency } from '../../../utils/currencyUtils';
import { showError } from '../../../utils/alerts';

export default function ViewPricingPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        const response = await superadminService.getPricingPlanById(id);
        setPlan(response.data);
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
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Plan Not Found</h2>
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

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate('/superadmin/pricing-plans')}
            className="p-3 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 rounded-lg shadow-sm transition-all group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">{plan.name}</h1>
              <span className={`px-3 py-1 bg-${plan.color || 'emerald'}-50 text-${plan.color || 'emerald'}-700 text-xs font-bold rounded-full border border-${plan.color || 'emerald'}-100 uppercase tracking-wider`}>
                Active Tier
              </span>
            </div>
            <p className="text-lg text-slate-500 font-medium">{plan.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/superadmin/pricing-plans/${id}/edit`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Edit className="w-5 h-5" />
            Modify Plan
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Monthly Price</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(plan.priceMonthly)}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Billed recurringly</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Yearly Price</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(plan.priceYearly)}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Save ~20% annually</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-100 rounded-2xl">
              <Users className="w-6 h-6 text-slate-600" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Active Users</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{plan.active_businesses || 0}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Businesses on this plan</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl">
              <Globe className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Trial Period</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{plan.trialDays} Days</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">No credit card required</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Features & Capabilities */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-900">Included Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500 transition-colors">
                    <Check className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-slate-700 font-semibold leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-7 h-7 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Feature Flags</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {plan.featureFlags.map((flag, index) => (
                <div key={index} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold border border-slate-200 uppercase tracking-tight">
                  {flag.replace(/_/g, ' ')}
                </div>
              ))}
            </div>
            <p className="mt-6 text-slate-500 text-sm italic font-medium">
              These flags control component-level visibility and API capabilities for tenants on this plan.
            </p>
          </section>
        </div>

        {/* Global Limits Sidebar */}
        <div className="space-y-8">
          <section className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-all duration-700"></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <Database className="w-7 h-7 text-emerald-400" />
              <h2 className="text-2xl font-bold tracking-tight">System Limits</h2>
            </div>
            
            <div className="space-y-6 relative z-10">
              {[
                { label: 'Maximum Users', value: plan.limits?.maxUsers },
                { label: 'Product Inventory', value: plan.limits?.maxProducts },
                { label: 'Monthly Orders', value: plan.limits?.maxOrdersPerMonth },
                { label: 'Cloud Storage', value: plan.limits?.maxStorageMB, isStorage: true },
                { label: 'Business Locations', value: plan.limits?.maxLocations },
              ].map((limit, index) => (
                <div key={index} className="flex flex-col gap-2 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-widest">{limit.label}</span>
                    <span className="text-xl font-bold text-white">
                      {limit.value === -1 
                        ? 'Unlimited' 
                        : limit.isStorage 
                          ? (limit.value >= 1024 ? `${(limit.value/1024).toFixed(0)} GB` : `${limit.value} MB`)
                          : (limit.value || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]" 
                      style={{ width: limit.value === -1 ? '100%' : '65%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-emerald-600 rounded-[2.5rem] p-8 shadow-xl shadow-emerald-600/20 text-white group">
             <div className="flex items-center justify-between mb-4">
                <p className="text-emerald-100 font-bold uppercase tracking-widest text-xs">Projected ROI</p>
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
             </div>
             <h3 className="text-3xl font-bold leading-tight mb-2">High Value Tier</h3>
             <p className="text-emerald-50 font-medium">This plan generates the highest retention rate among growing SMBs.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

// Minimal placeholder component for Activity since it wasn't imported
function Activity({ className }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
