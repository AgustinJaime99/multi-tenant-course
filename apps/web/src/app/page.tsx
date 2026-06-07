"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesGrid } from "@/components/home/features-grid";
import { PricingSection } from "@/components/home/pricing-section";
import { TestimonialsGrid } from "@/components/home/testimonials-grid";
import { FaqSection } from "@/components/home/faq-section";
import { CtaBanner } from "@/components/home/cta-banner";
import { useCourses } from "@/lib/queries";

export default function HomePage() {
  const { data: courses } = useCourses();
  const featured = courses?.[0];

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <PricingSection course={featured} />
      <TestimonialsGrid />
      <FaqSection />
      <CtaBanner />
      <Footer />
    </div>
  );
}
