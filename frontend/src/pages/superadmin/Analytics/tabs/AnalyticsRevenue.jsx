import React from 'react';
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

export default function AnalyticsRevenue({ data, formatCurrency }) {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Breakdown</h2>
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
