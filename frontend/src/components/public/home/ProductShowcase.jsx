import React, { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ArrowRightLeft, 
  RefreshCcw, 
  Truck, 
  TrendingUp, 
  Box,
  List,
  Users,
  Tag,
  Receipt,
  BarChart3,
  UserCircle,
  MessageSquare,
  Bell,
  Settings,
  RefreshCcw as SyncIcon,
  ShieldCheck as ShieldIcon,
  Zap as ZapIcon
} from "lucide-react";

// Showcase Components
import MacBookFrame from "../showcase/MacBookFrame";
import ShowcaseSidebar from "../showcase/ShowcaseSidebar";
import ShowcaseHeader from "../showcase/ShowcaseHeader";

// Lazy-loaded View Tabs
const DashboardView = lazy(() => import("../showcase/DashboardView"));
const ProductsView = lazy(() => import("../showcase/ProductsView"));
const SalesView = lazy(() => import("../showcase/SalesView"));
const CategoriesView = lazy(() => import("../showcase/CategoriesView"));
const SuppliersView = lazy(() => import("../showcase/SuppliersView"));
const PurchasesView = lazy(() => import("../showcase/PurchasesView"));
const InventoryView = lazy(() => import("../showcase/InventoryView"));
const RefundsView = lazy(() => import("../showcase/RefundsView"));
const TransactionsView = lazy(() => import("../showcase/TransactionsView"));
const CustomersView = lazy(() => import("../showcase/CustomersView"));
const ExpenseCategoriesView = lazy(() => import("../showcase/ExpenseCategoriesView"));
const ExpensesView = lazy(() => import("../showcase/ExpensesView"));
const ReportsView = lazy(() => import("../showcase/ReportsView"));
const UsersView = lazy(() => import("../showcase/UsersView"));
const MessagingView = lazy(() => import("../showcase/MessagingView"));
const NotificationsMenuView = lazy(() => import("../showcase/NotificationsMenuView"));
const SettingsView = lazy(() => import("../showcase/SettingsView"));

/**
 * Shimmer loader specifically for the Showcase views
 */
const ShowcaseLoader = () => (
  <div className="w-full h-full flex flex-col gap-6 animate-pulse p-4">
    <div className="h-10 bg-slate-100 rounded-2xl w-1/3" />
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl" />)}
    </div>
    <div className="h-64 bg-slate-100 rounded-3xl w-full" />
  </div>
);

/**
 * Premium Interactive Showcase Section
 * Features a modularized MacBook Air mockup 
 * with a fully functional simulated admin dashboard.
 */
const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "categories", icon: Box, label: "Categories" },
    { id: "suppliers", icon: Truck, label: "Suppliers" },
    { id: "products", icon: Package, label: "Products" },
    { id: "purchases", icon: ShoppingCart, label: "Purchases" },
    { id: "inventory", icon: List, label: "Inventory" },
    { id: "sales", icon: TrendingUp, label: "Sales" },
    { id: "refunds", icon: RefreshCcw, label: "Refunds" },
    { id: "transactions", icon: ArrowRightLeft, label: "Transactions" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "expense-categories", icon: Tag, label: "Expense Categories" },
    { id: "expenses", icon: Receipt, label: "Expenses" },
    { id: "reports", icon: BarChart3, label: "Reports" },
    { id: "users", icon: UserCircle, label: "Users" },
    { id: "messaging", icon: MessageSquare, label: "Messaging" },
    { id: "notifications-menu", icon: Bell, label: "Notifications" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <section className="relative py-14 px-6 overflow-hidden bg-slate-50/50" id="product-showcase">
      <div className="max-w-8xl px-20 mx-auto flex flex-col items-center">
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/50 border border-emerald-200 rounded-full mb-6"
          >
            <Box className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em]">Product Showcase</span>
          </motion.div>
          <h2 className="text-5xl font-semibold text-slate-900 mb-3 tracking-tight">
            The Modern <span className="text-emerald-600">Operating System</span> <br /> 
            for Your Business
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            A single, unified interface to manage stock, tracking sales, and delighting customers.
          </p>
        </div>

        {/* INTERACTIVE MACBOOK MOCKUP */}
        <div className="w-full max-w-6xl mx-auto px-4 perspective-1000">
          <div className="relative transform transition-all duration-1000 hover:rotate-y-2 group">
            {/* Responsiveness Wrapper: Scales the frame down on smaller screens */}
            <div className="scale-[0.4] sm:scale-[0.5] md:scale-[0.75] lg:scale-100 origin-top transition-transform duration-500 mb-[-30%] sm:mb-[-20%] md:mb-[-10%] lg:mb-0">
               <MacBookFrame 
                sidebar={
                  <ShowcaseSidebar 
                    menuItems={menuItems} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                  />
                }
              >
                <main className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden">
                   <ShowcaseHeader 
                     searchQuery={searchQuery} 
                     setSearchQuery={setSearchQuery} 
                   />

                   <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                      <Suspense fallback={<ShowcaseLoader />}>
                        <AnimatePresence mode="wait">
                           {activeTab === "dashboard" && <DashboardView key="dashboard" />}
                           {activeTab === "products" && <ProductsView key="products" />}
                           {activeTab === "sales" && <SalesView key="sales" />}
                           {activeTab === "categories" && <CategoriesView key="categories" />}
                           {activeTab === "suppliers" && <SuppliersView key="suppliers" />}
                           {activeTab === "purchases" && <PurchasesView key="purchases" />}
                           {activeTab === "inventory" && <InventoryView key="inventory" />}
                           {activeTab === "refunds" && <RefundsView key="refunds" />}
                           {activeTab === "transactions" && <TransactionsView key="transactions" />}
                           {activeTab === "customers" && <CustomersView key="customers" />}
                           {activeTab === "expense-categories" && <ExpenseCategoriesView key="expense-categories" />}
                           {activeTab === "expenses" && <ExpensesView key="expenses" />}
                           {activeTab === "reports" && <ReportsView key="reports" />}
                           {activeTab === "users" && <UsersView key="users" />}
                           {activeTab === "messaging" && <MessagingView key="messaging" />}
                           {activeTab === "notifications-menu" && <NotificationsMenuView key="notifications-menu" />}
                           {activeTab === "settings" && <SettingsView key="settings" />}
                        </AnimatePresence>
                      </Suspense>
                   </div>
                </main>
              </MacBookFrame>
            </div>
          </div>
        </div>

        {/* BOTTOM FEATURES BAR */}
        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 w-full">
           {[
             { title: "Intelligent Forecasting", desc: "Predict stock needs with AI-driven historical analysis.", icon: Box },
             { title: "Unified Commerce", desc: "Sync physical and digital storefronts instantly.", icon: RefreshCcw },
             { title: "Bank-Grade Security", desc: "Your data is encrypted with 256-bit AES protection.", icon: ShieldCheck },
             { title: "Instant Onboarding", desc: "Get up and running in less than 5 minutes.", icon: Zap }
           ].map((feature, i) => (
             <motion.div 
               key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
               className="flex flex-col gap-4 group cursor-default"
             >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                   <feature.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

// Internal sub-components for the features bar icons (to keep them self-contained)
const ShieldCheck = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const Zap = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export default ProductShowcase;
