import { useState, useEffect } from "react";
import { MessageSquare, Clock, Send, Users } from "lucide-react";
import CustomerSelector from "./CustomerSelector";
import Composer from "./Composer";
import MessageHistory from "./MessageHistory";
import MessageDetails from "./MessageDetails";
import customerService from "../../../services/customerService";
import messagingService from "../../../services/messagingService";
import { showError, showSuccess } from "../../../utils/alerts";

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

const normalizeCustomer = (customer) => {
  const firstName = customer?.firstName || "";
  const lastName = customer?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    ...customer,
    id: customer?.id,
    customerName: customer?.customerName || customer?.name || fullName || customer?.email || "Unknown",
    email: customer?.email || "",
  };
};

export default function Messaging() {
  const [activeTab, setActiveTab] = useState("compose");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null); // For details modal

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerService.getCustomers();
        setCustomers(extractCustomers(response).map(normalizeCustomer));
      } catch (error) {
        console.error("Error loading customers", error);
        showError(error?.message || "Failed to load customers");
      }
    };

    fetchCustomers();
  }, []);

  const handleSelectCustomer = (id) => {
    setSelectedCustomerIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomerIds.length === customers.length) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(customers.map(c => c.id));
    }
  };

  const handleSendMessage = async (messageBody) => {
    if (!selectedCustomerIds.length || !messageBody?.trim()) return;

    try {
      await messagingService.sendBulkMessage({
        recipientIds: selectedCustomerIds,
        body: messageBody,
      });

      showSuccess(`Successfully sent to ${selectedCustomerIds.length} customers`);
      setSelectedCustomerIds([]);
      setActiveTab("history");
    } catch (error) {
      console.error("Failed to send messages", error);
      showError(error?.message || "Failed to send messages");
    }
  };

  return (
    <div className="p-8 max-w-400 mx-auto h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messaging Center</h1>
          <p className="text-gray-500 mt-1">Manage SMS and Email campaigns</p>
        </div>
        
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab("compose")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "compose" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Send size={18} />
            Compose
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "history" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Clock size={18} />
            History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {activeTab === "compose" ? (
          <div className="grid grid-cols-12 gap-6 h-full">
            <div className="col-span-4 h-full">
              <CustomerSelector 
                customers={customers} 
                selectedIds={selectedCustomerIds}
                onSelect={handleSelectCustomer}
                onSelectAll={handleSelectAll}
              />
            </div>
            <div className="col-span-8 h-full">
              <Composer 
                recipientCount={selectedCustomerIds.length} 
                onSend={handleSendMessage} 
              />
            </div>
          </div>
        ) : (
          <div className="h-full">
            <MessageHistory onViewDetails={setSelectedMessage} />
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedMessage && (
        <MessageDetails 
          message={selectedMessage} 
          onClose={() => setSelectedMessage(null)} 
        />
      )}
    </div>
  );
}
