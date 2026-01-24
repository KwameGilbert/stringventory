import { useState } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingCart, TrendingUp, Plus, Search, Filter, Eye, ArrowRight, RefreshCw } from "lucide-react";

export default function SalesMain() {
  // Mock Data for KPI
  const stats = [
    { title: "Today's Sales", value: "GHS 2,450.00", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Today's Orders", value: "14", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Avg. Ticket Size", value: "GHS 175.00", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  // Mock Data for Transactions
  const [transactions] = useState([
    { id: "TRX-001", date: "2024-03-20 14:30", customer: "Walk-in Customer", amount: 150.00, method: "Cash", status: "Completed" },
    { id: "TRX-002", date: "2024-03-20 13:15", customer: "John Doe", amount: 450.50, method: "Mobile Money", status: "Completed" },
    { id: "TRX-003", date: "2024-03-20 11:00", customer: "Sarah Smith", amount: 85.00, method: "Card", status: "Completed" },
    { id: "TRX-004", date: "2024-03-20 10:45", customer: "Walk-in Customer", amount: 25.00, method: "Cash", status: "Completed" },
    { id: "TRX-005", date: "2024-03-20 09:30", customer: "Kwame Osei", amount: 1200.00, method: "Bank Transfer", status: "Pending" },
  ]);

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Overview</h1>
          <p className="text-gray-500 mt-1">Monitor daily sales performance and history</p>
        </div>
        
        <Link
          to="/dashboard/sales/pos"
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 font-medium"
        >
          <Plus size={18} />
          New Sale (POS)
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="font-bold text-gray-900 text-lg">Recent Transactions</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search ID..." 
                    className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 text-left">Transaction ID</th>
                <th className="px-6 py-4 text-left">Date & Time</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Method</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">
                    {trx.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {trx.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {trx.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {trx.method}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        trx.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                        {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                    GHS {trx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Link 
                            to={`/dashboard/sales/${trx.id}`}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="View Details"
                        >
                            <Eye size={18} />
                        </Link>
                        <Link 
                            to={`/dashboard/sales/${trx.id}/refund`}
                            className="text-gray-400 hover:text-rose-600 transition-colors"
                            title="Process Refund"
                        >
                            <RefreshCw size={18} />
                        </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-center">
            <Link to="/dashboard/sales/history" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All Transactions <ArrowRight size={16} />
            </Link>
        </div>
      </div>
    </div>
  );
}
