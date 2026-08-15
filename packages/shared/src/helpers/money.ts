const NPR = new Intl.NumberFormat('en-NP', {
  style: 'currency',
  currency: 'NPR',
  maximumFractionDigits: 0,
});

export function formatNpr(amount: number): string {
  if (!Number.isFinite(amount)) return 'NPR 0';
  return NPR.format(amount);
}

export function formatNumber(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('en-NP', {
    maximumFractionDigits: digits,
  }).format(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}
