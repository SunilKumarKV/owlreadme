import React from 'react';
import { ProductHuntBadgeProps } from '../../types/product-hunt';

export const ProductHuntBadge: React.FC<ProductHuntBadgeProps> = ({
  label = 'FEATURED ON PRODUCT HUNT',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full bg-[#DA552F]/10 text-[#DA552F] text-xs font-extrabold tracking-wider uppercase border border-[#DA552F]/20 ${className}`}
    >
      {label}
    </span>
  );
};

export default ProductHuntBadge;
