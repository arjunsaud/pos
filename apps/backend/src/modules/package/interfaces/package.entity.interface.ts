export interface IPackageEntity {
  name: string;
  price: number;
  interval: string;
  status: string;
  maxProducts: number;
  maxStaff: number;
  maxOutlets: number;
  analytics: string;
  support: string;
  paymentGateway?: boolean;
  billing?: boolean;
  receipt?: boolean;
  canExport?: boolean;
  inventory?: boolean;
  skuManagement?: boolean;
  pos?: boolean;
  multipleOutlets?: boolean;
  vendors?: boolean;
  invoicePrinting?: boolean;
  trainingAndSupport?: boolean;
  customDomain?: boolean;
  dailyBackup?: boolean;
  popular?: boolean;
}
