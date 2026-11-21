import React from "react";
import Navbar from "../../components/public/layout/Navbar";
import LandingFooter from "../../components/public/layout/LandingFooter";
import ContactHeader from "../../components/public/contact/ContactHeader";
import ContactForm from "../../components/public/contact/ContactForm";
import ContactInfoSection from "../../components/public/contact/ContactInfoSection";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 bg-dot-grid font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-8xl px-20 mx-auto">
          <ContactHeader />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <ContactForm />
            <ContactInfoSection />
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default ContactPage;
