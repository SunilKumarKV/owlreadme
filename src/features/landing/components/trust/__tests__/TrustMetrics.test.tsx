import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TrustMetrics from '../TrustMetrics';
import TrustMetricCard from '../TrustMetricCard';
import TrustMetricIcon from '../TrustMetricIcon';
import TrustMetricValue from '../TrustMetricValue';
import TrustMetricTitle from '../TrustMetricTitle';
import TrustMetricDescription from '../TrustMetricDescription';
import { TRUST_METRICS_CONFIG } from '../../../constants/trust-metrics';

describe('Trust Metrics System Suite', () => {
  describe('TrustMetricIcon', () => {
    it('renders rocket, database, lightning, and shield icons', () => {
      const { container: c1 } = render(<TrustMetricIcon icon="rocket" colorTheme="blue" />);
      expect(c1.querySelector('svg')).toBeInTheDocument();

      const { container: c2 } = render(<TrustMetricIcon icon="database" colorTheme="purple" />);
      expect(c2.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('TrustMetricValue', () => {
    it('renders primary metric value', () => {
      render(<TrustMetricValue value="100%" />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('TrustMetricTitle', () => {
    it('renders metric title', () => {
      render(<TrustMetricTitle title="CLIENT-SIDE LOGIC" />);
      expect(screen.getByText('CLIENT-SIDE LOGIC')).toBeInTheDocument();
    });
  });

  describe('TrustMetricDescription', () => {
    it('renders metric description preserving line breaks', () => {
      render(<TrustMetricDescription description={'No backend.\nNo tracking.'} />);
      expect(screen.getByText(/No backend/)).toBeInTheDocument();
    });
  });

  describe('TrustMetricCard', () => {
    it('renders card with icon, value, title, and description from configuration', () => {
      const metric = TRUST_METRICS_CONFIG.metrics[0];
      render(<TrustMetricCard metric={metric} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('CLIENT-SIDE LOGIC')).toBeInTheDocument();
      expect(screen.getByText('Your data stays in your browser.')).toBeInTheDocument();
    });
  });

  describe('TrustMetrics Section', () => {
    it('renders all 4 configuration-driven trust metric cards', () => {
      render(<TrustMetrics />);
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('CLIENT-SIDE LOGIC')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('DATABASES NEEDED')).toBeInTheDocument();
      expect(screen.getByText('1-Click')).toBeInTheDocument();
      expect(screen.getByText('PACKAGE EXPORT')).toBeInTheDocument();
      expect(screen.getByText('MIT')).toBeInTheDocument();
      expect(screen.getByText('LICENSE')).toBeInTheDocument();
    });
  });
});
