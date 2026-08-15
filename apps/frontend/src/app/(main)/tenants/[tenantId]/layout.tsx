'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTenantSelectorStore } from '@/features/auth/store';

export default function TenantViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ tenantId: string }>();
  const setSelectedTenantId = useTenantSelectorStore((s) => s.setSelectedTenantId);

  useEffect(() => {
    if (params.tenantId) {
      setSelectedTenantId(params.tenantId);
    }
  }, [params.tenantId, setSelectedTenantId]);

  return <>{children}</>;
}
