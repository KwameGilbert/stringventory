import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Linkedin, Github, Instagram, Mail, MapPin, Phone } from "lucide-react";

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Dashboard", href: "#" },
        { name: "Inventory", href: "#" },
        { name: "Pricing", href: "#pricing" },
        { name: "API Docs", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Partners", href: "#" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Resource Library", href: "#" },
        { name: "System Status", href: "#" },
        { name: "Community", href: "#" },
        { name: "Terms of Service", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 max-w-8xl mx-auto px-20">
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-8 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-emerald-700 transition-colors">
                <span className="text-white font-bold text-xl uppercase">S</span>
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                PinnexVentures
              </span>
            </Link>
            <p className="text-slate-500 mb-8 max-w-sm leading-relaxed">
              The premier inventory management platform for scale-up businesses. 
              Modern tools for smarter growth. Built with ❤️ for entrepreneurs.
            </p>
            <div className="flex items-center space-x-5">
              {[Twitter, Linkedin, Github, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column */}
          {footerLinks.map((column, i) => (
            <div key={i} className="lg:col-span-1">
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-8">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.href} className="text-slate-500 hover:text-emerald-600 transition-colors text-sm font-medium">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Details */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-8">
              Reach Out
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <Mail className="w-5 h-5 text-emerald-600 mt-1" />
                <span className="text-slate-500 text-sm font-medium">hello@pinnexventures.com</span>
              </li>
              <li className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                <span className="text-slate-500 text-sm font-medium">Silicon Valley, CA</span>
              </li>
              <li className="flex items-start space-x-4">
                <Phone className="w-5 h-5 text-emerald-600 mt-1" />
                <span className="text-slate-500 text-sm font-medium">+1 (555) 000-0000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-400 text-sm font-medium">
            © {currentYear} PinnexVentures Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Cookies</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
