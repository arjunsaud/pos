export interface IPaymentMethodEntity {
  type: string;
  name: string;
  description?: string;
  enabled?: boolean;
  accountDetails?: string;
  qrCodeUrl?: string;
}
