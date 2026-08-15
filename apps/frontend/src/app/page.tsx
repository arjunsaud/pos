'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store';
import LandingPage from '@/components/layout/landing-page';
import { isDesktopClient } from '@/lib/desktop';
import { PATHS, homePath } from '@/lib/navigation/routes';

export default function HomePage() {
  const { isAuthenticated, user, hydrated } = useAuthStore();
  const router = useRouter();
  const desktop = isDesktopClient();

  useEffect(() => {
    if (!hydrated) return;
    if (desktop) {
      router.replace(`${PATHS.login}?client=desktop`);
      return;
    }
    if (isAuthenticated && user) {
      router.replace(homePath(user.role));
    }
  }, [hydrated, desktop, isAuthenticated, user, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (desktop || (isAuthenticated && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Redirecting...
      </div>
    );
  }

  return <LandingPage onSignIn={() => router.push(PATHS.login)} />;
}
