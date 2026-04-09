import { useState, useEffect } from "react";
import { Send, Sparkles, Mail, MessageSquare, Info } from "lucide-react";

export default function Composer({ recipientCount, onSend, initialMessage = "", initialSubject = "", initialChannels = ["email"] }) {
  const [message, setMessage] = useState(initialMessage);
  const [subject, setSubject] = useState(initialSubject);
  const [channels, setChannels] = useState(initialChannels);

  // Update internal state if props change (e.g. from template selection)
  useEffect(() => {
    if (initialMessage !== undefined) setMessage(initialMessage);
  }, [initialMessage]);

  useEffect(() => {
    if (initialSubject !== undefined) setSubject(initialSubject);
  }, [initialSubject]);

  useEffect(() => {
    if (initialChannels && initialChannels.length > 0) setChannels(initialChannels);
  }, [initialChannels]);

  const toggleChannel = (channel) => {
    setChannels(prev => 
      prev.includes(channel) 
        ? (prev.length > 1 ? prev.filter(c => c !== channel) : prev) 
        : [...prev, channel]
    );
  };

  const handleSend = () => {
    onSend({
      body: message,
      subject: channels.includes("email") ? subject : undefined,
      channels
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full flex flex-col min-h-0">
      <h2 className="font-bold text-gray-900 mb-6 text-lg">Compose Message</h2>
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-3">
          {recipientCount > 0 ? (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
              {recipientCount} Recipients
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-full uppercase tracking-wider">
              No Recipients
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleChannel("email")}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              channels.includes("email") 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm" 
                : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
            }`}
          >
            <Mail size={16} />
            Email
          </button>
          <button
            onClick={() => toggleChannel("sms")}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              channels.includes("sms") 
                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" 
                : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
            }`}
          >
            <MessageSquare size={16} />
            SMS
          </button>
        </div>
      </div>

      <div className="space-y-6 flex-1 flex flex-col min-h-0">
        {channels.includes("email") && (
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email Subject Line..."
            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-semibold transition-all"
          />
        )}

        <div className="flex-1 flex flex-col relative min-h-0">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 w-full p-6 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm leading-relaxed"
          />
          
          <div className="absolute bottom-4 right-4 flex items-center gap-3">
             <div className="group relative">
              <Info size={16} className="text-gray-400 cursor-help" />
              <div className="absolute bottom-full right-0 mb-3 w-56 p-3 bg-gray-900 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-2xl">
                <p className="font-bold mb-2">Available Placeholders:</p>
                <ul className="space-y-1">
                  <li className="flex justify-between"><span>First Name</span> <code className="text-emerald-400 font-bold">{"{{firstName}}"}</code></li>
                  <li className="flex justify-between"><span>Last Name</span> <code className="text-emerald-400 font-bold">{"{{lastName}}"}</code></li>
                  <li className="flex justify-between"><span>Business</span> <code className="text-emerald-400 font-bold">{"{{businessName}}"}</code></li>
                </ul>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-gray-400 bg-white px-3 py-1 border border-gray-100 rounded-lg">
              {message.length} chars
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSend}
          disabled={!message || recipientCount === 0 || (channels.includes("email") && !subject)}
          className="flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-xl shadow-gray-900/10 active:scale-95 shrink-0"
        >
          <Send size={20} />
          Send Campaign
        </button>
      </div>
    </div>
  );
}
