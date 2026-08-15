export interface IBatchEntity {
  tenantId: string;
  productId: string;
  productName: string;
  sku: string;
  batchNumber: string;
  quantity: number;
  remainingQty: number;
  costPrice?: number;
  mfgDate?: string;
  expiryDate?: string;
  status: string;
  receivedDate?: string;
  outletId?: string;
}
