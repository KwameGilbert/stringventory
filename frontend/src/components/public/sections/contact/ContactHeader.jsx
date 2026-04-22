import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ContactHeader = () => {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="inline-flex items-center space-x-2 text-emerald-600 font-bold mb-6 hover:text-emerald-700 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          Let's Start a <span className="text-emerald-600">Conversation</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
          Have questions about StringVentory? Whether you're a small business or an enterprise, 
          our team is here to help you scale your operations.
        </p>
      </motion.div>
    </div>
  );
};

export default ContactHeader;
