import React from "react";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";

const PricingCard = ({ tier, price, description, features, highlighted }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    }}
    whileHover={{ 
      y: -12,
      transition: { duration: 0.3 }
    }}
    className={`p-8 rounded-[2.5rem] flex flex-col h-full transition-all duration-300 ${
      highlighted 
        ? "bg-slate-900 text-white shadow-2xl shadow-emerald-200/20 scale-105 z-10 border-4 border-emerald-500" 
        : "bg-white text-slate-900 border border-slate-100 shadow-xl"
    }`}
  >
    {highlighted && (
      <div className="bg-emerald-500 text-white text-xs font-black px-4 py-1.5 rounded-full self-start mb-6 uppercase tracking-widest shadow-lg shadow-emerald-500/20">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold mb-2">{tier}</h3>
    <div className="flex items-baseline mb-4">
      <span className="text-4xl font-black">${price}</span>
      <span className={`text-sm font-bold ml-2 ${highlighted ? "text-slate-400" : "text-slate-500"}`}>/month</span>
    </div>
    <p className={`text-sm mb-8 leading-relaxed font-medium ${highlighted ? "text-slate-400" : "text-slate-500"}`}>
      {description}
    </p>
    
    <div className="space-y-4 mb-10 flex-1">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${highlighted ? "bg-emerald-500" : "bg-emerald-100"}`}>
            <Check className={`w-3 h-3 ${highlighted ? "text-white" : "text-emerald-600"}`} />
          </div>
          <span className="text-sm font-semibold">{feature}</span>
        </div>
      ))}
    </div>

    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 ${
        highlighted 
          ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30" 
          : "bg-slate-900 text-white hover:bg-slate-800"
      }`}
    >
      Select Plan
    </motion.button>
  </motion.div>
);

const PricingSection = () => {
  const plans = [
    {
      tier: "Basic",
      price: "29",
      description: "Perfect for small shops and individual retailers getting started.",
      features: [
        "Up to 500 Products",
        "Single Store Location",
        "Basic Analytics",
        "Mobile App Access",
        "Email Support"
      ]
    },
    {
      tier: "Pro",
      price: "79",
      description: "Everything you need to scale your growing retail business.",
      features: [
        "Unlimited Products",
        "Up to 5 Store Locations",
        "Advanced Financial Reports",
        "Inventory Forecasting",
        "Priority 24/7 Support",
        "Multi-user Access"
      ],
      highlighted: true
    },
    {
      tier: "Enterprise",
      price: "199",
      description: "Advanced features for high-volume, multi-national retailers.",
      features: [
        "Unlimited Everything",
        "Custom API Integrations",
        "Dedicated Account Manager",
        "White-label Reports",
        "Custom Security Roles",
        "On-site Training"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden max-w-7xl mx-auto">
      {/* Decorative background components */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-slate-50 rounded-full -translate-x-1/2 -z-0 blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-1.5 bg-emerald-100/50 rounded-full mb-4">
            <Zap className="w-4 h-4 text-emerald-600 mr-2" />
            <span className="text-emerald-700 text-sm font-bold uppercase tracking-wider">Pricing Plans</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display">
            Simple Pricing for <br />
            <span className="text-emerald-600 font-black">Infinite Growth</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Choose the plan that fits your current scale. You can always upgrade 
            as your business grows. No hidden fees or long-term contracts.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center"
        >
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
