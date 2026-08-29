import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, TrendingUp, Plus, Search, Filter, ArrowRight } from "lucide-react";
// import SalesTable from "../../../components/dashboard/Sales/SalesTable"; // REMOVED
import OrdersTable from "../../../components/dashboard/Orders/OrdersTable"; // ADDED
import orderService from "../../../services/business/orderService";
import { useCurrency } from "../../../utils/currencyUtils";

export default function SalesMain() {
  const { formatPrice } = useCurrency();
  const [stats, setStats] = useState([
    { title: "Total Revenue", value: formatPrice(0), icon: DollarSign, bg: "bg-[#00C49F]" },
    { title: "Total Orders", value: "0", icon: ShoppingBag, bg: "bg-[#4F46E5]" },
    { title: "Avg. Ticket Size", value: formatPrice(0), icon: TrendingUp, bg: "bg-[#F59E0B]" },
  ]);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    orderService.getOrders({ limit: 20, sortBy: "date", sortOrder: "desc" })
      .then(res => {
        const payload = res?.data || res || {};
        const orders = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.orders)
            ? payload.orders
            : Array.isArray(payload.data)
              ? payload.data
              : [];
        
        // Calculate Stats
        const totalRevenue = orders
            .filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
            .reduce((sum, o) => sum + Number(o.total || 0), 0);
        const totalOrders = orders.length;
        const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const currency = (val) => formatPrice(val);

        setStats([
            { title: "Total Revenue", value: currency(totalRevenue), icon: DollarSign, bg: "bg-[#00C49F]" },
            { title: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, bg: "bg-[#4F46E5]" },
            { title: "Avg. Ticket Size", value: currency(avgTicket), icon: TrendingUp, bg: "bg-[#F59E0B]" },
        ]);

        setTransactions(
          orders.slice(0, 5).map((order) => ({
            ...order,
            orderNumber: order.orderNumber || order.id,
            orderDate: order.orderDate || order.date || order.createdAt,
            customer: {
              name: order.customer?.name || order.customerName || "Unknown Customer",
              phone: order.customer?.phone || order.customerPhone || "",
            },
            total: Number(order.total || 0),
            paymentMethod: order.paymentMethod || "cash",
            discountAmount: Number(order.discountAmount ?? order.discount ?? 0),
          }))
        );
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 animate-fade-in">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="rounded-xl p-4 shadow-sm border bg-white border-slate-100 flex flex-col items-start transition-all duration-300 hover:shadow-md">
              <div className={`p-2 rounded-lg text-white ${stat.bg} mb-3`}>
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-[22px] font-medium text-slate-900 tracking-tight leading-none mb-0.5">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-700 mb-1">{stat.title}</p>
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
                    className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
            </div>
            <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors">
                <Filter size={18} />
            </button>
          </div>
        </div>

        <OrdersTable orders={transactions} />
        
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-center">
            <Link to="/dashboard/orders" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                View All Transactions <ArrowRight size={16} />
            </Link>
        </div>
      </div>
    </div>
  );
}
