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

    const dataToExport = filteredTransactions.map((tx) => ({
      ID: tx.id,
      Date: new Date(tx.transactionDate || tx.createdAt).toLocaleDateString("en-GB"),
      Type: tx.transactionType.toUpperCase(),
      Category: tx.category || "General",
      Amount: tx.amount,
      Method: tx.paymentMethod || "—",
      Reference: tx.order?.orderNumber || tx.purchase?.purchaseNumber || "—",
    }));

    exportToExcel(dataToExport, "stringventory_transactions", "Transactions");
  };

  const handleExportPDF = async () => {
    if (filteredTransactions.length === 0) return;

    const tableData = {
      headers: ["Date", "Type", "Amount", "Method", "Ref"],
      rows: filteredTransactions.map((tx) => [
        new Date(tx.transactionDate || tx.createdAt).toLocaleDateString("en-GB"),
        tx.transactionType.toUpperCase(),
        tx.amount.toFixed(2),
        tx.paymentMethod || "—",
        tx.order?.orderNumber || tx.purchase?.purchaseNumber || "—",
      ]),
    };

    try {
      await exportToPDF({
        title: "Company Financial Ledger Report",
        fileName: "stringventory_transactions",
        table: tableData,
      });
    } catch (error) {
      showError("Failed to generate PDF");
    }
  };

  // Remove local calculation as we use summary from API

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-20 bg-gray-100 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
            <div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
        </div>
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="pb-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 group flex items-center gap-2">
            <Landmark className="text-gray-400 group-hover:text-rose-500 transition-colors" />
            Financial Transactions
          </h1>
          <p className="text-gray-500 text-sm">Real-time ledger of all company cash flow</p>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={fetchData}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                title="Refresh"
            >
                <RefreshCw size={18} className="text-gray-500" />
            </button>
            
            <button 
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 text-sm font-medium shadow-sm"
            >
                <FileText size={16} className="text-emerald-600" />
                Excel
            </button>

            <button 
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 text-sm font-medium shadow-sm"
            >
                <Download size={16} className="text-rose-600" />
                PDF
            </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl">
                <TrendingUp className="text-emerald-600 w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Inflow</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(summary.totalInflow, responseCurrency)}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-rose-50 rounded-2xl">
                <TrendingDown className="text-rose-600 w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Outflow</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(summary.totalOutflow, responseCurrency)}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-2xl">
                <DollarSign className="text-blue-600 w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Net Profit/Loss</p>
                <p className={`text-2xl font-bold ${summary.netProfitLoss >= 0 ? 'text-gray-900' : 'text-rose-600'}`}>
                  {formatPrice(summary.netProfitLoss, responseCurrency)}
                </p>
            </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text"
                    placeholder="Search by ID, Order, Method..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm md:w-48"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
            >
                <option value="">All Types</option>
                <option value="order">Sales</option>
                <option value="refunds">Refunds</option>
                <option value="expense">Expenses</option>
                <option value="purchase">Purchases</option>
                <option value="stock_loss">Stock Loss</option>
            </select>
        </div>

        <TransactionsTable transactions={filteredTransactions} />
      </div>
    </div>
  );
}
