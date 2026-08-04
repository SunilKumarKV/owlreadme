import { IconSize } from '../types/icon';
import { resolveIconSize } from '../icons/iconSizes';

export function getIconSizePixels(size: IconSize = 'md'): number {
  return resolveIconSize(size);
}
