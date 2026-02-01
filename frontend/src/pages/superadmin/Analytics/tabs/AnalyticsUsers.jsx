import React from 'react';
import { 
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar
} from 'recharts';

export default function AnalyticsUsers({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">User Acquisition</h2>
          <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="new" fill="#10b981" name="New Users" stackId="a" />
                  <Bar dataKey="active" fill="#3b82f6" name="Existing Active" stackId="a" />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold text-gray-900 mb-6">Geographic Distribution</h2>
           <div className="space-y-4">
              {data.geographicDistribution.map((geo, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{geo.country}</span>
                    <span className="text-gray-500">{geo.users} users ({geo.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${geo.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
