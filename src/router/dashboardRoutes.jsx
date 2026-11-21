import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleRoute from "../components/auth/RoleRoute";
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";
import { ROLES } from "../utils/accessControl";

// Lazy-loaded Dashboard pages
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard/Dashboard"));
const Categories = lazy(() => import("../pages/dashboard/Categories/Categories"));
const CreateCategory = lazy(() => import("../pages/dashboard/Categories/CreateCategory"));
const EditCategory = lazy(() => import("../pages/dashboard/Categories/EditCategory"));
const ViewCategory = lazy(() => import("../pages/dashboard/Categories/ViewCategory"));
const Products = lazy(() => import("../pages/dashboard/Products/Products"));
const CreateProduct = lazy(() => import("../pages/dashboard/Products/CreateProduct"));
const EditProduct = lazy(() => import("../pages/dashboard/Products/EditProduct"));
const ViewProduct = lazy(() => import("../pages/dashboard/Products/ViewProduct"));
const Purchases = lazy(() => import("../pages/dashboard/Purchases/Purchases"));
const ViewPurchase = lazy(() => import("../pages/dashboard/Purchases/ViewPurchase"));
const CreatePurchase = lazy(() => import("../pages/dashboard/Purchases/CreatePurchase"));
const EditPurchase = lazy(() => import("../pages/dashboard/Purchases/EditPurchase"));
const Inventory = lazy(() => import("../pages/dashboard/Inventory/Inventory"));
const AddInventory = lazy(() => import("../pages/dashboard/Inventory/AddInventory"));
const EditInventory = lazy(() => import("../pages/dashboard/Inventory/EditInventory"));
const ViewInventory = lazy(() => import("../pages/dashboard/Inventory/ViewInventory"));
const Orders = lazy(() => import("../pages/dashboard/Orders/Orders"));
const ViewOrder = lazy(() => import("../pages/dashboard/Orders/ViewOrder"));
const CreateOrder = lazy(() => import("../pages/dashboard/Orders/CreateOrder"));
const CreateRefund = lazy(() => import("../pages/dashboard/Orders/CreateRefund"));
const Refunds = lazy(() => import("../pages/dashboard/Refunds/Refunds"));
const ViewRefund = lazy(() => import("../pages/dashboard/Refunds/ViewRefund"));
const Transactions = lazy(() => import("../pages/dashboard/Transactions/Transactions"));
const ViewTransaction = lazy(() => import("../pages/dashboard/Transactions/ViewTransaction"));
const Customers = lazy(() => import("../pages/dashboard/Customers/Customers"));
const ViewCustomer = lazy(() => import("../pages/dashboard/Customers/ViewCustomer"));
const CreateCustomer = lazy(() => import("../pages/dashboard/Customers/CreateCustomer"));
const EditCustomer = lazy(() => import("../pages/dashboard/Customers/EditCustomer"));
const Expenses = lazy(() => import("../pages/dashboard/Expenses/Expenses"));
const AddExpense = lazy(() => import("../pages/dashboard/Expenses/AddExpense"));
const ViewExpense = lazy(() => import("../pages/dashboard/Expenses/ViewExpense"));
const EditExpense = lazy(() => import("../pages/dashboard/Expenses/EditExpense"));
const ExpenseCategories = lazy(() => import("../pages/dashboard/Expenses/ExpenseCategories"));
const Reports = lazy(() => import("../pages/dashboard/Reports/Reports"));
const Users = lazy(() => import("../pages/dashboard/Users/Users"));
const AddUser = lazy(() => import("../pages/dashboard/Users/AddUser"));
const EditUser = lazy(() => import("../pages/dashboard/Users/EditUser"));
const ViewUser = lazy(() => import("../pages/dashboard/Users/ViewUser"));
const ActivityLogs = lazy(() => import("../pages/dashboard/ActivityLogs/ActivityLogs"));
const Suppliers = lazy(() => import("../pages/dashboard/Suppliers/Suppliers"));
const CreateSupplier = lazy(() => import("../pages/dashboard/Suppliers/CreateSupplier"));
const EditSupplier = lazy(() => import("../pages/dashboard/Suppliers/EditSupplier"));
const ViewSupplier = lazy(() => import("../pages/dashboard/Suppliers/ViewSupplier"));
const Messaging = lazy(() => import("../pages/dashboard/Messaging/Messaging"));
const Settings = lazy(() => import("../pages/dashboard/Settings/Settings"));
const Notifications = lazy(() => import("../pages/dashboard/Notifications/Notifications"));
const Profile = lazy(() => import("../pages/dashboard/Profile/Profile"));

const allRoles = [ROLES.CEO, ROLES.MANAGER, ROLES.SALES];
const managementRoles = [ROLES.CEO, ROLES.MANAGER];
const ceoOnly = [ROLES.CEO];

const withRoles = (allowedRoles, element) => (
  <RoleRoute allowedRoles={allowedRoles}>{element}</RoleRoute>
);

const dashboardRoutes = (
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
            <Route path="/inventory/:id/edit" element={withRoles(managementRoles, <EditInventory />)} />
            <Route path="/orders" element={withRoles(allRoles, <Orders />)} />
            <Route path="/orders/new" element={withRoles(allRoles, <CreateOrder />)} />
            <Route path="/orders/:id/refund" element={withRoles(allRoles, <CreateRefund />)} />
            <Route path="/orders/:id" element={withRoles(allRoles, <ViewOrder />)} />
            <Route path="/suppliers" element={withRoles(managementRoles, <Suppliers />)} />
            <Route path="/suppliers/new" element={withRoles(managementRoles, <CreateSupplier />)} />
            <Route path="/suppliers/:id" element={withRoles(managementRoles, <ViewSupplier />)} />
            <Route path="/suppliers/:id/edit" element={withRoles(managementRoles, <EditSupplier />)} />
            <Route path="/refunds" element={withRoles(managementRoles, <Refunds />)} />
            <Route path="/refunds/:id" element={withRoles(managementRoles, <ViewRefund />)} />
            <Route path="/transactions" element={withRoles(managementRoles, <Transactions />)} />
            <Route path="/transactions/:id" element={withRoles(managementRoles, <ViewTransaction />)} />
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
            <Route path="/activity-logs" element={withRoles(managementRoles, <ActivityLogs />)} />
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
);

export default dashboardRoutes;
