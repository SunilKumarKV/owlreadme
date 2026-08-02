"use client";

import React from 'react';
import { Button, Input, Badge, Container, Section } from '@/components/ui';
import { GitHubIcon } from '@/components/Icons';
import { ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  username: string;
  setUsername: (value: string) => void;
  onStartBuilding: (e: React.FormEvent) => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  username,
  setUsername,
  onStartBuilding,
}) => {
  return (
    <Section spacing="lg" className="relative overflow-hidden pt-8 pb-16">
      <Container size="md" className="text-center" data-reveal="true">
        <div className="glass-card p-10 sm:p-14 rounded-3xl border border-blue-500/20 dark:border-indigo-500/30 flex flex-col items-center gap-6 relative overflow-hidden reveal-item opacity-0 translate-y-6 transition-all duration-500 bg-gradient-to-tr from-blue-950/20 via-indigo-950/30 to-purple-950/20">
          {/* Glow accent bubbles */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

          <Badge variant="info">Get Started</Badge>
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Build your profile portfolio today
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Connect your GitHub username or open a blank workspace. Download your clean markdown structures instantly.
          </p>

          {/* Action Trigger Form */}
          <form onSubmit={onStartBuilding} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-md pt-2">
            <label htmlFor="cta-github-username" className="sr-only">GitHub Username</label>
            <Input
              id="cta-github-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your GitHub username"
              className="h-12 text-sm bg-white/90 dark:bg-gray-950/90 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              icon={<GitHubIcon className="h-4 w-4 text-gray-400" />}
            />
            <Button
              type="submit"
              disabled={!username.trim()}
              variant="glow"
              className="h-12 px-6 font-bold text-sm shrink-0 rounded-xl"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Build Now
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
};

export default CtaSection;
