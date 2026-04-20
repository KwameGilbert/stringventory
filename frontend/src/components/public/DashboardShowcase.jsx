import React, { useState } from "react";
import { 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Shield, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  ArrowUpRight,
  TrendingDown,
  Clock,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DashboardShowcase = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Package, label: "Inventory" },
    { id: "sales", icon: ShoppingCart, label: "Sales" },
    { id: "customers", icon: Users, label: "Customers" },
  ];

  // --- MOCK DATA ---
  const stats = [
    { label: "Total Revenue", value: "$48,250.00", trend: "+12.5%", isUp: true },
    { label: "Active Orders", value: "142", trend: "+8.2%", isUp: true },
    { label: "Stock Level", value: "85%", trend: "-2.1%", isUp: false },
  ];

  const products = [
    { id: "P-102", name: "Premium Wireless Headphones", stock: 45, price: "$129", status: "In Stock" },
    { id: "P-105", name: "Modern Desk Lamp", stock: 12, price: "$89", status: "Low Stock" },
    { id: "P-108", name: "Ergonomic Office Chair", stock: 8, price: "$299", status: "Low Stock" },
  ];

  const sales = [
    { id: "ORD-772", customer: "John Doe", amount: "$450", status: "Completed", time: "2 mins ago" },
    { id: "ORD-771", customer: "Jane Smith", amount: "$120", status: "Pending", time: "15 mins ago" },
    { id: "ORD-770", customer: "Robert Brown", amount: "$890", status: "Completed", time: "1 hour ago" },
  ];

  // --- SUB-VIEWS ---
  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Overview</h3>
        <div className="flex gap-2">
          <div className="w-24 h-8 bg-slate-100 rounded-lg border border-slate-200" />
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h4 className="text-xl font-black text-slate-800 tracking-tight">{stat.value}</h4>
            <div className={`mt-2 inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {stat.isUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 h-48">
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500 mb-4">Revenue Trend</p>
          <div className="absolute bottom-0 left-0 w-full h-24 px-4 pb-4">
            <svg viewBox="0 0 200 60" className="w-full h-full">
              <path d="M0,50 Q20,40 40,45 Q60,50 80,30 Q100,10 120,25 Q140,40 160,15 Q180,-5 200,10 L200,60 L0,60 Z" fill="url(#grad)" opacity="0.1" />
              <path d="M0,50 Q20,40 40,45 Q60,50 80,30 Q100,10 120,25 Q140,40 160,15 Q180,-5 200,10" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
          <p className="text-xs font-bold text-slate-500 mb-4">Sales Distribution</p>
          <div className="flex items-center justify-center h-24 relative">
             <div className="w-20 h-20 rounded-full border-[6px] border-emerald-500 border-t-purple-500 border-r-rose-400 rotate-[45deg]" />
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-xs font-black text-slate-800">84%</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderProducts = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Inventory</h3>
        <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-500/20">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Product</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">Price</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((p, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{p.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-slate-600">{p.stock}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-600">{p.price}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${p.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderSales = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Recent Sales</h3>
        <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">Real-time</div>
      </div>

      <div className="space-y-3">
        {sales.map((s, i) => (
          <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-all cursor-default">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">{s.customer}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 font-medium">{s.id}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                  <div className="flex items-center text-[10px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3 mr-1" />
                    {s.time}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-slate-800">{s.amount}</p>
              <p className={`text-[10px] font-bold ${s.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{s.status}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section className="py-24 bg-white overflow-hidden max-w-7xl mx-auto">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mb-6">
            <Zap className="w-4 h-4 text-emerald-500 mr-2" />
            <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Live Experience</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
            The Dashboard That <br />
            <span className="text-emerald-600 font-black">Empowers Growth</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Take full control of your business with an interface designed for speed and clarity. 
            Try the interactive mockup below to see StringVentory in action.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative max-w-5xl mx-auto"
        >
          {/* MacBook Frame */}
          <div className="relative z-10 mx-auto w-full group">
            {/* The "Screen" Part */}
            <div className="bg-[#1a1f26] rounded-[2rem] p-2 md:p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-700/50">
              <div className="bg-white rounded-[1.4rem] min-h-[500px] md:aspect-[16/10] overflow-hidden relative flex flex-col md:flex-row">
                
                {/* Internal Mockup Sidebar */}
                <div className="w-full md:w-[220px] bg-[#1a1f26] p-4 md:p-6 flex flex-row md:flex-col items-center md:items-stretch gap-4 md:gap-8 border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
                  <div className="flex items-center gap-3 md:mb-4">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-[3px] rotate-45" />
                    </div>
                    <span className="text-white font-bold text-sm md:text-base tracking-tight hidden sm:block">Stringventory</span>
                  </div>
                  
                  <nav className="flex flex-row md:flex-col gap-2 md:gap-1 flex-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative group font-sans ${
                            isActive 
                              ? "bg-slate-800/80 text-emerald-400" 
                              : "text-slate-500 hover:text-white"
                          }`}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="navGlow"
                              className="absolute inset-0 bg-emerald-500/5 rounded-xl border border-emerald-500/20"
                            />
                          )}
                          <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-emerald-400' : 'group-hover:text-emerald-400'}`} />
                          <span className="text-xs font-bold tracking-wide hidden md:block">{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>

                  <div className="hidden md:block mt-auto p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">System Normal</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold leading-tight">All systems are operational. Last sync 2m ago.</p>
                  </div>
                </div>

                {/* Internal Main Screen */}
                <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar relative">
                  <AnimatePresence mode="wait">
                    {activeTab === "dashboard" && renderDashboard()}
                    {activeTab === "products" && renderProducts()}
                    {activeTab === "sales" && renderSales()}
                    {activeTab === "customers" && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full text-center"
                      >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                          <Users className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 mb-2">Customer Insights</h4>
                        <p className="text-slate-500 text-sm max-w-sm">Detailed customer management and retention tools are fully integrated into StringVentory.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Top Camera Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#1a1f26] rounded-b-2xl flex items-center justify-center gap-2 px-6 z-30">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-[#0a0a0a] ring-1 ring-slate-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>
              </div>
            </div>

            {/* Macbook "Bottom" Part */}
            <div className="relative mx-auto w-[110%] -left-[5%] h-6 bg-slate-800 rounded-b-xl shadow-2xl border-t border-slate-700/50 z-0 flex justify-center">
              <div className="w-32 h-1 bg-slate-900/50 rounded-full mt-1.5" />
            </div>

            {/* Floating Glass Badges */}
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 1, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="hidden lg:block absolute top-[10%] -right-[8%] w-64 p-5 glass-dark rounded-3xl shadow-2xl z-40 border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Growth Monthly</p>
                  <p className="text-2xl font-black text-white">+32.4%</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] font-bold">
                 <span className="text-emerald-500 underline decoration-2 underline-offset-4 cursor-pointer">View Full Report</span>
                 <ChevronRight className="w-3 h-3 text-slate-500" />
              </div>
            </motion.div>

            <motion.div 
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, -2, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="hidden lg:block absolute bottom-[15%] -left-[10%] w-56 p-5 glass rounded-3xl shadow-2xl z-40 border border-white/50 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="text-emerald-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-800 uppercase">Enterprise Secure</p>
                  <p className="text-xs text-slate-500 font-bold">256-bit AES encryption</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Value Props below MacBook */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            {[
               { icon: Zap, text: "Instant Updates", desc: "Sync stock across all points of sale instantly." },
               { icon: TrendingUp, text: "ROI Driven", desc: "Track profitability at a granular item level." },
               { icon: Shield, text: "Reliable Backup", desc: "Your data is mirrored across global regions." },
               { icon: CheckCircle2, text: "Setup in Mins", desc: "Guided onboarding for faster deployment." }
            ].map((pill, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -4 }}
                className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 group cursor-default"
              >
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-all duration-500">
                  <pill.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{pill.text}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{pill.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardShowcase;
