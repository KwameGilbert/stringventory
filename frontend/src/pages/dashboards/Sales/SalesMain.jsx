import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, TrendingUp, Plus, Search, Filter, ArrowRight } from "lucide-react";
// import SalesTable from "../../../components/admin/Sales/SalesTable"; // REMOVED
import OrdersTable from "../../../components/admin/Orders/OrdersTable"; // ADDED
import axios from "axios";

export default function SalesMain() {
  const [stats, setStats] = useState([
    { title: "Total Revenue", value: "GHS 0.00", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Total Orders", value: "0", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Avg. Ticket Size", value: "GHS 0.00", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ]);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch orders data instead of sales
    axios.get("/data/orders.json")
      .then(res => {
        const orders = res.data;
        
        // Calculate Stats
        const totalRevenue = orders
            .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
            .reduce((sum, o) => sum + o.total, 0);
        const totalOrders = orders.length;
        const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const formatCurrency = (val) => new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(val);

        setStats([
            { title: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
            { title: "Total Sales", value: totalOrders.toString(), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
            { title: "Avg. Ticket Size", value: formatCurrency(avgTicket), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        ]);

        // Use raw orders data for OrdersTable (it handles structure correctly)
        // Just slice the most recent 5
        setTransactions(orders.slice(0, 5));
      })
      .catch(err => console.error("Error loading orders:", err));
  }, []);

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Overview</h1>
          <p className="text-gray-500 mt-1">Monitor daily sales performance and history</p>
        </div>
        
        <Link
          to="/dashboard/orders/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 font-medium"
        >
          <Plus size={18} />
          New Sale
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

        <OrdersTable orders={transactions} />
        
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-center">
            <Link to="/dashboard/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All Transactions <ArrowRight size={16} />
            </Link>
        </div>
      </div>
    </div>
  );
}
