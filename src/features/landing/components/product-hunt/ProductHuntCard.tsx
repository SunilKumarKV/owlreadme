import React from 'react';
import { ProductHuntCardProps } from '../../types/product-hunt';
import ProductHuntLogo from './ProductHuntLogo';
import ProductHuntBadge from './ProductHuntBadge';
import ProductHuntVote from './ProductHuntVote';
import ProductHuntButton from './ProductHuntButton';

export const ProductHuntCard: React.FC<ProductHuntCardProps> = ({
  post,
  className = '',
}) => {
  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-2xl shadow-xl shadow-[#DA552F]/5 max-w-xl mx-auto text-center space-y-6 ${className}`}
    >
      <div className="flex flex-col items-center space-y-3">
        <ProductHuntLogo size={44} />
        <ProductHuntBadge label="FIND US ON PRODUCT HUNT" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
          {post.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
          {post.tagline}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <ProductHuntVote votesCount={post.votesCount} />
        <ProductHuntButton url={post.url} />
      </div>
    </div>
  );
};

export default ProductHuntCard;
