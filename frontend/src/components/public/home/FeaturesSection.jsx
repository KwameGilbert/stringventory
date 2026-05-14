import React from "react";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  CreditCard, 
  RotateCcw, 
  Bell, 
  ShieldCheck,
  Zap,
  Layers
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundLines from "../shared/BackgroundLines";

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    whileHover={{ 
      y: -8,
      transition: { duration: 0.3 }
    }}
    className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default h-full"
  >
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-6 transition-colors duration-300`}
    >
      <Icon className="w-5 h-5" />
    </motion.div>
    <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Smart Dashboard",
      description: "Real-time analytics and beautiful visualizations providing deep insights into your inventory health.",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: Package,
      title: "Product Management",
      description: "Organize products by categories, monitor stock levels, and track variations with ease.",
      color: "bg-sky-100 text-sky-600"
    },
    {
      icon: Users,
      title: "Supplier Management",
      description: "Maintain a comprehensive directory of suppliers, track purchase history, and manage relationships.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: ShoppingCart,
      title: "Sales & POS System",
      description: "Modern point-of-sale interface for rapid transaction processing and seamless inventory updates.",
      color: "bg-rose-100 text-rose-600"
    },
    {
      icon: Truck,
      title: "Purchase Management",
      description: "Streamline procurement with automated purchase orders and real-time shipment tracking.",
      color: "bg-amber-100 text-amber-600"
    },
    {
      icon: BarChart3,
      title: "Inventory Tracking",
      description: "Precise item-level tracking with automated low-stock alerts and movement history.",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: CreditCard,
      title: "Transactions",
      description: "Support for multiple payment methods including Mobile Money, Cards, and Bank Transfers.",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: RotateCcw,
      title: "Refund Management",
      description: "Simple, transparent process for handling returns and issuing refunds or store credits.",
      color: "bg-slate-100 text-slate-600"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Intelligent system for critical alerts, low-stock updates, and daily performance summaries.",
      color: "bg-sky-100 text-sky-600"
    },
    {
      icon: ShieldCheck,
      title: "Roles & Permissions",
      description: "Granular access control to ensure every team member has exactly the access they need.",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section id="features" className="py-14 bg-slate-50/50 max-w-8xl mx-auto px-20 relative overflow-hidden">
      <BackgroundLines />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-1.5 bg-emerald-100/50 rounded-full mb-2">
            <Zap className="w-4 h-4 text-emerald-600 mr-2" />
            <span className="text-emerald-700 text-sm font-bold uppercase tracking-wider">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display leading-snug">
            Everything You Need to <br />
            <span className="text-emerald-600 font-semibold">Scale Your Business</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A powerful suite of tools designed to remove friction from your daily operations 
            and provide a crystal-clear view of your business performance.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
          
          {/* Feature Highlight Card (Span 2) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -4 }}
            className="md:col-span-2 p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-8 overflow-hidden relative group cursor-default"
          >
            <div className="absolute top-0 right-0 p-6 bg-emerald-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10 flex-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Seamless Integrations</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Full API access and native integrations with your favorite tools. 
                StringVentory fits perfectly into your existing ecosystem.
              </p>
            </div>
            <div className="relative z-10 flex-1 flex justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.2, backgroundColor: "rgba(16, 185, 129, 0.2)" }}
                    className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-full" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
