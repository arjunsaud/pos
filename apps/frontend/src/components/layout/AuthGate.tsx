'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import { isDesktopClient } from '@/lib/desktop';
import { PATHS, homePath } from '@/lib/navigation/routes';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, hydrated, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const desktop = isDesktopClient();

  useEffect(() => {
    if (!hydrated) return;
    if (desktop && user?.role === 'super-admin') {
      logout();
      router.replace(`${PATHS.login}?client=desktop`);
      return;
    }
    if (!isAuthenticated || !user) {
      router.replace(desktop ? `${PATHS.login}?client=desktop` : PATHS.login);
      return;
    }
    if (user.role === 'staff' && pathname === PATHS.dashboard) {
      router.replace(homePath('staff'));
    }
  }, [hydrated, isAuthenticated, user, desktop, logout, router, pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user || (desktop && user.role === 'super-admin')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Redirecting...
      </div>
    );
  }

  return <>{children}</>;
}
