export function formatDate(
  value: string | Date,
  locale = 'en-NP',
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(
    locale,
    options ?? { year: 'numeric', month: 'short', day: 'numeric' },
  );
}

export function formatDateTime(
  value: string | Date,
  locale = 'en-NP',
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(value: string | Date, now = new Date()): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = date.getTime() - now.getTime();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['week', 1000 * 60 * 60 * 24 * 7],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
    ['second', 1000],
  ];

  for (const [unit, ms] of units) {
    if (abs >= ms || unit === 'second') {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }

  return '';
}

export function isExpired(expireAt: string | Date, now = new Date()): boolean {
  const date = expireAt instanceof Date ? expireAt : new Date(expireAt);
  if (Number.isNaN(date.getTime())) return true;
  return date.getTime() <= now.getTime();
}
