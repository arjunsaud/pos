'use client';

import { useAuthStore } from '@/features/auth/store';
import SuperAdminDashboard from '@/features/super-admin/dashboard/components/super-admin-dashboard';
import TenantDashboard from '@/features/tenant/dashboard/components/tenant-dashboard';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  if (user?.role === 'super-admin') {
    return <SuperAdminDashboard />;
  }
  return <TenantDashboard />;
}
