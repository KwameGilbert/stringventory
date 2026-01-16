import { useState } from "react";
import { X, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

export default function StockAdjustmentModal({ isOpen, onClose, item, onConfirm }) {
  const [type, setType] = useState("increase"); // increase | decrease
  const [reason, setReason] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");



  if (!isOpen || !item) return null;

  const reasons = {
    increase: [
      "Found extra items",
      "Supplier bonus",
      "Stock count correction",
      "Missed entry"
    ],
    decrease: [
      "Damaged goods",
      "Expired products",
      "Theft/loss",
      "Wrongly added earlier"
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!quantity || quantity <= 0) {
      setError("Please enter a valid positive quantity");
      return;
    }

    if (!reason) {
      setError("Please select a reason");
      return;
    }

    onConfirm({
      itemId: item.id,
      type,
      reason,
      quantity: parseInt(quantity),
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Adjust Stock</h3>
            <p className="text-sm text-gray-500">For {item.productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Adjustment Type */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setType("increase"); setReason(""); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                type === "increase"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 ring-1 ring-emerald-500/20"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <TrendingUp size={18} />
              Stock Increase
            </button>
            <button
              type="button"
              onClick={() => { setType("decrease"); setReason(""); }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                type === "decrease"
                  ? "bg-rose-50 border-rose-200 text-rose-700 ring-1 ring-rose-500/20"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <TrendingDown size={18} />
              Stock Decrease
            </button>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all text-sm"
            >
              <option value="">Select reason...</option>
              {reasons[type].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all text-sm"
              />
              <div className="absolute right-4 top-2.5 text-sm text-gray-500 pointer-events-none">
                units
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2.5 text-white rounded-xl font-medium transition-colors shadow-sm ${
                type === "increase"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
