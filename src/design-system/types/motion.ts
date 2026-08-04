import { ReactNode } from 'react';
import { TargetAndTransition } from 'framer-motion';

export type MotionType =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'zoom'
  | 'blur';

export type MotionPreset =
  | 'heroReveal'
  | 'cardReveal'
  | 'buttonHover'
  | 'metricReveal'
  | 'navbarReveal'
  | 'sectionFade'
  | 'backgroundFloat'
  | 'repositoryReveal';

export interface MotionWrapperProps {
  preset?: MotionPreset;
  type?: MotionType;
  delay?: number;
  duration?: number;
  stagger?: boolean;
  viewport?: boolean;
  once?: boolean;
  hover?: boolean | TargetAndTransition;
  className?: string;
  children: ReactNode;
}

export interface MotionContextValue {
  reducedMotion: boolean;
  defaultDuration: number;
}
