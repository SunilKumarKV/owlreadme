"use client";

import React from 'react';
import { Container, Section } from '@/components/ui';
import { HeroSectionProps } from '../../types/hero';
import { HERO_CONFIG } from '../../constants/hero';
import { useHero } from '../../hooks/useHero';

import HeroBadge from './HeroBadge';
import HeroHeading from './HeroHeading';
import HeroDescription from './HeroDescription';
import HeroInput from './HeroInput';
import HeroCTA from './HeroCTA';
import FeatureChips from './FeatureChips';
import HeroPreviewPlaceholder from './HeroPreviewPlaceholder';

export const HeroSection: React.FC<HeroSectionProps> = ({
  config = HERO_CONFIG,
  username: externalUsername,
  onUsernameChange,
  setUsername: externalSetUsername,
  onStartBuilding,
  className = '',
}) => {
  const { username, setUsername, onClear, error, validate } = useHero(externalUsername || '');

  const changeHandler = onUsernameChange || externalSetUsername;

  const currentUsername = externalUsername !== undefined ? externalUsername : username;
  const handleInputChange = (val: string) => {
    if (changeHandler) {
      changeHandler(val);
    } else {
      setUsername(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onStartBuilding?.(e);
    }
  };

  return (
    <Section spacing="lg" className={`relative overflow-hidden pt-8 lg:pt-16 pb-16 ${className}`} id="hero-form">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-purple-500/15 blur-3xl pointer-events-none rounded-full" />

      <Container size="lg" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Description & Input CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <HeroBadge text={config.badge.text} icon={config.badge.icon} href={config.badge.href} />

            <HeroHeading
              prefix={config.headline.prefix}
              highlight={config.headline.highlight}
              suffix={config.headline.suffix}
            />

            <HeroDescription text={config.description} />

            {/* GitHub Username Onboarding Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 pt-2 max-w-lg">
              <HeroInput
                id="hero-github-username"
                value={currentUsername}
                onChange={handleInputChange}
                onClear={onClear}
                placeholder={config.input.placeholder}
                ariaLabel={config.input.ariaLabel}
                error={error}
              />
              <HeroCTA label={config.cta.label} disabled={!currentUsername.trim()} />
            </form>

            <FeatureChips chips={config.featureChips} />
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
