import { useState } from "react";
import { X, MessageSquare, Mail, Phone } from "lucide-react";

export default function SendMessageModal({ isOpen, onClose, customer }) {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("sms");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending message:", { customer, channel, message });
    // Here you would integrate with your messaging service
    alert(`Message sent via ${channel.toUpperCase()} to ${customer.name}`);
    setMessage("");
    onClose();
  };

  const channels = [
    { id: "sms", label: "SMS", icon: Phone, color: "blue" },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "green" },
    { id: "email", label: "Email", icon: Mail, color: "emerald " }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Send Message</h2>
              <p className="text-sm text-gray-500">{customer?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Channel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {channels.map((ch) => {
                const Icon = ch.icon;
                const isSelected = channel === ch.id;
                const colorClasses = {
                  blue: isSelected ? "bg-blue-100 border-blue-500 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300",
                  green: isSelected ? "bg-green-100 border-green-500 text-green-700" : "border-gray-200 text-gray-600 hover:border-green-300",
                  emerald : isSelected ? "bg-emerald-100 border-emerald-500 text-emerald-700" : "border-gray-200 text-gray-600 hover:border-emerald-300"
                };

                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setChannel(ch.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${colorClasses[ch.color]}`}
                  >
                    <Icon size={20} />
                    <span className="text-xs font-medium">{ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Recipient</p>
            <div className="flex items-center gap-2 text-sm">
              {channel === "email" && (
                <>
                  <Mail size={14} className="text-gray-400" />
                  <span className="font-medium text-gray-900">{customer?.email}</span>
                </>
              )}
              {(channel === "sms" || channel === "whatsapp") && (
                <>
                  <Phone size={14} className="text-gray-400" />
                  <span className="font-medium text-gray-900">{customer?.phone}</span>
                </>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              placeholder={`Type your ${channel} message here...`}
              required
            />
            <p className="text-xs text-gray-400 mt-1">{message.length} characters</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
