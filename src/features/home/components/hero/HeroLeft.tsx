"use client";

import React from 'react';
import { HeroSectionProps } from '../../types/hero';
import { HERO_CONFIG } from '../../constants/hero';
import { useHero } from '../../hooks/useHero';

import HeroBadge from './HeroBadge';
import HeroHeading from './HeroHeading';
import HeroDescription from './HeroDescription';
import HeroInput from './HeroInput';
import HeroCTA from './HeroCTA';
import FeatureChips from './FeatureChips';

export const HeroLeft: React.FC<HeroSectionProps> = ({
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
    <div className={`space-y-6 text-left ${className}`}>
      <HeroBadge text={config.badge.text} icon={config.badge.icon} href={config.badge.href} />

      <HeroHeading
        prefix={config.headline.prefix}
        highlight={config.headline.highlight}
        suffix={config.headline.suffix}
      />

      <HeroDescription text={config.description} />

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
  );
};

export default HeroLeft;
