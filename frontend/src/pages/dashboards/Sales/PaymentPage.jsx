import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, CreditCard, Smartphone, CheckCircle, Wallet } from "lucide-react";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total } = location.state || { total: 0 };
  
  const [selectedMethod, setSelectedMethod] = useState("Cash");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // If no state passed (e.g. direct access), redirect back to POS
    if (!location.state) {
        navigate("/dashboard/sales/pos");
    }
  }, [location, navigate]);

  const paymentMethods = [
    { id: "Cash", icon: DollarSign, label: "Cash", desc: "Pay with physical cash" },
    { id: "Card", icon: CreditCard, label: "Card", desc: "Credit or Debit Card" },
    { id: "Mobile Money", icon: Smartphone, label: "Mobile Money", desc: "Momo, Vodafone Cash..." },
    { id: "Wallet", icon: Wallet, label: "Customer Wallet", desc: "Prepaid balance" },
  ];

  const handlePayment = () => {
    setProcessing(true);
    
    // Simulate API/Processing
    setTimeout(() => {
        setProcessing(false);
        Swal.fire({
            icon: 'success',
            title: 'Payment Successful',
            text: `Received ${formatCurrency(total)} via ${selectedMethod}`,
            confirmButtonColor: '#10b981',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            navigate('/dashboard/sales'); // Redirect back to sales dashboard
        });
    }, 1500);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="max-w-3xl mx-auto pb-8 animate-fade-in relative">
        {/* Back Button */}
       <button
        onClick={() => navigate("/dashboard/sales/pos")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
      >
        <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to POS</span>
      </button>

      <div className="text-center mb-10">
        <p className="text-gray-500 font-medium uppercase tracking-wide text-sm mb-2">Total Amount Payable</p>
        <h1 className="text-5xl font-bold text-gray-900">{formatCurrency(total)}</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Select Payment Method</h3>
        </div>
        
        <div className="p-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;
                    return (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                                isSelected 
                                    ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500' 
                                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 text-emerald-500">
                                    <CheckCircle size={20} fill="currentColor" className="text-white" />
                                </div>
                            )}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                                isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                                <Icon size={20} />
                            </div>
                            <p className={`font-bold ${isSelected ? 'text-emerald-900' : 'text-gray-900'}`}>{method.label}</p>
                            <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                        </button>
                    );
                })}
             </div>

            {/* Dynamic Inputs can go here based on method (e.g. Card number input) */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Payment Details required for <strong>{selectedMethod}</strong>:</p>
                <div className="h-10 bg-white border border-gray-200 rounded-lg w-full"></div>
                <p className="text-xs text-gray-400 mt-2 italic">* This is a simulated step. No real transaction will occur.</p>
            </div>
            
            <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full mt-6 py-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl font-bold text-lg shadow-xl shadow-gray-900/20 transition-all transform active:scale-95"
            >
                {processing ? "Processing..." : `Confirm Payment • ${formatCurrency(total)}`}
            </button>
        </div>
      </div>
    </div>
  );
}
