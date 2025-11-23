"use client";

import { SpotlightCursor } from "@/components/landing/spotlight-cursor";
import { Aurora } from "@/components/landing/aurora";
import { Navbar } from "@/components/landing-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingFooter } from "@/components/landing/footer";

export default function SkillPassportLanding() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden selection:bg-blue-500/30 font-sans">
      <SpotlightCursor />
      <Aurora />
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <LandingFooter />
    </div>
  );
}
