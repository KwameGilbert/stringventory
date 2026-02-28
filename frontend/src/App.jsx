import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
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
import { ROLES } from "./utils/accessControl";


export default function App() {
  const allRoles = [ROLES.CEO, ROLES.MANAGER, ROLES.SALES];
  const managementRoles = [ROLES.CEO, ROLES.MANAGER];
  const ceoOnly = [ROLES.CEO];

  const withRoles = (allowedRoles, element) => (
    <RoleRoute allowedRoles={allowedRoles}>{element}</RoleRoute>
  );

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
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Routes>
                          <Route path="/" element={withRoles(allRoles, <Dashboard />)} />
                          <Route path="/categories" element={withRoles(allRoles, <Categories />)} />
                          <Route path="/categories/new" element={withRoles(managementRoles, <CreateCategory />)} />
                          <Route path="/categories/:id" element={withRoles(allRoles, <ViewCategory />)} />
                          <Route path="/categories/:id/edit" element={withRoles(managementRoles, <EditCategory />)} />
                          <Route path="/products" element={withRoles(allRoles, <Products />)} />
                          <Route path="/products/new" element={withRoles(managementRoles, <CreateProduct />)} />
                          <Route path="/products/:id" element={withRoles(allRoles, <ViewProduct />)} />
                          <Route path="/products/:id/edit" element={withRoles(managementRoles, <EditProduct />)} />
                          <Route path="/purchases" element={withRoles(managementRoles, <Purchases />)} />
                          <Route path="/purchases/new" element={withRoles(managementRoles, <CreatePurchase />)} />
                          <Route path="/purchases/:id" element={withRoles(managementRoles, <ViewPurchase />)} />
                          <Route path="/purchases/:id/edit" element={withRoles(managementRoles, <EditPurchase />)} />
                          <Route path="/inventory" element={withRoles(managementRoles, <Inventory />)} />
                          <Route path="/inventory/new" element={withRoles(managementRoles, <AddInventory />)} />
                          <Route path="/inventory/:id" element={withRoles(managementRoles, <ViewInventory />)} />
                          <Route path="/orders" element={withRoles(allRoles, <Orders />)} />
                          <Route path="/orders/new" element={withRoles(allRoles, <CreateOrder />)} />
                          <Route path="/orders/:id/refund" element={withRoles(managementRoles, <CreateRefund />)} />
                          <Route path="/orders/:id" element={withRoles(allRoles, <ViewOrder />)} />
                         
                          {/* <Route path="/sales" element={<SalesMain />} /> */}
                          
                          <Route path="/suppliers" element={withRoles(managementRoles, <Suppliers />)} />
                          <Route path="/suppliers/new" element={withRoles(managementRoles, <CreateSupplier />)} />
                          <Route path="/suppliers/:id" element={withRoles(managementRoles, <ViewSupplier />)} />
                          <Route path="/suppliers/:id/edit" element={withRoles(managementRoles, <EditSupplier />)} />
                          <Route path="/refunds" element={withRoles(managementRoles, <CreateRefund />)} />
                          <Route path="/customers" element={withRoles(allRoles, <Customers />)} />
                          <Route path="/customers/new" element={withRoles(managementRoles, <CreateCustomer />)} />
                          <Route path="/customers/:id" element={withRoles(allRoles, <ViewCustomer />)} />
                          <Route path="/customers/:id/edit" element={withRoles(managementRoles, <EditCustomer />)} />
                          <Route path="/expenses" element={withRoles(managementRoles, <Expenses />)} />
                          <Route path="/expenses/new" element={withRoles(managementRoles, <AddExpense />)} />
                          <Route path="/expenses/:id" element={withRoles(managementRoles, <ViewExpense />)} />
                          <Route path="/expenses/:id/edit" element={withRoles(managementRoles, <EditExpense />)} />
                          <Route path="/expenses/categories" element={withRoles(managementRoles, <ExpenseCategories />)} />
                          <Route path="/reports" element={withRoles(managementRoles, <Reports />)} />
                          <Route path="/users" element={withRoles(managementRoles, <Users />)} />
                          <Route path="/users/new" element={withRoles(ceoOnly, <AddUser />)} />
                          <Route path="/users/:id" element={withRoles(managementRoles, <ViewUser />)} />
                          <Route path="/users/:id/edit" element={withRoles(managementRoles, <EditUser />)} />
                          <Route path="/messaging" element={withRoles(managementRoles, <Messaging />)} />
                          <Route path="/settings" element={withRoles(managementRoles, <Settings />)} />
                          <Route path="/notifications" element={withRoles(allRoles, <Notifications />)} />
                          <Route path="/profile" element={withRoles(allRoles, <Profile />)} />
                        </Routes>
                      </DashboardLayout>
                    </ProtectedRoute>
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



