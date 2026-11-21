import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lg:col-span-7"
    >
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl relative overflow-hidden border border-slate-100">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10" />
        
        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">Message Sent!</h2>
            <p className="text-slate-500 font-medium mb-8">
              Thank you for reaching out. We've received your message and will get back to you shortly.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all duration-300"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Kwame Mensah"
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="kwame@example.com"
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium placeholder:text-slate-400"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Subject</label>
              <input
                required
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Message</label>
              <textarea
                required
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your needs..."
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium placeholder:text-slate-400 resize-none"
              ></textarea>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-5 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center space-x-2 hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-100 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Message</span>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-center text-slate-400 text-[10px] font-medium uppercase tracking-widest mt-4">
              By submitting this form, you agree to our <Link to="#" className="text-emerald-600 font-bold hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default ContactForm;
