import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Siderbar";
import Footer from "./Footer";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleMobileSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDesktopSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);
  const closeMobileSidebar = () => setSidebarOpen(false);

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ease-in-out`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        mobileOpen={sidebarOpen} 
        onClose={closeMobileSidebar}
        isOpen={isSidebarExpanded}
        onToggle={toggleDesktopSidebar}
      />

      {/* Main Content Area - responsive margin */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? "lg:ml-64" : "lg:ml-20"}`}>
        {/* Header with mobile menu toggle */}
        <Header 
          onMenuToggle={toggleMobileSidebar} 
          isSidebarExpanded={isSidebarExpanded}
        />

        {/* Page Content */}
        <main className="pt-24 px-4 sm:px-6 pb-12 min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
