import React from 'react';
import {
  CreditCard,
  Calendar,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function BusinessSubscription({ business }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paused: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getPlanBadge = (plan) => {
    const badges = {
      'free_trial': 'bg-gray-100 text-gray-800 border-gray-200',
      'starter': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'professional': 'bg-blue-100 text-blue-800 border-blue-200',
      'enterprise': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    const key = business?.subscription_plan?.toLowerCase() || 'starter';
    return badges[key] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl shadow-sm border border-emerald-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Current Subscription</h2>
            <p className="text-gray-600">Active plan details and billing information</p>
          </div>
          <CreditCard className="w-8 h-8 text-emerald-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Plan */}
          <div className="bg-white rounded-lg p-4 border border-emerald-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Plan</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 capitalize">
                {business?.subscription_plan || 'N/A'}
              </span>
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg p-4 border border-emerald-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
            <span className={`px-2 py-1 rounded text-xs font-semibold border inline-block capitalize ${getStatusBadge(business?.subscription_status)}`}>
              {business?.subscription_status || 'N/A'}
            </span>
          </div>

          {/* Billing Cycle */}
          <div className="bg-white rounded-lg p-4 border border-emerald-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Billing Cycle</p>
            <span className="text-lg font-bold text-gray-900 capitalize">
              {business?.billing_cycle || 'monthly'}
            </span>
          </div>

          {/* MRR */}
          <div className="bg-white rounded-lg p-4 border border-emerald-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Monthly Revenue</p>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(business?.mrr || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Period & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billing Period */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Billing Period</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Period Start</p>
                <p className="text-sm text-gray-900 mt-1">{formatDate(business?.subscription?.currentPeriodStart)}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Period End / Next Billing</p>
                <p className="text-sm text-gray-900 mt-1 font-medium">{formatDate(business?.next_billing_date)}</p>
              </div>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>

            {business?.subscription?.trialEndsAt && (
              <div className="flex items-start justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div>
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Trial Ends At</p>
                  <p className="text-sm text-blue-900 mt-1">{formatDate(business?.subscription?.trialEndsAt)}</p>
                </div>
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
          </div>

          <div className="space-y-4">
            {business?.subscription?.paymentMethodBrand ? (
              <>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Card Brand</p>
                    <p className="text-sm text-gray-900 mt-1 capitalize">{business?.subscription?.paymentMethodBrand}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last 4 Digits</p>
                    <p className="text-sm text-gray-900 mt-1 font-mono">•••• {business?.subscription?.paymentMethodLast4}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No payment method on file</p>
                </div>
              </div>
            )}

            {business?.subscription?.cancelAtPeriodEnd && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">Subscription Scheduled for Cancellation</p>
                    <p className="text-xs text-red-700 mt-1">This subscription will be cancelled at the end of the current billing period</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gateway Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Gateway Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gateway Customer ID</p>
            <p className="text-sm text-gray-900 mt-2 font-mono break-all">
              {business?.subscription?.gatewayCustomerId || 'Not linked'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gateway Subscription ID</p>
            <p className="text-sm text-gray-900 mt-2 font-mono break-all">
              {business?.subscription?.gatewaySubscriptionId || 'Not linked'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</p>
            <p className="text-sm text-gray-900 mt-2">
              {formatDate(business?.subscription?.createdAt)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</p>
            <p className="text-sm text-gray-900 mt-2">
              {formatDate(business?.subscription?.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Usage & Plan Limits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Plan Limits & Usage</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Users */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">Team Members</p>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-blue-900">{business?.current_usage?.total_users || 0}</span>
                <span className="text-sm text-blue-600">
                  {business?.usage_limits?.maxUsers && business?.usage_limits?.maxUsers > 0 
                    ? `/ ${business?.usage_limits?.maxUsers}`
                    : '/ Unlimited'}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: business?.usage_limits?.maxUsers > 0
                      ? `${Math.min(100, (business?.current_usage?.total_users / business?.usage_limits?.maxUsers) * 100)}%`
                      : '100%'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3">Products</p>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-emerald-900">{business?.current_usage?.total_products || 0}</span>
                <span className="text-sm text-emerald-600">
                  {business?.usage_limits?.maxProducts && business?.usage_limits?.maxProducts > 0 
                    ? `/ ${business?.usage_limits?.maxProducts}`
                    : '/ Unlimited'}
                </span>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{
                    width: business?.usage_limits?.maxProducts > 0
                      ? `${Math.min(100, (business?.current_usage?.total_products / business?.usage_limits?.maxProducts) * 100)}%`
                      : '100%'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Storage */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-3">Storage</p>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-purple-900">{business?.current_usage?.storage_used || 0}MB</span>
                <span className="text-sm text-purple-600">
                  {business?.usage_limits?.maxStorage && business?.usage_limits?.maxStorage > 0 
                    ? `/ ${business?.usage_limits?.maxStorage}MB`
                    : '/ Unlimited'}
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{
                    width: business?.usage_limits?.maxStorage > 0
                      ? `${Math.min(100, (business?.current_usage?.storage_used / business?.usage_limits?.maxStorage) * 100)}%`
                      : '100%'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
