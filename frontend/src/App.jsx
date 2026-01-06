import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/(dashboards)/Dashboard/Dashboard";
import Header from "./components/admin/layout/Header";
import Sidebar from "./components/admin/layout/Siderbar";
import Login from "./pages/login/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route - No Layout */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Routes - With Sidebar and Header */}
        <Route
          path="/dashboard/*"
          element={
            <div className="flex min-h-screen bg-gray-50">
              {/* Sidebar */}
              <Sidebar />

              {/* Main Content Area */}
              <div className="flex-1 ml-72">
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="pt-20 px-6 py-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
