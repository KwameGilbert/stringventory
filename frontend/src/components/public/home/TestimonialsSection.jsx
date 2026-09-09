import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

/**
 * Infinite Vertical Testimonials Section
 * Features a triple-column vertical marquee with seamless looping.
 */
const TestimonialsSection = () => {
  const testimonials = [
    { name: "Akua Mansa", role: "Manager", company: "The Fashion Hub", content: "PinnexVentures transformed our stock tracking overnight. We reduced our waste by 30% and finally have clear margins.", stars: 5 },
    { name: "David Chen", role: "CEO", company: "TechNexus", content: "The most intuitive inventory system I've used. The mobile app makes stocktaking a breeze.", stars: 5 },
    { name: "Sarah Jenkins", role: "Founder", company: "Artisan Boutique", content: "Ready in minutes. The customer support is lightning fast and helpful!", stars: 5 },
    { name: "Michael Kwame", role: "Director", company: "Global Logistics", content: "Managing 5 warehouses used to be a nightmare. Now, with real-time sync, it's efficient.", stars: 5 },
    { name: "Elena Rodriguez", role: "Finance Lead", company: "Urban Organics", content: "Automated expense tracking saved us countless hours. Much more than just an inventory tool.", stars: 5 },
    { name: "James Wilson", role: "Strategist", company: "Retail Consult", content: "I recommend it to all my clients. The ability to scale is exactly what the industry needs.", stars: 5 },
    { name: " Kofi Boateng", role: "Owner", company: "Kofi's electronics", content: "Finally, a tool that understands the African retail landscape. Simply perfect.", stars: 5 },
    { name: "Linda Smith", role: "Ops Head", company: "Beauty Palace", content: "Stock replenishment is now automated and error-free. Highly recommended.", stars: 5 },
    { name: "Anita Yusuf", role: "Managing Director", company: "Yusuf Fabrics", content: "The transition from spreadsheets to PinnexVentures was the best decision for our growth.", stars: 5 }
  ];

  // Distribute testimonials into 3 columns
  const col1 = [...testimonials.slice(0, 3), ...testimonials.slice(0, 3)];
  const col2 = [...testimonials.slice(3, 6), ...testimonials.slice(3, 6)];
  const col3 = [...testimonials.slice(6, 9), ...testimonials.slice(6, 9)];

  const MarqueeColumn = ({ items, duration, reverse = false }) => (
    <div className="flex flex-col gap-6 relative overflow-hidden h-full">
      <motion.div 
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ 
          duration: duration, 
          ease: "linear", 
          repeat: Infinity 
        }}
        className="flex flex-col gap-6"
      >
        {items.map((t, i) => (
          <div 
            key={i}
            className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all flex flex-col gap-4"
          >
            <div className="flex gap-1">
              {[...Array(t.stars)].map((_, idx) => (
                <Star key={idx} className="w-3 h-3 text-emerald-500 fill-emerald-500" />
              ))}
            </div>
            <p className="text-[13px] text-slate-600 font-medium leading-relaxed italic">"{t.content}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
               <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-[10px]">
                  {t.name.split(' ').map(n => n[0]).join('')}
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 text-[11px] leading-tight">{t.name}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.role} @ {t.company}</p>
               </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="testimonials">
      <div className="max-w-8xl mx-auto px-20">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/50 border border-emerald-200 rounded-full mb-6"
          >
            <Quote className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.2em]">Infinite Praise</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Trusted by Thousands <br />
            <span className="text-emerald-600">Across the Globe</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            PinnexVentures powers the growth of retailers worldwide. See what our community has to say.
          </p>
        </div>

        {/* MASONRY MARQUEE CONTAINER */}
        <div className="relative h-[650px] overflow-hidden">
           {/* Gradient Overlays for Fade Effect */}
           <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
           <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              <MarqueeColumn items={col1} duration={40} />
              <div className="hidden md:block">
                 <MarqueeColumn items={col2} duration={30} reverse={true} />
              </div>
              <div className="hidden lg:block">
                 <MarqueeColumn items={col3} duration={45} />
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
