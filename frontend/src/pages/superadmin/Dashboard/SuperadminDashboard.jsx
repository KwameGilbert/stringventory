import { useState, useEffect } from 'react';
import { 
  Building2, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import KPICard from '../../../components/superadmin/Dashboard/KPICard';
import RecentBusinessesTable from '../../../components/superadmin/Dashboard/RecentBusinessesTable';
import superadminService from '../../../services/superadminService';
import { showError } from '../../../utils/alerts';

const extractBusinesses = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.businesses)) return payload.businesses;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.businesses)) return payload.data.businesses;

  return [];
};

const extractAnalytics = (response) => {
  const payload = response?.data || response || {};

  if (payload?.analytics) return payload.analytics;
  if (payload?.data?.analytics) return payload.data.analytics;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;

  return payload;
};

const normalizeBusiness = (business) => ({
  ...business,
  id: business?.id,
  name: business?.name || business?.businessName || 'Unnamed Business',
  email: business?.email || business?.ownerEmail || '',
  subscription_plan: business?.subscription_plan || business?.subscriptionPlan || business?.plan || 'starter',
  status: String(business?.status || 'active').toLowerCase(),
  current_usage: {
    total_users:
      Number(business?.current_usage?.total_users) ||
      Number(business?.currentUsage?.totalUsers) ||
      Number(business?.totalUsers) ||
      0,
  },
  usage_limits: {
    maxUsers:
      Number(business?.usage_limits?.maxUsers) ||
      Number(business?.usageLimits?.maxUsers) ||
      Number(business?.planLimits?.maxUsers) ||
      0,
  },
  mrr:
    Number(business?.mrr) ||
    Number(business?.monthlyRecurringRevenue) ||
    Number(business?.revenue?.mrr) ||
    0,
  created_at: business?.created_at || business?.createdAt || new Date().toISOString(),
  logo_url: business?.logo_url || business?.logoUrl || null,
});

