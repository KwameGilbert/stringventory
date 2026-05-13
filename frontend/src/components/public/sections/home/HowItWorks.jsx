import React from "react";
import { PlusCircle, Search, BarChart, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const Step = ({ number, icon: Icon, title, description, isLast }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="relative flex flex-col items-center flex-1"
    >
      <motion.div 
        whileHover={{ 
          scale: 1.1, 
          boxShadow: "0 20px 40px rgba(16, 185, 129, 0.15)",
          backgroundColor: "#ecfdf5" 
        }}
        className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6 relative z-10 transition-colors duration-300 group cursor-default"
      >
        <Icon className="w-10 h-10 text-emerald-600" />
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 border-4 border-white rounded-full flex items-center justify-center text-white text-xs font-bold">
          {number}
        </div>
      </motion.div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">{title}</h3>
      <p className="text-slate-600 text-center text-sm leading-relaxed max-w-[200px]">
        {description}
      </p>

      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-[70%] w-[60%] h-[2px] bg-slate-100 -z-0">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-200" 
          />
        </div>
      )}
    </motion.div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: PlusCircle,
      title: "Add Products",
      description: "Quickly upload your inventory, categorize items, and set stock levels manually or via CSV."
    },
    {
      icon: Search,
      title: "Track Inventory",
      description: "Monitor movement in real-time. Automated alerts notify you before you run out of stock."
    },
    {
      icon: CheckCircle2,
      title: "Manage Sales",
      description: "Process orders through the POS or online. Stock levels update instantly across all channels."
    },
    {
      icon: BarChart,
      title: "Analyze Performance",
      description: "Generate deep financial reports and sales analytics to maximize your business growth."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <section id="how-it-works" className="py-14 bg-white max-w-8xl px-20 mx-auto overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm">Our Process</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-6">Simple Steps to Success</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Get up and running in minutes. StringVentory is designed to be powerful 
            yet incredibly easy for your entire team to use.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative"
        >
          {steps.map((step, index) => (
            <Step 
              key={index}
              number={index + 1}
              {...step}
              isLast={index === steps.length - 1}
            />
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-20 flex justify-center"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 transition-all duration-300"
          >
            Create Your Account Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
