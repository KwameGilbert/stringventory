import React from 'react';
import {
  Users,
  CreditCard,
  Package,
  Shield,
  FileText,
  Activity
} from 'lucide-react';

export default function BusinessActivity({ activityLogs }) {
  const formatDateTime = (dateString) => {
     if (!dateString) return 'N/A';
     return new Date(dateString).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Audit Log</h2>
        </div>
        <div className="divide-y divide-gray-200">
            {activityLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors flex gap-4">
                    <div className="mt-1">
                        {log.type === 'user' && <Users className="w-5 h-5 text-blue-500" />}
                        {log.type === 'subscription' && <CreditCard className="w-5 h-5 text-purple-500" />}
                        {log.type === 'product' && <Package className="w-5 h-5 text-emerald-500" />}
                        {log.type === 'security' && <Shield className="w-5 h-5 text-red-500" />}
                        {log.type === 'billing' && <FileText className="w-5 h-5 text-gray-500" />}
                        {log.type === 'settings' && <Activity className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{log.action}</p>
                        <p className="text-sm text-gray-600">{log.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDateTime(log.timestamp)}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
