// ============================================================
// Mock Data for Multi-Tenant POS, Inventory & Billing System
// ============================================================

import type {
  Tenant,
  SubscriptionPlan,
  Subscription,
  Product,
  Category,
  InventoryItem,
  StockMovement,
  Sale,
  StaffMember,
  ActivityLog,
  SalesReportData,
  InventoryReportData,
  VATReportData,
  SuperAdminStats,
  TenantStats,
  Customer,
  Vendor,
  Contract,
  TenantDocument,
  TenantFeature,
  Promotion,
  Referral,
  UserProfile,
} from '@/lib/types';

// ---------- Tenants ----------
export const mockTenants: Tenant[] = [
  { id: 't1', name: 'ABC Store', email: 'admin@abcstore.com', phone: '+977-9801234567', plan: 'pro', status: 'active', createdAt: '2024-01-15', domain: 'abcstore.posnepal.com', ownerName: 'Rajesh Sharma', productCount: 245, monthlyRevenue: 125000 },
  { id: 't2', name: 'XYZ Mart', email: 'info@xyzmart.com', phone: '+977-9812345678', plan: 'basic', status: 'inactive', createdAt: '2024-03-22', domain: 'xyzmart.posnepal.com', ownerName: 'Sita Devi', productCount: 89, monthlyRevenue: 45000 },
  { id: 't3', name: 'Kathmandu Grocers', email: 'hello@ktmgrcoers.com', phone: '+977-9823456789', plan: 'enterprise', status: 'active', createdAt: '2023-11-10', domain: 'ktmgrcoers.posnepal.com', ownerName: 'Bikash Thapa', productCount: 1200, monthlyRevenue: 890000 },
  { id: 't4', name: 'Pokhara Electronics', email: 'contact@pkr-electronics.com', phone: '+977-9834567890', plan: 'pro', status: 'active', createdAt: '2024-02-28', domain: 'pkrelectronics.posnepal.com', ownerName: 'Anita Gurung', productCount: 340, monthlyRevenue: 567000 },
  { id: 't5', name: 'Bhaktapur Handicraft', email: 'info@bktcraft.com', phone: '+977-9845678901', plan: 'basic', status: 'active', createdAt: '2024-05-10', domain: 'bktcraft.posnepal.com', ownerName: 'Hari Prasad', productCount: 156, monthlyRevenue: 78000 },
  { id: 't6', name: 'Lalitpur Fashion', email: 'style@ltpfashion.com', phone: '+977-9856789012', plan: 'pro', status: 'active', createdAt: '2024-04-05', domain: 'ltpfashion.posnepal.com', ownerName: 'Priya Maharjan', productCount: 412, monthlyRevenue: 234000 },
  { id: 't7', name: 'Chitwan Fresh', email: 'fresh@chitwanfresh.com', phone: '+977-9867890123', plan: 'basic', status: 'inactive', createdAt: '2024-06-18', domain: 'chitwanfresh.posnepal.com', ownerName: 'Dil Kumar', productCount: 67, monthlyRevenue: 32000 },
  { id: 't8', name: 'Biratnagar Hardware', email: 'sales@brthardware.com', phone: '+977-9878901234', plan: 'enterprise', status: 'active', createdAt: '2023-09-20', domain: 'brthardware.posnepal.com', ownerName: 'Kumar Rai', productCount: 890, monthlyRevenue: 1456000 },
];

// ---------- Subscription Plans ----------
export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-1', name: 'basic', price: 999, currency: 'NPR', interval: 'month',
    features: ['Up to 100 Products', '1 Staff Account', 'Basic Reports', 'Email Support', 'POS System'],
    maxProducts: 100, maxStaff: 1,
  },
  {
    id: 'plan-2', name: 'pro', price: 2999, currency: 'NPR', interval: 'month', popular: true,
    features: ['Up to 500 Products', '5 Staff Accounts', 'Advanced Reports', 'Priority Support', 'POS System', 'Inventory Management', 'Billing & Invoicing'],
    maxProducts: 500, maxStaff: 5,
  },
  {
    id: 'plan-3', name: 'enterprise', price: 7999, currency: 'NPR', interval: 'month',
    features: ['Unlimited Products', 'Unlimited Staff', 'Custom Reports', '24/7 Support', 'POS System', 'Inventory Management', 'Billing & Invoicing', 'API Access', 'Custom Domain', 'Multi-Branch Support'],
    maxProducts: 99999, maxStaff: 99999,
  },
];

// ---------- Subscriptions (entity CRUD) ----------
export const mockSubscriptions: Subscription[] = [
  { id: 'sub-1', tenantId: 't1', tenantName: 'ABC Store', planId: 'plan-2', planName: 'pro', status: 'active', startDate: '2024-01-15', endDate: '2025-01-15', amount: 2999, currency: 'NPR', autoRenew: true },
  { id: 'sub-2', tenantId: 't2', tenantName: 'XYZ Mart', planId: 'plan-1', planName: 'basic', status: 'expired', startDate: '2024-03-22', endDate: '2024-09-22', amount: 999, currency: 'NPR', autoRenew: false },
  { id: 'sub-3', tenantId: 't3', tenantName: 'Kathmandu Grocers', planId: 'plan-3', planName: 'enterprise', status: 'active', startDate: '2023-11-10', endDate: '2025-11-10', amount: 7999, currency: 'NPR', autoRenew: true },
  { id: 'sub-4', tenantId: 't4', tenantName: 'Pokhara Electronics', planId: 'plan-2', planName: 'pro', status: 'active', startDate: '2024-02-28', endDate: '2025-02-28', amount: 2999, currency: 'NPR', autoRenew: true },
  { id: 'sub-5', tenantId: 't5', tenantName: 'Bhaktapur Handicraft', planId: 'plan-1', planName: 'basic', status: 'active', startDate: '2024-05-10', endDate: '2025-05-10', amount: 999, currency: 'NPR', autoRenew: false },
  { id: 'sub-6', tenantId: 't6', tenantName: 'Lalitpur Fashion', planId: 'plan-2', planName: 'pro', status: 'active', startDate: '2024-04-05', endDate: '2025-04-05', amount: 2999, currency: 'NPR', autoRenew: true },
  { id: 'sub-7', tenantId: 't7', tenantName: 'Chitwan Fresh', planId: 'plan-1', planName: 'basic', status: 'cancelled', startDate: '2024-06-18', endDate: '2024-12-18', amount: 999, currency: 'NPR', autoRenew: false },
  { id: 'sub-8', tenantId: 't8', tenantName: 'Biratnagar Hardware', planId: 'plan-3', planName: 'enterprise', status: 'active', startDate: '2023-09-20', endDate: '2025-09-20', amount: 7999, currency: 'NPR', autoRenew: true },
  { id: 'sub-9', tenantId: 't1', tenantName: 'ABC Store', planId: 'plan-1', planName: 'basic', status: 'expired', startDate: '2023-06-15', endDate: '2024-01-15', amount: 999, currency: 'NPR', autoRenew: false },
  { id: 'sub-10', tenantId: 't3', tenantName: 'Kathmandu Grocers', planId: 'plan-2', planName: 'pro', status: 'expired', startDate: '2022-11-10', endDate: '2023-11-10', amount: 2999, currency: 'NPR', autoRenew: false },
];

