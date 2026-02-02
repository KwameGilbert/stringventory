import React from 'react';
import { Search } from 'lucide-react';

export default function ContactList({ contacts, activeContactId, onSelectContact }) {
  return (
    <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-emerald-500 focus:ring-0 transition-all"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0 text-left
              ${activeContactId === contact.id ? 'bg-emerald-50 hover:bg-emerald-50' : ''}
            `}
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                {contact.initials}
              </div>
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                ${contact.status === 'online' ? 'bg-green-500' : 
                  contact.status === 'away' ? 'bg-amber-500' : 'bg-gray-400'}
              `} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={`text-sm font-semibold truncate ${activeContactId === contact.id ? 'text-emerald-900' : 'text-gray-900'}`}>
                  {contact.name}
                </h3>
                <span className="text-xs text-gray-500">{contact.time}</span>
              </div>
              <p className={`text-sm truncate ${contact.unread > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                {contact.lastMessage}
              </p>
            </div>
            {contact.unread > 0 && (
              <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                {contact.unread}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
