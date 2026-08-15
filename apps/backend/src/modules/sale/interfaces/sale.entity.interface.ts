export interface ISaleEntity {
  tenantId: string;
  invoiceNumber: string;
  customerName?: string;
  customerPAN?: string;
  customerId?: string;
  items: Record<string, any>[];
  subtotal: number;
  discount?: number;
  vatAmount?: number;
  vatPercent?: number;
  total: number;
  paymentMethod: string;
  status: string;
  staffName?: string;
  outletId?: string;
}