// ---------- Vendors ----------
export const mockVendors: Vendor[] = [
  { id: 'v1', name: 'Nepal Dairy Corp', contactPerson: 'Ram Bahadur', email: 'sales@nepaldairy.com.np', phone: '+977-9801111111', pan: '301111111', vatNumber: 'VAT-301111111', address: 'Balaju Industrial Area', city: 'Kathmandu', status: 'active', productCount: 5, createdAt: '2024-01-10' },
  { id: 'v2', name: 'CG Foods Nepal', contactPerson: 'Sita Kumari', email: 'orders@cgfoods.com.np', phone: '+977-9802222222', pan: '302222222', vatNumber: 'VAT-302222222', address: 'Hetauda Industrial Corridor', city: 'Hetauda', status: 'active', productCount: 8, createdAt: '2024-01-12' },
  { id: 'v3', name: 'Goldstar Shoe Pvt Ltd', contactPerson: 'Hari Prasad', email: 'info@goldstar.com.np', phone: '+977-9803333333', pan: '303333333', vatNumber: 'VAT-303333333', address: 'Biratnagar', city: 'Biratnagar', status: 'active', productCount: 3, createdAt: '2024-02-01' },
  { id: 'v4', name: 'Tokla Tea Estate', contactPerson: 'Dawa Sherpa', email: 'export@tokla.com.np', phone: '+977-9804444444', pan: '304444444', vatNumber: 'VAT-304444444', address: 'Ilam', city: 'Ilam', status: 'active', productCount: 2, createdAt: '2024-01-18' },
  { id: 'v5', name: 'Himalayan Snacks Pvt Ltd', contactPerson: 'Bikash Lama', email: 'supply@himsnacks.com.np', phone: '+977-9805555555', pan: '305555555', vatNumber: 'VAT-305555555', address: 'Thapathali', city: 'Kathmandu', status: 'active', productCount: 4, createdAt: '2024-01-20' },
  { id: 'v6', name: 'Nepal Agro Industries', contactPerson: 'Kumar Shrestha', email: 'info@nepagro.com.np', phone: '+977-9806666666', pan: '306666666', vatNumber: 'VAT-306666666', address: 'Bhaktapur', city: 'Bhaktapur', status: 'inactive', productCount: 2, createdAt: '2024-03-05' },
  { id: 'v7', name: 'Surya Lights & Electricals', contactPerson: 'Anita Gurung', email: 'orders@suryalights.com.np', phone: '+977-9807777777', pan: '307777777', vatNumber: 'VAT-307777777', address: 'Putalisadak', city: 'Kathmandu', status: 'active', productCount: 6, createdAt: '2024-02-15' },
  { id: 'v8', name: 'Chitwan Fresh Farms', contactPerson: 'Dil Kumar', email: 'supply@ctfresh.com.np', phone: '+977-9808888888', pan: '308888888', vatNumber: 'VAT-308888888', address: 'Narayanghat', city: 'Chitwan', status: 'active', productCount: 3, createdAt: '2024-03-10' },
];

// ---------- Contracts ----------
export const mockContracts: Contract[] = [
  { id: 'ct-1', tenantId: 't1', tenantName: 'ABC Store', title: 'Annual POS Service Agreement', type: 'service', status: 'active', startDate: '2024-01-15', endDate: '2025-01-15', value: 35988, currency: 'NPR', description: 'Annual POS system service including maintenance, updates, and 24/7 support for Pro plan.' },
  { id: 'ct-2', tenantId: 't3', tenantName: 'Kathmandu Grocers', title: 'Enterprise License Contract', type: 'license', status: 'active', startDate: '2023-11-10', endDate: '2025-11-10', value: 191976, currency: 'NPR', description: 'Enterprise license with API access, custom domain, and multi-branch support.' },
  { id: 'ct-3', tenantId: 't4', tenantName: 'Pokhara Electronics', title: 'Pro Plan Service Agreement', type: 'service', status: 'active', startDate: '2024-02-28', endDate: '2025-02-28', value: 35988, currency: 'NPR', description: 'Pro plan service with inventory management and advanced reporting.' },
  { id: 'ct-4', tenantId: 't5', tenantName: 'Bhaktapur Handicraft', title: 'Basic Plan Contract', type: 'service', status: 'active', startDate: '2024-05-10', endDate: '2025-05-10', value: 11988, currency: 'NPR', description: 'Basic POS service agreement with email support.' },
  { id: 'ct-5', tenantId: 't2', tenantName: 'XYZ Mart', title: 'Initial Setup & Onboarding', type: 'custom', status: 'expired', startDate: '2024-03-22', endDate: '2024-06-22', value: 5000, currency: 'NPR', description: 'One-time onboarding and setup assistance.' },
  { id: 'ct-6', tenantId: 't6', tenantName: 'Lalitpur Fashion', title: 'Pro Plan Service Agreement', type: 'service', status: 'active', startDate: '2024-04-05', endDate: '2025-04-05', value: 35988, currency: 'NPR', description: 'Pro plan service with billing and invoicing features.' },
  { id: 'ct-7', tenantId: 't8', tenantName: 'Biratnagar Hardware', title: 'Enterprise Custom Integration', type: 'custom', status: 'active', startDate: '2023-09-20', endDate: '2025-09-20', value: 250000, currency: 'NPR', description: 'Custom ERP integration with hardware inventory tracking system.' },
  { id: 'ct-8', tenantId: 't7', tenantName: 'Chitwan Fresh', title: 'Basic Plan Contract', type: 'service', status: 'terminated', startDate: '2024-06-18', endDate: '2024-12-18', value: 5994, currency: 'NPR', description: 'Basic POS service - terminated early due to non-payment.' },
];

