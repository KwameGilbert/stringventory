import React from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin } from "lucide-react";

const InfoCard = ({ info, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
    className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm flex items-start space-x-4 group cursor-default transition-all hover:shadow-md hover:border-slate-200"
  >
    <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
      <info.icon size={28} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{info.title}</h3>
      <p className="text-emerald-600 font-bold mb-1">{info.value}</p>
      <p className="text-slate-500 font-medium text-sm leading-relaxed">{info.description}</p>
    </div>
  </motion.div>
);

const ContactInfoSection = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      value: "hello@pinnexventures.com",
      description: "Our team usually responds within 2 hours.",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      icon: MessageSquare,
      title: "Chat with Support",
      value: "+1 (555) 000-0000",
      description: "Available Mon-Fri from 9am to 6pm.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      value: "123 Innovation Drive, Silicon Valley, CA",
      description: "Come say hello in person at our HQ.",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="lg:col-span-5 space-y-6">
      {contactInfo.map((info, index) => (
        <InfoCard key={index} info={info} index={index} />
      ))}

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="relative h-64 rounded-[2rem] overflow-hidden shadow-lg group border border-slate-100"
      >
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="text-center">
            <MapPin size={40} className="text-slate-400 mx-auto mb-2 group-hover:animate-bounce" />
            <span className="text-slate-500 font-bold text-sm">Interactive Map Loading...</span>
           </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default ContactInfoSection;
