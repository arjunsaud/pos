'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { GlobalNavShortcuts } from '@/hooks/use-app-shortcuts';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 15_000,
      },
    },
  });
}

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    void restoreSession();
    const onUnauthorized = () => logout();
    window.addEventListener('posnepal:unauthorized', onUnauthorized);
    return () => window.removeEventListener('posnepal:unauthorized', onUnauthorized);
  }, [restoreSession, logout]);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={client}>
      <AuthBootstrap>
        <GlobalNavShortcuts />
        {children}
      </AuthBootstrap>
    </QueryClientProvider>
  );
}