// ---------- Tenant Documents ----------
export const mockTenantDocuments: TenantDocument[] = [
  { id: 'doc-1', tenantId: 't1', tenantName: 'ABC Store', type: 'pan', name: 'PAN Certificate', fileName: 'abc_store_pan.pdf', fileSize: '245 KB', uploadedAt: '2024-01-15', status: 'verified' },
  { id: 'doc-2', tenantId: 't1', tenantName: 'ABC Store', type: 'vat', name: 'VAT Registration', fileName: 'abc_store_vat.pdf', fileSize: '312 KB', uploadedAt: '2024-01-15', status: 'verified' },
  { id: 'doc-3', tenantId: 't1', tenantName: 'ABC Store', type: 'business_license', name: 'Business Registration Certificate', fileName: 'abc_store_biz_reg.pdf', fileSize: '528 KB', uploadedAt: '2024-01-15', status: 'verified' },
  { id: 'doc-4', tenantId: 't3', tenantName: 'Kathmandu Grocers', type: 'pan', name: 'PAN Certificate', fileName: 'ktm_grocers_pan.pdf', fileSize: '198 KB', uploadedAt: '2023-11-10', status: 'verified' },
  { id: 'doc-5', tenantId: 't3', tenantName: 'Kathmandu Grocers', type: 'vat', name: 'VAT Registration', fileName: 'ktm_grocers_vat.pdf', fileSize: '267 KB', uploadedAt: '2023-11-10', status: 'verified' },
  { id: 'doc-6', tenantId: 't3', tenantName: 'Kathmandu Grocers', type: 'business_license', name: 'Company Registration', fileName: 'ktm_grocers_company.pdf', fileSize: '1.2 MB', uploadedAt: '2023-11-10', status: 'verified' },
  { id: 'doc-7', tenantId: 't3', tenantName: 'Kathmandu Grocers', type: 'bank_statement', name: 'Bank Statement Q1 2024', fileName: 'ktm_grocers_bank_q1.pdf', fileSize: '890 KB', uploadedAt: '2024-04-15', status: 'verified' },
  { id: 'doc-8', tenantId: 't4', tenantName: 'Pokhara Electronics', type: 'pan', name: 'PAN Certificate', fileName: 'pkr_elec_pan.pdf', fileSize: '210 KB', uploadedAt: '2024-02-28', status: 'verified' },
  { id: 'doc-9', tenantId: 't4', tenantName: 'Pokhara Electronics', type: 'vat', name: 'VAT Registration', fileName: 'pkr_elec_vat.pdf', fileSize: '298 KB', uploadedAt: '2024-02-28', status: 'pending' },
  { id: 'doc-10', tenantId: 't5', tenantName: 'Bhaktapur Handicraft', type: 'pan', name: 'PAN Certificate', fileName: 'bkt_craft_pan.pdf', fileSize: '220 KB', uploadedAt: '2024-05-10', status: 'verified' },
  { id: 'doc-11', tenantId: 't5', tenantName: 'Bhaktapur Handicraft', type: 'other', name: 'Handicraft Export License', fileName: 'bkt_craft_export.pdf', fileSize: '456 KB', uploadedAt: '2024-05-12', status: 'pending' },
  { id: 'doc-12', tenantId: 't8', tenantName: 'Biratnagar Hardware', type: 'pan', name: 'PAN Certificate', fileName: 'brt_hw_pan.pdf', fileSize: '205 KB', uploadedAt: '2023-09-20', status: 'verified' },
  { id: 'doc-13', tenantId: 't8', tenantName: 'Biratnagar Hardware', type: 'vat', name: 'VAT Registration', fileName: 'brt_hw_vat.pdf', fileSize: '310 KB', uploadedAt: '2023-09-20', status: 'verified' },
  { id: 'doc-14', tenantId: 't8', tenantName: 'Biratnagar Hardware', type: 'business_license', name: 'Trade License', fileName: 'brt_hw_trade.pdf', fileSize: '780 KB', uploadedAt: '2023-09-20', status: 'rejected' },
  { id: 'doc-15', tenantId: 't6', tenantName: 'Lalitpur Fashion', type: 'pan', name: 'PAN Certificate', fileName: 'ltp_fashion_pan.pdf', fileSize: '230 KB', uploadedAt: '2024-04-05', status: 'verified' },
];

// ---------- Tenant Features ----------
export const mockTenantFeatures: TenantFeature[] = [
  { id: 'f1', key: 'pos_basic', label: 'POS Terminal', description: 'Point of sale terminal with barcode scanning', category: 'pos', enabled: true },
  { id: 'f2', key: 'pos_hold_sale', label: 'Hold & Resume Sales', description: 'Park current sale and resume later', category: 'pos', enabled: true },
  { id: 'f3', key: 'pos_discount', label: 'Manual Discount', description: 'Apply manual discounts on sales', category: 'pos', enabled: true },
  { id: 'f4', key: 'inv_basic', label: 'Inventory Tracking', description: 'Track stock levels and movements', category: 'inventory', enabled: true },
  { id: 'f5', key: 'inv_alerts', label: 'Low Stock Alerts', description: 'Get notified when stock falls below minimum', category: 'inventory', enabled: true },
  { id: 'f6', key: 'inv_batch', label: 'Batch Stock Update', description: 'Update stock for multiple items at once', category: 'inventory', enabled: false },
  { id: 'f7', key: 'bill_invoicing', label: 'Invoicing', description: 'Create and manage invoices with VAT', category: 'billing', enabled: true },
  { id: 'f8', key: 'bill_recurring', label: 'Recurring Billing', description: 'Set up automatic recurring invoices', category: 'billing', enabled: false },
  { id: 'f9', key: 'rpt_basic', label: 'Sales Reports', description: 'Daily, weekly, and monthly sales reports', category: 'reporting', enabled: true },
  { id: 'f10', key: 'rpt_vat', label: 'VAT Reports', description: 'VAT collection and filing reports', category: 'reporting', enabled: true },
  { id: 'f11', key: 'rpt_export', label: 'Export Reports', description: 'Export reports to CSV and PDF formats', category: 'reporting', enabled: true },
  { id: 'f12', key: 'rpt_custom', label: 'Custom Reports', description: 'Create custom report templates', category: 'reporting', enabled: false },
  { id: 'f13', key: 'int_esewa', label: 'eSewa Payment', description: 'Accept payments via eSewa digital wallet', category: 'integration', enabled: true },
  { id: 'f14', key: 'int_khalti', label: 'Khalti Payment', description: 'Accept payments via Khalti digital wallet', category: 'integration', enabled: true },
  { id: 'f15', key: 'int_bank', label: 'Bank Transfer', description: 'Bank transfer payment integration', category: 'integration', enabled: false },
  { id: 'f16', key: 'adv_multi_branch', label: 'Multi-Branch', description: 'Manage multiple store branches', category: 'advanced', enabled: false },
  { id: 'f17', key: 'adv_api', label: 'API Access', description: 'RESTful API for external integrations', category: 'advanced', enabled: false },
  { id: 'f18', key: 'adv_custom_domain', label: 'Custom Domain', description: 'Use your own domain name', category: 'advanced', enabled: false },
];

