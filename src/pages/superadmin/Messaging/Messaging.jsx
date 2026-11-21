import { useState } from 'react';
import ContactList from './components/ContactList';
import ChatArea from './components/ChatArea';

export default function Messaging() {
  const [activeContactId, setActiveContactId] = useState(1);

  const [contacts] = useState([]);
  const [messages, setMessages] = useState({});

  const activeContact = contacts.find(c => c.id === activeContactId);
  const activeMessages = messages[activeContactId] || [];

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));

    // Simulate Auto-Reply
    setTimeout(() => {
        const reply = {
            id: Date.now() + 1,
            sender: 'them',
            text: "Thanks for your message. We'll get back to you shortly.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };
        setMessages(prev => ({
            ...prev,
            [activeContactId]: [...(prev[activeContactId] || []), reply]
          }));
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-8rem)] flex overflow-hidden">
      {/* Sidebar - Contact List */}
      <ContactList 
        contacts={contacts} 
        activeContactId={activeContactId} 
        onSelectContact={setActiveContactId} 
      />

      {/* Main Chat Area */}
      <ChatArea 
        activeContact={activeContact} 
        messages={activeMessages} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
}
