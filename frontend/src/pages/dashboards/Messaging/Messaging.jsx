import { useState, useEffect } from "react";
import axios from "axios";
import { MessageCircle, Clock, Send } from "lucide-react";
import CustomerSelector from "../../../components/admin/Messaging/CustomerSelector";
import Composer from "../../../components/admin/Messaging/Composer";
import MessageHistory from "../../../components/admin/Messaging/MessageHistory";
import MessageDetails from "../../../components/admin/Messaging/MessageDetails";
import SupportChat from "./components/SupportChat";
import { showSuccess, showLoading, closeLoading } from "../../../utils/alerts";

export default function Messaging() {
  const [activeTab, setActiveTab] = useState("support");
  
  // Campaign Logic
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Support Chat Logic
  const [isOnline] = useState(true);

  useEffect(() => {
    // Reusing customer data logic or fetching from customers.json
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/data/customers.json");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error loading customers", error);
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

  const handleSendMessage = (messageBody) => {
    showLoading("Sending messages...");
    setTimeout(() => {
      closeLoading();
      console.log("Message sent:", messageBody);
      showSuccess(`Successfully sent to ${selectedCustomerIds.length} customers`);
      setSelectedCustomerIds([]);
      setActiveTab("history");
    }, 1500);
  };

  return (
    <div className="pb-8 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messaging Center</h1>
          <p className="text-gray-500 text-sm">Manage campaigns and support</p>
        </div>
        
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
           <button
            onClick={() => setActiveTab("support")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "support" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <MessageCircle size={18} />
            Support Chat
          </button>
          <button
            onClick={() => setActiveTab("compose")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "compose" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Send size={18} />
            Campaigns
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
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === "support" && (
            <SupportChat isOnline={isOnline} />
        )}

        {activeTab === "compose" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full p-6">
            <div className="lg:col-span-1 h-full">
              <CustomerSelector 
                customers={customers} 
                selectedIds={selectedCustomerIds}
                onSelect={handleSelectCustomer}
                onSelectAll={handleSelectAll}
              />
            </div>
            <div className="lg:col-span-2 h-full">
              <Composer 
                recipientCount={selectedCustomerIds.length} 
                onSend={handleSendMessage} 
              />
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="h-full p-6">
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