// ---------- Categories ----------
export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Dairy & Eggs', description: 'Milk, cheese, yogurt, eggs and related products', productCount: 12, createdAt: '2024-01-10' },
  { id: 'cat-2', name: 'Beverages', description: 'Tea, coffee, juices, soft drinks, water', productCount: 18, createdAt: '2024-01-10' },
  { id: 'cat-3', name: 'Snacks & Chips', description: 'Chips, biscuits, chocolates, nuts', productCount: 24, createdAt: '2024-01-12' },
  { id: 'cat-4', name: 'Rice & Grains', description: 'Rice, flour, lentils, grains', productCount: 15, createdAt: '2024-01-12' },
  { id: 'cat-5', name: 'Cooking Essentials', description: 'Oil, spices, salt, sugar', productCount: 20, createdAt: '2024-01-15' },
  { id: 'cat-6', name: 'Personal Care', description: 'Soap, shampoo, toothpaste, skincare', productCount: 30, createdAt: '2024-01-20' },
  { id: 'cat-7', name: 'Cleaning Products', description: 'Detergent, dish soap, floor cleaner', productCount: 10, createdAt: '2024-02-01' },
  { id: 'cat-8', name: 'Frozen Foods', description: 'Frozen vegetables, meat, ready meals', productCount: 8, createdAt: '2024-02-05' },
];

// ---------- Products ----------
export const mockProducts: Product[] = [
  { id: 'p1', name: 'DDC Milk (1L)', sku: 'DRY-001', price: 100, costPrice: 85, category: 'Dairy & Eggs', stock: 50, minStock: 10, unit: 'Litre', isActive: true, createdAt: '2024-01-15', vendorId: 'v1', vendorName: 'Nepal Dairy Corp' },
  { id: 'p2', name: 'Wai Wai Noodles', sku: 'SNK-001', price: 25, costPrice: 20, category: 'Snacks & Chips', stock: 200, minStock: 50, unit: 'Pcs', isActive: true, createdAt: '2024-01-15', vendorId: 'v2', vendorName: 'CG Foods Nepal' },
  { id: 'p3', name: 'Basmati Rice (5kg)', sku: 'RCE-001', price: 650, costPrice: 580, category: 'Rice & Grains', stock: 30, minStock: 5, unit: 'Kg', isActive: true, createdAt: '2024-01-16', vendorId: 'v6', vendorName: 'Nepal Agro Industries' },
  { id: 'p4', name: 'Sunflower Oil (1L)', sku: 'COK-001', price: 320, costPrice: 280, category: 'Cooking Essentials', stock: 25, minStock: 8, unit: 'Litre', isActive: true, createdAt: '2024-01-16', vendorId: 'v6', vendorName: 'Nepal Agro Industries' },
  { id: 'p5', name: 'Goldstar Shoes', sku: 'PRC-001', price: 2500, costPrice: 1800, category: 'Personal Care', stock: 12, minStock: 3, unit: 'Pcs', isActive: true, createdAt: '2024-01-18', vendorId: 'v3', vendorName: 'Goldstar Shoe Pvt Ltd' },
  { id: 'p6', name: 'Tokla Tea (500g)', sku: 'BEV-001', price: 280, costPrice: 240, category: 'Beverages', stock: 40, minStock: 10, unit: 'Pcs', isActive: true, createdAt: '2024-01-18', vendorId: 'v4', vendorName: 'Tokla Tea Estate' },
  { id: 'p7', name: 'Surf Excel (1kg)', sku: 'CLN-001', price: 250, costPrice: 210, category: 'Cleaning Products', stock: 3, minStock: 5, unit: 'Pcs', isActive: true, createdAt: '2024-02-01', vendorId: 'v5', vendorName: 'Himalayan Snacks Pvt Ltd' },
  { id: 'p8', name: 'Frozen Chicken (1kg)', sku: 'FRZ-001', price: 450, costPrice: 380, category: 'Frozen Foods', stock: 2, minStock: 5, unit: 'Kg', isActive: true, createdAt: '2024-02-05', vendorId: 'v8', vendorName: 'Chitwan Fresh Farms' },
  { id: 'p9', name: 'Coca Cola (500ml)', sku: 'BEV-002', price: 60, costPrice: 48, category: 'Beverages', stock: 150, minStock: 30, unit: 'Pcs', isActive: true, createdAt: '2024-01-20', vendorId: 'v2', vendorName: 'CG Foods Nepal' },
  { id: 'p10', name: 'Lay\'s Chips (Large)', sku: 'SNK-002', price: 80, costPrice: 65, category: 'Snacks & Chips', stock: 80, minStock: 20, unit: 'Pcs', isActive: true, createdAt: '2024-01-20', vendorId: 'v5', vendorName: 'Himalayan Snacks Pvt Ltd' },
  { id: 'p11', name: 'Musk Melon', sku: 'FRU-001', price: 150, costPrice: 120, category: 'Snacks & Chips', stock: 8, minStock: 10, unit: 'Kg', isActive: true, createdAt: '2024-03-01', vendorId: 'v8', vendorName: 'Chitwan Fresh Farms' },
  { id: 'p12', name: 'Dettol Soap', sku: 'PRC-002', price: 120, costPrice: 95, category: 'Personal Care', stock: 60, minStock: 15, unit: 'Pcs', isActive: true, createdAt: '2024-02-10', vendorId: 'v5', vendorName: 'Himalayan Snacks Pvt Ltd' },
  { id: 'p13', name: 'Red Bull (250ml)', sku: 'BEV-003', price: 180, costPrice: 150, category: 'Beverages', stock: 45, minStock: 10, unit: 'Pcs', isActive: true, createdAt: '2024-02-15', vendorId: 'v2', vendorName: 'CG Foods Nepal' },
  { id: 'p14', name: 'Momo Wrapper (500g)', sku: 'FRZ-002', price: 80, costPrice: 60, category: 'Frozen Foods', stock: 35, minStock: 10, unit: 'Pcs', isActive: true, createdAt: '2024-03-05', vendorId: 'v8', vendorName: 'Chitwan Fresh Farms' },
  { id: 'p15', name: 'Turmeric Powder (200g)', sku: 'COK-002', price: 90, costPrice: 70, category: 'Cooking Essentials', stock: 55, minStock: 10, unit: 'Pcs', isActive: true, createdAt: '2024-02-20', vendorId: 'v6', vendorName: 'Nepal Agro Industries' },
  { id: 'p16', name: 'Eggs (Tray of 30)', sku: 'DRY-002', price: 450, costPrice: 380, category: 'Dairy & Eggs', stock: 18, minStock: 5, unit: 'Tray', isActive: true, createdAt: '2024-01-22', vendorId: 'v1', vendorName: 'Nepal Dairy Corp' },
];

