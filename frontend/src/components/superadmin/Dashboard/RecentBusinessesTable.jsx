import { Link } from 'react-router-dom';
import { Eye, Edit, MoreVertical } from 'lucide-react';
import PlanBadge from '../../shared/PlanBadge';
import StatusBadge from '../../shared/StatusBadge';

export default function RecentBusinessesTable({ businesses = [] }) {
  // Ensure businesses is always an array
  const businessList = Array.isArray(businesses) ? businesses : [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Businesses</h2>
          <Link 
            to="/superadmin/businesses"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Users
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MRR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {businessList.map((business) => (
              <tr key={business.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {business.logo_url ? (
                      <img 
                        src={business.logo_url} 
                        alt={business.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-emerald-200 flex items-center justify-center">
                        <span className="text-emerald-600 font-semibold">
                          {business.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{business.name}</p>
                      <p className="text-xs text-gray-500">{business.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PlanBadge plan={business.subscription_plan} size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={business.status} type="business" size="sm" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {business.current_usage?.total_users || 0}/{business.usage_limits?.maxUsers || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(business.mrr || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(business.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/superadmin/businesses/${business.id}`}
                      className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/superadmin/businesses/${business.id}/edit`}
                      className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                      title="More Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {businessList.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No businesses yet</p>
        </div>
      )}
    </div>
  );
}
