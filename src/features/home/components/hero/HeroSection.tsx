"use client";

import React from 'react';
import { Container, Section } from '@/components/ui';
import { HeroSectionProps } from '../../types/hero';
import { HERO_CONFIG } from '../../constants/hero';

import HeroLeft from './HeroLeft';
import HeroPreviewPlaceholder from './HeroPreviewPlaceholder';

export const HeroSection: React.FC<HeroSectionProps> = ({
  config = HERO_CONFIG,
  username,
  onUsernameChange,
  setUsername,
  onStartBuilding,
  className = '',
}) => {
  return (
    <Section spacing="lg" className={`relative overflow-hidden pt-8 lg:pt-16 pb-16 ${className}`} id="hero-form">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-purple-500/15 blur-3xl pointer-events-none rounded-full" />

      <Container size="lg" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Description, Input, CTA & Feature Chips */}
          <div className="lg:col-span-6 w-full">
            <HeroLeft
              config={config}
              username={username}
              onUsernameChange={onUsernameChange}
              setUsername={setUsername}
              onStartBuilding={onStartBuilding}
            />
          </div>

          {/* Right Column: Reserved Preview Showcase Placeholder */}
          <div className="lg:col-span-6 w-full">
            <HeroPreviewPlaceholder />
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default HeroSection;
