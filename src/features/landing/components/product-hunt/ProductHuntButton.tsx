import React from 'react';
import { ProductHuntButtonProps } from '../../types/product-hunt';

export const ProductHuntButton: React.FC<ProductHuntButtonProps> = ({
  url,
  label = 'Visit on Product Hunt',
  className = '',
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
      className={`inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl bg-[#DA552F] hover:bg-[#c44723] text-white font-bold text-sm shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DA552F] ${className}`}
    >
      {label} →
    </a>
  );
};

export default ProductHuntButton;
