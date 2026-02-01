import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  ImageIcon, 
  Smile, 
  Send,
  Check,
  CheckCheck
} from 'lucide-react';

export default function ChatArea({ activeContact, messages, onSendMessage }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeContact) {
    return <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">Select a contact to start messaging</div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
            {activeContact.initials}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{activeContact.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-2 h-2 rounded-full ${activeContact.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
              {activeContact.adminName} • {activeContact.status === 'online' ? 'Online' : 'Offline'}
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] group flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                       <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs mt-1 self-end">
                          {activeContact.initials}
                      </div>
                  )}
                <div className={`space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                   <div
                      className={`px-4 py-2 rounded-2xl text-sm shadow-sm
                      ${isMe 
                          ? 'bg-purple-600 text-white rounded-br-none' 
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
        <div className="bg-gray-50 rounded-xl p-2 flex items-end gap-2 border border-gray-200 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
          <div className="flex gap-1 pb-1">
              <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
              </button>
               <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <ImageIcon className="w-5 h-5" />
              </button>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-2 max-h-32 text-sm text-gray-900 placeholder:text-gray-400"
            rows={1}
          />
          
          <div className="flex gap-1 pb-1">
               <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <Smile className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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
