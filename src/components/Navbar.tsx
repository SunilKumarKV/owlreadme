"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';
import { Button, Container } from '@/components/ui';
import { BRANDING } from '@/config/branding';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection: initialActive = '' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(initialActive);

  // Scroll observer to update glass shadow and active nav item
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to set active section
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sectionIds = ['features', 'how-it-works', 'preview-showcase', 'faq'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { name: 'Preview', href: '#preview-showcase', id: 'preview-showcase' },
    { name: 'FAQ', href: '#faq', id: 'faq' },
    { name: 'Templates', href: '/gallery', id: 'templates' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav shadow-lg shadow-blue-500/5 dark:shadow-black/40 py-3'
          : 'bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 py-4'
      }`}
    >
      <Container size="lg" className="flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1">
          <div className="p-1.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/branding/owlreadme-icon.svg" className="h-5 w-5" alt="OwlREADME Logo" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              {BRANDING.name}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items with Active Indicator */}
        <nav className="hidden md:flex items-center space-x-1 bg-gray-100/70 dark:bg-gray-900/60 p-1.5 rounded-full border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isExternal = item.href.startsWith('/');
            return (
              <a
                key={item.name}
                href={item.href}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 select-none ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold bg-white dark:bg-gray-800 shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-800/40'
                }`}
              >
                {item.name}
                {isExternal && (
                  <span className="inline-block ml-1 text-[9px] opacity-70">↗</span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons & Theme Switcher */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          
          <Button
            href="/dashboard"
            variant="ghost"
            className="text-xs py-2 px-3 font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            icon={<LayoutDashboard className="h-3.5 w-3.5" />}
          >
            Dashboard
          </Button>

          <Button
            href="#hero-form"
            variant="primary"
            className="text-xs py-2 px-4 font-bold shadow-md shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            icon={<Sparkles className="h-3.5 w-3.5" />}
          >
            Start Building
          </Button>
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 dark:text-gray-200 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700/80 border border-gray-200/80 dark:border-gray-700/60 rounded-lg transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Responsive Mobile Drawer Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100 border-b border-gray-200/80 dark:border-gray-800' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <Container size="lg" className="py-4 space-y-3 bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 font-bold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <hr className="border-gray-200 dark:border-gray-800 my-2" />

          <div className="flex flex-col space-y-2 pt-1">
            <Button
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              variant="outline"
              className="w-full text-xs py-2 justify-center"
              icon={<LayoutDashboard className="h-3.5 w-3.5" />}
            >
              Dashboard
            </Button>
            <Button
              href="#hero-form"
              onClick={() => setMobileMenuOpen(false)}
              variant="primary"
              className="w-full text-xs py-2 justify-center font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              icon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Start Building
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Navbar;
