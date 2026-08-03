export function isNavItemActive(currentPath: string, itemHref: string): boolean {
  if (!currentPath || !itemHref) return false;
  if (itemHref.startsWith('#')) return false;
  return currentPath === itemHref || currentPath.startsWith(`${itemHref}/`);
}

export function getLinkAttributes(external?: boolean, target?: string) {
  if (external) {
    return {
      target: target || '_blank',
      rel: 'noopener noreferrer',
    };
  }
  return {
    target: target || '_self',
  };
}
