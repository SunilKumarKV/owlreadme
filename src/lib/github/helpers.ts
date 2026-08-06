export function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return entries.length > 0 ? `?${entries.join('&')}` : '';
}

export function parseResetTimestamp(resetHeader: string | null | undefined): Date {
  if (!resetHeader) {
    return new Date(Date.now() + 60 * 60 * 1000);
  }
  const seconds = parseInt(resetHeader, 10);
  if (isNaN(seconds)) {
    return new Date(Date.now() + 60 * 60 * 1000);
  }
  return new Date(seconds * 1000);
}

export function getFormattedResetTime(resetDate: Date): string {
  const diffMs = resetDate.getTime() - Date.now();
  if (diffMs <= 0) return 'momentarily';
  const diffMins = Math.ceil(diffMs / 60000);
  return `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
}
