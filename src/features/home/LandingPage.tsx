"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useScrollReveal } from './hooks/useScrollReveal';

import HeroSection from './components/hero/HeroSection';
import HighlightMetricsBar from './components/metrics/HighlightMetricsBar';
import ProductHighlightsSection from './components/features/ProductHighlightsSection';
import ProcessSection from './components/process/ProcessSection';
import WorkspacePreviewSection from './components/preview/WorkspacePreviewSection';
import BenefitsSection from './components/benefits/BenefitsSection';
import FaqSection from './components/faq/FaqSection';
import CtaSection from './components/cta/CtaSection';
import LandingFooter from './components/footer/LandingFooter';

export const LandingPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();

  // Initialize IntersectionObserver scroll reveal animations
  useScrollReveal();

  const handleStartBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/dashboard?username=${encodeURIComponent(username.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0c0c0e] text-gray-900 dark:text-white transition-colors duration-300 animate-fade-in-smooth selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <HeroSection
          username={username}
          setUsername={setUsername}
          onStartBuilding={handleStartBuilding}
        />
        <HighlightMetricsBar />
        <ProductHighlightsSection />
        <ProcessSection />
        <WorkspacePreviewSection />
        <BenefitsSection />
        <FaqSection />
        <CtaSection
          username={username}
          setUsername={setUsername}
          onStartBuilding={handleStartBuilding}
        />
      </main>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