// ---------- Inventory ----------
export const mockInventory: InventoryItem[] = mockProducts.map(p => ({
  id: `inv-${p.id}`,
  productId: p.id,
  productName: p.name,
  sku: p.sku,
  currentStock: p.stock,
  minStock: p.minStock,
  lastUpdated: '2024-06-15',
}));

export const mockStockMovements: StockMovement[] = [
  { id: 'sm1', productId: 'p1', productName: 'DDC Milk (1L)', type: 'in', quantity: 100, reason: 'New stock received from supplier', date: '2024-06-15', performedBy: 'Ramesh' },
  { id: 'sm2', productId: 'p2', productName: 'Wai Wai Noodles', type: 'out', quantity: 50, reason: 'Sold to customer', date: '2024-06-15', performedBy: 'Sita' },
  { id: 'sm3', productId: 'p7', productName: 'Surf Excel (1kg)', type: 'out', quantity: 12, reason: 'Sold to customer', date: '2024-06-14', performedBy: 'Ramesh' },
  { id: 'sm4', productId: 'p8', productName: 'Frozen Chicken (1kg)', type: 'out', quantity: 5, reason: 'Sold to customer', date: '2024-06-14', performedBy: 'Sita' },
  { id: 'sm5', productId: 'p3', productName: 'Basmati Rice (5kg)', type: 'in', quantity: 20, reason: 'New stock received from supplier', date: '2024-06-13', performedBy: 'Ramesh' },
  { id: 'sm6', productId: 'p5', productName: 'Goldstar Shoes', type: 'in', quantity: 10, reason: 'New stock received from supplier', date: '2024-06-13', performedBy: 'Hari' },
  { id: 'sm7', productId: 'p11', productName: 'Musk Melon', type: 'out', quantity: 3, reason: 'Expired - disposed', date: '2024-06-12', performedBy: 'Ramesh' },
  { id: 'sm8', productId: 'p9', productName: 'Coca Cola (500ml)', type: 'in', quantity: 200, reason: 'New stock received from distributor', date: '2024-06-12', performedBy: 'Hari' },
];

// ---------- Sales ----------
export const mockSales: Sale[] = [
  { id: 's1', invoiceNumber: 'INV-2024-0001', customerName: 'Walk-in Customer', customerPAN: '', items: [{ productName: 'DDC Milk (1L)', quantity: 2, unitPrice: 100, total: 200 }, { productName: 'Wai Wai Noodles', quantity: 5, unitPrice: 25, total: 125 }], subtotal: 325, discount: 0, vatAmount: 42.25, vatPercent: 13, total: 367.25, paymentMethod: 'Cash', status: 'completed', date: '2024-06-15T10:30:00', staffName: 'Ramesh' },
  { id: 's2', invoiceNumber: 'INV-2024-0002', customerName: 'Kumar Hardware', customerPAN: '301234567', items: [{ productName: 'Basmati Rice (5kg)', quantity: 3, unitPrice: 650, total: 1950 }, { productName: 'Sunflower Oil (1L)', quantity: 2, unitPrice: 320, total: 640 }], subtotal: 2590, discount: 100, vatAmount: 323.7, vatPercent: 13, total: 2813.7, paymentMethod: 'Card', status: 'completed', date: '2024-06-15T11:15:00', staffName: 'Sita' },
  { id: 's3', invoiceNumber: 'INV-2024-0003', customerName: 'Walk-in Customer', customerPAN: '', items: [{ productName: 'Coca Cola (500ml)', quantity: 3, unitPrice: 60, total: 180 }, { productName: 'Lay\'s Chips (Large)', quantity: 2, unitPrice: 80, total: 160 }, { productName: 'Red Bull (250ml)', quantity: 1, unitPrice: 180, total: 180 }], subtotal: 520, discount: 20, vatAmount: 65, vatPercent: 13, total: 565, paymentMethod: 'eSewa', status: 'completed', date: '2024-06-15T12:00:00', staffName: 'Ramesh' },
  { id: 's4', invoiceNumber: 'INV-2024-0004', customerName: 'Walk-in Customer', customerPAN: '', items: [{ productName: 'Tokla Tea (500g)', quantity: 1, unitPrice: 280, total: 280 }, { productName: 'Dettol Soap', quantity: 2, unitPrice: 120, total: 240 }], subtotal: 520, discount: 0, vatAmount: 67.6, vatPercent: 13, total: 587.6, paymentMethod: 'Cash', status: 'completed', date: '2024-06-14T09:45:00', staffName: 'Sita' },
  { id: 's5', invoiceNumber: 'INV-2024-0005', customerName: 'Hotel Himalayan', customerPAN: '402345678', items: [{ productName: 'Eggs (Tray of 30)', quantity: 5, unitPrice: 450, total: 2250 }, { productName: 'DDC Milk (1L)', quantity: 10, unitPrice: 100, total: 1000 }, { productName: 'Frozen Chicken (1kg)', quantity: 5, unitPrice: 450, total: 2250 }], subtotal: 5500, discount: 200, vatAmount: 689, vatPercent: 13, total: 5989, paymentMethod: 'Khalti', status: 'completed', date: '2024-06-14T14:30:00', staffName: 'Ramesh' },
  { id: 's6', invoiceNumber: 'INV-2024-0006', customerName: 'Walk-in Customer', customerPAN: '', items: [{ productName: 'Surf Excel (1kg)', quantity: 1, unitPrice: 250, total: 250 }], subtotal: 250, discount: 0, vatAmount: 32.5, vatPercent: 13, total: 282.5, paymentMethod: 'Cash', status: 'refunded', date: '2024-06-13T16:00:00', staffName: 'Sita' },
  { id: 's7', invoiceNumber: 'INV-2024-0007', customerName: 'Walk-in Customer', customerPAN: '', items: [{ productName: 'Momo Wrapper (500g)', quantity: 3, unitPrice: 80, total: 240 }, { productName: 'Frozen Chicken (1kg)', quantity: 2, unitPrice: 450, total: 900 }], subtotal: 1140, discount: 0, vatAmount: 148.2, vatPercent: 13, total: 1288.2, paymentMethod: 'Cash', status: 'completed', date: '2024-06-13T10:20:00', staffName: 'Ramesh' },
  { id: 's8', invoiceNumber: 'INV-2024-0008', customerName: 'Thapa Enterprises', customerPAN: '503456789', items: [{ productName: 'Goldstar Shoes', quantity: 2, unitPrice: 2500, total: 5000 }], subtotal: 5000, discount: 0, vatAmount: 650, vatPercent: 13, total: 5650, paymentMethod: 'Card', status: 'completed', date: '2024-06-12T11:00:00', staffName: 'Sita' },
  { id: 's9', invoiceNumber: 'INV-2024-0009', customerName: 'Walk-in Customer', customerPAN: '', items: [{ productName: 'Turmeric Powder (200g)', quantity: 2, unitPrice: 90, total: 180 }, { productName: 'Sunflower Oil (1L)', quantity: 1, unitPrice: 320, total: 320 }], subtotal: 500, discount: 0, vatAmount: 65, vatPercent: 13, total: 565, paymentMethod: 'eSewa', status: 'completed', date: '2024-06-12T15:30:00', staffName: 'Ramesh' },
  { id: 's10', invoiceNumber: 'INV-2024-0010', customerName: 'Walk-in Customer', customerPAN: '', items: [{ productName: 'Wai Wai Noodles', quantity: 10, unitPrice: 25, total: 250 }, { productName: 'Coca Cola (500ml)', quantity: 5, unitPrice: 60, total: 300 }], subtotal: 550, discount: 0, vatAmount: 71.5, vatPercent: 13, total: 621.5, paymentMethod: 'Cash', status: 'pending', date: '2024-06-15T17:00:00', staffName: 'Sita' },
];

