import { useState, useEffect } from "react";
import { MessageCircle, Clock, Send, Sparkles } from "lucide-react";
import CustomerSelector from "../../../components/admin/Messaging/CustomerSelector";
import Composer from "../../../components/admin/Messaging/Composer";
import MessageHistory from "../../../components/admin/Messaging/MessageHistory";
import MessageDetails from "../../../components/admin/Messaging/MessageDetails";
import TemplateManager from "../../../components/admin/Messaging/TemplateManager";
import SupportChat from "./components/SupportChat";
import { showError, showSuccess, showLoading, closeLoading } from "../../../utils/alerts";
import customerService from "../../../services/customerService";
import messagingService from "../../../services/messagingService";

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
  const [activeTab, setActiveTab] = useState("support");
  
  // Campaign Logic
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Support Chat Logic
  const [isOnline] = useState(true);

  const [stagedTemplate, setStagedTemplate] = useState({ body: "", subject: "", channels: ["email"] });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingTemplates(true);
        const [custRes, tempRes] = await Promise.all([
          customerService.getCustomers(),
          messagingService.getTemplates()
        ]);
        
        setCustomers(extractCustomers(custRes).map(normalizeCustomer));
        setTemplates(extractTemplates(tempRes));
      } catch (error) {
        console.error("Error loading messaging data", error);
        showError(error?.message || "Failed to load initial data");
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchInitialData();
  }, []);

  const extractTemplates = (response) => {
    // Check for the most specific path first, then fall back
    const data = response?.data?.templates || response?.templates || response?.data || response;
    return Array.isArray(data) ? data : [];
  };

  const handleSelectTemplate = (template) => {
    // Map backend channel to frontend array
    let channels = ["email"];
    if (template.channel === 'sms') channels = ["sms"];
    else if (template.channel === 'multi') channels = ["email", "sms"];

    setStagedTemplate({
      body: template.body,
      subject: template.subject || "",
      channels: channels
    });
  };

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

  const handleSendMessage = async (campaignData) => {
    const { body, subject, channels } = campaignData;
    
    if (!selectedCustomerIds.length || !body?.trim()) {
      showError("Please select recipients and provide a message body.");
      return;
    }

    showLoading("Sending campaign...");
    try {
      await messagingService.sendBulkMessage({
        recipientIds: selectedCustomerIds,
        body,
        subject,
        channels
      });

      closeLoading();
      showSuccess(`Campaign successfully initiated for ${selectedCustomerIds.length} customers`);
      setSelectedCustomerIds([]);
      setStagedTemplate({ body: "", subject: "", channels: ["email"] });
      setActiveTab("history");
    } catch (error) {
      closeLoading();
      console.error("Failed to send message", error);
      showError(error?.message || "Failed to send messages");
    }
  };

  return (
    <div className="pb-4 animate-fade-in h-[calc(100vh-30px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messaging Center</h1>
          <p className="text-gray-500 text-sm">Manage campaigns, templates and support</p>
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
            onClick={() => setActiveTab("templates")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "templates" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Sparkles size={18} />
            Templates
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
      <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === "support" && (
            <SupportChat isOnline={isOnline} />
        )}

        {activeTab === "compose" && (
          <div className="grid grid-cols-12 gap-6 h-full p-6 min-h-0 bg-gray-50/30">
            {/* Pane 1: Audience */}
            <div className="col-span-12 lg:col-span-3 h-full min-h-0">
              <CustomerSelector 
                customers={customers} 
                selectedIds={selectedCustomerIds}
                onSelect={handleSelectCustomer}
                onSelectAll={handleSelectAll}
              />
            </div>

            {/* Pane 2: Composer */}
            <div className="col-span-12 lg:col-span-6 h-full min-h-0">
              <Composer 
                recipientCount={selectedCustomerIds.length} 
                onSend={handleSendMessage} 
                initialMessage={stagedTemplate.body}
                initialSubject={stagedTemplate.subject}
                initialChannels={stagedTemplate.channels}
              />
            </div>

            {/* Pane 3: Templates Sidebar */}
            <div className="col-span-12 lg:col-span-3 h-full min-h-0 flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full overflow-hidden">
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Sparkles size={20} className="text-amber-500" />
                    Library
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">Quickly apply campaign templates</p>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
                  {loadingTemplates ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : templates.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleSelectTemplate(template)}
                          className="w-full text-left p-4 rounded-2xl border border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group scale-100 active:scale-95"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 truncate">
                              {template.name}
                            </p>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded group-hover:bg-emerald-100 group-hover:text-emerald-600">
                              {template.channel === 'multi' ? 'Omni' : template.channel}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed opacity-70">
                            {template.body}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Sparkles size={32} className="text-gray-200 mb-2" />
                      <p className="text-xs text-gray-400 font-medium">No templates available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="h-full p-6 overflow-auto">
             <TemplateManager 
               templates={templates} 
               onUpdate={() => {
                 // Refresh templates after change
                 messagingService.getTemplates().then(res => setTemplates(extractTemplates(res)));
               }}
             />
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
