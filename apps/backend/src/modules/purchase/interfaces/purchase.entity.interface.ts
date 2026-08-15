export interface IPurchaseEntity {
  tenantId: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  items: Record<string, any>[];
  subtotal: number;
  vatAmount?: number;
  total: number;
  status: string;
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  notes?: string;
  createdBy?: string;
}
