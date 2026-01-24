import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye, RefreshCw, ArrowLeft, Download, Calendar } from "lucide-react";
import axios from "axios";

export default function ViewSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        // Fetch from the new sales.json
        const response = await axios.get("/data/sales.json");
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };

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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        ) : (
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
                {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">
                            {sale.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                            {sale.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {sale.customer}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                            {sale.method}
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                sale.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                                sale.status === 'Refunded' ? 'bg-rose-100 text-rose-700' :
                                'bg-amber-100 text-amber-700'
                            }`}>
                                {sale.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                            {formatCurrency(sale.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <Link 
                                    to={`/dashboard/sales/${sale.id}`}
                                    className="text-gray-400 hover:text-blue-600 transition-colors" 
                                    title="View Details"
                                >
                                    <Eye size={18} />
                                </Link>
                                <Link 
                                    to={`/dashboard/sales/${sale.id}/refund`}
                                    className="text-gray-400 hover:text-rose-600 transition-colors"
                                    title="Process Refund"
                                >
                                    <RefreshCw size={18} />
                                </Link>
                            </div>
                        </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                            No sales transactions found matching your search.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
}
