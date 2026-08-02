export type AnnouncementType = 'release' | 'feature' | 'maintenance' | 'event';

export interface AnnouncementConfig {
  id: string;
  type: AnnouncementType;
  version?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  icon?: string;
  visible: boolean;
  dismissible?: boolean;
  dismissKey?: string;
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

export interface AnnouncementLinkProps {
  text: string;
  href: string;
  className?: string;
}
