'use client';

import { useAuthStore, useNavStore } from '@/features/auth/store';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Activity,
  FileText,
  Settings,
  ShoppingCart,
  Receipt,
  Package,
  Warehouse,
  Tags,
  BarChart3,
  UserCog,
  Store,
  Monitor,
  type LucideIcon,
} from 'lucide-react';
import type { NavSection, UserRole } from '@/lib/types';

interface SidebarItem {
  label: string;
  section: NavSection;
  icon: LucideIcon;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

const superAdminMenu: SidebarGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', section: 'super-admin-dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Tenants', section: 'tenants', icon: Store },
      { label: 'Staff', section: 'super-admin-staff', icon: UserCog },
      { label: 'Subscriptions', section: 'super-admin-subscriptions', icon: CreditCard },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Activity Logs', section: 'activity-logs', icon: Activity },
      { label: 'Content & Social', section: 'content', icon: FileText },
      { label: 'Settings', section: 'super-admin-settings', icon: Settings },
    ],
  },
];

const tenantAdminMenu: SidebarGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', section: 'tenant-dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Point of Sale',
    items: [
      { label: 'POS Terminal', section: 'pos', icon: ShoppingCart },
      { label: 'Billing', section: 'billing', icon: Receipt },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Products', section: 'products', icon: Package },
      { label: 'Inventory', section: 'inventory', icon: Warehouse },
      { label: 'Categories', section: 'categories', icon: Tags },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Sales', section: 'sales', icon: BarChart3 },
      { label: 'Reports', section: 'reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Subscription', section: 'tenant-subscription', icon: CreditCard },
      { label: 'Staff', section: 'tenant-staff', icon: UserCog },
    ],
  },
];

const staffMenu: SidebarGroup[] = [
  {
    title: 'Point of Sale',
    items: [
      { label: 'POS Terminal', section: 'pos', icon: ShoppingCart },
    ],
  },
  {
    title: 'History',
    items: [
      { label: 'Sales History', section: 'sales', icon: BarChart3 },
    ],
  },
];

const menuMap: Record<UserRole, SidebarGroup[]> = {
  'super-admin': superAdminMenu,
  'tenant-admin': tenantAdminMenu,
  'staff': staffMenu,
};

export function AppSidebar() {
  const { user } = useAuthStore();
  const { currentSection, setCurrentSection } = useNavStore();

  if (!user) return null;

  const menu = menuMap[user.role];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Logo / Brand */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Monitor className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-none">POS Nepal</span>
          <span className="text-[10px] text-muted-foreground">Multi-Tenant System</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className="space-y-4 px-3">
          {menu.map((group) => (
            <div key={group.title}>
              <h4 className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h4>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = currentSection === item.section;
                  return (
                    <button
                      key={item.section}
                      onClick={() => setCurrentSection(item.section)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Bottom info */}
      <div className="border-t p-3">
        <div className="rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-xs font-medium">POS Nepal v2.4.1</p>
          <p className="text-[10px] text-muted-foreground">© 2024 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
}

// Mobile bottom nav for staff
export function MobileBottomNav() {
  const { user } = useAuthStore();
  const { currentSection, setCurrentSection } = useNavStore();

  if (!user || user.role === 'super-admin') return null;

  const menu = menuMap[user.role].flatMap(g => g.items);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden h-16 items-center justify-around border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {menu.slice(0, 5).map((item) => {
        const isActive = currentSection === item.section;
        return (
          <button
            key={item.section}
            onClick={() => setCurrentSection(item.section)}
            className={cn(
              'flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
