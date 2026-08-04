import { useIconContext } from '../icons/IconProvider';
import { IconSize } from '../types/icon';
import { resolveIconSize } from '../icons/iconSizes';

export function useIcon(overrideSize?: IconSize, overrideStrokeWidth?: number) {
  const context = useIconContext();

  const finalSize = overrideSize ?? context.size ?? 'md';
  const finalStrokeWidth = overrideStrokeWidth ?? context.strokeWidth ?? 2;
  const pixelSize = resolveIconSize(finalSize);

  return {
    pixelSize,
    strokeWidth: finalStrokeWidth,
    contextColor: context.color,
  };
}

export default useIcon;
