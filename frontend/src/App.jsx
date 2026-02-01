import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/dashboards/Dashboard/Dashboard";
import Categories from "./pages/dashboards/Categories/Categories";
import CreateCategory from "./pages/dashboards/Categories/CreateCategory";
import EditCategory from "./pages/dashboards/Categories/EditCategory";
import ViewCategory from "./pages/dashboards/Categories/ViewCategory";
import Products from "./pages/dashboards/products/Products";
import CreateProduct from "./pages/dashboards/products/CreateProduct";
import EditProduct from "./pages/dashboards/products/EditProduct";
import ViewProduct from "./pages/dashboards/products/ViewProduct";
import Purchases from "./pages/dashboards/Purchases/Purchases";
import ViewPurchase from "./pages/dashboards/Purchases/ViewPurchase";
import CreatePurchase from "./pages/dashboards/Purchases/CreatePurchase";
import EditPurchase from "./pages/dashboards/Purchases/EditPurchase";
import Inventory from "./pages/dashboards/Inventory/Inventory";
import AddInventory from "./pages/dashboards/Inventory/AddInventory";
import ViewInventory from "./pages/dashboards/Inventory/ViewInventory";
import Orders from "./pages/dashboards/Orders/Orders";
import ViewOrder from "./pages/dashboards/Orders/ViewOrder";
import CreateOrder from "./pages/dashboards/Orders/CreateOrder";
import CreateRefund from "./pages/dashboards/Orders/CreateRefund";
import SalesMain from "./pages/dashboards/Sales/SalesMain";
// POS, ViewSales, ViewSale, SalesRefund, PaymentPage imports removed
import Customers from "./pages/dashboards/Customers/Customers";
import ViewCustomer from "./pages/dashboards/Customers/ViewCustomer";
import CreateCustomer from "./pages/dashboards/Customers/CreateCustomer";
import EditCustomer from "./pages/dashboards/Customers/EditCustomer";
import Expenses from "./pages/dashboards/Expenses/Expenses";
import AddExpense from "./pages/dashboards/Expenses/AddExpense";
import ViewExpense from "./pages/dashboards/Expenses/ViewExpense";
import EditExpense from "./pages/dashboards/Expenses/EditExpense";
import ExpenseCategories from "./pages/dashboards/Expenses/ExpenseCategories";
import Reports from "./pages/dashboards/Reports/Reports";
import Users from "./pages/dashboards/Users/Users";
import AddUser from "./pages/dashboards/Users/AddUser";
import EditUser from "./pages/dashboards/Users/EditUser";
import CreateSupplier from "./pages/dashboards/Suppliers/CreateSupplier";
import EditSupplier from "./pages/dashboards/Suppliers/EditSupplier";
import ViewSupplier from "./pages/dashboards/Suppliers/ViewSupplier";
import Suppliers from "./pages/dashboards/Suppliers/Suppliers";
import UserPermissions from "./pages/dashboards/Users/UserPermissions";
import ViewUser from "./pages/dashboards/Users/ViewUser";
import Messaging from "./pages/dashboards/Messaging/Messaging";
import Settings from "./pages/dashboards/Settings/Settings";
import Notifications from "./pages/dashboards/Notifications/Notifications";
import Profile from "./pages/dashboards/Profile/Profile";
import Header from "./components/admin/layout/Header";
import Sidebar from "./components/admin/layout/Siderbar";
import Footer from "./components/admin/layout/Footer";
import DashboardLayout from "./components/admin/layout/DashboardLayout";
import Login from "./pages/login/Login";

