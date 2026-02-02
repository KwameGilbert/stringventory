import { useState } from "react";
import { 
  CreditCard, 
  Check, 
  Zap, 
  Crown, 
  Rocket,
  Calendar,
  AlertCircle,
  ExternalLink,
  X,
  Plus,
  Download,
  Eye,
  Trash2,
  CheckCircle
} from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    period: "month",
    description: "Perfect for small businesses",
    icon: Zap,
    color: "emerald",
    features: [
      { name: "Up to 500 products", included: true },
      { name: "2 user accounts", included: true },
      { name: "Basic reports", included: true },
      { name: "Email support (48hr response)", included: true },
      { name: "1 location", included: true },
      { name: "Advanced analytics", included: false },
      { name: "API access", included: false },
      { name: "Custom integrations", included: false },
      { name: "Priority support", included: false },
      { name: "Dedicated account manager", included: false }
    ],
    limits: {
      products: 500,
      users: 2,
      locations: 1,
      storage: "5 GB",
      apiCalls: "N/A"
    }
  },
  {
    id: "professional",
    name: "Professional",
    price: 79,
    period: "month",
    description: "Best for growing businesses",
    icon: Crown,
    color: "emerald ",
    popular: true,
    features: [
      { name: "Up to 5,000 products", included: true },
      { name: "10 user accounts", included: true },
      { name: "Advanced reports & analytics", included: true },
      { name: "Priority support (24hr response)", included: true },
      { name: "5 locations", included: true },
      { name: "Advanced analytics", included: true },
      { name: "API access (10k calls/month)", included: true },
      { name: "Custom integrations", included: false },
      { name: "White-label options", included: false },
      { name: "Dedicated account manager", included: false }
    ],
    limits: {
      products: 5000,
      users: 10,
      locations: 5,
      storage: "50 GB",
      apiCalls: "10,000/month"
    }
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    period: "month",
    description: "For large scale operations",
    icon: Rocket,
    color: "amber",
    features: [
      { name: "Unlimited products", included: true },
      { name: "Unlimited user accounts", included: true },
      { name: "Custom reports & dashboards", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Unlimited locations", included: true },
      { name: "Advanced analytics + AI insights", included: true },
      { name: "Unlimited API access", included: true },
      { name: "Custom integrations", included: true },
      { name: "White-label options", included: true },
      { name: "Dedicated account manager", included: true }
    ],
    limits: {
      products: "Unlimited",
      users: "Unlimited",
      locations: "Unlimited",
      storage: "500 GB",
      apiCalls: "Unlimited"
    }
  }
];

const mockBillingHistory = [
  { id: 1, date: "Jan 15, 2026", description: "Starter Plan - Monthly", amount: 29.00, status: "paid", invoice: "INV-2026-001" },
  { id: 2, date: "Dec 15, 2025", description: "Starter Plan - Monthly", amount: 29.00, status: "paid", invoice: "INV-2025-012" },
  { id: 3, date: "Nov 15, 2025", description: "Starter Plan - Monthly", amount: 29.00, status: "paid", invoice: "INV-2025-011" },
  { id: 4, date: "Oct 15, 2025", description: "Starter Plan - Monthly", amount: 29.00, status: "paid", invoice: "INV-2025-010" },
  { id: 5, date: "Sep 15, 2025", description: "Starter Plan - Monthly", amount: 29.00, status: "paid", invoice: "INV-2025-009" },
];

