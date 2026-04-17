import React from "react";

const SocialProof = () => {
  const partners = [
    { name: "Acme Corp", logo: "ACME" },
    { name: "Global Logistics", logo: "GLOBAL" },
    { name: "Retail Pro", logo: "RETAIL" },
    { name: "Zenith Hub", logo: "ZENITH" },
    { name: "Pulse Systems", logo: "PULSE" },
    { name: "Nexus Trading", logo: "NEXUS" },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-100 max-w-7xl mx-auto overflow-hidden relative">
      {/* Gradient Masks */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

      <div className="container mx-auto px-6 mb-8">
        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
          Trusted by 2,000+ businesses worldwide
        </p>
      </div>
      
      <div className="flex overflow-hidden group">
        <div className="flex items-center space-x-16 animate-marquee whitespace-nowrap py-4">
          {[...partners, ...partners].map((partner, index) => (
            <div key={index} className="flex items-center space-x-3 shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-default">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 group-hover:text-emerald-600 transition-colors">
                {partner.logo[0]}
              </div>
              <span className="text-xl font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
