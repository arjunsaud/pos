export interface IHeldSaleEntity {
  tenantId: string;
  cart: Record<string, any>[];
  customerName?: string;
  heldAt: string;
  total: number;
  outletId?: string;
}
