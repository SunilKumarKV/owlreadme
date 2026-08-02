"use client";

import React from 'react';
import { Button, Input, Container, Section } from '@/components/ui';
import { GitHubIcon } from '@/components/Icons';
import { BRANDING } from '@/config/branding';
import { isValidGithubUsername } from '@/packages/github/validators';
import { Sparkles, ArrowRight, CheckCircle, Check } from 'lucide-react';
import HeroPreviewWindow from './HeroPreviewWindow';

interface HeroSectionProps {
  username: string;
  setUsername: (value: string) => void;
  onStartBuilding: (e: React.FormEvent) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  username,
  setUsername,
  onStartBuilding,
}) => {
  const isUsernameValid = isValidGithubUsername(username);

  return (
    <Section spacing="lg" className="relative overflow-hidden hero-grid-pattern pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Animated Background Mesh & Light Beams */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/20 rounded-full blur-[140px] pointer-events-none animate-glow-bubble-1 transform-gpu" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-glow-bubble-2 transform-gpu" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-glow-bubble-3 transform-gpu" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(12,12,14,0.8)_80%)] pointer-events-none dark:block hidden" />

      {/* Sweeping Light Beam */}
      <div className="absolute top-0 right-1/4 w-96 h-[600px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent pointer-events-none animate-beam-sweep transform-gpu" />

      <Container size="lg" className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Hero Left Content Column */}
          <div className="flex-1 space-y-8 text-center lg:text-left" data-reveal="true">
            {/* Release Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold border border-blue-200/60 dark:border-blue-800/40 backdrop-blur-md shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
              <span>Introducing {BRANDING.name} v{BRANDING.version}</span>
            </div>

            {/* Primary SaaS Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-gray-900 dark:text-white">
              Your GitHub Profile <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                Automated in Seconds.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {BRANDING.description} Build custom layout structures, sync your repository metrics, and present your developer portfolio cleanly.
            </p>

            {/* Onboarding Username Form */}
            <form
              id="hero-form"
              onSubmit={onStartBuilding}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start max-w-lg mx-auto lg:mx-0 gap-3 pt-2"
              aria-label="GitHub Username Onboarding"
            >
              <div className="w-full relative flex-1">
                <label htmlFor="hero-github-username" className="sr-only">GitHub Username</label>
                <Input
                  id="hero-github-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your GitHub username"
                  className="h-12 text-sm bg-white/90 dark:bg-gray-900/90 border-gray-300 dark:border-gray-700 shadow-md font-medium"
                  icon={<GitHubIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                  isValid={isUsernameValid}
                  rightElement={
                    isUsernameValid ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : undefined
                  }
                  autoComplete="off"
                />
              </div>

              <Button
                type="submit"
                disabled={!username.trim()}
                variant="glow"
                className="h-12 px-6 font-bold text-sm shrink-0 rounded-xl transition-all duration-200"
                icon={<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
              >
                Get Started
              </Button>
            </form>

            {/* Feature Checklist Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Free &amp; Open Source
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Local Browser Storage
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> 1-Click Export Pack
              </span>
            </div>
          </div>

          {/* Hero Right Window Preview */}
          <HeroPreviewWindow />
        </div>
      </Container>
    </Section>
  );
};

export default HeroSection;
