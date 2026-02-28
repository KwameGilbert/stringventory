import { useState, useEffect } from "react";
import { X, Search, CheckCircle, AlertCircle, Clock, MailOpen, User } from "lucide-react";
import messagingService from "../../../services/messagingService";
import customerService from "../../../services/customerService";
import { showError } from "../../../utils/alerts";

const extractCustomers = (response) => {
  const payload = response?.data || response || {};

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.customers)) return payload.customers;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.customers)) return payload.data.customers;

  return [];
};

const extractMessage = (response) => {
  const payload = response?.data || response || {};

  if (payload?.message) return payload.message;
  if (payload?.data?.message) return payload.data.message;
  if (payload?.data && !Array.isArray(payload.data)) return payload.data;

  return payload;
};

const extractRecipients = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.recipients)) return value.recipients;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.recipients)) return value.data.recipients;

  return [];
};

export default function MessageDetails({ message, onClose }) {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [messageRes, customersRes] = await Promise.all([
          messagingService.getMessageById(message.id),
          customerService.getCustomers(),
        ]);

        const detailsMessage = extractMessage(messageRes);
        const recipientsSource = extractRecipients(detailsMessage);
        const customers = extractCustomers(customersRes);
        const customerMap = new Map(customers.map((customer) => [String(customer.id), customer]));

        const enrichedRecipients = recipientsSource.map((recipient, index) => {
          const linkedCustomer = customerMap.get(String(recipient?.customerId || recipient?.id || "")) || {};
          const firstName = linkedCustomer?.firstName || "";
          const lastName = linkedCustomer?.lastName || "";
          const fullName = `${firstName} ${lastName}`.trim();

          return {
            ...recipient,
            id: recipient?.id || `${message.id}-${index}`,
            customerName:
              recipient?.customerName ||
              linkedCustomer?.customerName ||
              linkedCustomer?.name ||
              fullName ||
              recipient?.name ||
              "Unknown",
            email: recipient?.email || linkedCustomer?.email || "N/A",
            status: recipient?.status || "pending",
            sentAt: recipient?.sentAt || recipient?.createdAt || null,
          };
        });

        setRecipients(enrichedRecipients);
      } catch (error) {
        console.error("Error fetching details:", error);
        showError(error?.message || "Failed to load message details");
      } finally {
        setLoading(false);
      }
    };

    if (message) {
      fetchData();
    }
  }, [message]);

  const filteredRecipients = recipients.filter(r => 
    r.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'failed': return <AlertCircle size={16} className="text-red-500" />;
      case 'opened': return <MailOpen size={16} className="text-blue-500" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{message.subject}</h2>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-xs text-gray-500">Sent on {new Date(message.createdAt).toLocaleString()}</span>
               <span className="w-1 h-1 rounded-full bg-gray-300"></span>
               <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  message.type === 'SMS' ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700'
               }`}>
                 {message.type}
               </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar / Stats */}
          <div className="w-64 bg-gray-50 border-r border-gray-100 p-6 flex flex-col gap-6 overflow-y-auto">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Delivery Stats</h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Total Recipients</p>
                  <p className="text-xl font-bold text-gray-900">{message.recipientCount}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-emerald-600 mb-1">Successful</p>
                  <p className="text-xl font-bold text-gray-900">{message.successCount}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs text-red-600 mb-1">Failed</p>
                  <p className="text-xl font-bold text-gray-900">{message.failureCount}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message Content</h3>
              <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-600 italic">
                "{message.body}"
              </div>
            </div>
          </div>

          {/* Main Content / List */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-100">
               <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search recipients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRecipients.map((recipient) => (
                      <tr key={recipient.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                              <User size={14} />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{recipient.customerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">{recipient.email}</td>
                        <td className="px-6 py-3">
                           <div className="flex items-center gap-2">
                             {getStatusIcon(recipient.status)}
                             <span className="text-sm text-gray-700">{recipient.status}</span>
                           </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {recipient.sentAt ? new Date(recipient.sentAt).toLocaleTimeString() : '-'}
                        </td>
                      </tr>
                    ))}
                    {filteredRecipients.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">
                          No recipients found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
