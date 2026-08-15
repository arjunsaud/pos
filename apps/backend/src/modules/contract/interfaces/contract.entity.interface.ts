export interface IContractEntity {
  tenantId: string;
  tenantName: string;
  title: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  value: number;
  currency: string;
  description?: string;
}
