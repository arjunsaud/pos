export interface IReturnRefundEntity {
  tenantId: string;
  returnNumber: string;
  saleId: string;
  invoiceNumber: string;
  customerName?: string;
  items: Record<string, any>[];
  refundAmount: number;
  refundMethod: string;
  status: string;
  reason?: string;
  processedBy?: string;
  processedAt?: string;
}
