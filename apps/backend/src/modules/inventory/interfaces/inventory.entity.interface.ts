export interface IInventoryEntity {
  tenantId: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock?: number;
  outletId?: string;
}
