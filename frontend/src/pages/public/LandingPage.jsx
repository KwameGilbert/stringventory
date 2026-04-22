import React from "react";
import Navbar from "../../components/public/layout/Navbar";
import HeroSection from "../../components/public/sections/home/HeroSection";
import SocialProof from "../../components/public/sections/home/SocialProof";
import FeaturesSection from "../../components/public/sections/home/FeaturesSection";
import ProductShowcase from "../../components/public/sections/home/ProductShowcase";
import HowItWorks from "../../components/public/sections/home/HowItWorks";
import BenefitsSection from "../../components/public/sections/home/BenefitsSection";
import PricingSection from "../../components/public/sections/home/PricingSection";
import TestimonialsSection from "../../components/public/sections/home/TestimonialsSection";
import ComparisonSection from "../../components/public/sections/home/ComparisonSection";
import FAQSection from "../../components/public/sections/home/FAQSection";
import CTASection from "../../components/public/sections/home/CTASection";
import LandingFooter from "../../components/public/layout/LandingFooter";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 bg-dot-grid font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <main>
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <ProductShowcase />
        <HowItWorks />
        <BenefitsSection />
        <PricingSection />
        <TestimonialsSection />
        <ComparisonSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
