import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Edit2, Trash2, DollarSign, Calendar, FileText, 
  Link as LinkIcon, Paperclip, Repeat, CheckCircle, Clock, 
  User, Shield, Hash, CreditCard, Activity
} from "lucide-react";
import expenseService from "../../../services/expenseService";
import { confirmDelete, showError, showSuccess } from "../../../utils/alerts";
import { useCurrency } from "../../../utils/currencyUtils";

const statusConfig = {
  paid: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle,
  },
  successful: {
    label: "Successful",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Activity,
  },
};

const extractExpense = (response) => {
  const payload = response?.data || response || {};
  return payload?.expense || payload?.data?.expense || payload?.data || payload;
};

export default function ViewExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await expenseService.getExpenseById(id);
        const found = extractExpense(response);
        if (found) {
          setExpense({
            ...found,
            categoryName: found?.category?.name || found?.category || found?.categoryName || "Uncategorized",
            amount: Number(found?.amount ?? 0),
            date: found?.transactionDate || found?.date || found?.createdAt,
            isRecurring: Boolean(found?.isRecurring || found?.expenseScheduleId),
            hasAttachment: Boolean(found?.hasAttachment || found?.receipt || found?.evidence),
            attachmentUrl: found?.evidence || found?.receipt || null,
            notes: found?.notes || found?.description || "",
            creatorName: found?.creator 
              ? `${found.creator.firstName || ""} ${found.creator.lastName || ""}`.trim() 
              : "System",
            creatorRole: found?.creator?.role || "Administrator",
          });
        }
      } catch (error) {
        console.error("Error loading expense", error);
        showError(error?.message || "Failed to load expense");
        navigate("/dashboard/expenses");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id, navigate]);

  const handleDelete = async () => {
    const result = await confirmDelete("this expense");
    if (!result.isConfirmed) return;

    try {
      await expenseService.deleteExpense(id);
      showSuccess("Expense deleted successfully");
      navigate("/dashboard/expenses");
    } catch (error) {
      console.error("Failed to delete expense", error);
      showError(error?.message || "Failed to delete expense");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="bg-white rounded-2xl p-8 h-96 shadow-sm border border-gray-100"></div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Expense Not Found</h2>
        <p className="text-gray-500 mt-2">The expense record you're looking for doesn't exist or has been deleted.</p>
        <Link to="/dashboard/expenses" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
          <ArrowLeft size={18} />
          Back to Expenses
        </Link>
      </div>
    );
  }

  const status = statusConfig[expense.status?.toLowerCase()] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/expenses")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Expenses</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-200">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 capitalize">{expense.name || expense.categoryName}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status.bg} ${status.text} border ${status.border}`}>
                    <StatusIcon size={14} />
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(expense.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Hash size={14} />
                    Ref: {expense.reference || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to={`/dashboard/expenses/${id}/edit`}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-all font-semibold text-sm shadow-lg shadow-gray-200"
              >
                <Edit2 size={16} />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-6 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-semibold text-sm"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="md:col-span-2 space-y-8">
          {/* Financials & Type */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Activity size={18} className="text-gray-400" />
                Financial Overview
              </h3>
            </div>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Expense Amount</p>
                <p className="text-4xl font-black text-rose-600 font-mono tracking-tight">
                  {formatPrice(expense.amount, expense.currency)}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 font-medium">
                  <span className="text-sm text-gray-500">Method</span>
                  <span className="text-sm text-gray-900 capitalize flex items-center gap-2">
                    <CreditCard size={14} className="text-gray-400" />
                    {expense.paymentMethod?.replace(/_/g, " ") || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 font-medium">
                  <span className="text-sm text-gray-500">Frequency</span>
                  <span className={`text-sm flex items-center gap-2 ${expense.isRecurring ? 'text-blue-600' : 'text-gray-600'}`}>
                    {expense.isRecurring ? <Repeat size={14} /> : <CheckCircle size={14} />}
                    {expense.isRecurring ? "Recurring" : "One-Time"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description / Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-gray-400" />
                Notes & Description
              </h3>
            </div>
            <div className="p-8">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed italic">
                {expense.notes || "No additional description or notes were provided for this expense."}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Creator Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <User size={18} className="text-gray-400" />
              <h3 className="font-bold text-gray-900">Recorded By</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-gray-600">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 leading-tight">{expense.creatorName}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase font-semibold tracking-wider">{expense.creatorRole}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence / Attachments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Paperclip size={18} className="text-gray-400" />
              <h3 className="font-bold text-gray-900">Attachments</h3>
            </div>
            <div className="p-6">
              {expense.hasAttachment ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center gap-3">
                    <FileText className="text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-blue-900 truncate">Expense_Evidence_{id}</p>
                      <p className="text-[10px] text-blue-600 uppercase font-bold tracking-tight">Attached Document</p>
                    </div>
                  </div>
                  <a 
                    href={expense.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-blue-200 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                  >
                    View Document
                  </a>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 opacity-50">
                    <Paperclip size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400 font-medium italic">No evidence attached</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Meta */}
          <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl shadow-gray-200">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">System Details</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                <span className="text-xs text-gray-500">Record ID</span>
                <span className="text-sm font-mono text-gray-300">#{id}</span>
              </div>
              <div className="flex justify-between items-end border-b border-gray-800 pb-2">
                <span className="text-xs text-gray-500">Added On</span>
                <span className="text-sm text-gray-300">{formatDate(expense.createdAt)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-500">Category</span>
                <span className="text-sm text-rose-400 font-bold uppercase">{expense.categoryName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
