import { ParticleColor } from '../types/background-animation';

export function getParticleColorClass(color: ParticleColor): string {
  switch (color) {
    case 'blue':
      return 'bg-blue-400 dark:bg-blue-500 shadow-blue-500/50';
    case 'purple':
      return 'bg-purple-400 dark:bg-purple-500 shadow-purple-500/50';
    case 'indigo':
      return 'bg-indigo-400 dark:bg-indigo-500 shadow-indigo-500/50';
    case 'cyan':
    default:
      return 'bg-cyan-400 dark:bg-cyan-500 shadow-cyan-500/50';
  }
}
