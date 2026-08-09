'use client';

import { useAuthStore, useNavStore, useTenantSelectorStore } from '@/features/auth/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Calculator,
  Bell,
  FileCheck2,
  FolderOpen,
  SlidersHorizontal,
  Truck,
  Eye,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { CommandPalette } from '@/components/layout/command-palette';
import type { NavSection, UserRole } from '@/lib/types';
import { useState } from 'react';
import { mockTenants } from '@/lib/mock-data';

interface SidebarItem {
  label: string;
  section: NavSection;
  icon: LucideIcon;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

// ---------- Super Admin Menu (global - always visible) ----------
const superAdminGlobalMenu: SidebarGroup[] = [
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
      { label: 'Contracts', section: 'sa-contracts', icon: FileCheck2 },
      { label: 'Documents', section: 'sa-documents', icon: FolderOpen },
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

// ---------- Super Admin Menu (tenant view - when tenant selected) ----------
const superAdminTenantViewMenu: SidebarGroup[] = [
  {
    title: 'Tenant View',
    items: [
      { label: 'Overview', section: 'sa-tenant-overview', icon: Eye },
      { label: 'Billing', section: 'sa-tenant-billing', icon: Receipt },
      { label: 'Products', section: 'sa-tenant-products', icon: Package },
      { label: 'Inventory', section: 'sa-tenant-inventory', icon: Warehouse },
      { label: 'Categories', section: 'sa-tenant-categories', icon: Tags },
      { label: 'Sales', section: 'sa-tenant-sales', icon: BarChart3 },
      { label: 'Reports', section: 'sa-tenant-reports', icon: BarChart3 },
      { label: 'Staff', section: 'sa-tenant-staff-view', icon: UserCog },
    ],
  },
  {
    title: 'Tenant Config',
    items: [
      { label: 'Subscription', section: 'sa-tenant-subscription', icon: CreditCard },
      { label: 'Features', section: 'sa-tenant-features', icon: SlidersHorizontal },
      { label: 'Vendors', section: 'sa-tenant-vendors', icon: Truck },
    ],
  },
];

// ---------- Tenant Admin Menu ----------
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
      { label: 'POS', section: 'pos', icon: ShoppingCart },
      { label: 'Customers', section: 'customers', icon: Users },
      { label: 'Billing', section: 'billing', icon: Receipt },
      { label: 'Settlement', section: 'settlement', icon: Calculator },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Products', section: 'products', icon: Package },
      { label: 'Inventory', section: 'inventory', icon: Warehouse },
      { label: 'Categories', section: 'categories', icon: Tags },
      { label: 'Vendors', section: 'vendors', icon: Truck },
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
      { label: 'Store Profile', section: 'store-profile', icon: Store },
      { label: 'Staff', section: 'tenant-staff', icon: UserCog },
      { label: 'Notifications', section: 'notifications', icon: Bell },
    ],
  },
];

// ---------- Staff Menu ----------
const staffMenu: SidebarGroup[] = [
  {
    title: 'Point of Sale',
    items: [
      { label: 'POS', section: 'pos', icon: ShoppingCart },
    ],
  },
  {
    title: 'History',
    items: [
      { label: 'Sales History', section: 'sales', icon: BarChart3 },
    ],
  },
];

