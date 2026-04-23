import React from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#fafafa] max-w-7xl mx-auto font-sans">
      {/* Background Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.35, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-200/50 rounded-full blur-3xl -z-10" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.25, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl -z-10" 
      />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content side */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 text-left"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <span className="text-emerald-800 font-bold text-xs uppercase tracking-tight">New · AI-powered insights</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-8 font-sans"
            >
              Manage your <br />
              inventory <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-500 to-emerald-400">smarter,</span> <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-pink-500 to-rose-400">faster, better.</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl text-slate-500 mb-12 max-w-xl leading-relaxed font-sans"
            >
              All-in-one inventory, sales, and financial tracking for modern businesses. 
              Real-time stock, multi-channel sales, and beautiful analytics.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#047857" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg shadow-emerald-200 font-sans"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#ffffff", borderColor: "#cbd5e1" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-slate-50 text-slate-600 font-bold rounded-xl border border-slate-200 transition-all duration-300 flex items-center justify-center space-x-2 font-sans"
              >
                <Play className="w-5 h-5 fill-slate-400 text-slate-400" />
                <span>View Demo</span>
              </motion.button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-8 text-sm font-medium text-slate-400"
            >
              No credit card required · 14-day free trial · Cancel anytime
            </motion.div>
          </motion.div>

          {/* Visual side - Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 40, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="flex-1 w-full relative perspective-[2000px]"
          >
            <motion.div 
              whileHover={{ 
                rotateY: 5, 
                rotateX: -2,
                transition: { duration: 0.5 }
              }}
              className="relative z-10 rounded-[2.5rem] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white overflow-hidden flex aspect-[4/3]"
            >
              {/* Sidebar */}
              <div className="w-[180px] bg-[#1a1f26] p-6 flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
                  </div>
                  <span className="text-white font-bold text-sm tracking-tight">Stringventory</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Dashboard", active: true },
                    { label: "Products" },
                    { label: "Sales" },
                    { label: "Suppliers" },
                    { label: "Payments" },
                    { label: "Reports" },
                    { label: "Settings" }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 py-1 cursor-default ${item.active ? 'text-white' : 'text-slate-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-emerald-400' : 'bg-transparent'}`} />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="flex-1 bg-white p-6 flex flex-col gap-6 overflow-hidden text-[#1a1f26]">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-sm font-bold">Overview</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Last 7 days</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-emerald-600 tracking-tighter uppercase">Live</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Revenue', value: '$24.8k', trend: '+12%' },
                    { label: 'Orders', value: '318', trend: '+8%' },
                    { label: 'Stock', value: '1,204', trend: '+2%' }
                  ].map((stat, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
                      <h4 className="text-xs font-black tracking-tight">{stat.value}</h4>
                      <p className="text-[8px] font-bold text-emerald-500 mt-0.5">{stat.trend}</p>
                    </div>
                  ))}
                </div>

                {/* Mid cards */}
                <div className="grid grid-cols-2 gap-4 flex-grow min-h-0">
                  {/* Revenue chart mockup */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-3">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Revenue</p>
                    <div className="flex-1 w-full relative">
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                          d="M0,35 Q10,30 20,32 Q30,34 40,25 Q50,15 60,20 Q70,25 80,10 Q90,5 100,12" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="2" 
                        />
                        <path d="M0,35 Q10,30 20,32 Q30,34 40,25 Q50,15 60,20 Q70,25 80,10 Q90,5 100,12 L100,40 L0,40 Z" fill="url(#grad)" opacity="0.1" />
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0 }} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="flex justify-between text-[6px] font-bold text-slate-300 mt-2">
                        <span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                    </div>
                  </div>
                  {/* Payments chart mockup */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1 items-center justify-center">
                    <p className="text-[8px] font-bold text-slate-400 uppercase w-full text-left">Payments</p>
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                        <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                        <motion.circle 
                          initial={{ strokeDasharray: "0 100" }}
                          animate={{ strokeDasharray: "60 100" }}
                          transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                          cx="18" cy="18" r="16" fill="transparent" stroke="#10b981" strokeWidth="4" 
                        />
                        <motion.circle 
                          initial={{ strokeDasharray: "0 100", strokeDashoffset: -60 }}
                          animate={{ strokeDasharray: "30 100", strokeDashoffset: -60 }}
                          transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
                          cx="18" cy="18" r="16" fill="transparent" stroke="#8b5cf6" strokeWidth="4" 
                        />
                        <motion.circle 
                          initial={{ strokeDasharray: "0 100", strokeDashoffset: -90 }}
                          animate={{ strokeDasharray: "10 100", strokeDashoffset: -90 }}
                          transition={{ duration: 1.5, delay: 1.6, ease: "easeOut" }}
                          cx="18" cy="18" r="16" fill="transparent" stroke="#ec4899" strokeWidth="4" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Small Table part */}
                <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden text-[8px]">
                   <div className="grid grid-cols-4 p-2 font-bold text-slate-400 uppercase border-b border-slate-100">
                      <span className="col-span-2">Product</span>
                      <span>Stock</span>
                      <span>Status</span>
                   </div>
                   <div className="p-2 space-y-2">
                      <div className="grid grid-cols-4 items-center">
                         <div className="col-span-2">
                            <p className="font-bold">Wireless Earbuds</p>
                            <p className="text-[6px] text-slate-400">WE-204</p>
                         </div>
                         <span className="font-bold text-slate-600">142</span>
                         <span className="font-bold text-emerald-500">In stock</span>
                      </div>
                      <div className="grid grid-cols-4 items-center">
                         <div className="col-span-2">
                            <p className="font-bold">Smart Watch</p>
                            <p className="text-[6px] text-slate-400">SW-118</p>
                         </div>
                         <span className="font-bold text-slate-600">28</span>
                         <span className="font-bold text-rose-500">Low</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Background elements */}
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 right-[-100px] -translate-y-1/2 w-[400px] h-[400px] bg-sky-200/20 rounded-full blur-[100px] -z-10" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
