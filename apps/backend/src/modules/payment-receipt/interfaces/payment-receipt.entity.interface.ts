export interface IPaymentReceiptEntity {
  tenantId: string;
  tenantName: string;
  amount: number;
  packageId: string;
  packageName: string;
  paymentMethod: string;
  receiptFile?: string;
  status: string;
  uploadedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}
