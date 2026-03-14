import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowLeft, Download, Calendar } from "lucide-react";
import SalesTable from "../../../components/admin/Sales/SalesTable";
import orderService from "../../../services/orderService";

export default function ViewSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await orderService.getOrders({ limit: 200, sortBy: "date", sortOrder: "desc" });
        const payload = response?.data || response || {};
        const orders = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.orders)
            ? payload.orders
            : Array.isArray(payload.data)
              ? payload.data
              : [];

        const toStatusLabel = (statusValue) => {
          const value = String(statusValue || "pending").toLowerCase();
          if (value === "fulfilled" || value === "completed") return "Completed";
          if (value === "refunded") return "Refunded";
          if (value === "cancelled") return "Cancelled";
          return "Pending";
        };

        setSales(
          orders.map((order) => ({
            id: order.id,
            date: order.orderDate || order.date || order.createdAt || "—",
            customer: order.customer?.name || order.customerName || "Walk-in Customer",
            method: String(order.paymentMethod || "cash").replace(/_/g, " "),
            status: toStatusLabel(order.status),
            amount: Number(order.total || 0),
          }))
        );
      } catch (error) {
        console.error("Error fetching sales:", error);
        setSales([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
        sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || sale.status === filterStatus;
    return matchesSearch && matchesStatus;
  });



  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <Link to="/dashboard/sales" className="text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowLeft size={20} />
             </Link>
             <h1 className="text-2xl font-bold text-gray-900">Sales History</h1>
           </div>
          <p className="text-gray-500 ml-7">View and manage all POS transactions</p>
        </div>
        
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                <Download size={18} />
                Export
            </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
                type="text" 
                placeholder="Search Transaction ID or Customer..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select 
                    className="pl-9 pr-8 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white appearance-none cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Refunded">Refunded</option>
                </select>
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                <Calendar size={18} />
            </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <SalesTable sales={filteredSales} />
      )}
    </div>
  );
}
