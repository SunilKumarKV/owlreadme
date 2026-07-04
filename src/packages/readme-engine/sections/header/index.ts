import type { HeaderConfig } from '../../types';
import { image as helperImage, paragraph as helperParagraph } from '../../utils/markdown-helpers';

export const renderHeader = (config?: HeaderConfig, username?: string): string => {
  if (!config || !config.enabled) return '';

  const align = config.alignment || 'center';
  const alignAttr = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';
  const lines: string[] = [];

  if (config.bannerType && config.bannerType !== 'none') {
    const bannerText = encodeURIComponent(config.bannerText || '');
    const bannerTheme = config.bannerTheme || 'gradient';
    let bannerUrl = '';

    if (config.bannerType === 'capsule') {
      bannerUrl = `https://capsule-render.vercel.app/api?type=waving&color=${bannerTheme}&height=120&section=header${bannerText ? `&text=${bannerText}` : ''}&fontSize=30`;
    } else if (config.bannerType === 'wave') {
      bannerUrl = `https://capsule-render.vercel.app/api?type=soft&color=${bannerTheme}&height=100&section=header${bannerText ? `&text=${bannerText}` : ''}`;
    } else if (config.bannerType === 'gradient') {
      bannerUrl = `https://capsule-render.vercel.app/api?type=rect&color=${bannerTheme}&height=120&section=header${bannerText ? `&text=${bannerText}` : ''}&fontSize=30`;
    }

    if (bannerUrl) {
      lines.push(helperImage('Banner', bannerUrl, alignAttr));
    }
  }

  const addAlignedElement = (tag: string, content: string) => {
    lines.push(`<${tag} align="${alignAttr}">${content}</${tag}>\n`);
  };

  if (config.visitorPlacement === 'top' && username) {
    const user = username.trim();
    if (user) {
      const visitorUrl = `https://komarev.com/ghpvc/?username=${user}&color=green&style=flat`;
      lines.push(helperImage('Visitor Counter', visitorUrl, alignAttr));
    }
  }

  if (config.name) {
    let nameText = `Hi 👋, I'm ${config.name}`;
    if (config.pronouns) {
      nameText += ` (${config.pronouns})`;
    }
    addAlignedElement('h1', nameText);
  }

  if (config.title || config.location) {
    let subText = config.title || '';
    if (config.location) {
      subText += subText ? ` based in ${config.location}` : `Based in ${config.location}`;
    }
    if (subText) {
      addAlignedElement('h3', subText);
    }
  }

  if (config.intro) {
    addAlignedElement('p', config.intro);
  }

  if (config.typingEnabled && config.typingLines && config.typingLines.length > 0) {
    const activeLines = config.typingLines.filter(Boolean);
    if (activeLines.length > 0) {
      const encodedLines = activeLines.map((l) => encodeURIComponent(l)).join(';');
      const speed = config.typingSpeed || 200;
      const delay = config.typingDelay || 1000;
      const color = config.typingColor || '36BCF7';
      const typingCenter = config.typingCenter !== false;
      const typingUrl = `https://readme-typing-svg.herokuapp.com/?lines=${encodedLines}&color=${color}&center=${typingCenter}&width=450&height=30&speed=${speed}&pause=${delay}`;

      lines.push(helperImage('Typing SVG', typingUrl, alignAttr));
    }
  }

  const badgeLines: string[] = [];
  if (config.badges.openToWork) {
    badgeLines.push(`[![Open To Work](https://img.shields.io/badge/Open%20to%20Work-blue?style=flat-square)](https://github.com)`);
  }
  if (config.badges.freelance) {
    badgeLines.push(`[![Freelance](https://img.shields.io/badge/Freelance-Available-green?style=flat-square)](https://github.com)`);
  }
  if (config.badges.learning) {
    const val = config.badges.learning.trim();
    if (val) {
      badgeLines.push(`[![Learning](https://img.shields.io/badge/Learning-${encodeURIComponent(val)}-orange?style=flat-square)](https://github.com)`);
    }
  }
  if (config.badges.building) {
    const val = config.badges.building.trim();
    if (val) {
      badgeLines.push(`[![Building](https://img.shields.io/badge/Building-${encodeURIComponent(val)}-purple?style=flat-square)](https://github.com)`);
    }
  }

  if (badgeLines.length > 0) {
    if (alignAttr && alignAttr !== 'left') {
      lines.push(`<p align="${alignAttr}">\n  ${badgeLines.join('\n  ')}\n</p>`);
    } else {
      lines.push(badgeLines.join('\n'));
    }
  }

  if (config.visitorPlacement === 'bottom' && username) {
    const user = username.trim();
    if (user) {
      const visitorUrl = `https://komarev.com/ghpvc/?username=${user}&color=green&style=flat`;
      lines.push(helperImage('Visitor Counter', visitorUrl, alignAttr));
    }
  }

  return lines.join('\n');
};
