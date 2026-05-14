import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Image as ImageIcon, 
  Phone, 
  Video, 
  MoreVertical, 
  Check, 
  CheckCheck 
} from "lucide-react";

export default function SupportChat({ isOnline }) {
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef(null);
  const [supportMessages, setSupportMessages] = useState([
    { id: 1, sender: 'them', text: 'Welcome to StringVentory Support! How can we help you today?', time: '09:00 AM', status: 'read' }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [supportMessages]);

  const handleSupportSend = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setSupportMessages(prev => [...prev, newMessage]);
    setChatInput('');

    // Simulate Auto-Reply
    setTimeout(() => {
        const reply = {
            id: Date.now() + 1,
            sender: 'them',
            text: "Thanks for reaching out! A support agent will be with you shortly.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };
        setSupportMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSupportSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
            SV
          </div>
          <div>
            <h3 className="font-bold text-gray-900">StringVentory Support</h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {supportMessages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] group flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs mt-1 self-end">
                    SV
                  </div>
                )}
                <div className={`space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm shadow-sm
                    ${isMe 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none'}
                    `}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{msg.time}</span>
                    {isMe && (
                      msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="bg-gray-50 rounded-xl p-2 flex items-end gap-2 border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
          <div className="flex gap-1 pb-1">
            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message to support..."
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-2 max-h-32 text-sm text-gray-900 placeholder:text-gray-400"
            rows={1}
          />
          <div className="flex gap-1 pb-1">
            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSupportSend}
              disabled={!chatInput.trim()}
              className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">Press Enter to send, Shift + Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
