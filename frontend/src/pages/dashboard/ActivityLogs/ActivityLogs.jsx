import React from 'react';
import { Activity } from 'lucide-react';
import ActivityLogsDashboard from '../../../components/dashboard/Dashboard/ActivityLogsDashboard';

/**
 * Activity Logs Page
 * Displays comprehensive user activity logs with filtering, pagination, and real-time stats
 * Feature: Enterprise tier only
 */
export default function ActivityLogs() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Activity size={28} className="text-emerald-600" />
            </div>
            Activity Logs
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor all user activities and system actions in real-time
          </p>
        </div>
      </div>

      {/* Activity Logs Dashboard */}
      <ActivityLogsDashboard />
    </div>
  );
}
