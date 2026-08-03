export type AnnouncementType = 'release' | 'feature' | 'maintenance' | 'event';

export interface AnnouncementConfig {
  id: string;
  type: AnnouncementType;
  version?: string;
  badge?: string;
  title: string;
  headline?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: string;
  visible: boolean;
  dismissible?: boolean;
  dismissKey?: string;
  futureSchedule?: string;
  futureRelease?: boolean;
}

export interface AnnouncementBarProps {
  config?: AnnouncementConfig;
  className?: string;
  onDismiss?: () => void;
}

export interface AnnouncementContentProps {
  config: AnnouncementConfig;
  className?: string;
}

export interface AnnouncementBadgeProps {
  text: string;
  type?: AnnouncementType;
  className?: string;
}

export interface AnnouncementCTAProps {
  label: string;
  href: string;
  className?: string;
}

export interface AnnouncementCloseButtonProps {
  onDismiss: () => void;
  ariaLabel?: string;
  className?: string;
}

export interface AnnouncementLinkProps {
  text: string;
  href: string;
  className?: string;
}
