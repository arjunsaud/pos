'use client';

import { useEffect } from 'react';
import {
  SHORTCUTS,
  matchShortcutId,
  type ShortcutId,
} from '@posnepal/shared';
import { useAuthStore } from '@/features/auth/store';
import { hrefForSection } from '@/lib/navigation/routes';
import { useRouter } from 'next/navigation';
import type { NavSection, UserRole } from '@/lib/types';

type ShortcutHandler = (id: ShortcutId, event: KeyboardEvent) => void;

export function useAppShortcuts(handler: ShortcutHandler, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const id = matchShortcutId(event);
      if (!id) return;
      handler(id, event);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handler, enabled]);
}

const navByRole: Record<UserRole, Partial<Record<ShortcutId, NavSection>>> = {
  'super-admin': {
    goDashboard: 'super-admin-dashboard',
  },
  'tenant-admin': {
    goDashboard: 'tenant-dashboard',
    goPos: 'pos',
    goProducts: 'products',
    goInventory: 'inventory',
    goSales: 'sales-reports',
  },
  staff: {
    goDashboard: 'pos',
    goPos: 'pos',
    goSales: 'sales-reports',
  },
};

/** Global navigation shortcuts shared with the desktop app. */
export function GlobalNavShortcuts() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const id = matchShortcutId(event);
      if (!id) return;
      const section = navByRole[user.role]?.[id];
      if (!section) return;
      event.preventDefault();
      router.push(hrefForSection(section));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [user, router]);

  return null;
}

export { SHORTCUTS };
