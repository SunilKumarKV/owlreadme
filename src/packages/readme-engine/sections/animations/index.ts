import type { AnimatedComponentsConfig } from '../../types';

export const renderAnimations = (config: AnimatedComponentsConfig, username: string): string => {
  if (!config || !config.enabled) return '';

  const blocks: string[] = [];

  config.components.forEach((comp) => {
    if (!comp.enabled) return;

    let compMarkdown = '';

    switch (comp.type) {
      case 'typing': {
        const { lines, speed, delay, color, cursor } = comp.config;
        if (lines && lines.length > 0) {
          const linesParam = lines.map((l: string) => encodeURIComponent(l)).join(';');
          const speedParam = speed ? `&speed=${speed}` : '';
          const delayParam = delay ? `&pause=${delay}` : '';
          const colorParam = color ? `&color=${color.replace('#','')}` : '';
          const cursorParam = cursor === 'pipe' ? '' : `&vCenter=true&multiline=true`;

          compMarkdown = `<p align="center">\n  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&width=435${speedParam}${delayParam}${colorParam}${cursorParam}&lines=${linesParam}" alt="Typing SVG" />\n</p>`;
        }
        break;
      }
      case 'waveHeader': {
        const { theme, height, text, animation } = comp.config;
        const colorVal = theme === 'auto' ? 'auto' : theme.replace('#','');
        const textParam = text ? `&text=${encodeURIComponent(text)}` : '';
        compMarkdown = `<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=${animation || 'wave'}&color=${colorVal}&height=${height || 120}&section=header${textParam}&fontSize=30" alt="Wave Header" />\n</p>`;
        break;
      }
      case 'divider': {
        const { style, color1, color2 } = comp.config;
        const c1 = color1 || '#0078d7';
        const c2 = color2 || '#36BCF7';

        if (style === 'waves') {
          compMarkdown = `<p align="center">\n  <svg width="100%" height="20" viewBox="0 0 1200 20" fill="none" xmlns="http://www.w3.org/2500/svg">\n    <path d="M0 10 Q 75 0, 150 10 T 300 10 T 450 10 T 600 10 T 750 10 T 900 10 T 1050 10 T 1200 10" stroke="url(#divider_grad)" stroke-width="3" fill="none" />\n    <defs>\n      <linearGradient id="divider_grad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">\n        <stop stop-color="${c1}" />\n        <stop offset="1" stop-color="${c2}" />\n      </linearGradient>\n    </defs>\n  </svg>\n</p>`;
        } else if (style === 'dots') {
          compMarkdown = `<p align="center">\n  <svg width="120" height="20" viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <circle cx="20" cy="10" r="4" fill="${c1}" />\n    <circle cx="40" cy="10" r="5" fill="${c2}" />\n    <circle cx="60" cy="10" r="6" fill="${c1}" />\n    <circle cx="80" cy="10" r="5" fill="${c2}" />\n    <circle cx="100" cy="10" r="4" fill="${c1}" />\n  </svg>\n</p>`;
        } else {
          compMarkdown = `<p align="center">\n  <svg width="100%" height="10" viewBox="0 0 1200 10" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <line x1="0" y1="5" x2="1200" y2="5" stroke="url(#line_grad)" stroke-width="4" />\n    <defs>\n      <linearGradient id="line_grad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">\n        <stop stop-color="${c1}" />\n        <stop offset="1" stop-color="${c2}" />\n      </linearGradient>\n    </defs>\n  </svg>\n</p>`;
        }
        break;
      }
      case 'snake': {
        const user = username || 'github-username';
        compMarkdown = `<p align="center">\n  <img src="https://raw.githubusercontent.com/${user}/${user}/output/github-contribution-grid-snake.svg" alt="GitHub Contribution Snake" />\n</p>`;
        break;
      }
      case 'decorative': {
        const { type, color } = comp.config;
        const col = color || '#eab308';
        if (type === 'stars') {
          compMarkdown = `<p align="center">\n  <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <polygon points="10,1 4,19 19,7 1,7 16,19" fill="${col}" />\n    <polygon points="30,3 25,17 37,8 23,8 35,17" fill="${col}" opacity="0.6" />\n    <polygon points="50,1 44,19 59,7 41,7 56,19" fill="${col}" />\n  </svg>\n</p>`;
        }
        break;
      }
      case 'badge': {
        const { label, color } = comp.config;
        const col = (color || '#10b981').replace('#','');
        compMarkdown = `<p align="center">\n  <a href="#">\n    <img src="https://img.shields.io/badge/Status-${encodeURIComponent(label || 'Open to Work')}-${col}?style=for-the-badge" alt="Status Badge" />\n  </a>\n</p>`;
        break;
      }
      case 'footer': {
        const { text, theme } = comp.config;
        const colorVal = theme === 'auto' ? 'auto' : theme.replace('#','');
        const textParam = text ? `&text=${encodeURIComponent(text)}` : '';
        compMarkdown = `<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=${colorVal}&height=100&section=footer${textParam}&fontSize=20" alt="Footer Wave" />\n</p>`;
        break;
      }
    }

    if (compMarkdown) {
      blocks.push(compMarkdown);
    }
  });

  return blocks.join('\n\n');
};
