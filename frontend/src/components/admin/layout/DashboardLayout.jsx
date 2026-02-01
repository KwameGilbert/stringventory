import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Siderbar";
import Footer from "./Footer";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ease-in-out`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        mobileOpen={sidebarOpen} 
        onClose={closeSidebar} 
      />

      {/* Main Content Area - responsive margin */}
      <div className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
        {/* Header with mobile menu toggle */}
        <Header onMenuToggle={toggleSidebar} />

        {/* Page Content */}
        <main className="pt-20 px-4 sm:px-6 py-4 sm:py-6 pb-20 min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
