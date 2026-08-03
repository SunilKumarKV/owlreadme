export interface FeatureChipConfig {
  id: string;
  title: string;
  icon: string;
  tooltip?: string;
}

export interface HeroConfig {
  badge: {
    text: string;
    icon?: string;
    href?: string;
  };
  headline: {
    prefix: string;
    highlight: string;
    suffix: string;
  };
  description: string;
  input: {
    placeholder: string;
    ariaLabel: string;
  };
  cta: {
    label: string;
  };
  featureChips: FeatureChipConfig[];
}

export interface HeroBadgeProps {
  text: string;
  icon?: string;
  href?: string;
  className?: string;
}

export interface HeroHeadingProps {
  prefix: string;
  highlight: string;
  suffix: string;
  className?: string;
}

export interface HeroDescriptionProps {
  text: string;
  className?: string;
}

export interface HeroInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  ariaLabel?: string;
  isLoading?: boolean;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export interface HeroCTAProps {
  label: string;
  onSubmit?: (e: React.FormEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface FeatureChipProps {
  chip: FeatureChipConfig;
  className?: string;
}

export interface FeatureChipsProps {
  chips: FeatureChipConfig[];
  className?: string;
}

export interface HeroSectionProps {
  config?: HeroConfig;
  username?: string;
  onUsernameChange?: (value: string) => void;
  setUsername?: (value: string) => void;
  onStartBuilding?: (e: React.FormEvent) => void;
  className?: string;
}