// Superadmin imports
import SuperadminRoute from "./components/auth/SuperadminRoute";
import SuperadminLayout from "./components/superadmin/layout/SuperadminLayout";
import SuperadminDashboard from "./pages/superadmin/Dashboard/SuperadminDashboard";
import Businesses from "./pages/superadmin/Businesses/Businesses";
import BusinessDetails from "./pages/superadmin/Businesses/BusinessDetails";
import EditBusiness from "./pages/superadmin/Businesses/EditBusiness";
import AddBusiness from "./pages/superadmin/Businesses/AddBusiness";
import PricingPlans from "./pages/superadmin/PricingPlans/PricingPlans";
import CreatePricingPlan from "./pages/superadmin/PricingPlans/CreatePricingPlan";
import ViewPricingPlan from "./pages/superadmin/PricingPlans/ViewPricingPlan";
import Analytics from "./pages/superadmin/Analytics/Analytics";
import SuperadminSettings from "./pages/superadmin/Settings/Settings";
import SuperadminMessaging from "./pages/superadmin/Messaging/Messaging";
import SuperadminNotifications from "./pages/superadmin/Notifications/Notifications";
import SuperadminProfile from "./pages/superadmin/Profile/Profile";
import { TenantProvider } from "./contexts/TenantProvider";
import { SubscriptionProvider } from "./contexts/SubscriptionProvider";


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TenantProvider>
          <SubscriptionProvider>
            <Router>
              <Routes>
                {/* Login Route - No Layout */}
                <Route path="/" element={<Login />} />

                {/* Superadmin Routes */}
                <Route
                  path="/superadmin/*"
                  element={
                    <SuperadminRoute>
                      <SuperadminLayout>
                        <Routes>
                          <Route path="/" element={<SuperadminDashboard />} />
                          <Route path="/businesses" element={<Businesses />} />
                          <Route path="/businesses/new" element={<AddBusiness />} />
                          <Route path="/businesses/:id" element={<BusinessDetails />} />
                          <Route path="/businesses/edit/:id" element={<EditBusiness />} />
                          <Route path="/pricing-plans" element={<PricingPlans />} />
                          <Route path="/pricing-plans/new" element={<CreatePricingPlan />} />
                          <Route path="/pricing-plans/:id" element={<ViewPricingPlan />} />
                          <Route path="/pricing-plans/:id/edit" element={<CreatePricingPlan />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/settings" element={<SuperadminSettings />} />
                          <Route path="/messaging" element={<SuperadminMessaging />} />
                          <Route path="/notifications" element={<SuperadminNotifications />} />
                          <Route path="/profile" element={<SuperadminProfile />} />
                        </Routes>
                      </SuperadminLayout>
                    </SuperadminRoute>
                  }
                />

                {/* Dashboard Routes - With Sidebar and Header */}
                <Route
                  path="/dashboard/*"
                  element={
                    // <ProtectedRoute>
                      <DashboardLayout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/categories" element={<Categories />} />
                          <Route path="/categories/new" element={<CreateCategory />} />
                          <Route path="/categories/:id" element={<ViewCategory />} />
                          <Route path="/categories/:id/edit" element={<EditCategory />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/products/new" element={<CreateProduct />} />
                          <Route path="/products/:id" element={<ViewProduct />} />
                          <Route path="/products/:id/edit" element={<EditProduct />} />
                          <Route path="/purchases" element={<Purchases />} />
                          <Route path="/purchases/new" element={<CreatePurchase />} />
                          <Route path="/purchases/:id" element={<ViewPurchase />} />
                          <Route path="/purchases/:id/edit" element={<EditPurchase />} />
                          <Route path="/inventory" element={<Inventory />} />
                          <Route path="/inventory/new" element={<AddInventory />} />
                          <Route path="/inventory/:id" element={<ViewInventory />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/orders/new" element={<CreateOrder />} />
                          <Route path="/orders/:id/refund" element={<CreateRefund />} />
                          <Route path="/orders/:id" element={<ViewOrder />} />
                         
                          {/* <Route path="/sales" element={<SalesMain />} /> */}
                          
                          <Route path="/suppliers" element={<Suppliers />} />
                          <Route path="/suppliers/new" element={<CreateSupplier />} />
                          <Route path="/suppliers/:id" element={<ViewSupplier />} />
                          <Route path="/suppliers/:id/edit" element={<EditSupplier />} />
                          <Route path="/refunds" element={<CreateRefund />} />
                          <Route path="/customers" element={<Customers />} />
                          <Route path="/customers/new" element={<CreateCustomer />} />
                          <Route path="/customers/:id" element={<ViewCustomer />} />
                          <Route path="/customers/:id/edit" element={<EditCustomer />} />
                          <Route path="/expenses" element={<Expenses />} />
                          <Route path="/expenses/new" element={<AddExpense />} />
                          <Route path="/expenses/:id" element={<ViewExpense />} />
                          <Route path="/expenses/:id/edit" element={<EditExpense />} />
                          <Route path="/expenses/categories" element={<ExpenseCategories />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/users" element={<Users />} />
                          <Route path="/users/new" element={<AddUser />} />
                          <Route path="/users/:id" element={<ViewUser />} />
                          <Route path="/users/:id/edit" element={<EditUser />} />
                          <Route path="/users/:id/permissions" element={<UserPermissions />} />
                          <Route path="/messaging" element={<Messaging />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/notifications" element={<Notifications />} />
                          <Route path="/profile" element={<Profile />} />
                        </Routes>
                      </DashboardLayout>
                    // </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </SubscriptionProvider>
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}



