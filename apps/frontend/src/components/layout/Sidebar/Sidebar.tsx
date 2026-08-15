'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Monitor } from 'lucide-react';
import { CommandPalette } from '@/components/layout/command-palette';
import { SidebarNav } from '@/components/layout/Header/SidebarNav/SidebarNav';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAuthStore, useOutletSelectorStore, useTenantSelectorStore } from '@/features/auth/store';
import { useOutlets, useTenants } from '@/hooks/use-api-data';
import {
  platformSidebarData,
  staffSidebarData,
  tenantSidebarData,
  tenantViewSidebarData,
} from '@/lib/data/sidebar.data';
import { PATHS } from '@/lib/navigation/routes';

function TenantSelector() {
  const router = useRouter();
  const tenants = useTenants().items;
  const { selectedTenantId, setSelectedTenantId } = useTenantSelectorStore();

  return (
    <div className="px-3 pt-3 pb-1">
      <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
        Select Tenant
      </label>
      <Select
        value={selectedTenantId || ''}
        onValueChange={(id) => {
          setSelectedTenantId(id || null);
          router.push(id ? `${PATHS.tenants}/${id}` : PATHS.tenants);
        }}
      >
        <SelectTrigger className="h-9 w-full text-sm">
          <SelectValue placeholder="Choose a tenant..." />
        </SelectTrigger>
        <SelectContent>
          {tenants.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id}>
              {tenant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function OutletSelector() {
  const outlets = useOutlets().items;
  const { user } = useAuthStore();
  const { selectedOutletId, setSelectedOutletId } = useOutletSelectorStore();
  const tenantOutlets = outlets.filter((o) => o.tenantId === (user?.tenantId || ''));

  return (
    <div className="px-3 pt-3 pb-1">
      <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
        Select Outlet
      </label>
      <Select
        value={selectedOutletId || ''}
        onValueChange={(id) => setSelectedOutletId(id || null)}
      >
        <SelectTrigger className="h-9 w-full text-sm">
          <SelectValue placeholder="Choose an outlet..." />
        </SelectTrigger>
        <SelectContent>
          {tenantOutlets.map((outlet) => (
            <SelectItem key={outlet.id} value={outlet.id}>
              {outlet.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function Sidebar() {
  const { user } = useAuthStore();
  const { selectedTenantId, setSelectedTenantId } = useTenantSelectorStore();
  const router = useRouter();

  if (!user) return null;

  const isSuperAdmin = user.role === 'super-admin';
  const isTenant = user.role === 'tenant-admin';
  const items = isSuperAdmin
    ? selectedTenantId
      ? tenantViewSidebarData(selectedTenantId)
      : platformSidebarData
    : isTenant
      ? tenantSidebarData
      : staffSidebarData;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex md:h-[calc(100vh-3.5rem)]">
      <div className="flex h-14 items-center gap-2.5 border-b px-4 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Monitor className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold">POS Nepal</span>
      </div>
      {isSuperAdmin && <TenantSelector />}
      {isTenant && <OutletSelector />}
      {isSuperAdmin && selectedTenantId && (
        <div className="px-3 pt-1 pb-2">
          <button
            type="button"
            onClick={() => {
              setSelectedTenantId(null);
              router.push(PATHS.dashboard);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/60 hover:text-accent-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </button>
        </div>
      )}
      <SidebarNav items={items} />
      <div className="px-3 pb-2">
        <CommandPalette />
      </div>
      <div className="mt-auto border-t p-3">
        <div className="rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-xs font-medium">POS Nepal v2.5.0</p>
          <p className="text-[10px] text-muted-foreground">&copy; 2026 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const items =
    user?.role === 'staff'
      ? staffSidebarData.flatMap((g) => g.items)
      : tenantSidebarData.flatMap((g) => g.items).slice(0, 5);

  if (!user || user.role !== 'staff') return null;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur-lg md:hidden">
      {items.slice(0, 5).map((item) => {
        const href = item.href ?? PATHS.dashboard;
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl',
                isActive ? 'bg-primary/10' : '',
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
            </div>
            <span className={cn(isActive && 'font-semibold')}>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
