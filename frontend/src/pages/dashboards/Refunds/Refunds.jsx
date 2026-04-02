import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, DollarSign, Clock, CheckCircle, AlertCircle, FileText, Download } from "lucide-react";
import refundService from "../../../services/refundService";
import { showError } from "../../../utils/alerts";
import RefundsTable from "../../../components/admin/Refunds/RefundsTable";
import { useCurrency } from "../../../utils/currencyUtils";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";

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

  // Calculate Stats - Moved up for early availability to handlers
  const stats = {
    total: refunds.length,
    pending: refunds.filter(r => (r.refundStatus || "").toLowerCase() === 'pending').length,
    completed: refunds.filter(r => (r.refundStatus || "").toLowerCase() === 'completed').length,
    totalAmount: refunds.filter(r => (r.refundStatus || "").toLowerCase() === 'completed').reduce((sum, r) => sum + Number(r.refundAmount || 0), 0)
  };

  const handleExportExcel = () => {
    if (filteredRefunds.length === 0) return;

    try {
      const dataToExport = filteredRefunds.map((r) => ({
        ID: r.id || "—",
        Date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB") : "—",
        Order: r.order?.orderNumber || r.orderId || "—",
        Customer: r.customer?.firstName ? `${r.customer.firstName} ${r.customer.lastName || ''}`.trim() : "Unknown",
        Amount: Number(r.refundAmount || 0).toFixed(2),
        Currency: r.currency || responseCurrency,
        "Reason Category": (r.reasonCategory || "Other").toUpperCase(),
        Status: (r.refundStatus || "pending").toUpperCase(),
        "Processed By": r.processedBy || "System",
      }));

      exportToExcel(dataToExport, "stringventory_refunds", "Refunds");
    } catch (error) {
      console.error("Excel Export Error:", error);
      showError("Failed to generate Excel report");
    }
  };

  const handleExportPDF = async () => {
    if (filteredRefunds.length === 0) return;

    const tableData = {
      headers: ["Date", "Order #", "Amount", "Reason", "Status"],
      rows: filteredRefunds.map((r) => [
        r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB") : "—",
        r.order?.orderNumber || r.orderId || "—",
        `${r.currency || responseCurrency} ${Number(r.refundAmount || 0).toFixed(2)}`,
        (r.reasonCategory || "Other").toUpperCase(),
        (r.refundStatus || "pending").toUpperCase(),
      ]),
    };

    try {
      await exportToPDF({
        title: "Refund Management Report",
        subtitle: `Generated on ${new Date().toLocaleDateString("en-GB")} for ${filteredRefunds.length} record(s)`,
        fileName: "stringventory_refunds",
        table: tableData,
        totals: [
          { label: "Total Refunded Amount", value: formatCurrency(stats.totalAmount), bold: true, color: 'emerald' },
        ],
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      showError("Failed to generate PDF report");
    }
  };

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
      {/* Immersive Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Refund Management</h1>
          <p className="text-gray-500 text-sm tracking-tight">{stats.total} total refund requests recorded</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button 
                onClick={handleExportExcel}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-all border border-gray-200 text-sm font-medium shadow-sm"
            >
                <FileText size={15} className="text-emerald-600" />
                Excel
            </button>
            <button 
                onClick={handleExportPDF}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-all border border-gray-200 text-sm font-medium shadow-sm"
            >
                <Download size={15} className="text-rose-600" />
                PDF
            </button>
            
            <div className="hidden lg:block w-px h-8 bg-gray-100 mx-1"></div>
            
            <div className="relative flex-1 lg:flex-none min-w-[140px]">
                <RefreshCw size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/5 focus:border-gray-300 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            
            <button 
                onClick={fetchData}
                className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10 active:scale-95"
                title="Refresh Table"
            >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* Immersive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
        {/* Total Requests */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900 tracking-tight">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Pending</p>
              <p className="text-2xl font-semibold text-gray-900 tracking-tight">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Completed</p>
              <p className="text-2xl font-semibold text-gray-900 tracking-tight">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Total Refunded */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Total Refunded</p>
              <p className="text-2xl font-semibold text-gray-900 tracking-tight truncate">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <RefundsTable refunds={filteredRefunds} />
    </div>
  );
}
