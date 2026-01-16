import { useState } from "react";
import { Send, Sparkles, X } from "lucide-react";

export default function Composer({ recipientCount, onSend }) {
  const [message, setMessage] = useState("");
  const [templates] = useState([
    { id: 1, title: "New Stock Arrival", body: "Hello! We've just received new stock of your favorite items. Visit us today to check them out!" },
    { id: 2, title: "Order Thank You", body: "Thank you for your recent order! We appreciate your business and look forward to serving you again." },
    { id: 3, title: "Payment Reminder", body: "Friendly reminder regarding your outstanding payment. Please settle at your earliest convenience." }
  ]);

  const handleTemplateClick = (body) => {
    setMessage(body);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col">
        <h2 className="font-bold text-gray-900 mb-4">Compose Message</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {recipientCount > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
              Recipients: {recipientCount} selected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
              No recipients selected
            </span>
          )}
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
        />
        
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-gray-400">
            {message.length} characters
          </p>
          <button
            onClick={() => onSend(message)}
            disabled={!message || recipientCount === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-lg shadow-gray-900/10"
          >
            <Send size={16} />
            Send Message
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Quick Templates
        </h3>
        <div className="space-y-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template.body)}
              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-all group"
            >
              <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                {template.title}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5 opacity-80">
                {template.body}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
