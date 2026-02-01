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
import axios from 'axios';

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

  // Mock revenue data for chart
  const revenueData = [
    { month: 'Jan', revenue: 28500, subscriptions: 218 },
    { month: 'Feb', revenue: 31200, subscriptions: 235 },
    { month: 'Mar', revenue: 33800, subscriptions: 248 },
    { month: 'Apr', revenue: 35600, subscriptions: 257 },
    { month: 'May', revenue: 37200, subscriptions: 272 },
    { month: 'Jun', revenue: 42850, subscriptions: 284 }
  ];

  // Mock plan distribution
  const planDistribution = [
    { plan: 'Enterprise', count: 23, percentage: 8.1, revenue: 11477, color: 'bg-purple-500' },
    { plan: 'Professional', count: 89, percentage: 31.3, revenue: 13261, color: 'bg-blue-500' },
    { plan: 'Starter', count: 142, percentage: 50.0, revenue: 6958, color: 'bg-emerald-500' },
    { plan: 'Free Trial', count: 30, percentage: 10.6, revenue: 0, color: 'bg-gray-400' }
  ];

  // Mock recent activity
  const recentActivity = [
    { id: 1, type: 'signup', business: 'TechStart Solutions', time: '5 minutes ago', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { id: 2, type: 'upgrade', business: 'Acme Innovations', plan: 'Enterprise', time: '12 minutes ago', icon: ArrowUp, color: 'text-blue-600 bg-blue-50' },
    { id: 3, type: 'payment', business: 'Global Retail Co.', amount: 499, time: '23 minutes ago', icon: DollarSign, color: 'text-purple-600 bg-purple-50' },
    { id: 4, type: 'signup', business: 'Digital Ventures', time: '1 hour ago', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { id: 5, type: 'cancellation', business: 'OldBiz Corp', time: '2 hours ago', icon: ArrowDown, color: 'text-red-600 bg-red-50' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, businessesRes] = await Promise.all([
        axios.get('/data/platform-stats.json'),
        axios.get('/data/businesses.json')
      ]);

      setStats(statsRes.data);
      setRecentBusinesses(businessesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data if files don't exist yet
      setStats({
        totalBusinesses: 284,
        activeSubscriptions: 267,
        monthlyRecurringRevenue: 42850,
        totalUsers: 1847,
        businessesChange: 12,
        subscriptionsChange: 8,
        mrrChange: 15,
        usersChange: 9
      });

      // Mock businesses data
      setRecentBusinesses([
        {
          id: '1',
          name: 'Acme Innovations Inc.',
          email: 'contact@acme.com',
          subscription_plan: 'professional',
          status: 'active',
          current_usage: { total_users: 8 },
          usage_limits: { maxUsers: 15 },
          mrr: 149,
          created_at: '2023-10-26',
          logo_url: null
        },
        {
          id: '2',
          name: 'TechStart Solutions',
          email: 'hello@techstart.com',
          subscription_plan: 'starter',
          status: 'active',
          current_usage: { total_users: 3 },
          usage_limits: { maxUsers: 5 },
          mrr: 49,
          created_at: '2023-10-25',
          logo_url: null
        },
        {
          id: '3',
          name: 'Global Retail Co.',
          email: 'admin@globalretail.com',
          subscription_plan: 'enterprise',
          status: 'active',
          current_usage: { total_users: 25 },
          usage_limits: { maxUsers: -1 },
          mrr: 499,
          created_at: '2023-10-24',
          logo_url: null
        },
        {
          id: '4',
          name: 'SmallBiz Store',
          email: 'owner@smallbiz.com',
          subscription_plan: 'starter',
          status: 'trial',
          current_usage: { total_users: 1 },
          usage_limits: { maxUsers: 5 },
          mrr: 0,
          created_at: '2023-10-23',
          logo_url: null
        },
        {
          id: '5',
          name: 'Enterprise Corp',
          email: 'it@enterprise.com',
          subscription_plan: 'professional',
          status: 'active',
          current_usage: { total_users: 12 },
          usage_limits: { maxUsers: 15 },
          mrr: 149,
          created_at: '2023-10-22',
          logo_url: null
        }
      ]);
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
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

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
          color="purple"
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
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
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
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500 rounded-lg"
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
            <Activity className="w-5 h-5 text-purple-600" />
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
