import { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import AnalyticsOverview from './tabs/AnalyticsOverview';
import AnalyticsRevenue from './tabs/AnalyticsRevenue';
import AnalyticsUsers from './tabs/AnalyticsUsers';
import AnalyticsSystem from './tabs/AnalyticsSystem';
import superadminService from '../../../services/platform/superadminService';
import { showError } from '../../../utils/alerts';
import { useCurrency } from '../../../utils/currencyUtils';
import { extractAnalytics } from '../../../models/analytics';

// ─── Mock Analytics Data ───────────────────────────────────────────────────
const MOCK_ANALYTICS_DATA = {
  kpi: {
    revenue: {
      current: 42850.50,
      change: 15.4,
    },
    users: {
      current: 1847,
      change: 23.5,
    },
    activeBusinesses: {
      current: 185,
      change: 12.3,
    },
    churnRate: {
      current: 2.4,
      change: -0.5,
    },
  },
  revenueTrends: [
    { date: 'Jan', revenue: 28000, mrr: 27500 },
    { date: 'Feb', revenue: 31200, mrr: 30800 },
    { date: 'Mar', revenue: 35800, mrr: 35200 },
    { date: 'Apr', revenue: 39500, mrr: 38900 },
    { date: 'May', revenue: 42850, mrr: 42200 },
  ],
  topBusinesses: [
    { id: '1', name: 'Global Tech Solutions', revenue: 2500, growth: 18 },
    { id: '2', name: 'Riverside Retail Group', revenue: 2100, growth: 12 },
    { id: '3', name: 'Summit Logistics Inc', revenue: 1850, growth: 25 },
    { id: '4', name: 'Urban Fashion Boutiques', revenue: 1650, growth: 8 },
    { id: '5', name: 'EcoGreen Supplies', revenue: 1420, growth: 31 },
  ],
  revenueByPlan: [
    { plan: 'Starter', revenue: 4455, fill: '#10b981' },
    { plan: 'Professional', revenue: 21500, fill: '#3b82f6' },
    { plan: 'Enterprise', revenue: 16895, fill: '#f59e0b' },
  ],
  userGrowth: [
    { date: 'Week 1', new: 120, active: 890 },
    { date: 'Week 2', new: 145, active: 920 },
    { date: 'Week 3', new: 178, active: 980 },
    { date: 'Week 4', new: 154, active: 1015 },
  ],
  geographicDistribution: [
    { country: 'United States', users: 756, percentage: 41 },
    { country: 'Canada', users: 387, percentage: 21 },
    { country: 'Ghana', users: 294, percentage: 16 },
    { country: 'Nigeria', users: 184, percentage: 10 },
    { country: 'Other', users: 226, percentage: 12 },
  ],
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
  const [responseCurrency, setResponseCurrency] = useState("USD");

  const { formatPrice } = useCurrency();
  const formatCurrency = (val) => formatPrice(val, responseCurrency);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getPlatformAnalytics({ timeRange });
      const analytics = extractAnalytics(response);
      
      const currency = response?.currency || response?.data?.currency || "USD";
      setResponseCurrency(currency);
      
      setData(normalizeAnalyticsData(analytics));
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use mock data as fallback
      console.log('Using mock analytics data');
      setData(normalizeAnalyticsData(MOCK_ANALYTICS_DATA));
      showError('Using demo data - API currently unavailable');
    } finally {
      setLoading(false);
    }
  };

  // Local helper removed

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading analytics...</p>
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
        <div className="flex items-center gap-3 flex-wrap">
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
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
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
