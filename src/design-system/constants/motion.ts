import { MotionType } from '../types/motion';

export const MOTION_CONFIG = {
  defaultType: 'slide-up' as MotionType,
  defaultDuration: 0.3,
  viewportAmount: 0.2,
} as const;
