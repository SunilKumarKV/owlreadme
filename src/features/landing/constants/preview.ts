import { PreviewVariant } from '../types/preview';

export const DEFAULT_PREVIEW_CONFIG = {
  fileName: 'owlreadme-output.md',
  maxHeight: '600px',
  variant: 'glow' as PreviewVariant,
  windowControls: [
    { color: 'bg-red-500/80 hover:bg-red-600', label: 'Close window' },
    { color: 'bg-yellow-500/80 hover:bg-yellow-600', label: 'Minimize window' },
    { color: 'bg-green-500/80 hover:bg-green-600', label: 'Maximize window' },
  ],
} as const;
