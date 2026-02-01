import React from 'react';
import { 
  Server,
  Clock,
  AlertCircle,
  Database
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function AnalyticsSystem({ data }) {
  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SystemMetricCard title="Uptime" value={data.systemHealth.uptime} icon={Server} color="text-emerald-600" />
          <SystemMetricCard title="Avg Latency" value={data.systemHealth.apiLatency} icon={Clock} color="text-blue-600" />
          <SystemMetricCard title="Error Rate" value={data.systemHealth.errorRate} icon={AlertCircle} color="text-red-600" />
          <SystemMetricCard title="DB Load" value={data.systemHealth.databaseLoad} icon={Database} color="text-amber-600" />
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">System Performance History</h2>
          <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.systemHealth.history}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="time" />
                   <YAxis />
                   <Tooltip />
                   <Legend />
                   <Line type="monotone" dataKey="latency" stroke="#3b82f6" name="Latency (ms)" strokeWidth={2} />
                   <Line type="monotone" dataKey="load" stroke="#f59e0b" name="Load (%)" strokeWidth={2} />
                </LineChart>
             </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
}

function SystemMetricCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-lg">
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
