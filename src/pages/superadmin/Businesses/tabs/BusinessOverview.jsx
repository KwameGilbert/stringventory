import React from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  Package,
  FileText,
  CreditCard,
  LogIn,
  Key,
  Shield
} from 'lucide-react';

export default function BusinessOverview({ business, handleAction }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getPlanBadge = (plan) => {
    const badges = {
      free_trial: 'bg-gray-100 text-gray-800 border-gray-200',
      starter: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      professional: 'bg-blue-100 text-blue-800 border-blue-200',
      enterprise: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return badges[plan] || 'bg-gray-100 text-gray-800';
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info - 2 Cols */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-400" />
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</label>
                <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{business.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{business.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{business.country}</span>
                    </div>
                </div>
             </div>
             <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</label>
                <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{business.owner_name} (Owner)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{business.industry}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">Joined {formatDate(business.created_at)}</span>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-semibold text-gray-900 mb-6">Resource Usage</h2>
             <div className="space-y-6">
                {[
                    { label: 'Users', current: business.current_usage.total_users, max: business.usage_limits.maxUsers, color: 'bg-emerald-600', icon: Users },
                    { label: 'Products', current: business.current_usage.total_products, max: business.usage_limits.maxProducts, color: 'bg-emerald-600', icon: Package },
                    { label: 'Storage (GB)', current: business.current_usage.storage_used, max: business.usage_limits.maxStorage, color: 'bg-blue-600', icon: FileText },
                ].map((item, i) => {
                    const percentage = item.max === -1 ? 0 : Math.min((item.current / item.max) * 100, 100);
                    return (
                        <div key={i}>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <item.icon className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                </div>
                                <span className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-900">{item.current}</span>
                                    <span className="text-gray-400 mx-1">/</span>
                                    {item.max === -1 ? 'Unlimited' : item.max}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div className={`${item.color} h-full transition-all duration-500`} style={{ width: item.max === -1 ? '100%' : `${percentage}%` }} />
                            </div>
                        </div>
                    );
                })}
             </div>
        </div>
      </div>

      {/* Sidebar Info */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-500">Current Plan</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getPlanBadge(business.subscription_plan)} capitalize`}>
                            {business.subscription_plan.replace('_', ' ')}
                        </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{formatCurrency(business.mrr)}</span>
                        <span className="text-sm text-gray-500">/mo</span>
                    </div>
                </div>
                
                <div className="space-y-3 pt-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadge(business.status)} capitalize`}>
                            {business.status}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Next Billing</span>
                        <span className="font-medium text-gray-900">{business.next_billing_date ? formatDate(business.next_billing_date) : 'N/A'}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Payment Method</span>
                        <span className="font-medium text-gray-900 flex items-center gap-1">
                           <CreditCard className="w-3 h-3" /> Visa •••• 4242
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
                <button 
                  onClick={() => handleAction('login_as')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    <LogIn className="w-4 h-4" /> Login as Owner
                </button>
                <button 
                   onClick={() => handleAction('reset_password')}
                   className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                    <Key className="w-4 h-4" /> Reset Password
                </button>
                <button 
                   onClick={() => handleAction('suspend')}
                   className={`w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors text-sm font-medium ${business.status === 'suspended' ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100' : 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'}`}
                >
                    <Shield className="w-4 h-4" /> {business.status === 'suspended' ? 'Activate Business' : 'Suspend Access'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
