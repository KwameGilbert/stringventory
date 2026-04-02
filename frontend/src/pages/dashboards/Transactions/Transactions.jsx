import { useState, useEffect } from "react";
import { RefreshCw, Download, Filter, Search, TrendingUp, TrendingDown, Landmark, DollarSign } from "lucide-react";
import transactionService from "../../../services/transactionService";
import TransactionsTable from "../../../components/admin/Transactions/TransactionsTable";
import { showError } from "../../../utils/alerts";
import { exportToExcel } from "../../../utils/exportUtils";
import { exportToPDF } from "../../../utils/pdfUtils";
import { useCurrency } from "../../../utils/currencyUtils";
import { FileText } from "lucide-react";

export default function Transactions() {
  const { formatPrice } = useCurrency();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalInflow: 0, totalOutflow: 0, netProfitLoss: 0 });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [responseCurrency, setResponseCurrency] = useState("GHS");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await transactionService.getTransactions();
      const payload = response?.data || response;
      
      if (payload?.transactions) {
        const currency = response?.currency || response?.data?.currency || "GHS";
        setResponseCurrency(currency);
        setTransactions(payload.transactions.map(t => ({ ...t, currency })));
        setSummary(payload.summary || { totalInflow: 0, totalOutflow: 0, netProfitLoss: 0 });
      } else {
        setTransactions(Array.isArray(payload) ? payload : []);
      }
    } catch (error) {
      console.error("Error loading transactions", error);
      showError(error?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = !filterType || tx.transactionType === filterType;
    const searchString = searchTerm.toLowerCase();
    
    // Help search through order numbers and purchase numbers too
    const orderNumber = tx.order?.orderNumber || "";
    const purchaseNumber = tx.purchase?.purchaseNumber || "";
    
    const matchesSearch = !searchTerm || 
        tx.id.toString().includes(searchString) ||
        (tx.orderId && tx.orderId.toString().includes(searchString)) ||
        orderNumber.toLowerCase().includes(searchString) ||
        purchaseNumber.toLowerCase().includes(searchString) ||
        (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(searchString));
    
    return matchesType && matchesSearch;
  });

  const handleExportExcel = () => {
    if (filteredTransactions.length === 0) return;

    try {
      const dataToExport = filteredTransactions.map((tx) => ({
        ID: tx.id || "—",
        Date: new Date(tx.transactionDate || tx.createdAt).toLocaleDateString("en-GB"),
        Type: (tx.transactionType || "general").toUpperCase(),
        Category: tx.category || "General",
        Amount: Number(tx.amount || 0).toFixed(2),
        Currency: tx.currency || responseCurrency,
        Method: (tx.paymentMethod || "—").toUpperCase(),
        Reference: tx.order?.orderNumber || tx.purchase?.purchaseNumber || "—",
      }));

      exportToExcel(dataToExport, "stringventory_transactions", "Transactions");
    } catch (error) {
      console.error("Excel Export Error:", error);
      showError("Failed to generate Excel report");
    }
  };

  const handleExportPDF = async () => {
    if (filteredTransactions.length === 0) return;

    const tableData = {
      headers: ["Date", "Type", "Amount", "Method", "Ref"],
      rows: filteredTransactions.map((tx) => [
        new Date(tx.transactionDate || tx.createdAt).toLocaleDateString("en-GB"),
        (tx.transactionType || "general").toUpperCase(),
        `${tx.currency || responseCurrency} ${Number(tx.amount || 0).toFixed(2)}`,
        (tx.paymentMethod || "—").toUpperCase(),
        tx.order?.orderNumber || tx.purchase?.purchaseNumber || "—",
      ]),
    };

    try {
      await exportToPDF({
        title: "Financial Ledger Report",
        subtitle: `Generated on ${new Date().toLocaleDateString("en-GB")} for ${filteredTransactions.length} transaction(s)`,
        fileName: "stringventory_transactions",
        table: tableData,
        totals: [
          { label: "Total Inflow", value: formatPrice(summary.totalInflow, responseCurrency), color: 'emerald' },
          { label: "Total Outflow", value: formatPrice(summary.totalOutflow, responseCurrency), color: 'rose' },
          { label: "Net Balance", value: formatPrice(summary.netProfitLoss, responseCurrency), bold: true, color: summary.netProfitLoss >= 0 ? 'emerald' : 'rose' },
        ],
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      showError("Failed to generate PDF report");
    }
  };

  // Remove local calculation as we use summary from API

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-20 bg-gray-100 rounded-3xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-3xl animate-pulse"></div>
            ))}
        </div>
        <div className="h-96 bg-gray-100 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 space-y-6 animate-fade-in">
      {/* Immersive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Landmark className="text-rose-500" />
            Financial Transactions
          </h1>
          <p className="text-gray-500 text-sm tracking-tight">Real-time ledger of all company cash flow</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <button 
                onClick={handleExportExcel}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 text-sm font-medium shadow-sm"
            >
                <FileText size={16} className="text-emerald-600" />
                Excel
            </button>

            <button 
                onClick={handleExportPDF}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 text-sm font-medium shadow-sm"
            >
                <Download size={16} className="text-rose-600" />
                PDF
            </button>

            <div className="hidden lg:block w-px h-8 bg-gray-100 mx-1"></div>

            <button 
                onClick={fetchData}
                className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 active:scale-95"
                title="Refresh"
            >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* Immersive Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
        {/* Inflow */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-emerald-600 w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Total Inflow</p>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">{formatPrice(summary.totalInflow, responseCurrency)}</p>
                </div>
            </div>
        </div>

        {/* Outflow */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-rose-50 rounded-2xl group-hover:scale-110 transition-transform">
                    <TrendingDown className="text-rose-600 w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Total Outflow</p>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">{formatPrice(summary.totalOutflow, responseCurrency)}</p>
                </div>
            </div>
        </div>

        {/* Net */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                    <DollarSign className="text-blue-600 w-6 h-6" />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none mb-1">Net Balance</p>
                    <p className={`text-2xl font-bold tracking-tight truncate ${summary.netProfitLoss >= 0 ? 'text-gray-900' : 'text-rose-600'}`}>
                      {formatPrice(summary.netProfitLoss, responseCurrency)}
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="relative min-w-[200px]">
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                    className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">All Transaction Types</option>
                    <option value="order">Sales Revenue</option>
                    <option value="refunds">Refunds Paid</option>
                    <option value="expense">Business Expenses</option>
                    <option value="purchase">Stock Purchases</option>
                    <option value="stock_loss">Inventory Adjustments</option>
                </select>
            </div>
        </div>

        <TransactionsTable transactions={filteredTransactions} />
      </div>
    </div>
  );
}
