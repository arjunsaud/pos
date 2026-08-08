'use client';

import { useAuthStore, useNavStore } from '@/features/auth/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  LayoutDashboard,
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
  Menu,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { CommandPalette } from '@/components/layout/command-palette';
import type { NavSection, UserRole } from '@/lib/types';
import { useState } from 'react';

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
      { label: 'Customers', section: 'customers', icon: Users },
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

// ---------- Sidebar navigation items ----------
function SidebarNav({ menu, onClose }: { menu: SidebarGroup[]; onClose?: () => void }) {
  const { currentSection, setCurrentSection } = useNavStore();

  return (
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
                    onClick={() => {
                      setCurrentSection(item.section);
                      onClose?.();
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
  );
}

// ---------- Desktop Sidebar ----------
export function AppSidebar() {
  const { user } = useAuthStore();

  if (!user) return null;

  const menu = menuMap[user.role];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Monitor className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-none">POS Nepal</span>
          <span className="text-[10px] text-muted-foreground">Multi-Tenant System</span>
        </div>
      </div>

      <SidebarNav menu={menu} />

      {/* Command Palette trigger */}
      <div className="px-3 pb-2">
        <CommandPalette />
      </div>

      {/* Bottom */}
      <div className="mt-auto border-t p-3">
        <div className="rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-xs font-medium">POS Nepal v2.4.1</p>
          <p className="text-[10px] text-muted-foreground">© 2024 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
}

// ---------- Mobile Sidebar Trigger (used in navbar) ----------
export function MobileSidebarTrigger() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  if (!user || user.role === 'staff') return null;

  const menu = menuMap[user.role];

  return (
    <>
      <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          {/* Logo */}
          <div className="flex h-14 items-center gap-2.5 border-b px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Monitor className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">POS Nepal</span>
              <span className="text-[10px] text-muted-foreground">Multi-Tenant System</span>
            </div>
          </div>
          <SidebarNav menu={menu} onClose={() => setOpen(false)} />
          <div className="border-t p-3">
            <div className="rounded-lg bg-muted/50 px-3 py-2.5">
              <p className="text-xs font-medium">POS Nepal v2.4.1</p>
              <p className="text-[10px] text-muted-foreground">© 2024 All rights reserved</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// ---------- Mobile bottom nav for staff ----------
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