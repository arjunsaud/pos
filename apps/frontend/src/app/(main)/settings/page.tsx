'use client';

import { useAuthStore } from '@/features/auth/store';
import SuperAdminSettings from '@/features/super-admin/settings/components/super-admin-settings';
import TenantSettings from '@/features/tenant/settings/components/tenant-settings';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  if (user?.role === 'super-admin') {
    return <SuperAdminSettings />;
  }
  return <TenantSettings />;
}
