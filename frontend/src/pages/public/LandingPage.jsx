import React from "react";
import Navbar from "../../components/public/Navbar";
import HeroSection from "../../components/public/HeroSection";
import SocialProof from "../../components/public/SocialProof";
import FeaturesSection from "../../components/public/FeaturesSection";
import DashboardShowcase from "../../components/public/DashboardShowcase";
import HowItWorks from "../../components/public/HowItWorks";
import BenefitsSection from "../../components/public/BenefitsSection";
import PricingSection from "../../components/public/PricingSection";
import CTASection from "../../components/public/CTASection";
import LandingFooter from "../../components/public/LandingFooter";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <main>
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <DashboardShowcase />
        <HowItWorks />
        <BenefitsSection />
        <PricingSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
