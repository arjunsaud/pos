'use client';

import { useAuthStore } from '@/features/auth/store';
import { MobileSidebarTrigger } from '@/components/layout/app-sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Moon, Sun, User, Settings, Store } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/helpers';
import { NotificationPanel } from '@/components/layout/notification-panel';
import { useNavStore } from '@/features/auth/store';

export function AppNavbar() {
  const { user, logout } = useAuthStore();
  const { setTheme, resolvedTheme } = useTheme();
  const { setCurrentSection } = useNavStore();

  if (!user) return null;

  const initials = getInitials(user.name);

  const roleLabel = {
    'super-admin': 'Super Admin',
    'tenant-admin': 'Tenant Admin',
    'staff': 'Staff',
  }[user.role];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <div className="flex flex-1 items-center gap-2">
        {/* Mobile sidebar trigger */}
        <MobileSidebarTrigger />

        {/* Breadcrumb / Tenant name */}
        <div className="flex items-center gap-2">
          {user.tenantName && (
            <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 text-xs font-normal">
              <Store className="h-3 w-3" />
              {user.tenantName}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <NotificationPanel />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-2 px-2 hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start text-left md:flex">
                <span className="text-sm font-medium leading-none">{user.name}</span>
                <span className="text-xs text-muted-foreground">{roleLabel}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCurrentSection(user.role === 'super-admin' ? 'sa-profile' : 'tenant-profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentSection(user.role === 'super-admin' ? 'super-admin-settings' : 'tenant-settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
