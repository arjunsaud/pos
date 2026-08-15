export interface IStockMovementEntity {
  tenantId: string;
  productId: string;
  productName: string;
  type: string;
  quantity: number;
  reason?: string;
  performedBy?: string;
  outletId?: string;
}
