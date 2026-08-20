import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Package,
  Warehouse,
  Tags,
  Truck,
  FileText,
  ArrowLeftRight,
  BarChart3,
  Users,
  CreditCard,
  MapPin,
  Store,
  UserCog,
  BellRing,
  Headphones,
  UserCircle,
  Settings,
} from 'lucide-react';
import type { DesktopPage, DesktopRole } from '@/lib/types';

export type NavItem = {
  id: DesktopPage;
  label: string;
  icon: LucideIcon;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const ADMIN_NAV: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Point of Sale',
    items: [
      { id: 'pos', label: 'POS', icon: ShoppingCart },
      { id: 'billing', label: 'Billing', icon: Receipt },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { id: 'products', label: 'Products', icon: Package },
      { id: 'inventory', label: 'Inventory', icon: Warehouse },
      { id: 'categories', label: 'Categories', icon: Tags },
      { id: 'vendors', label: 'Vendors', icon: Truck },
    ],
  },
  {
    title: 'Procurement',
    items: [
      { id: 'purchases', label: 'Purchases', icon: FileText },
      { id: 'stock-transfer', label: 'Stock Transfer', icon: ArrowLeftRight },
    ],
  },
  {
    title: 'Analytics',
    items: [{ id: 'sales', label: 'Sales & Reports', icon: BarChart3 }],
  },
  {
    title: 'People',
    items: [{ id: 'customers', label: 'Customers', icon: Users }],
  },
  {
    title: 'Settings',
    items: [
      { id: 'subscription', label: 'Subscription', icon: CreditCard },
      { id: 'outlets', label: 'Outlets', icon: MapPin },
      { id: 'store-profile', label: 'Store Profile', icon: Store },
      { id: 'staff', label: 'Staff', icon: UserCog },
      { id: 'notifications', label: 'Notifications', icon: BellRing },
      { id: 'support', label: 'Support', icon: Headphones },
      { id: 'profile', label: 'Profile', icon: UserCircle },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const STAFF_NAV: NavGroup[] = [
  {
    title: 'Point of Sale',
    items: [
      { id: 'pos', label: 'POS', icon: ShoppingCart },
      { id: 'sales', label: 'Sales History', icon: BarChart3 },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function navForRole(role: DesktopRole): NavGroup[] {
  return role === 'staff' ? STAFF_NAV : ADMIN_NAV;
}

export function pageLabel(page: DesktopPage, role: DesktopRole): string {
  for (const group of navForRole(role)) {
    const item = group.items.find((i) => i.id === page);
    if (item) return item.label;
  }
  return page;
}