export default function SubscriptionSettings() {
  const [currentPlan] = useState("starter");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showBillingHistoryModal, setShowBillingHistoryModal] = useState(false);
  const [showPlanDetailsModal, setShowPlanDetailsModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "visa", last4: "4242", expiry: "12/2027", isDefault: true }
  ]);
  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  });

  const currentPlanData = plans.find(p => p.id === currentPlan);
  const nextBillingDate = "February 15, 2026";
  
  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleViewPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setShowPlanDetailsModal(true);
  };

  const handleAddPaymentMethod = () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvc || !newCard.name) {
      alert("Please fill in all card details");
      return;
    }
    
    const newMethod = {
      id: Date.now(),
      type: newCard.number.startsWith("4") ? "visa" : "mastercard",
      last4: newCard.number.slice(-4),
      expiry: newCard.expiry,
      isDefault: paymentMethods.length === 0
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setNewCard({ number: "", expiry: "", cvc: "", name: "" });
    setShowAddPaymentModal(false);
  };

  const handleSetDefaultCard = (id) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  const handleDeleteCard = (id) => {
    const card = paymentMethods.find(pm => pm.id === id);
    if (card?.isDefault && paymentMethods.length > 1) {
      alert("Please set another card as default before deleting this one");
      return;
    }
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const getColorClasses = (color, isActive) => {
    const colors = {
      emerald: {
        bg: isActive ? "bg-emerald-50 border-emerald-500" : "bg-white border-gray-200",
        button: "bg-emerald-600 hover:bg-emerald-700",
        badge: "bg-emerald-100 text-emerald-700",
        icon: "text-emerald-600"
      },
      emerald : {
        bg: isActive ? "bg-emerald-50 border-emerald-500" : "bg-white border-gray-200",
        button: "bg-emerald-600 hover:bg-emerald-700",
        badge: "bg-emerald-100 text-emerald-700",
        icon: "text-emerald-600"
      },
      amber: {
        bg: isActive ? "bg-amber-50 border-amber-500" : "bg-white border-gray-200",
        button: "bg-amber-600 hover:bg-amber-700",
        badge: "bg-amber-100 text-amber-700",
        icon: "text-amber-600"
      }
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(currentPlanData?.color, true).badge}`}>
              {currentPlanData && <currentPlanData.icon className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{currentPlanData?.name} Plan</h3>
              <p className="text-sm text-gray-500">${currentPlanData?.price}/month</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Next billing: {nextBillingDate}</span>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              billingCycle === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Yearly <span className="text-emerald-600 text-xs ml-1">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan;
          const colorClasses = getColorClasses(plan.color, isCurrentPlan);
          const Icon = plan.icon;
          const price = billingCycle === "yearly" ? Math.round(plan.price * 0.8) : plan.price;

          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-6 transition-all hover:shadow-lg ${colorClasses.bg}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${colorClasses.badge}`}>
                  <Icon className={`w-7 h-7 ${colorClasses.icon}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${price}</span>
                  <span className="text-gray-500">/{billingCycle === "yearly" ? "mo" : "month"}</span>
                  {billingCycle === "yearly" && (
                    <p className="text-xs text-gray-500 mt-1">Billed annually</p>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.slice(0, 5).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <Check className={`w-4 h-4 flex-shrink-0 ${colorClasses.icon}`} />
                    {feature.name}
                  </li>
                ))}
              </ul>

              {/* View Details Button */}
              <button
                onClick={() => handleViewPlanDetails(plan)}
                className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-3 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Full Details
              </button>

              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-lg bg-gray-100 text-gray-500 font-medium cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan)}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${colorClasses.button}`}
                >
                  {plans.findIndex(p => p.id === plan.id) > plans.findIndex(p => p.id === currentPlan)
                    ? "Upgrade"
                    : "Downgrade"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
          <button 
            onClick={() => setShowAddPaymentModal(true)}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
        
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold ${
                method.type === "visa" 
                  ? "bg-gradient-to-r from-blue-600 to-blue-400" 
                  : "bg-gradient-to-r from-red-600 to-orange-400"
              }`}>
                {method.type.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">•••• •••• •••• {method.last4}</p>
                <p className="text-sm text-gray-500">Expires {method.expiry}</p>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault ? (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded font-medium">
                    Default
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetDefaultCard(method.id)}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-emerald-600 font-medium"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDeleteCard(method.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {paymentMethods.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No payment methods added</p>
              <button 
                onClick={() => setShowAddPaymentModal(true)}
                className="mt-2 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Add your first card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
            <p className="text-sm text-gray-500">View and download past invoices</p>
          </div>
          <button 
            onClick={() => setShowBillingHistoryModal(true)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View All
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        
        {/* Recent invoices preview */}
        <div className="mt-4 space-y-2">
          {mockBillingHistory.slice(0, 3).map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{invoice.description}</p>
                <p className="text-xs text-gray-500">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">${invoice.amount.toFixed(2)}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded capitalize">
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Payment Method</h2>
              <button onClick={() => setShowAddPaymentModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={newCard.cvc}
                    onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                className="flex-1 py-3 px-4 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing History Modal */}
      {showBillingHistoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Billing History</h2>
              <button onClick={() => setShowBillingHistoryModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockBillingHistory.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{invoice.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{invoice.description}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${invoice.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full capitalize">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                          <Download className="w-4 h-4" />
                          {invoice.invoice}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowBillingHistoryModal(false)}
                className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Details Modal */}
      {showPlanDetailsModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className={`p-6 ${getColorClasses(selectedPlan.color, true).badge}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow">
                    <selectedPlan.icon className={`w-7 h-7 ${getColorClasses(selectedPlan.color, true).icon}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.name} Plan</h2>
                    <p className="text-gray-600">{selectedPlan.description}</p>
                  </div>
                </div>
                <button onClick={() => setShowPlanDetailsModal(false)} className="p-1 hover:bg-white/50 rounded">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === "yearly" ? Math.round(selectedPlan.price * 0.8) : selectedPlan.price}
                </span>
                <span className="text-gray-600">/month</span>
                {billingCycle === "yearly" && (
                  <span className="ml-2 text-sm text-emerald-700 font-medium">Save 20%</span>
                )}
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {/* Limits */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Plan Limits</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Products</p>
                    <p className="font-semibold text-gray-900">{selectedPlan.limits.products}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Users</p>
                    <p className="font-semibold text-gray-900">{selectedPlan.limits.users}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Locations</p>
                    <p className="font-semibold text-gray-900">{selectedPlan.limits.locations}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Storage</p>
                    <p className="font-semibold text-gray-900">{selectedPlan.limits.storage}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-gray-500">API Calls</p>
                    <p className="font-semibold text-gray-900">{selectedPlan.limits.apiCalls}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <h3 className="font-semibold text-gray-900 mb-3">All Features</h3>
              <ul className="space-y-2">
                {selectedPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "text-gray-900" : "text-gray-400"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowPlanDetailsModal(false)}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-white"
              >
                Close
              </button>
              {selectedPlan.id !== currentPlan && (
                <button
                  onClick={() => {
                    setShowPlanDetailsModal(false);
                    handleUpgrade(selectedPlan);
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg text-white font-medium ${getColorClasses(selectedPlan.color, true).button}`}
                >
                  {plans.findIndex(p => p.id === selectedPlan.id) > plans.findIndex(p => p.id === currentPlan)
                    ? "Upgrade to this Plan"
                    : "Downgrade to this Plan"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Confirmation Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Upgrade to {selectedPlan.name}</h2>
            <p className="text-gray-500 mb-6">
              You're about to upgrade your subscription. Your card will be charged the difference.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">New Plan</span>
                <span className="font-medium">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price</span>
                <span className="font-medium">
                  ${billingCycle === "yearly" ? Math.round(selectedPlan.price * 0.8) : selectedPlan.price}/mo
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-semibold">Due Today</span>
                <span className="font-bold text-emerald-600">
                  ${billingCycle === "yearly" ? Math.round(selectedPlan.price * 0.8) : selectedPlan.price}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Your subscription will be upgraded immediately and prorated for the remaining billing period.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Upgrading to ${selectedPlan.name}! Payment would be processed here.`);
                  setShowPaymentModal(false);
                }}
                className="flex-1 py-3 px-4 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
