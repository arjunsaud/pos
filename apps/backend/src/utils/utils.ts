import { randomBytes } from 'crypto';
export const shitLists = {
  MORNING: { $gte: 6 * 60, $lt: 12 * 60 },
  AFTERNOON: { $gte: 12 * 60, $lt: 18 * 60 },
  EVENING: { $gte: 18 * 60, $lte: 23 * 60 },
};

export function generateCode(length = 8, prefix: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(length);

  const code = Array.from(bytes, (b) => chars[b % chars.length]).join('');

  return `${prefix}-${code}`;
}

export function generateBookingCode() {
  return generateCode(8, 'IEN-BOK');
}