// ---------- Staff (Super Admin) ----------
export const mockSuperAdminStaff: StaffMember[] = [
  { id: 'sa1', name: 'Admin User', email: 'admin@posnepal.com', phone: '+977-9800000001', role: 'admin', status: 'active', createdAt: '2023-10-01', permissions: ['all'] },
  { id: 'sa2', name: 'Support Ram', email: 'support@posnepal.com', phone: '+977-9800000002', role: 'support', status: 'active', createdAt: '2024-01-15', permissions: ['view_tenants', 'view_tickets', 'respond_tickets'] },
  { id: 'sa3', name: 'Finance Sita', email: 'finance@posnepal.com', phone: '+977-9800000003', role: 'finance', status: 'active', createdAt: '2024-02-01', permissions: ['view_revenue', 'view_subscriptions', 'manage_invoices'] },
  { id: 'sa4', name: 'Support Hari', email: 'hari@posnepal.com', phone: '+977-9800000004', role: 'support', status: 'inactive', createdAt: '2024-03-10', permissions: ['view_tenants', 'view_tickets'] },
];

// ---------- Staff (Tenant) ----------
export const mockTenantStaff: StaffMember[] = [
  { id: 'ts1', name: 'Ramesh Karki', email: 'ramesh@abcstore.com', phone: '+977-9811111111', role: 'cashier', status: 'active', createdAt: '2024-01-20', permissions: ['pos_access', 'view_sales'] },
  { id: 'ts2', name: 'Sita Kumari', email: 'sita@abcstore.com', phone: '+977-9822222222', role: 'cashier', status: 'active', createdAt: '2024-02-15', permissions: ['pos_access', 'view_sales', 'manage_products'] },
  { id: 'ts3', name: 'Hari Bahadur', email: 'hari@abcstore.com', phone: '+977-9833333333', role: 'manager', status: 'active', createdAt: '2024-01-15', permissions: ['all'] },
];

// ---------- Activity Logs ----------
export const mockActivityLogs: ActivityLog[] = [
  { id: 'al1', user: 'Admin User', action: 'Created Tenant', details: 'Created new tenant: Chitwan Fresh', timestamp: '2024-06-15T10:00:00', type: 'success' },
  { id: 'al2', user: 'Support Ram', action: 'Updated Tenant', details: 'Upgraded XYZ Mart from Basic to Pro plan', timestamp: '2024-06-15T09:30:00', type: 'info' },
  { id: 'al3', user: 'Finance Sita', action: 'Generated Report', details: 'Generated monthly revenue report for June 2024', timestamp: '2024-06-14T16:00:00', type: 'info' },
  { id: 'al4', user: 'Admin User', action: 'Disabled Tenant', details: 'Disabled tenant: Chitwan Fresh (payment overdue)', timestamp: '2024-06-14T14:00:00', type: 'warning' },
  { id: 'al5', user: 'System', action: 'Backup Completed', details: 'Daily backup completed successfully. Size: 2.3GB', timestamp: '2024-06-14T03:00:00', type: 'success' },
  { id: 'al6', user: 'Support Hari', action: 'Ticket Resolved', details: 'Resolved support ticket #1245 for Pokhara Electronics', timestamp: '2024-06-13T15:30:00', type: 'success' },
  { id: 'al7', user: 'Admin User', action: 'Plan Updated', details: 'Updated Enterprise plan pricing from NPR 7,499 to NPR 7,999', timestamp: '2024-06-13T11:00:00', type: 'info' },
  { id: 'al8', user: 'System', action: 'SSL Renewal', details: 'Auto-renewed SSL certificate for bhaktapurhandicraft.com', timestamp: '2024-06-13T00:00:00', type: 'success' },
  { id: 'al9', user: 'Finance Sita', action: 'Payment Received', details: 'Received NPR 7,999 from Biratnagar Hardware (Enterprise)', timestamp: '2024-06-12T14:20:00', type: 'success' },
  { id: 'al10', user: 'Support Ram', action: 'New Ticket', details: 'New support ticket #1250 opened by Lalitpur Fashion', timestamp: '2024-06-12T10:00:00', type: 'warning' },
  { id: 'al11', user: 'Admin User', action: 'Staff Created', details: 'Created new staff account: Support Hari', timestamp: '2024-06-11T09:00:00', type: 'info' },
  { id: 'al12', user: 'System', action: 'System Update', details: 'System updated to v2.4.1 - Bug fixes and improvements', timestamp: '2024-06-11T02:00:00', type: 'info' },
];

// ---------- Report Data ----------
export const mockSalesReportData: SalesReportData[] = [
  { date: '2024-06-01', sales: 18500, orders: 23 },
  { date: '2024-06-02', sales: 22300, orders: 28 },
  { date: '2024-06-03', sales: 15800, orders: 19 },
  { date: '2024-06-04', sales: 31200, orders: 35 },
  { date: '2024-06-05', sales: 27600, orders: 31 },
  { date: '2024-06-06', sales: 19800, orders: 22 },
  { date: '2024-06-07', sales: 34500, orders: 42 },
  { date: '2024-06-08', sales: 42100, orders: 48 },
  { date: '2024-06-09', sales: 28900, orders: 33 },
  { date: '2024-06-10', sales: 25600, orders: 29 },
  { date: '2024-06-11', sales: 31400, orders: 37 },
  { date: '2024-06-12', sales: 38700, orders: 44 },
  { date: '2024-06-13', sales: 29300, orders: 32 },
  { date: '2024-06-14', sales: 41800, orders: 46 },
  { date: '2024-06-15', sales: 35200, orders: 39 },
];

