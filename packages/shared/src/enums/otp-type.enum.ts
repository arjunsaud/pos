/**
 * OTP purpose — one-word values for storage and API contracts.
 */
export enum OtpType {
  FORGOT = 'FORGOT',
  VERIFY = 'VERIFY',
  TWOFA = 'TWOFA',
  LOGIN = 'LOGIN',
  CHANGE = 'CHANGE',
}

export const OTP_TYPE_VALUES = Object.values(OtpType);

export function isOtpType(value: unknown): value is OtpType {
  return typeof value === 'string' && OTP_TYPE_VALUES.includes(value as OtpType);
}
