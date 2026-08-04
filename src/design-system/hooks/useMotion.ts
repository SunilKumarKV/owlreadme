import { useMotionContext } from '../motion/MotionProvider';
import { MotionPreset } from '../types/motion';
import { motionPresets } from '../motion/motionPresets';

export function useMotion(presetKey?: MotionPreset) {
  const { reducedMotion, defaultDuration } = useMotionContext();
  const preset = presetKey ? motionPresets[presetKey] : undefined;

  return {
    reducedMotion,
    preset,
    duration: preset?.duration ?? defaultDuration,
  };
}

export default useMotion;
