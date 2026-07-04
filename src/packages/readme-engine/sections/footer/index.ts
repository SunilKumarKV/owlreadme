export const renderFooter = (text?: string, theme?: string): string => {
  const colorVal = theme === 'auto' || !theme ? 'auto' : theme.replace('#','');
  const textParam = text ? `&text=${encodeURIComponent(text)}` : '';
  return `<p align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=${colorVal}&height=100&section=footer${textParam}&fontSize=20" alt="Footer Wave" />\n</p>`;
};
