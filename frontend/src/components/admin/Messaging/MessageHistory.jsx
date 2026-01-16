import { useState, useEffect } from "react";
import { Search, Mail, MessageSquare, ExternalLink, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import axios from "axios";

export default function MessageHistory({ onViewDetails }) {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    // Fetch bulk messages
    axios.get("/data/bulk-messages.json")
      .then(response => setMessages(response.data))
      .catch(err => console.error("Error loading messages:", err));
  }, []);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'sent': return 'bg-emerald-100 text-emerald-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'sent': return <CheckCircle size={14} />;
      case 'failed': return <AlertCircle size={14} />;
      case 'draft': return <Clock size={14} />;
      default: return null;
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          msg.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || msg.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-bold text-gray-900 text-lg mb-4">Message History</h2>
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto flex-1 p-0">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 sticky top-0 z-10 w-full">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Recipients</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMessages.map((msg) => (
              <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors group">
                <div className="hidden">{/* This div is structurally invalid in tbody, but needed for map? No, remove. */}</div>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 mb-1">{msg.subject}</p>
                  <p className="text-xs text-gray-500 truncate max-w-sm">{msg.body}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    msg.type === 'SMS' ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                    {msg.type === 'SMS' ? <MessageSquare size={12} /> : <Mail size={12} />}
                    {msg.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{msg.recipientCount}</span>
                    {msg.status === 'Sent' && (
                      <span className="text-[10px] text-gray-500">
                        {msg.successCount} sent, {msg.failureCount} failed
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(msg.status)}`}>
                    {getStatusIcon(msg.status)}
                    {msg.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onViewDetails(msg)}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="View Details"
                  >
                    <ExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium">No messages found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
