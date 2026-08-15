export interface IReferralEntity {
  referrerTenantId: string;
  referrerTenantName: string;
  referredTenantId: string;
  referredTenantName: string;
  referralCode: string;
  status: string;
  rewardType: string;
  rewardValue: number;
  convertedAt?: string;
}
