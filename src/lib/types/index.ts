// ============================================================
// Types for Multi-Tenant POS, Inventory & Billing System
// ============================================================

// ---------- Auth & Roles ----------
export type UserRole = 'super-admin' | 'tenant-admin' | 'staff';

export type TenantStaffRole = 'cashier' | 'manager';

export type SuperAdminStaffRole = 'admin' | 'support' | 'finance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantStaffRole?: TenantStaffRole;
  superAdminStaffRole?: SuperAdminStaffRole;
  avatar?: string;
  tenantId?: string;
  tenantName?: string;
}

// ---------- Navigation ----------
export type NavSection =
  | 'super-admin-dashboard'
  | 'tenants'
  | 'super-admin-staff'
  | 'super-admin-subscriptions'
  | 'activity-logs'
  | 'content'
  | 'super-admin-settings'
  | 'tenant-dashboard'
  | 'pos'
  | 'customers'
  | 'billing'
  | 'products'
  | 'inventory'
  | 'categories'
  | 'sales'
  | 'reports'
  | 'tenant-subscription'
  | 'tenant-staff'
  | 'store-profile';

export interface NavItem {
  label: string;
  section: NavSection;
  icon: string;
  badge?: string;
}

// ---------- Tenant ----------
export type TenantStatus = 'active' | 'inactive';
export type PlanType = 'basic' | 'pro' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: PlanType;
  status: TenantStatus;
  createdAt: string;
  domain: string;
  ownerName: string;
  productCount: number;
  monthlyRevenue: number;
}

// ---------- Subscription Plans ----------
export interface SubscriptionPlan {
  id: string;
  name: PlanType;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
  maxProducts: number;
  maxStaff: number;
}

// ---------- Product ----------
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  image?: string;
}

// ---------- Category ----------
export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
}

// ---------- Inventory ----------
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  minStock: number;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: string;
  performedBy: string;
}

// ---------- POS / Cart ----------
export interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

// ---------- Sale / Order ----------
export interface Sale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPAN: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  vatAmount: number;
  vatPercent: number;
  total: number;
  paymentMethod: string;
  status: 'completed' | 'refunded' | 'pending';
  date: string;
  staffName: string;
}

export interface SaleItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ---------- Invoice ----------
export interface Invoice extends Sale {
  tenantName: string;
  tenantAddress: string;
  tenantPAN: string;
  tenantPhone: string;
}

// ---------- Staff ----------
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: SuperAdminStaffRole | TenantStaffRole;
  status: 'active' | 'inactive';
  createdAt: string;
  permissions: string[];
  avatar?: string;
}

// ---------- Activity Log ----------
export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

// ---------- Report Data ----------
export interface SalesReportData {
  date: string;
  sales: number;
  orders: number;
}

export interface InventoryReportData {
  category: string;
  totalProducts: number;
  totalValue: number;
  lowStock: number;
}

export interface VATReportData {
  month: string;
  taxableAmount: number;
  vatCollected: number;
  vatPaid: number;
}

// ---------- Dashboard Stats ----------
export interface SuperAdminStats {
  totalTenants: number;
  activeSubscriptions: number;
  totalRevenue: number;
  revenueGrowth: number;
  recentActivity: ActivityLog[];
}

export interface TenantStats {
  dailySales: number;
  dailySalesGrowth: number;
  monthlyRevenue: number;
  monthlyRevenueGrowth: number;
  totalOrders: number;
  totalOrdersGrowth: number;
  topProducts: { name: string; sold: number; revenue: number }[];
  lowStockAlerts: number;
}

// ---------- Customer ----------
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  address: string;
  totalPurchases: number;
  totalSpent: number;
  lastVisit: string;
  createdAt: string;
  isActive: boolean;
}

// ---------- Held Sale ----------
export interface HeldSale {
  id: string;
  cart: CartItem[];
  customerName: string;
  heldAt: string;
  total: number;
}
