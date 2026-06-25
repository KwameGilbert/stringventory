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
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#fafafa] max-w-8xl px-20 mx-auto font-sans">
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
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-4 font-sans"
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

          {/* Visual side - Dashboard Image */}
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
              <img 
                src="/dashboard.png" 
                alt="Stringventory Dashboard" 
                className="w-full h-full object-cover rounded-3xl"
              />
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
