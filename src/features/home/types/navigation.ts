export interface NavItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  disabled?: boolean;
  target?: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

export interface NavbarProps {
  className?: string;
}

export interface NavbarLogoProps {
  className?: string;
}

export interface NavbarLinkProps {
  item: NavItem;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface NavbarLinksProps {
  items: NavItem[];
  currentPath?: string;
  className?: string;
}

export interface NavbarActionsProps {
  className?: string;
}

export interface ThemeToggleProps {
  className?: string;
}

export interface ActionButtonProps {
  className?: string;
  onClick?: () => void;
}

export interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  className?: string;
}
