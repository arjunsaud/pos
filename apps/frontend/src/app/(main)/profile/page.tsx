'use client';

import { useAuthStore } from '@/features/auth/store';
import SAProfile from '@/features/super-admin/profile/components/sa-profile';
import TenantProfile from '@/features/tenant/profile/components/tenant-profile';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  if (user?.role === 'super-admin') {
    return <SAProfile />;
  }
  return <TenantProfile />;
}
