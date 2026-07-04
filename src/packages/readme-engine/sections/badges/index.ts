export const renderBadge = (label: string, color: string, style: string = 'flat'): string => {
  const encodedLabel = encodeURIComponent(label);
  const sanitizedColor = color.replace('#', '');
  return `![${label}](https://img.shields.io/badge/${encodedLabel}-${sanitizedColor}?style=${style})`;
};

export const renderSupportBadge = (
  type: 'buymeacoffee' | 'kofi',
  username: string,
  style: string = 'flat-square'
): string => {
  const user = username.trim();
  if (!user) return '';
  if (type === 'buymeacoffee') {
    return `[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=${style}&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/${user})`;
  }
  return `[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=${style}&logo=ko-fi&logoColor=white)](https://ko-fi.com/${user})`;
};

export const renderBadges = (badges: { label: string; color: string; style?: string }[]): string => {
  return badges.map((b) => renderBadge(b.label, b.color, b.style)).join(' ');
};
