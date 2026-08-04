import React from 'react';
import { FeatureCardProps } from '../../types/card';
import Card from './Card';
import CardTitle from './CardTitle';
import CardDescription from './CardDescription';

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  ctaText,
  onCtaClick,
  className = '',
  ...rest
}) => {
  return (
    <Card variant="feature" className={className} {...rest}>
      {icon && <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 mb-4">{icon}</div>}
      <CardTitle className="text-xl font-extrabold">{title}</CardTitle>
      <CardDescription className="mt-2 text-gray-300">{description}</CardDescription>
      {ctaText && (
        <button
          onClick={onCtaClick}
          className="mt-4 inline-flex items-center text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline"
        >
          {ctaText} →
        </button>
      )}
    </Card>
  );
};

export default FeatureCard;