// ---------- Tenant Selector Component ----------
function TenantSelector() {
  const { selectedTenantId, setSelectedTenantId } = useTenantSelectorStore();
  const selectedTenant = mockTenants.find(t => t.id === selectedTenantId);

  return (
    <div className="px-3 pt-3 pb-1">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1.5 block">
        Select Tenant
      </label>
      <Select
        value={selectedTenantId || ''}
        onValueChange={(v) => setSelectedTenantId(v || null)}
      >
        <SelectTrigger className="h-9 w-full text-sm">
          <SelectValue placeholder="Choose a tenant..." />
        </SelectTrigger>
        <SelectContent>
          {mockTenants.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id}>
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    tenant.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                  )}
                />
                {tenant.name}
                <span className="text-xs text-muted-foreground">
                  ({tenant.plan})
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTenant && (
        <div className="mt-1.5 flex items-center justify-between rounded-md bg-muted/50 px-2.5 py-1.5">
          <span className="text-xs text-muted-foreground truncate">
            Viewing: <span className="font-medium text-foreground">{selectedTenant.name}</span>
          </span>
          <button
            onClick={() => setSelectedTenantId(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Sidebar navigation items ----------
function SidebarNav({ menu, onClose }: { menu: SidebarGroup[]; onClose?: () => void }) {
  const { currentSection, setCurrentSection } = useNavStore();

  return (
    <ScrollArea className="flex-1 py-3">
      <nav className="space-y-1 px-3">
        {menu.map((group, groupIdx) => (
          <div key={group.title}>
            <h4 className={cn(
              'px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70',
              groupIdx > 0 ? 'mt-5 pt-4 border-t border-border/50' : 'mb-2'
            )}>
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
                      'relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground'
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-primary" />
                    )}
                    <item.icon className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-primary' : ''
                    )} />
                    <span className="truncate">{item.label}</span>
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
  const { selectedTenantId } = useTenantSelectorStore();

  if (!user) return null;

  const isSuperAdmin = user.role === 'super-admin';

  let menu: SidebarGroup[];
  if (isSuperAdmin) {
    if (selectedTenantId) {
      // When a tenant is selected, show ONLY tenant view menus
      menu = superAdminTenantViewMenu;
    } else {
      menu = superAdminGlobalMenu;
    }
  } else if (user.role === 'tenant-admin') {
    menu = tenantAdminMenu;
  } else {
    menu = staffMenu;
  }

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

      {/* Tenant Selector (only for super admin) */}
      {isSuperAdmin && <TenantSelector />}

      {/* Back to Admin button (when tenant selected) */}
      {isSuperAdmin && selectedTenantId && (
        <div className="px-3 pt-1 pb-2">
          <button
            onClick={() => {
              useTenantSelectorStore.getState().setSelectedTenantId(null);
              useNavStore.getState().setCurrentSection('super-admin-dashboard');
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground transition-all duration-150"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Admin</span>
          </button>
        </div>
      )}

      <SidebarNav menu={menu} />

      {/* Command Palette trigger */}
      <div className="px-3 pb-2">
        <CommandPalette />
      </div>

      {/* Bottom */}
      <div className="mt-auto border-t p-3">
        <div className="rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-xs font-medium">POS Nepal v2.5.0</p>
          <p className="text-[10px] text-muted-foreground">&copy; 2025 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
}

// ---------- Mobile Sidebar Trigger (used in navbar) ----------
export function MobileSidebarTrigger() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const { selectedTenantId } = useTenantSelectorStore();

  if (!user || user.role === 'staff') return null;

  const isSuperAdmin = user.role === 'super-admin';

  let menu: SidebarGroup[];
  if (isSuperAdmin) {
    if (selectedTenantId) {
      // When a tenant is selected, show ONLY tenant view menus
      menu = superAdminTenantViewMenu;
    } else {
      menu = superAdminGlobalMenu;
    }
  } else {
    menu = tenantAdminMenu;
  }

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
          {isSuperAdmin && <TenantSelector />}
          {isSuperAdmin && selectedTenantId && (
            <div className="px-3 pt-1 pb-2">
              <button
                onClick={() => {
                  useTenantSelectorStore.getState().setSelectedTenantId(null);
                  useNavStore.getState().setCurrentSection('super-admin-dashboard');
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground transition-all duration-150"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Admin</span>
              </button>
            </div>
          )}
          <SidebarNav menu={menu} onClose={() => setOpen(false)} />
          <div className="border-t p-3">
            <div className="rounded-lg bg-muted/50 px-3 py-2.5">
              <p className="text-xs font-medium">POS Nepal v2.5.0</p>
              <p className="text-[10px] text-muted-foreground">&copy; 2025 All rights reserved</p>
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

  const menuMap: Record<string, SidebarGroup[]> = {
    'tenant-admin': tenantAdminMenu,
    'staff': staffMenu,
  };
  const menu = menuMap[user.role]?.flatMap(g => g.items) ?? [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden h-16 items-center justify-around border-t bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      {menu.slice(0, 5).map((item) => {
        const isActive = currentSection === item.section;
        return (
          <button
            key={item.section}
            onClick={() => setCurrentSection(item.section)}
            className={cn(
              'relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-all duration-150',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-150',
              isActive ? 'bg-primary/10' : ''
            )}>
              <item.icon className={cn('h-4.5 w-4.5 transition-colors', isActive && 'text-primary')} />
            </div>
            <span className={cn(isActive && 'font-semibold')}>{item.label}</span>
            {isActive && (
              <div className="absolute -top-px left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
