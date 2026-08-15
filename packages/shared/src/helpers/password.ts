export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export function scorePassword(password: string): {
  score: number;
  strength: PasswordStrength;
} {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const strength: PasswordStrength =
    score <= 1 ? 'weak' : score === 2 ? 'fair' : score === 3 ? 'good' : 'strong';

  return { score, strength };
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}
