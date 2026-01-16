import { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare, Clock, Send, Users } from "lucide-react";
import CustomerSelector from "./CustomerSelector";
import Composer from "./Composer";
import MessageHistory from "./MessageHistory";
import MessageDetails from "./MessageDetails";

export default function Messaging() {
  const [activeTab, setActiveTab] = useState("compose");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null); // For details modal

  useEffect(() => {
    // Load customers for the selector
    axios.get("/data/customers.json")
      .then(res => setCustomers(res.data))
      .catch(err => console.error("Error loading customers", err));
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
    // Mock send logic
    alert(`Sending message to ${selectedCustomerIds.length} recipients:\n\n${messageBody}`);
    // In a real app, we would POST to an API here
    // Then clear selection or switch to history
    setSelectedCustomerIds([]);
    setActiveTab("history");
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-[calc(100vh-64px)] flex flex-col">
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
