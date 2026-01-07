import Header from "./Header";
import Sidebar from "./Siderbar";
import Footer from "./Footer";

const DashboardLayout = ({ children }) => {
  return (
    <div className={`flex min-h-screen transition-colors duration-500 ease-in-out`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="pt-20 px-6 py-6 pb-20 min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
