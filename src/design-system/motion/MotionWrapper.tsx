"use client";

import React from 'react';
import { motion, TargetAndTransition } from 'framer-motion';
import { MotionWrapperProps } from '../types/motion';
import { motionPresets } from './motionPresets';
import { motionVariants } from './motionVariants';
import { reducedMotionVariants } from './reducedMotion';
import { useMotionContext } from './MotionProvider';

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  preset,
  type = 'slide-up',
  delay,
  duration,
  viewport = true,
  once = true,
  hover,
  className = '',
  children,
}) => {
  const { reducedMotion } = useMotionContext();

  const activePreset = preset ? motionPresets[preset] : undefined;
  const activeVariants = reducedMotion
    ? reducedMotionVariants
    : activePreset
    ? activePreset.variants
    : motionVariants[type] || motionVariants.fade;

  const activeDuration = duration ?? activePreset?.duration ?? 0.3;
  const activeDelay = delay ?? activePreset?.delay ?? 0;

  const transition = reducedMotion
    ? { duration: 0.1 }
    : {
        duration: activeDuration,
        delay: activeDelay,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      };

  const hoverEffect = typeof hover === 'object' ? hover : hover ? { y: -4, scale: 1.01 } : undefined;

  const animationProps = viewport
    ? {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once, amount: 0.2 },
      }
    : {
        initial: 'hidden',
        animate: 'visible',
      };

  return (
    <motion.div
      variants={activeVariants}
      transition={transition}
      whileHover={hoverEffect as TargetAndTransition}
      className={className}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
