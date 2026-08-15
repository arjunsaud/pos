'use client';

import { useAuthStore } from '@/features/auth/store';
import SuperAdminStaff from '@/features/super-admin/staff/components/super-admin-staff';
import TenantStaffPage from '@/features/tenant/staff/components/tenant-staff-page';

export default function StaffPage() {
  const user = useAuthStore((s) => s.user);
  if (user?.role === 'super-admin') {
    return <SuperAdminStaff />;
  }
  return <TenantStaffPage />;
}
