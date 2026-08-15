'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  Dialog, DialogContent, DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavStore, useAuthStore, useTenantSelectorStore } from '@/features/auth/store';
import { hrefForSection } from '@/lib/navigation/routes';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, CreditCard, Activity, FileText, Settings,
  ShoppingCart, Receipt, Package, Warehouse, Tags, BarChart3,
  UserCog, Store, Search, Zap, FileCheck2, FolderOpen, SlidersHorizontal, Truck, Eye,
  Users, BellRing, ArrowLeftRight, type LucideIcon,
} from 'lucide-react';
import { SHORTCUTS, matchesShortcut } from '@posnepal/shared';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { NavSection, UserRole } from '@/lib/types';

interface CommandItem {
  label: string;
  section: NavSection;
  icon: LucideIcon;
  group: 'Pages' | 'Actions';
  isAction?: boolean;
  toastMessage?: string;
}

function buildCommands(role: UserRole): CommandItem[] {
  const pages: CommandItem[] = [];
  const actions: CommandItem[] = [];

  if (role === 'super-admin') {
    pages.push(
      { label: 'Dashboard', section: 'super-admin-dashboard', icon: LayoutDashboard, group: 'Pages' },
      { label: 'Tenants', section: 'tenants', icon: Store, group: 'Pages' },
      { label: 'Staff', section: 'super-admin-staff', icon: UserCog, group: 'Pages' },
      { label: 'Packages', section: 'sa-packages', icon: CreditCard, group: 'Pages' },
      { label: 'Documents', section: 'sa-documents', icon: FolderOpen, group: 'Pages' },
      { label: 'Contracts', section: 'sa-contracts', icon: FileCheck2, group: 'Pages' },
      { label: 'Templates', section: 'sa-templates', icon: FileText, group: 'Pages' },
      { label: 'Promotions', section: 'sa-promotions', icon: Zap, group: 'Pages' },
      { label: 'Referrals', section: 'sa-referrals', icon: Zap, group: 'Pages' },
      { label: 'Activity Logs', section: 'activity-logs', icon: Activity, group: 'Pages' },
      { label: 'Settings', section: 'super-admin-settings', icon: Settings, group: 'Pages' },
      { label: 'Profile', section: 'sa-profile', icon: UserCog, group: 'Pages' },
    );
  } else if (role === 'tenant-admin') {
    pages.push(
      { label: 'Dashboard', section: 'tenant-dashboard', icon: LayoutDashboard, group: 'Pages' },
      { label: 'POS', section: 'pos', icon: ShoppingCart, group: 'Pages' },
      { label: 'Billing', section: 'billing', icon: Receipt, group: 'Pages' },
      { label: 'Products', section: 'products', icon: Package, group: 'Pages' },
      { label: 'Inventory', section: 'inventory', icon: Warehouse, group: 'Pages' },
      { label: 'Categories', section: 'categories', icon: Tags, group: 'Pages' },
      { label: 'Vendors', section: 'vendors', icon: Truck, group: 'Pages' },
      { label: 'Purchases', section: 'purchases', icon: FileText, group: 'Pages' },
      { label: 'Stock Transfer', section: 'stock-transfer', icon: ArrowLeftRight, group: 'Pages' },
      { label: 'Sales & Reports', section: 'sales-reports', icon: BarChart3, group: 'Pages' },
      { label: 'Customers', section: 'customers', icon: Users, group: 'Pages' },
      { label: 'Subscription', section: 'tenant-subscription', icon: CreditCard, group: 'Pages' },
      { label: 'Outlets', section: 'tenant-outlets', icon: Store, group: 'Pages' },
      { label: 'Staff', section: 'tenant-staff', icon: UserCog, group: 'Pages' },
      { label: 'Notifications', section: 'notifications', icon: BellRing, group: 'Pages' },
      { label: 'Store Profile', section: 'store-profile', icon: Store, group: 'Pages' },
      { label: 'Profile', section: 'tenant-profile', icon: UserCog, group: 'Pages' },
      { label: 'Settings', section: 'tenant-settings', icon: Settings, group: 'Pages' },
    );
      { label: 'New Sale', section: 'pos', icon: ShoppingCart, group: 'Actions', isAction: true, toastMessage: 'Opening POS...' },
      { label: 'Create Invoice', section: 'billing', icon: Receipt, group: 'Actions', isAction: true, toastMessage: 'Opening Billing...' },
      { label: 'Add Product', section: 'products', icon: Package, group: 'Actions', isAction: true, toastMessage: 'Opening Products...' },
      { label: 'View Reports', section: 'sales-reports', icon: BarChart3, group: 'Actions', isAction: true, toastMessage: 'Opening Reports...' },
    );
  } else if (role === 'staff') {
    pages.push(
      { label: 'POS', section: 'pos', icon: ShoppingCart, group: 'Pages' },
      { label: 'Sales History', section: 'sales-reports', icon: BarChart3, group: 'Pages' },
      { label: 'Settings', section: 'tenant-settings', icon: Settings, group: 'Pages' },
    );
    actions.push(
      { label: 'New Sale', section: 'pos', icon: ShoppingCart, group: 'Actions', isAction: true, toastMessage: 'Opening POS...' },
    );
  }

  return [...pages, ...actions];
}

