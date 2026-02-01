import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Edit, Loader, X } from 'lucide-react';
import { PRICING_PLANS } from '../../../constants/plans';

export default function ViewPricingPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plan = PRICING_PLANS.find(p => p.id === id);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan Not Found</h2>
        <button
          onClick={() => navigate('/superadmin/pricing-plans')}
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Return to Pricing Plans
        </button>
      </div>
    );
  }

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
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/superadmin/pricing-plans')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{plan.name}</h1>
            <p className="text-gray-600 mt-1">{plan.description}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/superadmin/pricing-plans/${id}/edit`)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Edit className="w-5 h-5" />
          Edit Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Plan Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Monthly Price</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(plan.priceMonthly)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Yearly Price</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(plan.priceYearly)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Context Color</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-${plan.color}-500`} />
                  <span className="capitalize text-gray-900">{plan.color}</span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Trial Period</dt>
                <dd className="mt-1 text-lg font-medium text-gray-900">{plan.trialDays} Days</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Feature Flags</h2>
            <div className="flex flex-wrap gap-2">
              {plan.featureFlags.map((flag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {flag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Limits */}
        <div className="space-y-6">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Usage Limits</h2>
            <div className="space-y-4">
              {[
                { label: 'Users', value: plan.limits?.maxUsers },
                { label: 'Products', value: plan.limits?.maxProducts },
                { label: 'Orders/Month', value: plan.limits?.maxOrdersPerMonth },
                { label: 'Storage', value: plan.limits?.maxStorageMB, isStorage: true },
                { label: 'Locations', value: plan.limits?.maxLocations },
                { label: 'Categories', value: plan.limits?.maxCategories },
                { label: 'Suppliers', value: plan.limits?.maxSuppliers },
                { label: 'Customers', value: plan.limits?.maxCustomers },
              ].map((limit, index) => (
                 <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-600">{limit.label}</span>
                  <span className="font-semibold text-gray-900">
                    {limit.value === -1 
                      ? 'Unlimited' 
                      : limit.isStorage 
                        ? (limit.value >= 1024 ? `${(limit.value/1024).toFixed(0)} GB` : `${limit.value} MB`)
                        : (limit.value || 0).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
