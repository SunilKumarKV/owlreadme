import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Navbar from '../Navbar';
import NavbarLogo from '../NavbarLogo';
import NavbarLink from '../NavbarLink';
import ThemeToggle from '../ThemeToggle';
import MobileMenuButton from '../MobileMenuButton';
import { NavItem } from '../../../types/navigation';
import ThemeModeProvider from '@/components/ThemeModeContext';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe('Production Navbar Component Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  describe('NavbarLogo', () => {
    it('renders brand logo icon and title', () => {
      render(<NavbarLogo />);
      expect(screen.getByLabelText(/OwlREADME Home/i)).toBeInTheDocument();
      expect(screen.getByText('OwlREADME')).toBeInTheDocument();
    });
  });

  describe('NavbarLink', () => {
    it('renders standard navigation item', () => {
      const item: NavItem = { id: 'test', label: 'Features', href: '#features' };
      render(<NavbarLink item={item} />);
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('renders external link with target _blank', () => {
      const item: NavItem = { id: 'gh', label: 'GitHub', href: 'https://github.com', external: true };
      render(<NavbarLink item={item} />);
      const link = screen.getByRole('link', { name: /GitHub/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('ThemeToggle', () => {
    it('renders theme switcher button', () => {
      render(
        <ThemeModeProvider>
          <ThemeToggle />
        </ThemeModeProvider>
      );
      const button = screen.getByRole('button', { name: 'Toggle theme' });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(button).toBeInTheDocument();
    });
  });

  describe('MobileMenuButton', () => {
    it('renders hamburger button with aria-expanded', () => {
      const onClick = vi.fn();
      render(<MobileMenuButton isOpen={false} onClick={onClick} />);
      const button = screen.getByRole('button', { name: 'Open navigation menu' });
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Navbar Container', () => {
    it('renders complete navigation bar', () => {
      render(
        <ThemeModeProvider>
          <Navbar />
        </ThemeModeProvider>
      );
      expect(screen.getByText('OwlREADME')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('How It Works')).toBeInTheDocument();
      expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Start Building').length).toBeGreaterThan(0);
    });
  });
});
