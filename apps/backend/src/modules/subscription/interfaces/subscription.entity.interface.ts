export interface ISubscriptionEntity {
  tenantId: string;
  tenantName: string;
  packageId: string;
  packageName: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  autoRenew?: boolean;
}
