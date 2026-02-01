import { useState } from 'react';
import ContactList from './components/ContactList';
import ChatArea from './components/ChatArea';

export default function Messaging() {
  const [activeContactId, setActiveContactId] = useState(1);

  // Mock Contacts Data
  const [contacts] = useState([
    { 
      id: 1, 
      name: 'TechStart Inc.', 
      avatar: null, 
      initials: 'TS', 
      status: 'online', 
      lastMessage: 'Thanks for the update!', 
      time: '10:30 AM', 
      unread: 0,
      adminName: 'John Doe'
    },
    { 
      id: 2, 
      name: 'Global Logistics', 
      avatar: null, 
      initials: 'GL', 
      status: 'offline', 
      lastMessage: 'Can we schedule a call?', 
      time: 'Yesterday', 
      unread: 2,
      adminName: 'Sarah Smith'
    },
    { 
      id: 3, 
      name: 'Creative Agency', 
      avatar: null, 
      initials: 'CA', 
      status: 'online', 
      lastMessage: 'Payment issue resolved.', 
      time: 'Yesterday', 
      unread: 0,
      adminName: 'Mike Jones'
    },
    { 
      id: 4, 
      name: 'Foodie Express', 
      avatar: null, 
      initials: 'FE', 
      status: 'away', 
      lastMessage: 'New menu items added.', 
      time: 'Mon', 
      unread: 0,
      adminName: 'Chef Ramsey'
    },
    { 
      id: 5, 
      name: 'BuildIt Construction', 
      avatar: null, 
      initials: 'BC', 
      status: 'offline', 
      lastMessage: 'Looking into the server logs.', 
      time: 'Mon', 
      unread: 0,
      adminName: 'Bob Builder'
    }
  ]);

  // Mock Messages Data
  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: 'them', text: 'Hi, we are having some trouble with the inventory export.', time: '10:00 AM', status: 'read' },
      { id: 2, sender: 'me', text: 'Hello! I can help with that. What format are you trying to export to?', time: '10:05 AM', status: 'read' },
      { id: 3, sender: 'them', text: 'We need CSV format for our accounting software.', time: '10:15 AM', status: 'read' },
      { id: 4, sender: 'me', text: 'Understood. Please try clearing your cache and trying again. We pushed a fix for CSV exports this morning.', time: '10:20 AM', status: 'read' },
      { id: 5, sender: 'them', text: 'Thanks for the update! It works now.', time: '10:30 AM', status: 'read' }
    ],
    2: [
      { id: 1, sender: 'them', text: 'Hi Admin, quick question.', time: 'Yesterday', status: 'read' },
      { id: 2, sender: 'them', text: 'Can we schedule a call to discuss the enterprise plan?', time: 'Yesterday', status: 'delivered' }
    ],
    3: [], 4: [], 5: []
  });

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
