import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, HelpCircle } from "lucide-react";

/**
 * FAQ Section with Accordion
 * Features a split layout with headline and interactive questions.
 */
const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
    isOpen ? 'border-emerald-200 bg-emerald-50/10 shadow-lg shadow-emerald-500/5' : 'border-slate-100 bg-white hover:border-slate-200'
  }`}>
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left"
    >
      <span className={`text-sm font-bold transition-colors ${isOpen ? 'text-emerald-700' : 'text-slate-800'}`}>
        {question}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
          isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
        }`}
      >
        <ChevronDown className="w-4 h-4" />
      </motion.div>
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="px-6 pb-6 pt-2">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Is there a free trial available?",
      answer: "Yes! PinnexVentures offers a 14-day full-featured free trial of any plan. No credit card is required to start your trial. You can explore all features including barcode generation, advanced reports, and multi-location management without any commitment."
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Absolutely. You can change your plan at any time directly from your dashboard settings. If you upgrade, the new features will be available instantly. If you downgrade, the changes will take effect at the start of your next billing cycle."
    },
    {
      question: "How secure is my business data?",
      answer: "Security is our top priority. We use industry-standard AES-256 encryption for all data at rest and SSL/TLS encryption for all data in transit. We also perform regular backups to ensure your records are always safe and accessible."
    },
    {
      question: "Does PinnexVentures work for multiple warehouse locations?",
      answer: "Yes, our Pro and Enterprise plans are specifically designed for multi-location businesses. You can track stock across different warehouses, branches, or mobile stores in real-time, and even perform inter-location stock transfers."
    },
    {
      question: "What kind of support do you provide?",
      answer: "Basic plan users have access to our comprehensive knowledge base and email support. Pro users get priority email and live chat support, while Enterprise users are assigned a dedicated account manager for on-site training and personalized assistance."
    }
  ];

  return (
    <section className="py-24 bg-slate-50/50 max-w-8xl mx-auto px-20 overflow-hidden" id="faq">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Headline & CTA */}
          <div className="lg:w-1/3 space-y-8 lg:sticky lg:top-32">
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/50 border border-emerald-200 rounded-full mb-6"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em]">Support FAQ</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-6 leading-tight">
                Everything You <br />
                <span className="text-emerald-600">Need to Know</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Finding the right inventory platform is a big decision. We're here to answer your questions and help you get started.
              </p>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-6 shadow-2xl shadow-slate-900/10">
               <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h4 className="text-xl font-semibold mb-2">Still have questions?</h4>
                  <p className="text-sm text-slate-400 font-medium">Our growth specialists are available 24/7 to help you choose the best plan for your scale.</p>
               </div>
               <button className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95">
                  Chat With Support
               </button>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:w-2/3 space-y-4 w-full">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;
