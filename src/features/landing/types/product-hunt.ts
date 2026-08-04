export interface ProductHuntPost {
  id: string;
  name: string;
  tagline: string;
  votesCount: number;
  featuredAt?: string;
  url: string;
  slug: string;
}

export interface ProductHuntData {
  post: ProductHuntPost | null;
  isAvailable: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProductHuntLogoProps {
  className?: string;
  size?: number;
}

export interface ProductHuntBadgeProps {
  label?: string;
  className?: string;
}

export interface ProductHuntVoteProps {
  votesCount: number;
  className?: string;
}

export interface ProductHuntButtonProps {
  url: string;
  label?: string;
  className?: string;
}

export interface ProductHuntCardProps {
  post: ProductHuntPost;
  className?: string;
}

export interface ProductHuntSectionProps {
  className?: string;
}
