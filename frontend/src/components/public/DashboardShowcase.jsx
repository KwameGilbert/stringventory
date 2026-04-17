import React from "react";
import { CheckCircle2, TrendingUp, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const DashboardShowcase = () => {
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-14 bg-white overflow-hidden max-w-7xl mx-auto">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
            Everything at a <span className="text-emerald-600 font-black">Single Glance</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our intuitive dashboard brings all your critical data front and center. 
            Stop hunting for information and start making data-driven decisions.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Main Mockup Screen */}
          <div className="relative z-10 rounded-3xl bg-slate-900 p-4 shadow-2xl overflow-hidden border border-slate-800">
            <div className="aspect-[16/9] bg-slate-800 rounded-2xl overflow-hidden relative">
              {/* Dummy UI elements inside */}
              <div className="absolute inset-0 p-8 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                     <div className="w-32 h-8 bg-slate-700 rounded-lg animate-pulse" />
                     <div className="w-32 h-8 bg-slate-700/50 rounded-lg" />
                  </div>
                  <div className="w-10 h-10 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20" />
                </div>
                <div className="grid grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-slate-700/30 rounded-xl border border-slate-700/50" />
                  ))}
                </div>
                <div className="flex-1 grid grid-cols-3 gap-8">
                  <div className="col-span-2 bg-slate-700/20 rounded-2xl border border-slate-700/50 p-6">
                    <div className="w-full h-full bg-gradient-to-t from-emerald-500/10 to-transparent rounded-lg" />
                  </div>
                  <div className="bg-slate-700/20 rounded-2xl border border-slate-700/50" />
                </div>
              </div>

              {/* Glass items floating over mockup */}
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 1, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-[-2%] w-64 p-4 glass-dark rounded-2xl shadow-2xl z-20 transition-all duration-300 border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Growth</p>
                    <p className="text-lg font-black text-white">+24.5%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -1, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 left-[-2%] w-56 p-4 glass-dark rounded-2xl shadow-2xl z-20 border border-emerald-500/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                  <p className="text-xs font-bold text-white">Stock Optimized</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Feature Pills surrounding the mockup */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
               { icon: Zap, text: "Instant Updates", desc: "Sync stock across all channels in real-time." },
               { icon: TrendingUp, text: "Smart Analytics", desc: "Turn raw data into actionable business plans." },
               { icon: Shield, text: "Data Security", desc: "Enterprise-grade encryption for your reports." },
               { icon: CheckCircle2, text: "Easy Onboarding", desc: "Import your data and launch in minutes." }
            ].map((pill, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5, backgroundColor: "#f8fafc" }}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all duration-300 group cursor-default"
              >
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-300">
                  <pill.icon className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">{pill.text}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{pill.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardShowcase;