// Section label for a given NavSection
const sectionLabels: Record<string, string> = {
  'super-admin-dashboard': 'Dashboard',
  'tenants': 'Tenants',
  'super-admin-staff': 'Staff',
  'sa-packages': 'Packages',
  'sa-documents': 'Documents',
  'sa-contracts': 'Contracts',
  'sa-promotions': 'Promotions',
  'sa-referrals': 'Referrals',
  'activity-logs': 'Activity Logs',
  'super-admin-settings': 'Settings',
  'sa-profile': 'Profile',
  'sa-templates': 'Templates',
  'sa-tenant-overview': 'Tenant Overview',
  'sa-tenant-billing': 'Tenant Billing',
  'sa-tenant-products': 'Tenant Products',
  'sa-tenant-inventory': 'Tenant Inventory',
  'sa-tenant-categories': 'Tenant Categories',
  'sa-tenant-sales': 'Tenant Sales',
  'sa-tenant-reports': 'Tenant Reports',
  'sa-tenant-staff-view': 'Tenant Staff',
  'sa-tenant-subscription': 'Tenant Subscription',
  'sa-tenant-features': 'Tenant Features',
  'sa-tenant-vendors': 'Tenant Vendors',
  'tenant-dashboard': 'Dashboard',
  'pos': 'POS',
  'sales-reports': 'Sales & Reports',
  'billing': 'Billing',
  'products': 'Products',
  'inventory': 'Inventory',
  'categories': 'Categories',
  'vendors': 'Vendors',
  'tenant-subscription': 'Subscription',
  'purchases': 'Purchases',
  'stock-transfer': 'Stock Transfer',
  'customers': 'Customers',
  'notifications': 'Notifications',
  'tenant-outlets': 'Outlets',
  'tenant-staff': 'Staff',
  'store-profile': 'Store Profile',
  'tenant-profile': 'Profile',
  'tenant-settings': 'Settings',
  'tenant-support': 'Support',
};

const sectionIcons: Record<string, LucideIcon> = {
  'super-admin-dashboard': LayoutDashboard,
  'tenants': Store,
  'super-admin-staff': UserCog,
  'super-admin-subscriptions': CreditCard,
  'sa-contracts': FileCheck2,
  'sa-documents': FolderOpen,
  'activity-logs': Activity,
  'content': FileText,
  'super-admin-settings': Settings,
  'sa-tenant-overview': Eye,
  'sa-tenant-billing': Receipt,
  'sa-tenant-products': Package,
  'sa-tenant-inventory': Warehouse,
  'sa-tenant-categories': Tags,
  'sa-tenant-sales': BarChart3,
  'sa-tenant-reports': BarChart3,
  'sa-tenant-staff-view': UserCog,
  'sa-tenant-subscription': CreditCard,
  'sa-tenant-features': SlidersHorizontal,
  'sa-tenant-vendors': Truck,
  'tenant-dashboard': LayoutDashboard,
  'pos': ShoppingCart,
  'customers': Users,
  'purchases': FileText,
  'stock-transfer': ArrowLeftRight,
  'notifications': BellRing,
  'billing': Receipt,
  'products': Package,
  'inventory': Warehouse,
  'categories': Tags,
  'vendors': Truck,
  'sales': BarChart3,
  'reports': BarChart3,
  'tenant-subscription': CreditCard,
  'tenant-staff': UserCog,
  'store-profile': Store,
};

