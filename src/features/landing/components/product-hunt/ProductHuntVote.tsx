import React from 'react';
import { ProductHuntVoteProps } from '../../types/product-hunt';
import { formatVoteCount } from '../../utils/product-hunt';

export const ProductHuntVote: React.FC<ProductHuntVoteProps> = ({
  votesCount,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-extrabold text-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <span className="text-[#DA552F]">▲</span>
      <span>{formatVoteCount(votesCount)}</span>
      <span className="text-xs text-gray-500 font-normal ml-1">UPVOTES</span>
    </div>
  );
};

export default ProductHuntVote;
