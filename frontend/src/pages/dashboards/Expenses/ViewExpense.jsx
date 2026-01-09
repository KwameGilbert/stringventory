import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, Edit2, Trash2, DollarSign, Calendar, FileText, 
  Link as LinkIcon, Paperclip, Repeat, CheckCircle 
} from "lucide-react";
import axios from "axios";

export default function ViewExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get("/data/expenses.json");
        const found = response.data.find(e => e.id === parseInt(id));
        if (found) setExpense(found);
      } catch (error) {
        console.error("Error loading expense", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!expense && !loading) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">Expense Not Found</h2>
        <Link to="/dashboard/expenses" className="text-blue-600 hover:underline mt-2 inline-block">
          Return to list
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="bg-white rounded-xl p-8 h-96"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-8 animate-fade-in">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-50 to-pink-100 border border-rose-100 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">{expense.category}</h1>
                <p className="text-gray-500">{expense.reference}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to={`/dashboard/expenses/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium text-sm">
                <Edit2 size={16} />
                Edit
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-sm">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:col-span-2">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Expense Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Amount</p>
              <p className="text-3xl font-bold text-rose-600">{formatCurrency(expense.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900">{formatDate(expense.date)}</p>
              </div>
            </div>
            
            <div className="md:col-span-2 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Description / Notes</p>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {expense.notes || "No notes provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Supplier</h3>
          </div>
          <div className="p-6">
            {expense.supplier ? (
              <div>
                <p className="font-medium text-gray-900 text-lg">{expense.supplier}</p>
                <p className="text-sm text-gray-500 mt-1">Vendor information</p>
              </div>
            ) : (
              <p className="text-gray-400 italic">No supplier linked</p>
            )}
          </div>
        </div>

        {/* Type & Attachment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Type & Evidence</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Frequency</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                expense.isRecurring ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
              }`}>
                {expense.isRecurring ? <Repeat size={14} /> : <CheckCircle size={14} />}
                {expense.isRecurring ? "Recurring" : "One-Time"}
              </span>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
               {expense.hasAttachment ? (
                 <button className="w-full flex items-center justify-center gap-2 py-2 border border-blue-200 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                   <Paperclip size={16} />
                   View Attachment
                 </button>
               ) : (
                 <p className="text-sm text-gray-400 text-center py-2">No evidence attached</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
