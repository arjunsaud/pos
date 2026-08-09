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
  // Super Admin - Global
  | 'super-admin-dashboard'
  | 'tenants'
  | 'super-admin-staff'
  | 'sa-packages'
  | 'sa-documents'
  | 'activity-logs'
  | 'super-admin-settings'
  | 'sa-promotions'
  | 'sa-referrals'
  | 'sa-profile'
  // Super Admin - Tenant View (when a tenant is selected)
  | 'sa-tenant-overview'
  | 'sa-tenant-billing'
  | 'sa-tenant-products'
  | 'sa-tenant-inventory'
  | 'sa-tenant-categories'
  | 'sa-tenant-sales'
  | 'sa-tenant-reports'
  | 'sa-tenant-staff-view'
  | 'sa-tenant-subscription'
  | 'sa-tenant-features'
  | 'sa-tenant-vendors'
  | 'sa-payment'
  | 'sa-support-tickets'
  | 'sa-terms-conditions'
  | 'sa-privacy-policy'
  // Tenant Admin
  | 'tenant-dashboard'
  | 'tenant-support'
  | 'pos'
  | 'billing'
  | 'products'
  | 'inventory'
  | 'categories'
  | 'vendors'
  | 'sales-reports'
  | 'tenant-subscription'
  | 'tenant-staff'
  | 'store-profile'
  | 'tenant-profile'
  | 'tenant-settings'
  | 'tenant-outlets'
  // Landing Page
  | 'landing-page';

export interface NavItem {
  label: string;
  section: NavSection;
  icon: string;
  badge?: string;
}

// ---------- Tenant ----------
export type TenantStatus = 'active' | 'inactive';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: TenantStatus;
  createdAt: string;
  domain: string;
  ownerName: string;
  productCount: number;
  monthlyRevenue: number;
}

// ---------- Outlet ----------
export interface Outlet {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
}

// ---------- Subscription Package (Super Admin manages these) ----------
export interface SubscriptionPackage {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'inactive';
  maxProducts: number;
  maxStaff: number;
  analytics: 'basic' | 'standard' | 'advanced';
  support: 'basic' | 'quick' | 'priority' | 'dedicated';
  paymentGateway: boolean;
  billing: boolean;
  receipt: boolean;
  export: boolean;
  advanceInventory: boolean;
  pos: boolean;
  multipleOutlets: boolean;
  popular?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------- Subscription (tenant assignment) ----------
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

export interface Subscription {
  id: string;
  tenantId: string;
  tenantName: string;
  packageId: string;
  packageName: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  amount: number;
  currency: string;
  autoRenew: boolean;
}

// ---------- Vendor ----------
export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  pan: string;
  vatNumber: string;
  address: string;
  city: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: string;
}

// ---------- Tenant Document ----------
export type DocumentType = 'pan' | 'vat' | 'business_license' | 'bank_statement' | 'other';

export interface TenantDocument {
  id: string;
  tenantId: string;
  tenantName: string;
  type: DocumentType;
  name: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'rejected';
}

// ---------- Tenant Feature ----------
export interface TenantFeature {
  id: string;
  key: string;
  label: string;
  description: string;
  category: 'pos' | 'inventory' | 'billing' | 'reporting' | 'integration' | 'advanced';
  enabled: boolean;
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
  vendorId?: string;
  vendorName?: string;
  outletId?: string;
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
  outletId?: string;
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
  outletId?: string;
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
  outletId?: string;
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

// ---------- Customer (used internally by POS for billing) ----------
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

// ---------- Promotion ----------
export type PromotionStatus = 'active' | 'expired' | 'scheduled' | 'paused';
export type PromotionType = 'percentage' | 'fixed' | 'trial_extension' | 'free_month';

export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: PromotionType;
  value: number;
  status: PromotionStatus;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  createdAt: string;
  createdBy: string;
}

// ---------- Referral ----------
export interface Referral {
  id: string;
  referrerTenantId: string;
  referrerTenantName: string;
  referredTenantId: string;
  referredTenantName: string;
  referralCode: string;
  status: 'pending' | 'converted' | 'rewarded';
  rewardType: 'percentage_discount' | 'fixed_discount' | 'free_month';
  rewardValue: number;
  createdAt: string;
  convertedAt?: string;
}

// ---------- User Profile ----------
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  address?: string;
  city?: string;
  pan?: string;
  referralCode?: string;
  referralCount?: number;
  referralEarnings?: number;
  joinedAt: string;
}

// ---------- Support Ticket ----------
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketCategory = 'bug' | 'feature_request' | 'billing' | 'technical' | 'other';

export interface SupportTicket {
  id: string;
  tenantId: string;
  tenantName: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  respondedAt?: string;
  response?: string;
  attachments?: string[];
}

// ---------- Payment Method (SA admin) ----------
export type AdminPaymentType = 'esewa' | 'khalti' | 'bank' | 'qr';

export interface AdminPaymentMethod {
  id: string;
  type: AdminPaymentType;
  name: string;
  description: string;
  enabled: boolean;
  accountDetails: string;
  qrCodeUrl?: string;
}

export interface PaymentReceipt {
  id: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  packageId: string;
  packageName: string;
  paymentMethod: AdminPaymentType;
  receiptFile?: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}
