import React, { lazy, Suspense } from "react";
import Navbar from "../../components/public/layout/Navbar";
import HeroSection from "../../components/public/sections/home/HeroSection";
import SocialProof from "../../components/public/sections/home/SocialProof";
import LandingFooter from "../../components/public/layout/LandingFooter";

// Lazy-loaded sections
const FeaturesSection = lazy(() => import("../../components/public/sections/home/FeaturesSection"));
const ProductShowcase = lazy(() => import("../../components/public/sections/home/ProductShowcase"));
const HowItWorks = lazy(() => import("../../components/public/sections/home/HowItWorks"));
const BenefitsSection = lazy(() => import("../../components/public/sections/home/BenefitsSection"));
const PricingSection = lazy(() => import("../../components/public/sections/home/PricingSection"));
const TestimonialsSection = lazy(() => import("../../components/public/sections/home/TestimonialsSection"));
const ComparisonSection = lazy(() => import("../../components/public/sections/home/ComparisonSection"));
const FAQSection = lazy(() => import("../../components/public/sections/home/FAQSection"));
const CTASection = lazy(() => import("../../components/public/sections/home/CTASection"));

/**
 * Minimal placeholder for lazy-loading sections
 */
const SectionLoading = () => <div className="h-40 w-full animate-pulse bg-slate-50 border-y border-slate-100" />;

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 bg-dot-grid font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <main>
        <HeroSection />
        <SocialProof />
        
        <Suspense fallback={<SectionLoading />}>
          <FeaturesSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoading />}>
          <ProductShowcase />
        </Suspense>
        
        <Suspense fallback={<SectionLoading />}>
          <HowItWorks />
        </Suspense>
        
        <Suspense fallback={<SectionLoading />}>
          <BenefitsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoading />}>
          <PricingSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoading />}>
          <TestimonialsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoading />}>
          <ComparisonSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoading />}>
          <FAQSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoading />}>
          <CTASection />
        </Suspense>
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
