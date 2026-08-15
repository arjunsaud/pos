'use client';

import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  BellRing,
  CreditCard,
  Eye,
  FileCheck2,
  FileText,
  FolderOpen,
  Gift,
  Headphones,
  LayoutDashboard,
  MapPin,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Store,
  Tag,
  Tags,
  Truck,
  UserCircle,
  UserCog,
  Users,
  Wallet,
  Warehouse,
} from 'lucide-react';
import type { SidebarNavItem } from '@/lib/types/interface/nav.interface';
import { PATHS } from '@/lib/navigation/routes';

export const platformSidebarData: SidebarNavItem[] = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', href: PATHS.dashboard, items: [], icon: LayoutDashboard },
    ],
  },
  {
    title: 'Management',
    items: [
      { title: 'Tenants', href: PATHS.tenants, items: [], icon: Store },
      { title: 'Staff', href: PATHS.staff, items: [], icon: UserCog },
      { title: 'Packages', href: PATHS.packages, items: [], icon: CreditCard },
      { title: 'Documents', href: PATHS.documents, items: [], icon: FolderOpen },
      { title: 'Contracts', href: PATHS.contracts, items: [], icon: FileCheck2 },
      { title: 'Templates', href: PATHS.templates, items: [], icon: FileText },
      { title: 'Promotions', href: PATHS.promotions, items: [], icon: Tag },
      { title: 'Referrals', href: PATHS.referrals, items: [], icon: Gift },
    ],
  },
  {
    title: 'Finance',
    items: [
      { title: 'Payment', href: PATHS.payment, items: [], icon: Wallet },
      { title: 'Support Tickets', href: PATHS.supportTickets, items: [], icon: Headphones },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Activity Logs', href: PATHS.activityLogs, items: [], icon: Activity },
      { title: 'Settings', href: PATHS.settings, items: [], icon: Settings },
      { title: 'Profile', href: PATHS.profile, items: [], icon: UserCircle },
    ],
  },
];

export function tenantViewSidebarData(tenantId: string): SidebarNavItem[] {
  const base = `${PATHS.tenants}/${tenantId}`;
  return [
    {
      title: 'Tenant View',
      items: [
        { title: 'Overview', href: base, items: [], icon: Eye },
        { title: 'Billing', href: `${base}/billing`, items: [], icon: Receipt },
        { title: 'Products', href: `${base}/products`, items: [], icon: Package },
        { title: 'Inventory', href: `${base}/inventory`, items: [], icon: Warehouse },
        { title: 'Categories', href: `${base}/categories`, items: [], icon: Tags },
        { title: 'Sales', href: `${base}/sales`, items: [], icon: BarChart3 },
        { title: 'Reports', href: `${base}/reports`, items: [], icon: BarChart3 },
        { title: 'Staff', href: `${base}/staff`, items: [], icon: UserCog },
        { title: 'Documents', href: PATHS.documents, items: [], icon: FolderOpen },
      ],
    },
    {
      title: 'Tenant Config',
      items: [
        { title: 'Subscription', href: `${base}/subscription`, items: [], icon: CreditCard },
        { title: 'Features', href: `${base}/features`, items: [], icon: SlidersHorizontal },
        { title: 'Vendors', href: `${base}/vendors`, items: [], icon: Truck },
      ],
    },
  ];
}

export const tenantSidebarData: SidebarNavItem[] = [
  {
    title: 'Overview',
    items: [
      { title: 'Dashboard', href: PATHS.dashboard, items: [], icon: LayoutDashboard },
    ],
  },
  {
    title: 'Point of Sale',
    items: [
      { title: 'POS', href: PATHS.pos, items: [], icon: ShoppingCart },
      { title: 'Billing', href: PATHS.billing, items: [], icon: Receipt },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { title: 'Products', href: PATHS.products, items: [], icon: Package },
      { title: 'Inventory', href: PATHS.inventory, items: [], icon: Warehouse },
      { title: 'Categories', href: PATHS.categories, items: [], icon: Tags },
      { title: 'Vendors', href: PATHS.vendors, items: [], icon: Truck },
    ],
  },
  {
    title: 'Procurement',
    items: [
      { title: 'Purchases', href: PATHS.purchases, items: [], icon: FileText },
      { title: 'Stock Transfer', href: PATHS.stockTransfer, items: [], icon: ArrowLeftRight },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { title: 'Sales & Reports', href: PATHS.salesReports, items: [], icon: BarChart3 },
    ],
  },
  {
    title: 'People',
    items: [
      { title: 'Customers', href: PATHS.customers, items: [], icon: Users },
    ],
  },
  {
    title: 'Settings',
    items: [
      { title: 'Subscription', href: PATHS.subscription, items: [], icon: CreditCard },
      { title: 'Outlets', href: PATHS.outlets, items: [], icon: MapPin },
      { title: 'Store Profile', href: PATHS.storeProfile, items: [], icon: Store },
      { title: 'Staff', href: PATHS.staff, items: [], icon: UserCog },
      { title: 'Notifications', href: PATHS.notifications, items: [], icon: BellRing },
      { title: 'Support', href: PATHS.support, items: [], icon: Headphones },
      { title: 'Profile', href: PATHS.profile, items: [], icon: UserCircle },
      { title: 'Settings', href: PATHS.settings, items: [], icon: Settings },
    ],
  },
];

export const staffSidebarData: SidebarNavItem[] = [
  {
    title: 'Point of Sale',
    items: [
      { title: 'POS', href: PATHS.pos, items: [], icon: ShoppingCart },
    ],
  },
  {
    title: 'History',
    items: [
      { title: 'Sales History', href: PATHS.salesReports, items: [], icon: BarChart3 },
    ],
  },
  {
    title: 'Account',
    items: [
      { title: 'Settings', href: PATHS.settings, items: [], icon: Settings },
    ],
  },
];

export const sidebarData = tenantSidebarData;
