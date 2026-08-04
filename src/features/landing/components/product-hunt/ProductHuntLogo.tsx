import React from 'react';
import { ProductHuntLogoProps } from '../../types/product-hunt';

export const ProductHuntLogo: React.FC<ProductHuntLogoProps> = ({
  className = '',
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="20" fill="#DA552F" />
      <path
        d="M22.6667 12H15V28H19V22H22.6667C25.4281 22 27.6667 19.7614 27.6667 17C27.6667 14.2386 25.4281 12 22.6667 12ZM22.6667 18H19V16H22.6667C23.219 16 23.6667 16.4477 23.6667 17C23.6667 17.5523 23.219 18 22.6667 18Z"
        fill="white"
      />
    </svg>
  );
};

export default ProductHuntLogo;
