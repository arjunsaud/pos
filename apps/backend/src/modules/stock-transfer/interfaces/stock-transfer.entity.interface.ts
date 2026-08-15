export interface IStockTransferEntity {
  tenantId: string;
  transferNumber: string;
  fromOutletId: string;
  fromOutletName: string;
  toOutletId: string;
  toOutletName: string;
  items: Record<string, any>[];
  status: string;
  reason?: string;
  completedAt?: string;
  createdBy?: string;
  notes?: string;
}
