import { MotionPreset, MotionType } from '../types/motion';
import { motionPresets } from '../motion/motionPresets';
import { motionVariants } from '../motion/motionVariants';

export function getMotionPreset(preset: MotionPreset) {
  return motionPresets[preset] || motionPresets.sectionFade;
}

export function getMotionVariants(type: MotionType) {
  return motionVariants[type] || motionVariants.fade;
}