type FlatEntry =
  | { type: 'header'; label: string; icon: LucideIcon }
  | { type: 'item'; item: CommandItem; globalIndex: number }
  | { type: 'recent-header' }
  | { type: 'recent-item'; section: NavSection; globalIndex: number };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useAuthStore();
  const { recentSections, pushRecent } = useNavStore();
  const { selectedTenantId } = useTenantSelectorStore();
  const router = useRouter();
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo(() => (user ? buildCommands(user.role) : []), [user]);

  // Filtered commands by query
  const filteredPages = useMemo(
    () =>
      query
        ? commands.filter(c => c.group === 'Pages' && c.label.toLowerCase().includes(query.toLowerCase()))
        : commands.filter(c => c.group === 'Pages'),
    [query, commands],
  );

  const filteredActions = useMemo(
    () =>
      query
        ? commands.filter(c => c.group === 'Actions' && c.label.toLowerCase().includes(query.toLowerCase()))
        : commands.filter(c => c.group === 'Actions'),
    [query, commands],
  );

  // Recent sections (max 3), exclude current and already shown in pages, only when no query
  const recentItems = useMemo(() => {
    if (query) return [];
    const pageSections = new Set(filteredPages.map(p => p.section));
    return recentSections
      .filter(s => !pageSections.has(s))
      .slice(0, 3);
  }, [query, recentSections, filteredPages]);

  // Total selectable item count
  const totalItems = filteredPages.length + filteredActions.length + recentItems.length;
  const clampedIndex = Math.min(activeIndex, Math.max(0, totalItems - 1));

  // Build flat list
  const flatItems = useMemo((): FlatEntry[] => {
    const items: FlatEntry[] = [];
    let gi = 0;

    if (filteredPages.length > 0) {
      items.push({ type: 'header', label: 'Pages', icon: LayoutDashboard });
      for (const item of filteredPages) {
        items.push({ type: 'item', item, globalIndex: gi });
        gi++;
      }
    }

    if (filteredActions.length > 0) {
      items.push({ type: 'header', label: 'Actions', icon: Zap });
      for (const item of filteredActions) {
        items.push({ type: 'item', item, globalIndex: gi });
        gi++;
      }
    }

    if (recentItems.length > 0) {
      items.push({ type: 'recent-header' });
      for (const section of recentItems) {
        items.push({ type: 'recent-item', section, globalIndex: gi });
        gi++;
      }
    }

    return items;
  }, [filteredPages, filteredActions, recentItems]);

  // Resolve a globalIndex to the actual item/section
  const resolveIndex = useCallback(
    (idx: number): { section: NavSection; toastMessage?: string } | null => {
      if (idx < filteredPages.length) {
        const item = filteredPages[idx];
        return { section: item.section };
      }
      const actionIdx = idx - filteredPages.length;
      if (actionIdx < filteredActions.length) {
        const item = filteredActions[actionIdx];
        return { section: item.section, toastMessage: item.toastMessage };
      }
      const recentIdx = actionIdx - filteredActions.length;
      if (recentIdx < recentItems.length) {
        return { section: recentItems[recentIdx] };
      }
      return null;
    },
    [filteredPages, filteredActions, recentItems],
  );

  const navigate = useCallback(
    (section: NavSection, toastMessage?: string) => {
      pushRecent(section);
      router.push(hrefForSection(section, selectedTenantId));
      if (toastMessage) {
        toast.success(toastMessage);
      }
      setOpen(false);
      setQuery('');
    },
    [pushRecent, router, selectedTenantId],
  );

  const handleOpenChange = useCallback((v: boolean) => {
    setOpen(v);
    if (!v) setQuery('');
    if (v) setActiveIndex(0);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setActiveIndex(0);
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K (shared with desktop)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (matchesShortcut(e, SHORTCUTS.commandPalette)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Arrow key navigation + Enter to select
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, totalItems - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        const target = resolveIndex(clampedIndex);
        if (target) {
          e.preventDefault();
          navigate(target.section, target.toastMessage);
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, totalItems, clampedIndex, resolveIndex, navigate]);

  // Scroll active item into view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const activeEl = listRef.current.querySelector('[data-active="true"]');
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const hasResults = totalItems > 0;

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        Search...
        <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium">{SHORTCUTS.commandPalette.keysLabel}</kbd>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <div className="flex items-center border-b px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <kbd className="ml-2 shrink-0 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">ESC</kbd>
          </div>
          <ScrollArea className="max-h-72 p-2">
            <div ref={listRef}>
              {!hasResults ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Search className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No results found</p>
                  <p className="text-xs mt-1 opacity-60">Try a different search term</p>
                </div>
              ) : (
                flatItems.map((entry, i) => {
                  if (entry.type === 'header') {
                    const HeaderIcon = entry.icon;
                    return (
                      <div key={`h-${entry.label}`} className="flex items-center gap-1.5 px-2 pt-3 pb-1 first:pt-1">
                        <HeaderIcon className="h-3 w-3 text-muted-foreground/60" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                          {entry.label}
                        </p>
                      </div>
                    );
                  }
                  if (entry.type === 'recent-header') {
                    return (
                      <div key="recent-header" className="flex items-center gap-1.5 px-2 pt-3 pb-1">
                        <Activity className="h-3 w-3 text-muted-foreground/60" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                          Recent
                        </p>
                      </div>
                    );
                  }
                  if (entry.type === 'recent-item') {
                    const RecentIcon = (sectionIcons as Record<string, LucideIcon>)[entry.section] || LayoutDashboard;
                    const isHighlighted = entry.globalIndex === clampedIndex;
                    return (
                      <button
                        key={`recent-${entry.section}`}
                        data-active={isHighlighted}
                        onClick={() => navigate(entry.section)}
                        onMouseEnter={() => setActiveIndex(entry.globalIndex)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors',
                          isHighlighted
                            ? 'bg-accent text-accent-foreground'
                            : 'text-foreground hover:bg-accent/50',
                        )}
                      >
                        <RecentIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="flex-1 text-left">{(sectionLabels as Record<string, string>)[entry.section] || entry.section}</span>
                        {isHighlighted && (
                          <span className="text-[10px] text-muted-foreground opacity-60">↓</span>
                        )}
                      </button>
                    );
                  }
                  // type === 'item'
                  const { item, globalIndex } = entry;
                  const isCurrentSection =
                    pathname === hrefForSection(item.section, selectedTenantId);
                  const isHighlighted = globalIndex === clampedIndex;
                  return (
                    <button
                      key={`${item.group}-${item.section}`}
                      data-active={isHighlighted}
                      onClick={() => navigate(item.section, item.toastMessage)}
                      onMouseEnter={() => setActiveIndex(globalIndex)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors',
                        isHighlighted
                          ? 'bg-accent text-accent-foreground'
                          : isCurrentSection
                            ? 'bg-accent/60 text-accent-foreground'
                            : 'text-foreground hover:bg-accent/50',
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isCurrentSection && (
                        <span className="text-[10px] font-medium text-muted-foreground">Current</span>
                      )}
                      {isHighlighted && !isCurrentSection && (
                        <span className="text-[10px] text-muted-foreground opacity-60">↓</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
          <div className="border-t px-4 py-2 text-[10px] text-muted-foreground">
            Navigate with <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[9px]">↑↓</kbd> and press <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[9px]">Enter</kbd>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
