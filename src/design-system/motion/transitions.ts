import { Transition } from 'framer-motion';
import { durations } from './durations';
import { easing } from './easing';

export const transitions: Record<string, Transition> = {
  fast: {
    duration: durations.fast,
    ease: easing.easeOut,
  },
  normal: {
    duration: durations.normal,
    ease: easing.easeOut,
  },
  slow: {
    duration: durations.slow,
    ease: easing.easeInOut,
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  },
};