export const mockInventoryReportData: InventoryReportData[] = [
  { category: 'Dairy & Eggs', totalProducts: 2, totalValue: 15500, lowStock: 0 },
  { category: 'Beverages', totalProducts: 3, totalValue: 36000, lowStock: 0 },
  { category: 'Snacks & Chips', totalProducts: 3, totalValue: 24000, lowStock: 1 },
  { category: 'Rice & Grains', totalProducts: 1, totalValue: 19500, lowStock: 0 },
  { category: 'Cooking Essentials', totalProducts: 2, totalValue: 20500, lowStock: 0 },
  { category: 'Personal Care', totalProducts: 2, totalValue: 31200, lowStock: 0 },
  { category: 'Cleaning Products', totalProducts: 1, totalValue: 750, lowStock: 1 },
  { category: 'Frozen Foods', totalProducts: 2, totalValue: 1600, lowStock: 2 },
];

export const mockVATReportData: VATReportData[] = [
  { month: '2024-01', taxableAmount: 245000, vatCollected: 31850, vatPaid: 12500 },
  { month: '2024-02', taxableAmount: 312000, vatCollected: 40560, vatPaid: 18000 },
  { month: '2024-03', taxableAmount: 287000, vatCollected: 37310, vatPaid: 15000 },
  { month: '2024-04', taxableAmount: 356000, vatCollected: 46280, vatPaid: 22000 },
  { month: '2024-05', taxableAmount: 398000, vatCollected: 51740, vatPaid: 25000 },
  { month: '2024-06', taxableAmount: 423500, vatCollected: 55055, vatPaid: 28000 },
];

// ---------- Customers ----------
export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Kumar Hardware', email: 'kumar@hardware.com.np', phone: '+977-9841234567', pan: '301234567', address: 'Putalisadak, Kathmandu', totalPurchases: 47, totalSpent: 245600, lastVisit: '2024-06-15T11:15:00', createdAt: '2024-01-10', isActive: true },
  { id: 'c2', name: 'Hotel Himalayan', email: 'orders@hotelhimalayan.com', phone: '+977-9851234567', pan: '402345678', address: 'Thamel, Kathmandu', totalPurchases: 32, totalSpent: 189400, lastVisit: '2024-06-14T14:30:00', createdAt: '2024-01-20', isActive: true },
  { id: 'c3', name: 'Thapa Enterprises', email: 'thapa@enterprises.com.np', phone: '+977-9861234567', pan: '503456789', address: 'Baneshwor, Kathmandu', totalPurchases: 18, totalSpent: 89500, lastVisit: '2024-06-12T11:00:00', createdAt: '2024-02-05', isActive: true },
  { id: 'c4', name: 'Gurung Bakery', email: 'gurung@bakery.com.np', phone: '+977-9871234567', pan: '604567890', address: 'Lazimpat, Kathmandu', totalPurchases: 56, totalSpent: 124300, lastVisit: '2024-06-15T09:00:00', createdAt: '2023-11-15', isActive: true },
  { id: 'c5', name: 'Shrestha Restaurant', email: 'shrestha@restaurant.com', phone: '+977-9801234580', pan: '705678901', address: 'Pulchowk, Lalitpur', totalPurchases: 29, totalSpent: 67800, lastVisit: '2024-06-13T16:30:00', createdAt: '2024-03-01', isActive: true },
  { id: 'c6', name: 'Magar Traders', email: 'magar@traders.com.np', phone: '+977-9811234580', pan: '806789012', address: 'Kalanki, Kathmandu', totalPurchases: 8, totalSpent: 34200, lastVisit: '2024-06-10T12:00:00', createdAt: '2024-04-10', isActive: true },
  { id: 'c7', name: 'Dorje Corner Store', email: 'dorje@corner.com.np', phone: '+977-9821234580', pan: '907890123', address: 'Jorpati, Kathmandu', totalPurchases: 41, totalSpent: 156700, lastVisit: '2024-06-14T10:00:00', createdAt: '2023-12-05', isActive: true },
  { id: 'c8', name: 'Tamang Electronics', email: 'tamang@electronics.com', phone: '+977-9831234580', pan: '', address: 'New Road, Kathmandu', totalPurchases: 3, totalSpent: 12500, lastVisit: '2024-05-28T14:00:00', createdAt: '2024-05-01', isActive: false },
  { id: 'c9', name: 'Rai Wholesale', email: 'rai@wholesale.com.np', phone: '+977-9841234580', pan: '118901234', address: 'Teku, Kathmandu', totalPurchases: 65, totalSpent: 432100, lastVisit: '2024-06-15T16:00:00', createdAt: '2023-10-20', isActive: true },
  { id: 'c10', name: 'Limbu Cafe', email: 'limbu@cafe.com.np', phone: '+977-9851234580', pan: '', address: 'Boudha, Kathmandu', totalPurchases: 12, totalSpent: 28900, lastVisit: '2024-06-11T09:30:00', createdAt: '2024-04-25', isActive: true },
];

// ---------- Dashboard Stats ----------
export const mockSuperAdminStats: SuperAdminStats = {
  totalTenants: 8,
  activeSubscriptions: 6,
  totalRevenue: 3426000,
  revenueGrowth: 12.5,
  recentActivity: mockActivityLogs.slice(0, 5),
};

export const mockTenantStats: TenantStats = {
  dailySales: 35200,
  dailySalesGrowth: 8.3,
  monthlyRevenue: 867000,
  monthlyRevenueGrowth: 15.2,
  totalOrders: 537,
  totalOrdersGrowth: 11.7,
  topProducts: [
    { name: 'Wai Wai Noodles', sold: 245, revenue: 6125 },
    { name: 'DDC Milk (1L)', sold: 189, revenue: 18900 },
    { name: 'Coca Cola (500ml)', sold: 156, revenue: 9360 },
    { name: 'Basmati Rice (5kg)', sold: 78, revenue: 50700 },
    { name: 'Tokla Tea (500g)', sold: 67, revenue: 18760 },
  ],
  lowStockAlerts: 3,
};

