import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import RoleRoute from "../components/auth/RoleRoute";
import DashboardLayout from "../components/admin/layout/DashboardLayout";
import { ROLES } from "../utils/accessControl";

// Lazy-loaded Dashboard pages
const Dashboard = lazy(() => import("../pages/dashboards/Dashboard/Dashboard"));
const Categories = lazy(() => import("../pages/dashboards/Categories/Categories"));
const CreateCategory = lazy(() => import("../pages/dashboards/Categories/CreateCategory"));
const EditCategory = lazy(() => import("../pages/dashboards/Categories/EditCategory"));
const ViewCategory = lazy(() => import("../pages/dashboards/Categories/ViewCategory"));
const Products = lazy(() => import("../pages/dashboards/Products/Products"));
const CreateProduct = lazy(() => import("../pages/dashboards/Products/CreateProduct"));
const EditProduct = lazy(() => import("../pages/dashboards/Products/EditProduct"));
const ViewProduct = lazy(() => import("../pages/dashboards/Products/ViewProduct"));
const Purchases = lazy(() => import("../pages/dashboards/Purchases/Purchases"));
const ViewPurchase = lazy(() => import("../pages/dashboards/Purchases/ViewPurchase"));
const CreatePurchase = lazy(() => import("../pages/dashboards/Purchases/CreatePurchase"));
const EditPurchase = lazy(() => import("../pages/dashboards/Purchases/EditPurchase"));
const Inventory = lazy(() => import("../pages/dashboards/Inventory/Inventory"));
const AddInventory = lazy(() => import("../pages/dashboards/Inventory/AddInventory"));
const EditInventory = lazy(() => import("../pages/dashboards/Inventory/EditInventory"));
const ViewInventory = lazy(() => import("../pages/dashboards/Inventory/ViewInventory"));
const Orders = lazy(() => import("../pages/dashboards/Orders/Orders"));
const ViewOrder = lazy(() => import("../pages/dashboards/Orders/ViewOrder"));
const CreateOrder = lazy(() => import("../pages/dashboards/Orders/CreateOrder"));
const CreateRefund = lazy(() => import("../pages/dashboards/Orders/CreateRefund"));
const Refunds = lazy(() => import("../pages/dashboards/Refunds/Refunds"));
const ViewRefund = lazy(() => import("../pages/dashboards/Refunds/ViewRefund"));
const Transactions = lazy(() => import("../pages/dashboards/Transactions/Transactions"));
const ViewTransaction = lazy(() => import("../pages/dashboards/Transactions/ViewTransaction"));
const Customers = lazy(() => import("../pages/dashboards/Customers/Customers"));
const ViewCustomer = lazy(() => import("../pages/dashboards/Customers/ViewCustomer"));
const CreateCustomer = lazy(() => import("../pages/dashboards/Customers/CreateCustomer"));
const EditCustomer = lazy(() => import("../pages/dashboards/Customers/EditCustomer"));
const Expenses = lazy(() => import("../pages/dashboards/Expenses/Expenses"));
const AddExpense = lazy(() => import("../pages/dashboards/Expenses/AddExpense"));
const ViewExpense = lazy(() => import("../pages/dashboards/Expenses/ViewExpense"));
const EditExpense = lazy(() => import("../pages/dashboards/Expenses/EditExpense"));
const ExpenseCategories = lazy(() => import("../pages/dashboards/Expenses/ExpenseCategories"));
const Reports = lazy(() => import("../pages/dashboards/Reports/Reports"));
const Users = lazy(() => import("../pages/dashboards/Users/Users"));
const AddUser = lazy(() => import("../pages/dashboards/Users/AddUser"));
const EditUser = lazy(() => import("../pages/dashboards/Users/EditUser"));
const ViewUser = lazy(() => import("../pages/dashboards/Users/ViewUser"));
const Suppliers = lazy(() => import("../pages/dashboards/Suppliers/Suppliers"));
const CreateSupplier = lazy(() => import("../pages/dashboards/Suppliers/CreateSupplier"));
const EditSupplier = lazy(() => import("../pages/dashboards/Suppliers/EditSupplier"));
const ViewSupplier = lazy(() => import("../pages/dashboards/Suppliers/ViewSupplier"));
const Messaging = lazy(() => import("../pages/dashboards/Messaging/Messaging"));
const Settings = lazy(() => import("../pages/dashboards/Settings/Settings"));
const Notifications = lazy(() => import("../pages/dashboards/Notifications/Notifications"));
const Profile = lazy(() => import("../pages/dashboards/Profile/Profile"));

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
