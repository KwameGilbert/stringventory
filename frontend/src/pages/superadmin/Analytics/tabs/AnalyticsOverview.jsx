import React from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export default function AnalyticsOverview({ data, formatCurrency }) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Revenue" 
          value={formatCurrency(data.kpi.revenue.current)} 
          change={data.kpi.revenue.change}
          icon={DollarSign}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-100"
        />
        <KPICard 
          title="Total Users" 
          value={data.kpi.users.current.toLocaleString()} 
          change={data.kpi.users.change}
          icon={Users}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <KPICard 
          title="Active Businesses" 
          value={data.kpi.activeBusinesses.current} 
          change={data.kpi.activeBusinesses.change}
          icon={Activity}
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
        />
        <KPICard 
          title="Churn Rate" 
          value={`${data.kpi.churnRate.current}%`} 
          change={data.kpi.churnRate.change}
          inverse={true}
          icon={AlertCircle}
          iconColor="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Growth Overview</h2>
              <p className="text-sm text-gray-500">Revenue vs User Growth</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueTrends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Businesses List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performers</h2>
          <div className="space-y-4">
            {data.topBusinesses.slice(0, 5).map((biz, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{biz.name}</p>
                    <p className="text-xs text-gray-500">{biz.plan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(biz.mrr)}/mo</p>
                  <span className="text-xs text-emerald-600 flex items-center justify-end">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {biz.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, icon: Icon, iconColor, bgColor, inverse = false }) {
  const isPositive = change >= 0;
  const isGood = inverse ? !isPositive : isPositive;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <span className={`flex items-center text-sm font-medium ${isGood ? 'text-emerald-600' : 'text-red-600'} bg-gray-50 px-2 py-1 rounded-full`}>
          <TrendingUp className={`w-3 h-3 mr-1 ${isPositive ? '' : 'transform rotate-180'}`} />
          {Math.abs(change)}%
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
