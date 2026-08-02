import type { ReactNode } from 'react';

export interface ProductHighlightItem {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
}

export interface WhyUsItem {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
