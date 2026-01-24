import { useState, useEffect } from "react";
import { Save, ArrowLeft, DollarSign, Calendar, FileText, Link as LinkIcon, Paperclip, RefreshCcw, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ExpenseForm = ({ initialData = {}, onSubmit, title, subTitle }) => {
  const navigate = useNavigate();
  
  const today = new Date().toISOString().split('T')[0];
  
  const [categories, setCategories] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  
  const [formData, setFormData] = useState({
    expenseCategoryId: "",
    paymentMethodId: "",
    amount: "",
    date: today,
    reference: "",
    supplier: "",
    name: "",
    notes: "",
    isRecurring: false,
    recurringFrequency: "monthly",
    recurringInterval: 1,
    recurringEndDate: "",
    hasAttachment: false,
    status: "pending",
    ...initialData,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, pmRes] = await Promise.all([
          axios.get("/data/expense-categories.json"),
          axios.get("/data/payment-methods.json")
        ]);
        setCategories(catRes.data);
        setPaymentMethods(pmRes.data.filter(pm => pm.isActive));
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/dashboard/expenses")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Expenses</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm">{subTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100">
                <DollarSign className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Expense Details</h3>
                <p className="text-xs text-gray-500">Basic information about the cost</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Name/Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Expense Name/Description <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all text-sm"
                placeholder="e.g. Monthly Rent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category */}
              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-gray-700">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="expenseCategoryId"
                  value={formData.expenseCategoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all text-sm bg-white"
                  required
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <Link 
                  to="/dashboard/expenses/categories" 
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Manage Categories"
                >
                  <Settings size={16} />
                </Link>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Amount (GH₵) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₵</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Payment Method <span className="text-rose-500">*</span>
                </label>
                <select
                  name="paymentMethodId"
                  value={formData.paymentMethodId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all text-sm bg-white"
                  required
                >
                  <option value="">Select Method</option>
                  {paymentMethods.map((pm) => (
                    <option key={pm.id} value={pm.id}>{pm.name}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all text-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <LinkIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Additional Information</h3>
                <p className="text-xs text-gray-500">Supplier, notes, and settings</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Supplier */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Linked Supplier <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 transition-all text-sm"
                placeholder="e.g. Office Max"
              />
            </div>

            {/* Reference */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                Reference
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all text-sm"
                placeholder="e.g. Invoice #12345"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Notes & Evidence</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 transition-all text-sm resize-none"
                placeholder="Details about this expense..."
              />
            </div>

            {/* Attachment Placeholder */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 mb-3 transition-colors">
                <Paperclip className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Click to upload evidence</p>
              <p className="text-xs text-gray-500 mt-1">Receipts, invoices, or other documents</p>
            </div>

            {/* Recurring Toggle */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                    <div className="p-2 rounded-lg bg-white border border-blue-100">
                        <RefreshCcw className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">Recurring Expense</p>
                        <p className="text-xs text-blue-600">Is this a repeated cost?</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                        type="checkbox"
                        name="isRecurring"
                        checked={formData.isRecurring}
                        onChange={handleChange}
                        className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {formData.isRecurring && (
                    <div className="px-4 pb-4 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-blue-100 animate-fade-in mt-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-blue-800">Frequency</label>
                            <select
                                name="recurringFrequency"
                                value={formData.recurringFrequency || "monthly"}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                             <label className="text-xs font-medium text-blue-800">Interval</label>
                             <div className="flex items-center gap-2">
                                <span className="text-xs text-blue-600">Every</span>
                                <input
                                    type="number"
                                    name="recurringInterval"
                                    value={formData.recurringInterval || 1}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                                <span className="text-xs text-blue-600 capitalize">{formData.recurringFrequency || "months"}(s)</span>
                             </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-blue-800">End Date</label>
                            <input
                                type="date"
                                name="recurringEndDate"
                                value={formData.recurringEndDate || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/dashboard/expenses"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all flex items-center gap-2 text-sm shadow-lg shadow-gray-900/20"
          >
            <Save size={18} />
            Save Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
