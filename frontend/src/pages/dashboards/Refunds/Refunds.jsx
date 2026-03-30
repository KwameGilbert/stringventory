import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";
import refundService from "../../../services/refundService";
import { showError } from "../../../utils/alerts";
import RefundsTable from "../../../components/admin/Refunds/RefundsTable";
import { useCurrency } from "../../../utils/currencyUtils";

const extractRefunds = (response) => {
  const payload = response?.data || response || {};
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function Refunds() {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [responseCurrency, setResponseCurrency] = useState("GHS");

  const { formatPrice } = useCurrency();
  const formatCurrency = (val) => formatPrice(val, responseCurrency);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await refundService.getRefunds();
      const currency = response?.currency || response?.data?.currency || "GHS";
      setResponseCurrency(currency);
      setRefunds(extractRefunds(response).map(r => ({ ...r, currency })));
    } catch (error) {
      console.error("Error loading refunds", error);
      showError(error?.message || "Failed to load refunds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRefunds = refunds.filter((refund) => {
    if (!statusFilter) return true;
    return refund.refundStatus === statusFilter;
  });

  // Stats
  const stats = {
    total: refunds.length,
    pending: refunds.filter(r => r.refundStatus === 'pending').length,
    completed: refunds.filter(r => r.refundStatus === 'completed').length,
    totalAmount: refunds.filter(r => r.refundStatus === 'completed').reduce((sum, r) => sum + Number(r.refundAmount || 0), 0)
  };

  // Local helper removed

  if (loading) {
     return (
        <div className="animate-fade-in space-y-6">
            <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
     );
  }

  return (
    <div className="pb-8 animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Refund Management</h1>
          <p className="text-gray-500 text-sm">Monitor and approve customer refund requests</p>
        </div>
        <div className="flex items-center gap-2">
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
            >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
            </select>
            <button 
                onClick={fetchData}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                title="Refresh"
            >
                <RefreshCw size={20} className="text-gray-500" />
            </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-50">
              <DollarSign className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Refunded</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      <RefundsTable refunds={filteredRefunds} />
    </div>
  );
}
