export type DesktopRole = 'tenant-admin' | 'staff';
export type DesktopPage = 'dashboard' | 'pos' | 'products' | 'inventory' | 'sales';

export interface DesktopUser {
  id: string;
  name: string;
  email: string;
  role: DesktopRole;
  tenantId?: string;
  tenantName?: string;
}

export interface ProductRow {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  stock: number;
  category: string;
  isActive: boolean;
}

export interface CartItem {
  product: ProductRow;
  quantity: number;
}

export interface SaleRow {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  paymentMethod: string;
  status: string;
  date: string;
}
