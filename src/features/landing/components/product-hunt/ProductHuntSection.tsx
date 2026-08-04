"use client";

import React from 'react';
import { ProductHuntSectionProps } from '../../types/product-hunt';
import useProductHunt from '../../hooks/useProductHunt';
import ProductHuntCard from './ProductHuntCard';

export const ProductHuntSection: React.FC<ProductHuntSectionProps> = ({
  className = '',
}) => {
  const { post, isAvailable, loading } = useProductHunt();

  if (loading || !isAvailable || !post) {
    return null;
  }

  return (
    <section className={`py-12 relative overflow-hidden ${className}`} aria-label="Product Hunt Launch">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <ProductHuntCard post={post} />
      </div>
    </section>
  );
};

export default ProductHuntSection;
