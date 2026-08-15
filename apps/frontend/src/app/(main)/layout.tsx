import Header from '@/components/layout/Header/Header';
import Sidebar, { MobileBottomNav } from '@/components/layout/Sidebar/Sidebar';
import AuthGate from '@/components/layout/AuthGate';
import { ErrorBoundary } from '@/components/shared/error-boundary';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGate>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    </AuthGate>
  );
}
