export interface IProductEntity {
  tenantId: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice?: number;
  category: string;
  stock?: number;
  minStock?: number;
  unit: string;
  isActive?: boolean;
  image?: string;
  vendorId?: string;
  vendorName?: string;
  outletId?: string;
  hasBatchTracking?: boolean;
}
