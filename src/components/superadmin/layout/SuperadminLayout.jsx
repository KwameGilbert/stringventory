import { useState } from 'react';
import SuperadminSidebar from './SuperadminSidebar';
import SuperadminHeader from './SuperadminHeader';

export default function SuperadminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - hidden on mobile by default, shown as overlay when open */}
      <div className={`
        fixed top-0 left-0 h-screen z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SuperadminSidebar onClose={closeSidebar} />
      </div>

      {/* Main content - full width on mobile, offset on desktop */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header with mobile menu toggle */}
        <div className="sticky top-0 z-20">
          <SuperadminHeader onMenuToggle={toggleSidebar} />
        </div>

        {/* Page content - scrollable */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
