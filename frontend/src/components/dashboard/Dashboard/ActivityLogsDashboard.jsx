import React, { useState, useEffect } from 'react';
import {
  Activity,
  Settings,
  Package,
  ShoppingCart,
  User,
  LogIn,
  AlertCircle,
  ChevronDown,
  Calendar,
  Search,
  Loader,
} from 'lucide-react';
import analyticsService from '../../../services/business/analyticsService';

/**
 * Enhanced Activity Logs Dashboard Component
 * Displays user activity logs with real-time stats, filtering, pagination, and severity levels
 */
export default function ActivityLogsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    summary: {
      activeUsers: 0,
      totalActions: 0,
      mostActiveUser: {},
    },
    logs: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
    },
  });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    module: '',
    severity: '',
    userId: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch activity logs
  useEffect(() => {
    fetchActivityLogs();
  }, [filters.page, filters.limit, filters.module, filters.severity, filters.userId, filters.startDate, filters.endDate, filters.search]);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.module && { module: filters.module }),
        ...(filters.severity && { severity: filters.severity }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await analyticsService.getActivityLogs(params);
      if (response?.status === 'success') {
        setData(response.data);
      } else {
        throw new Error(response?.message || 'Failed to fetch activity logs');
      }
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError(err.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim(),
      page: 1,
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      module: '',
      severity: '',
      userId: '',
      startDate: '',
      endDate: '',
      search: '',
    });
    setSearchInput('');
  };

  const getModuleIcon = (module) => {
    switch (module?.toLowerCase()) {
      case 'inventory':
        return <Package size={16} className="text-emerald-600" />;
      case 'sales':
        return <ShoppingCart size={16} className="text-emerald-600" />;
      case 'expenses':
        return <ShoppingCart size={16} className="text-red-600" />;
      case 'security':
        return <AlertCircle size={16} className="text-amber-600" />;
      case 'procurement':
        return <Package size={16} className="text-blue-600" />;
      case 'settings':
        return <Settings size={16} className="text-indigo-600" />;
      case 'system':
        return <Activity size={16} className="text-slate-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getModuleColor = (module) => {
    switch (module?.toLowerCase()) {
      case 'inventory':
        return 'bg-emerald-50 border-emerald-100';
      case 'sales':
        return 'bg-emerald-50 border-emerald-100';
      case 'expenses':
        return 'bg-red-50 border-red-100';
      case 'security':
        return 'bg-red-50 border-red-100';
      case 'procurement':
        return 'bg-blue-50 border-blue-100';
      case 'settings':
        return 'bg-blue-50 border-blue-100';
      case 'system':
        return 'bg-gray-50 border-gray-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return (
          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
            Warning
          </span>
        );
      case 'info':
      default:
        return (
          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
            Info
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const handlePagination = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Active Users</p>
          <p className="text-3xl font-medium text-gray-900 mt-2">{data.summary.activeUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Total Actions</p>
          <p className="text-3xl font-medium text-gray-900 mt-2">{data.summary.totalActions.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">Most Active User</p>
          <div className="mt-2">
            <p className="font-medium text-gray-900">{data.summary.mostActiveUser?.name || 'N/A'}</p>
            <p className="text-xs text-gray-600 mt-1">
              {data.summary.mostActiveUser?.actionCount} actions • {data.summary.mostActiveUser?.primaryModule}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings size={16} />
            Filters
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Module Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Module</label>
              <select
                value={filters.module}
                onChange={(e) => handleFilterChange('module', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Modules</option>
                <option value="Inventory">Inventory</option>
                <option value="Sales">Sales</option>
                <option value="Expenses">Expenses</option>
                <option value="Procurement">Procurement</option>
                <option value="Security">Security</option>
                <option value="Settings">Settings</option>
                <option value="System">System</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Severity</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Activity size={18} className="text-emerald-600" />
              Activity Logs
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Showing {data.logs.length} of {data.pagination.total} total actions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="text-emerald-600 animate-spin" />
            <span className="ml-2 text-gray-600">Loading activity logs...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-red-50 border-t border-red-200">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <div>
                <p className="font-medium">Error loading logs</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Logs List */}
        {!loading && !error && data.logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(log.time)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <User size={14} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{log.user.name}</p>
                          <p className="text-xs text-gray-500">{log.user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getModuleColor(log.module)}`}>
                        {getModuleIcon(log.module)}
                        <span className="text-xs font-medium text-gray-700">{log.module}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">{getSeverityBadge(log.severity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && data.logs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Activity size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-medium">No activity logs found</p>
            <p className="text-xs mt-1">Try adjusting your filters or date range</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && data.logs.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {data.pagination.page} of {Math.ceil(data.pagination.total / data.pagination.limit)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePagination(data.pagination.page - 1)}
                disabled={data.pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handlePagination(data.pagination.page + 1)}
                disabled={data.pagination.page >= Math.ceil(data.pagination.total / data.pagination.limit)}
                className="px-3 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
