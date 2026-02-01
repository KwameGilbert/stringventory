import SuperadminSidebar from './SuperadminSidebar';
import SuperadminHeader from './SuperadminHeader';

export default function SuperadminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-30">
        <SuperadminSidebar />
      </div>

      {/* Main content with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Header */}
        <div className="sticky top-0 z-20">
          <SuperadminHeader />
        </div>

        {/* Page content - scrollable */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
