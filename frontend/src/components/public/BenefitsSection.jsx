import React from "react";
import { 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Zap 
} from "lucide-react";
import { motion } from "framer-motion";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Increase Revenue",
      description: "Optimize your stock levels to prevent stockouts and maximize Every sales opportunity.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Automate repetitive tasks like inventory counting and purchase order generation.",
      color: "text-sky-600",
      bgColor: "bg-sky-50"
    },
    {
      icon: ShieldCheck,
      title: "Reduce Loss",
      description: "Track every item movement to eliminate shrinkage and unidentified stock variances.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-24 bg-slate-50/50 max-w-7xl mx-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <div className="inline-flex items-center px-4 py-1.5 bg-emerald-100/50 rounded-full mb-6">
              <Zap className="w-4 h-4 text-emerald-600 mr-2" />
              <span className="text-emerald-700 text-sm font-bold uppercase tracking-wider">Benefits</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 font-display">
              Designed for High <br />
              <span className="text-emerald-600 font-black">Performance Teams</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              StringVentory isn't just an inventory tool—it's a productivity multiplier. 
              We've obsessed over the details so you can focus on growing your business.
            </p>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-lg ${benefit.bgColor} flex items-center justify-center shrink-0`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{benefit.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-[3rem] blur-3xl -z-10 translate-x-12 translate-y-12" />
              <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Efficiency</p>
                    <h3 className="text-3xl font-black text-slate-900">94%</h3>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-4 overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "94%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-emerald-500" 
                       />
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-2">Growth</p>
                    <h3 className="text-3xl font-black text-slate-900">+42%</h3>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-4 overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "42%" }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        className="h-full bg-sky-500" 
                       />
                    </div>
                  </div>
                  <div className="col-span-2 p-8 bg-slate-900 rounded-3xl text-white">
                    <h4 className="font-bold mb-4">Real-time Stock Accuracy</h4>
                    <div className="flex items-end gap-2 h-24">
                       {[60, 45, 75, 50, 90, 65, 85].map((h, i) => (
                         <motion.div 
                          key={i} 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          transition={{ duration: 0.8, delay: 0.1 * i }}
                          className="flex-1 bg-emerald-500/40 rounded-t-md hover:bg-emerald-500 transition-colors" 
                         />
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