export default function SuperadminDashboard() {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeSubscriptions: 0,
    monthlyRecurringRevenue: 0,
    totalUsers: 0,
    businessesChange:  0,
    subscriptionsChange: 0,
    mrrChange: 0,
    usersChange: 0
  });

  const [recentBusinesses, setRecentBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [planDistribution, setPlanDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, businessesRes] = await Promise.all([
        superadminService.getPlatformAnalytics(),
        superadminService.getBusinesses(),
      ]);

      const analytics = extractAnalytics(analyticsRes);
      const businesses = extractBusinesses(businessesRes).map(normalizeBusiness);

      const computedMRR = businesses.reduce((sum, business) => sum + (Number(business.mrr) || 0), 0);
      const totalUsers = businesses.reduce((sum, business) => sum + (Number(business.current_usage?.total_users) || 0), 0);
      const activeSubscriptions = businesses.filter((business) => business.status === 'active').length;

      setStats({
        totalBusinesses: Number(analytics?.totalBusinesses) || businesses.length,
        activeSubscriptions: Number(analytics?.activeSubscriptions) || activeSubscriptions,
        monthlyRecurringRevenue: Number(analytics?.monthlyRecurringRevenue) || computedMRR,
        totalUsers: Number(analytics?.totalUsers) || totalUsers,
        businessesChange: Number(analytics?.businessesChange) || 0,
        subscriptionsChange: Number(analytics?.subscriptionsChange) || 0,
        mrrChange: Number(analytics?.mrrChange) || 0,
        usersChange: Number(analytics?.usersChange) || 0,
      });

      const trendSource = Array.isArray(analytics?.revenueTrends) ? analytics.revenueTrends : [];
      setRevenueData(
        trendSource.map((entry) => ({
          month: entry?.month || entry?.date || 'N/A',
          revenue: Number(entry?.revenue) || Number(entry?.mrr) || 0,
          subscriptions: Number(entry?.subscriptions) || 0,
        }))
      );

      const rawPlanDistribution = Array.isArray(analytics?.planDistribution)
        ? analytics.planDistribution
        : Array.isArray(analytics?.revenueByPlan)
          ? analytics.revenueByPlan
          : [];

      const totalPlanCount = rawPlanDistribution.reduce(
        (acc, item) => acc + (Number(item?.count) || Number(item?.businesses) || 0),
        0
      );

      setPlanDistribution(
        rawPlanDistribution.map((item, index) => {
          const count = Number(item?.count) || Number(item?.businesses) || 0;
          const percentage = Number(item?.percentage) || (totalPlanCount ? Number(((count / totalPlanCount) * 100).toFixed(1)) : 0);
          return {
            plan: item?.plan || item?.name || 'Unknown',
            count,
            percentage,
            revenue: Number(item?.revenue) || 0,
            color: item?.color || ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-gray-400'][index % 4],
          };
        })
      );

      const activitySource = Array.isArray(analytics?.recentActivity) ? analytics.recentActivity : [];
      setRecentActivity(
        activitySource.map((item, index) => ({
          id: item?.id || index + 1,
          type: item?.type || 'signup',
          business: item?.business || item?.businessName || 'Business',
          plan: item?.plan,
          amount: Number(item?.amount) || 0,
          time: item?.time || item?.createdAt || item?.timestamp || 'Recently',
          icon:
            item?.type === 'upgrade'
              ? ArrowUp
              : item?.type === 'payment'
                ? DollarSign
                : item?.type === 'cancellation'
                  ? ArrowDown
                  : Users,
          color:
            item?.type === 'upgrade'
              ? 'text-blue-600 bg-blue-50'
              : item?.type === 'payment'
                ? 'text-emerald-600 bg-emerald-50'
                : item?.type === 'cancellation'
                  ? 'text-red-600 bg-red-50'
                  : 'text-emerald-600 bg-emerald-50',
        }))
      );

      setRecentBusinesses(businesses.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showError(error?.message || 'Failed to load platform dashboard');
      setStats({
        totalBusinesses: 0,
        activeSubscriptions: 0,
        monthlyRecurringRevenue: 0,
        totalUsers: 0,
        businessesChange: 0,
        subscriptionsChange: 0,
        mrrChange: 0,
        usersChange: 0,
      });
      setRecentBusinesses([]);
      setRevenueData([]);
      setPlanDistribution([]);
      setRecentActivity([]);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Dashboard</h1>
        <p className="text-gray-600">Monitor and manage your SaaS platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Businesses"
          value={(stats?.totalBusinesses || 0).toLocaleString()}
          change={stats?.businessesChange || 0}
          changeType="positive"
          icon={Building2}
          color="emerald "
          subtitle="Active accounts"
        />
        <KPICard
          title="Active Subscriptions"
          value={(stats?.activeSubscriptions || 0).toLocaleString()}
          change={stats?.subscriptionsChange || 0}
          changeType="positive"
          icon={CreditCard}
          color="emerald"
          subtitle="Paying customers"
        />
        <KPICard
          title="Monthly Recurring Revenue"
          value={formatCurrency(stats?.monthlyRecurringRevenue || 0)}
          change={stats?.mrrChange || 0}
          changeType="positive"
          icon={DollarSign}
          color="blue"
          subtitle={`+$${(((stats?.mrrChange || 0) / 100) * (stats?.monthlyRecurringRevenue || 0)).toFixed(0)} this month`}
        />
        <KPICard
          title="Total Users"
          value={(stats?.totalUsers || 0).toLocaleString()}
          change={stats?.usersChange || 0}
          changeType="positive"
          icon={Users}
          color="amber"
          subtitle="Across all businesses"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {revenueData.map((data, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 w-12">{data.month}</span>
                  <span className="text-gray-600 text-xs">{formatCurrency(data.revenue)}</span>
                </div>
                <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-700 to-emerald-600 transition-all duration-500 rounded-lg"
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Subscription Distribution</h2>
          
          <div className="space-y-4">
            {planDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.plan}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{item.count} businesses</p>
                    <p className="text-xs text-gray-500">{formatCurrency(item.revenue)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Revenue</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(planDistribution.reduce((acc, item) => acc + item.revenue, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Businesses Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.business}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.type === 'signup' && 'New signup'}
                      {activity.type === 'upgrade' && `Upgraded to ${activity.plan}`}
                      {activity.type === 'payment' && `Payment: ${formatCurrency(activity.amount)}`}
                      {activity.type === 'cancellation' && 'Cancelled subscription'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Businesses - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentBusinessesTable businesses={recentBusinesses} />
        </div>
      </div>
    </div>
  );
}
