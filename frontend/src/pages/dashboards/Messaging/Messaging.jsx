import { useState, useEffect } from "react";
import axios from "axios";
import CustomerSelector from "../../../components/admin/Messaging/CustomerSelector";
import Composer from "../../../components/admin/Messaging/Composer";
import { showSuccess, showLoading, closeLoading } from "../../../utils/alerts";

export default function Messaging() {
  const [customers, setCustomers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    // Reusing customer data from sales module or mock data
    const fetchCustomers = async () => {
      try {
        // Fallback to reports mock data if customers.json doesn't exist yet, 
        // effectively simulating customer fetch
        const response = await axios.get("/data/reports.json"); 
        if (response.data?.customerPerformance) {
           // Mapping mock report data to customer format
           const mappedCustomers = response.data.customerPerformance.map(c => ({
             id: c.id,
             customerName: c.customerName,
             email: `${c.customerName.toLowerCase().replace(' ', '.')}@example.com`
           }));
           setCustomers(mappedCustomers);
        }
      } catch (error) {
        console.error("Error loading customers", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === customers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(customers.map(c => c.id));
    }
  };

  const handleSend = (message) => {
    showLoading("Sending messages...");
    setTimeout(() => {
      closeLoading();
      showSuccess(`Successfully sent to ${selectedIds.length} customers`);
      setSelectedIds([]);
    }, 1500);
  };

  return (
    <div className="pb-8 animate-fade-in h-[calc(100vh-140px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messaging</h1>
        <p className="text-gray-500 text-sm">Send bulk SMS or emails to your customers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-1 h-full">
          <CustomerSelector 
            customers={customers} 
            selectedIds={selectedIds} 
            onSelect={handleSelect} 
            onSelectAll={handleSelectAll} 
          />
        </div>
        <div className="lg:col-span-2 h-full">
          <Composer 
            recipientCount={selectedIds.length} 
            onSend={handleSend} 
          />
        </div>
      </div>
    </div>
  );
}
