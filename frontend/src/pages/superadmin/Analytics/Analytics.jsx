import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import AnalyticsOverview from './tabs/AnalyticsOverview';
import AnalyticsRevenue from './tabs/AnalyticsRevenue';
import AnalyticsUsers from './tabs/AnalyticsUsers';
import AnalyticsSystem from './tabs/AnalyticsSystem';
import superadminService from '../../../services/superadminService';
import { showError } from '../../../utils/alerts';

const extractAnalytics = (response) => {
  const payload = response?.data || response || {};

  if (payload?.analytics) return payload.analytics;
  if (payload?.data?.analytics) return payload.data.analytics;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;

  return payload;
};

const normalizeAnalyticsData = (raw) => {
  const kpiSource = raw?.kpi || {};
  const revenue = kpiSource?.revenue || {};
  const users = kpiSource?.users || {};
  const activeBusinesses = kpiSource?.activeBusinesses || {};
  const churnRate = kpiSource?.churnRate || {};

  const revenueByPlanSource = Array.isArray(raw?.revenueByPlan) ? raw.revenueByPlan : [];

  return {
    kpi: {
      revenue: {
        current: Number(revenue?.current) || Number(raw?.monthlyRecurringRevenue) || 0,
        change: Number(revenue?.change) || Number(raw?.mrrChange) || 0,
      },
      users: {
        current: Number(users?.current) || Number(raw?.totalUsers) || 0,
        change: Number(users?.change) || Number(raw?.usersChange) || 0,
      },
      activeBusinesses: {
        current: Number(activeBusinesses?.current) || Number(raw?.activeSubscriptions) || 0,
        change: Number(activeBusinesses?.change) || Number(raw?.subscriptionsChange) || 0,
      },
      churnRate: {
        current: Number(churnRate?.current) || Number(raw?.churnRate) || 0,
        change: Number(churnRate?.change) || 0,
      },
    },
    revenueTrends: (Array.isArray(raw?.revenueTrends) ? raw.revenueTrends : []).map((entry) => ({
      ...entry,
      date: entry?.date || entry?.month || 'N/A',
      revenue: Number(entry?.revenue) || Number(entry?.mrr) || 0,
      mrr: Number(entry?.mrr) || Number(entry?.revenue) || 0,
    })),
    topBusinesses: Array.isArray(raw?.topBusinesses) ? raw.topBusinesses : [],
    revenueByPlan: revenueByPlanSource.map((entry, index) => ({
      ...entry,
      plan: entry?.plan || entry?.name || 'Unknown',
      revenue: Number(entry?.revenue) || 0,
      fill: entry?.fill || ['#10b981', '#3b82f6', '#f59e0b', '#6b7280'][index % 4],
    })),
    userGrowth: Array.isArray(raw?.userGrowth) ? raw.userGrowth : [],
    geographicDistribution: Array.isArray(raw?.geographicDistribution) ? raw.geographicDistribution : [],
  };
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getPlatformAnalytics({ timeRange });
      const analytics = extractAnalytics(response);
      setData(normalizeAnalyticsData(analytics));
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showError(error?.message || 'Failed to load analytics');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading || !data) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Platform performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 3 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['overview', 'revenue', 'users' /* , 'system' */].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors
                ${activeTab === tab 
                  ? 'border-emerald-600 text-emerald-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-125">
        {activeTab === 'overview' && <AnalyticsOverview data={data} formatCurrency={formatCurrency} />}
        {activeTab === 'revenue' && <AnalyticsRevenue data={data} formatCurrency={formatCurrency} />}
        {activeTab === 'users' && <AnalyticsUsers data={data} />}
        {/* {activeTab === 'system' && <AnalyticsSystem data={data} />} */}
      </div>
    </div>
  );
}
