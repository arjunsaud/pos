'use client';

import Link from 'next/link';
import { Monitor, Moon, Store, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { MobileSidebar } from './MobileSidebar/MobileSidebar';
import ProfileHeaderDropdown from './ProfileHeaderDropdown';
import { useAuthStore, useTenantSelectorStore } from '@/features/auth/store';
import {
  platformSidebarData,
  staffSidebarData,
  tenantSidebarData,
  tenantViewSidebarData,
} from '@/lib/data/sidebar.data';
import { PATHS } from '@/lib/navigation/routes';
import { useTheme } from 'next-themes';

export default function Header() {
  const { user } = useAuthStore();
  const { selectedTenantId } = useTenantSelectorStore();
  const { setTheme, resolvedTheme } = useTheme();

  if (!user) return null;

  const items =
    user.role === 'super-admin'
      ? selectedTenantId
        ? tenantViewSidebarData(selectedTenantId)
        : platformSidebarData
      : user.role === 'staff'
        ? staffSidebarData
        : tenantSidebarData;

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <MobileSidebar items={items} />
      <Link href={PATHS.dashboard} className="mr-2 hidden items-center gap-2 md:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Monitor className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold">POS Nepal</span>
      </Link>
      <div className="flex flex-1 items-center gap-2">
        {user.tenantName && (
          <Badge variant="outline" className="hidden items-center gap-1.5 text-xs font-normal sm:flex">
            <Store className="h-3 w-3" />
            {user.tenantName}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <NotificationPanel />
        <ProfileHeaderDropdown />
      </div>
    </header>
  );
}
