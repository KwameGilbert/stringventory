import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/dashboards/Dashboard/Dashboard";
import Categories from "./pages/dashboards/Categories/Categories";
import CreateCategory from "./pages/dashboards/Categories/CreateCategory";
import EditCategory from "./pages/dashboards/Categories/EditCategory";
import ViewCategory from "./pages/dashboards/Categories/ViewCategory";
import Products from "./pages/dashboards/products/Products";
import Inventory from "./pages/dashboards/Inventory/Inventory";
import Orders from "./pages/dashboards/Orders/Orders";
import Customers from "./pages/dashboards/Customers/Customers";
import Expenses from "./pages/dashboards/Expenses/Expenses";
import Reports from "./pages/dashboards/Reports/Reports";
import Users from "./pages/dashboards/Users/Users";
import Messaging from "./pages/dashboards/Messaging/Messaging";
import Settings from "./pages/dashboards/Settings/Settings";
import Notifications from "./pages/dashboards/Notifications/Notifications";
import Profile from "./pages/dashboards/Profile/Profile";
import Header from "./components/admin/layout/Header";
import Sidebar from "./components/admin/layout/Siderbar";
import Footer from "./components/admin/layout/Footer";
import DashboardLayout from "./components/admin/layout/DashboardLayout";
import Login from "./pages/login/Login";

function App() {
  return (
    <ThemeProvider>
      <Router>
      <Routes>
        {/* Login Route - No Layout */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Routes - With Sidebar and Header */}
        <Route
          path="/dashboard/*"
          element={
            <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/categories/new" element={<CreateCategory />} />
                    <Route path="/categories/:id" element={<ViewCategory />} />
                    <Route path="/categories/:id/edit" element={<EditCategory />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/messaging" element={<Messaging />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
