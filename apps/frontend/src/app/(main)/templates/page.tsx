'use client';

import TemplatesPage from '@/features/super-admin/templates/components/templates-page';
import { useAuthStore } from '@/features/auth/store';

export default function Page() {
  const role = useAuthStore((s) => s.user?.role);
  if (role !== 'super-admin') {
    return <p className="text-sm text-muted-foreground">Templates are available to super admins only.</p>;
  }
  return <TemplatesPage />;
}
