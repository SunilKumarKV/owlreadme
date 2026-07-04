export const heading = (level: number, text: string): string => {
  const hashes = '#'.repeat(Math.max(1, Math.min(6, level)));
  return `${hashes} ${text}`;
};

export const spacing = (newlines: number = 1): string => {
  return '\n'.repeat(newlines);
};

export const blockquote = (text: string): string => {
  return `> ${text.split('\n').join('\n> ')}`;
};

export const codeBlock = (language: string, code: string): string => {
  return `\`\`\`${language}\n${code}\n\`\`\``;
};

export const link = (text: string, url: string, imageMarkdown?: string): string => {
  const content = imageMarkdown || text;
  return `[${content}](${url})`;
};

export const escapeMarkdown = (text: string): string => {
  // Simple markdown escape for common characters
  return text.replace(/([\\`*_{}[\]()#+\-.!])/g, '\\$1');
};

export const badge = (
  label: string,
  color: string,
  style: string = 'flat',
  logo?: string,
  logoColor?: string
): string => {
  const encodedLabel = label ? encodeURIComponent(label) : '';
  const sanitizedColor = color.replace('#', '');
  const logoParam = logo ? `&logo=${logo}` : '';
  const logoColorParam = logoColor ? `&logoColor=${logoColor}` : '';
  return `![${label}](https://img.shields.io/badge/${encodedLabel}-${sanitizedColor}?style=${style}${logoParam}${logoColorParam})`;
};

export const image = (
  alt: string,
  url: string,
  align?: 'left' | 'center' | 'right',
  width?: string | number,
  height?: string | number
): string => {
  const widthAttr = width ? ` width="${width}"` : '';
  const heightAttr = height ? ` height="${height}"` : '';
  const imgTag = `<img src="${url}" alt="${alt}"${widthAttr}${heightAttr} />`;
  
  if (align && align !== 'left') {
    return `<p align="${align}">\n  ${imgTag}\n</p>`;
  }
  return imgTag;
};

export const paragraph = (text: string, align?: 'left' | 'center' | 'right'): string => {
  if (align && align !== 'left') {
    return `<p align="${align}">${text}</p>`;
  }
  return text;
};

export const table = (headers: string[], rows: string[][]): string => {
  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
  const bodyRows = rows.map((row) => `| ${row.join(' | ')} |`);
  return [headerRow, separatorRow, ...bodyRows].join('\n');
};
