import React from 'react';
import TemplateMarketplacePage from '@/features/template-marketplace/TemplateMarketplacePage';
import { Metadata } from 'next';
import { BRANDING } from '@/config/branding';

export const metadata: Metadata = {
  title: `README Templates Marketplace - ${BRANDING.name}`,
  description: 'Explore 40+ professional, high-impact README templates for developers, designers, engineers, and creators.',
};

export default function TemplatesPage() {
  return <TemplateMarketplacePage />;
}
