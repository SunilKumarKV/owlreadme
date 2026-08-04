import { Variants } from 'framer-motion';
import { MotionPreset } from '../types/motion';

export const motionPresets: Record<MotionPreset, { variants: Variants; duration: number; delay?: number }> = {
  heroReveal: {
    variants: {
      hidden: { opacity: 0, y: 32 },
      visible: { opacity: 1, y: 0 },
    },
    duration: 0.6,
    delay: 0.1,
  },
  cardReveal: {
    variants: {
      hidden: { opacity: 0, y: 20, scale: 0.96 },
      visible: { opacity: 1, y: 0, scale: 1 },
    },
    duration: 0.4,
    delay: 0.15,
  },
  buttonHover: {
    variants: {
      hidden: { scale: 1 },
      visible: { scale: 1 },
    },
    duration: 0.2,
  },
  metricReveal: {
    variants: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    },
    duration: 0.35,
    delay: 0.1,
  },
  navbarReveal: {
    variants: {
      hidden: { opacity: 0, y: -16 },
      visible: { opacity: 1, y: 0 },
    },
    duration: 0.4,
  },
  sectionFade: {
    variants: {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0 },
    },
    duration: 0.5,
  },
  backgroundFloat: {
    variants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    duration: 1.0,
  },
  repositoryReveal: {
    variants: {
      hidden: { opacity: 0, y: 16 },
      visible: { opacity: 1, y: 0 },
    },
    duration: 0.3,
  },
};
