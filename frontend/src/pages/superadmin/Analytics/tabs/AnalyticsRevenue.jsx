import React from 'react';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  CreditCard
} from 'lucide-react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis
} from 'recharts';

// Financial KPI Card Component
// eslint-disable-next-line no-unused-vars
function FinancialKPICard({ title, value, change, subtitle, icon: Icon, iconColor, bgColor }) {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'} bg-gray-50 px-2 py-1 rounded-full`}>
            <TrendingUp className={`w-3 h-3 mr-1 ${isPositive ? '' : 'transform rotate-180'}`} />
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

export default function AnalyticsRevenue({ data, formatCurrency }) {
  // Calculate financial metrics
  const monthlyRevenue = data?.kpi?.revenue?.current || 42850;
  const yearlyRevenue = monthlyRevenue * 12;
  const totalUsers = data?.kpi?.users?.current || 1847;
  const arpu = totalUsers > 0 ? monthlyRevenue / totalUsers : 0;
  
  return (
    <div className="space-y-6">
      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialKPICard 
          title="Monthly Revenue" 
          value={formatCurrency(monthlyRevenue)}
          change={12.5}
          subtitle="Current month"
          icon={DollarSign}
          iconColor="text-emerald-600"
          bgColor="bg-emerald-100"
        />
        <FinancialKPICard 
          title="Yearly Revenue (ARR)" 
          value={formatCurrency(yearlyRevenue)}
          change={18.2}
          subtitle="Annualized"
          icon={Calendar}
          iconColor="text-blue-600"
          bgColor="bg-blue-100"
        />
        <FinancialKPICard 
          title="Avg Revenue Per User" 
          value={formatCurrency(arpu)}
          change={5.3}
          subtitle="ARPU this month"
          icon={CreditCard}
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
        />
        <FinancialKPICard 
          title="Revenue Growth Rate" 
          value="+24.8%"
          change={24.8}
          subtitle="Month over month"
          icon={TrendingUp}
          iconColor="text-amber-600"
          bgColor="bg-amber-100"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue by Subscription Plan</h2>
            <p className="text-sm text-gray-500">Breakdown by plan tier</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                  <Pie
                    data={data.revenueByPlan}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="revenue"
                    nameKey="plan"
                  >
                    {data.revenueByPlan.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
               </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold text-gray-900 mb-6">MRR vs ARR</h2>
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data.revenueTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="mrr" fill="#8b5cf6" name="Monthly Recurring Rev" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