// ---------- Promotions ----------
export const mockPromotions: Promotion[] = [
  { id: 'promo-1', code: 'LAUNCH2025', name: 'New Year Launch', description: '20% off on all plans for new signups in January 2025', type: 'percentage', value: 20, status: 'active', maxUses: 100, usedCount: 34, validFrom: '2025-01-01', validUntil: '2025-01-31', createdAt: '2024-12-20', createdBy: 'Super Admin' },
  { id: 'promo-2', code: 'REFER50', name: 'Referral Bonus', description: '50% off first month when referred by existing tenant', type: 'percentage', value: 50, status: 'active', maxUses: 200, usedCount: 12, validFrom: '2025-01-01', validUntil: '2025-06-30', createdAt: '2024-12-25', createdBy: 'Super Admin' },
  { id: 'promo-3', code: 'ENTERPRISE1K', name: 'Enterprise Discount', description: 'NPR 1,000 off on Enterprise plan', type: 'fixed', value: 1000, status: 'active', maxUses: 50, usedCount: 8, validFrom: '2025-01-15', validUntil: '2025-03-31', createdAt: '2025-01-10', createdBy: 'Super Admin' },
  { id: 'promo-4', code: 'FREETRIAL14', name: '14-Day Free Trial', description: 'Extended 14-day free trial on any plan', type: 'trial_extension', value: 14, status: 'active', maxUses: 500, usedCount: 89, validFrom: '2025-01-01', validUntil: '2025-12-31', createdAt: '2024-12-15', createdBy: 'Super Admin' },
  { id: 'promo-5', code: 'DASHAIN2024', name: 'Dashain Festival Offer', description: 'Free month on annual Enterprise subscription', type: 'free_month', value: 1, status: 'expired', maxUses: 30, usedCount: 30, validFrom: '2024-10-01', validUntil: '2024-10-20', createdAt: '2024-09-20', createdBy: 'Super Admin' },
  { id: 'promo-6', code: 'TIHAR24', name: 'Tihar Celebration', description: '15% off Pro and Enterprise plans during Tihar', type: 'percentage', value: 15, status: 'expired', maxUses: 75, usedCount: 62, validFrom: '2024-11-01', validUntil: '2024-11-15', createdAt: '2024-10-25', createdBy: 'Super Admin' },
  { id: 'promo-7', code: 'SUMMER25', name: 'Summer Special 2025', description: '25% off all plans during summer', type: 'percentage', value: 25, status: 'scheduled', maxUses: 150, usedCount: 0, validFrom: '2025-06-01', validUntil: '2025-08-31', createdAt: '2025-01-05', createdBy: 'Super Admin' },
  { id: 'promo-8', code: 'NEWYEAR26', name: 'New Year 2026', description: '10% off annual subscriptions for 2026', type: 'percentage', value: 10, status: 'paused', maxUses: 200, usedCount: 0, validFrom: '2025-12-25', validUntil: '2026-01-31', createdAt: '2025-01-10', createdBy: 'Super Admin' },
];

// ---------- Referrals ----------
export const mockReferrals: Referral[] = [
  { id: 'ref-1', referrerTenantId: 't1', referrerTenantName: 'ABC Store', referredTenantId: 't5', referredTenantName: 'Bhaktapur Handicraft', referralCode: 'ABCSTORE', status: 'rewarded', rewardType: 'percentage_discount', rewardValue: 20, createdAt: '2024-04-10', convertedAt: '2024-05-10' },
  { id: 'ref-2', referrerTenantId: 't1', referrerTenantName: 'ABC Store', referredTenantId: 't7', referredTenantName: 'Chitwan Fresh', referralCode: 'ABCSTORE', status: 'converted', rewardType: 'percentage_discount', rewardValue: 20, createdAt: '2024-06-01', convertedAt: '2024-06-18' },
  { id: 'ref-3', referrerTenantId: 't3', referrerTenantName: 'Kathmandu Grocers', referredTenantId: 't4', referredTenantName: 'Pokhara Electronics', referralCode: 'KTMGROC', status: 'rewarded', rewardType: 'fixed_discount', rewardValue: 1500, createdAt: '2024-01-20', convertedAt: '2024-02-28' },
  { id: 'ref-4', referrerTenantId: 't3', referrerTenantName: 'Kathmandu Grocers', referredTenantId: 't6', referredTenantName: 'Lalitpur Fashion', referralCode: 'KTMGROC', status: 'rewarded', rewardType: 'fixed_discount', rewardValue: 1500, createdAt: '2024-03-01', convertedAt: '2024-04-05' },
  { id: 'ref-5', referrerTenantId: 't3', referrerTenantName: 'Kathmandu Grocers', referredTenantId: 't8', referredTenantName: 'Biratnagar Hardware', referralCode: 'KTMGROC', status: 'rewarded', rewardType: 'free_month', rewardValue: 1, createdAt: '2024-08-01', convertedAt: '2024-09-20' },
  { id: 'ref-6', referrerTenantId: 't4', referrerTenantName: 'Pokhara Electronics', referredTenantId: 't2', referredTenantName: 'XYZ Mart', referralCode: 'PKRELEC', status: 'converted', rewardType: 'percentage_discount', rewardValue: 15, createdAt: '2024-03-10', convertedAt: '2024-03-22' },
  { id: 'ref-7', referrerTenantId: 't6', referrerTenantName: 'Lalitpur Fashion', referredTenantId: '', referredTenantName: 'Pending User', referralCode: 'LTPSTYLE', status: 'pending', rewardType: 'percentage_discount', rewardValue: 15, createdAt: '2025-01-08' },
  { id: 'ref-8', referrerTenantId: 't8', referrerTenantName: 'Biratnagar Hardware', referredTenantId: '', referredTenantName: 'Pending User', referralCode: 'BRTHARDW', status: 'pending', rewardType: 'fixed_discount', rewardValue: 1000, createdAt: '2025-01-10' },
];

// ---------- User Profiles ----------
export const mockSuperAdminProfile: UserProfile = {
  id: 'sa-main', name: 'Super Admin', email: 'admin@posnepal.com', phone: '+977-9800000001', role: 'super-admin', bio: 'Platform administrator managing POS Nepal operations.', address: 'Durbar Marg, Kathmandu', city: 'Kathmandu', joinedAt: '2023-01-01',
};

export const mockTenantAdminProfile: UserProfile = {
  id: 'ta-main', name: 'Rajesh Sharma', email: 'admin@abcstore.com', phone: '+977-9801234567', role: 'tenant-admin', bio: 'Owner and manager of ABC Store, a leading retail shop in Kathmandu.', address: 'Putalisadak, Kathmandu', city: 'Kathmandu', pan: '301234567', referralCode: 'ABCSTORE', referralCount: 2, referralEarnings: 3200, joinedAt: '2024-01-15',
};
