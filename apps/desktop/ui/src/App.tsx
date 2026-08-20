import { useCallback, useEffect, useState } from 'react';
import { NetworkStatus, matchShortcutId, type ShortcutId } from '@posnepal/shared';
import { Monitor, Store, Wifi, WifiOff, LogOut, Search } from 'lucide-react';
import { ApiError, apiRequest, asRecord, setToken, str } from '@/lib/api';
import { navForRole } from '@/lib/nav';
import type { DesktopPage, DesktopRole, DesktopUser } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoginScreen } from '@/screens/LoginScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { PosScreen } from '@/screens/PosScreen';
import { InventoryScreen, ProductsScreen, SalesScreen } from '@/screens/Lists';
import { BillingScreen, ResourceTable, SettingsScreen } from '@/screens/Modules';
import { CommandPalette } from '@/screens/CommandPalette';
import { SHORTCUTS } from '@posnepal/shared';

function pageForShortcut(id: ShortcutId, role: DesktopRole): DesktopPage | null {
  if (id === 'goPos') return 'pos';
  if (id === 'goSales') return 'sales';
  if (role === 'staff') {
    if (id === 'goDashboard') return 'pos';
    return null;
  }
  if (id === 'goDashboard') return 'dashboard';
  if (id === 'goProducts') return 'products';
  if (id === 'goInventory') return 'inventory';
  return null;
}

export function App() {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<DesktopUser | null>(null);
  const [page, setPage] = useState<DesktopPage>('dashboard');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [challengeEmail, setChallengeEmail] = useState('');
  const [online, setOnline] = useState(true);
  const [palette, setPalette] = useState(false);
  const [checkoutSignal, setCheckoutSignal] = useState(0);
  const [barcodeSignal, setBarcodeSignal] = useState(0);
  const [clearSignal, setClearSignal] = useState(0);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setPage('dashboard');
  }, []);

  const restore = useCallback(async () => {
    try {
      const profile = asRecord(await apiRequest('/v1/user/auth/profile'));
      const staffRole = str(profile, 'tenantStaffRole');
      const next: DesktopUser = {
        id: str(profile, 'id', '_id'),
        name: str(profile, 'name', 'fullName') || 'User',
        email: str(profile, 'email'),
        role: staffRole ? 'staff' : 'tenant-admin',
        tenantId: str(profile, 'tenantId') || undefined,
        tenantName: str(profile, 'tenantName') || undefined,
      };
      setUser(next);
      setPage(next.role === 'staff' ? 'pos' : 'dashboard');
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    void restore();
    const onUnauthorized = () => logout();
    window.addEventListener('posnepal:unauthorized', onUnauthorized);
    return () => window.removeEventListener('posnepal:unauthorized', onUnauthorized);
  }, [restore, logout]);

  useEffect(() => {
    const api = window.posnepalDesktop;
    if (!api) return;
    void api.getNetwork().then((snap) => setOnline(snap.status !== NetworkStatus.OFFLINE));
    return api.onNetworkChange((snap) => setOnline(snap.status !== NetworkStatus.OFFLINE));
  }, []);

  const applyShortcut = useCallback(
    (id: ShortcutId) => {
      if (id === 'commandPalette') {
        setPalette((open) => !open);
        return;
      }
      if (!user) return;
      const next = pageForShortcut(id, user.role);
      if (next) {
        setPage(next);
        setPalette(false);
        return;
      }
      if (id === 'posCheckout') setCheckoutSignal((n) => n + 1);
      if (id === 'posBarcode') setBarcodeSignal((n) => n + 1);
      if (id === 'posClear') {
        if (palette) setPalette(false);
        else setClearSignal((n) => n + 1);
      }
    },
    [user, palette],
  );

  useEffect(() => {
    const api = window.posnepalDesktop;
    return api?.onShortcut(applyShortcut);
  }, [applyShortcut]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const id = matchShortcutId(event);
      if (!id) return;
      event.preventDefault();
      applyShortcut(id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [applyShortcut]);

  const login = async (email: string, password: string, _role: DesktopRole, otp?: string) => {
    setBusy(true);
    setError('');
    try {
      if (otp) {
        const tokens = await apiRequest<{ accessToken: string }>('/v1/user/auth/login/2fa', {
          method: 'POST',
          body: { email, otp },
          auth: false,
        });
        setToken(tokens.accessToken);
        setChallengeEmail('');
        await restore();
        return;
      }
      const tokens = await apiRequest<{ accessToken?: string; requiresTwoFactor?: boolean; email?: string }>(
        '/v1/user/auth/login',
        { method: 'POST', body: { email, password }, auth: false },
      );
      if (tokens.requiresTwoFactor) {
        setChallengeEmail(tokens.email || email);
        return;
      }
      if (!tokens.accessToken) {
        setError('Sign in failed');
        return;
      }
      setToken(tokens.accessToken);
      await restore();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-full items-center justify-center text-muted-foreground">Loading…</div>
    );
  }

  if (!user) {
    return (
      <LoginScreen
        onSubmit={(e, p, r, otp) => void login(e, p, r, otp)}
        error={error}
        busy={busy}
        challengeEmail={challengeEmail}
      />
    );
  }

  const nav = navForRole(user.role);

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-14 w-full items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Monitor className="size-4" />
          </div>
          <strong className="text-sm font-bold">POS Nepal</strong>
        </div>
        {user.tenantName ? (
          <Badge variant="outline" className="gap-1.5 font-normal">
            <Store className="size-3.5" />
            {user.tenantName}
          </Badge>
        ) : null}
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn('gap-1.5', online ? 'text-emerald-700' : 'text-destructive')}>
            {online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
            {online ? 'Online' : 'Offline'}
          </Badge>
          <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
          <nav className="flex-1 overflow-y-auto px-3 py-3">
            {nav.map((group, index) => (
              <div
                key={group.title}
                className={cn(index > 0 && 'mt-5 border-t border-border/50 pt-4')}
              >
                <p className="px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.title}
                </p>
                <div className="mt-1.5 space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = page === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPage(item.id)}
                        className={cn(
                          'relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                          active
                            ? 'bg-primary/10 font-semibold text-primary'
                            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                        )}
                      >
                        {active ? (
                          <span className="absolute left-0 h-5 w-[3px] rounded-r-full bg-primary" />
                        ) : null}
                        <Icon className="size-4 shrink-0" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="border-t p-3">
            <button
              type="button"
              onClick={() => setPalette(true)}
              className="flex w-full items-center gap-2 rounded-md border border-dashed px-2.5 py-2 text-sm text-muted-foreground hover:bg-accent/60"
            >
              <Search className="size-4" />
              <span className="flex-1 text-left">Search...</span>
              <kbd>{SHORTCUTS.commandPalette.keysLabel}</kbd>
            </button>
            <div className="mt-3 px-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {!online ? (
            <div className="bg-amber-50 px-4 py-2 text-sm text-amber-800">
              You are offline. Reconnect to sync sales.
            </div>
          ) : null}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {page === 'dashboard' && user.role !== 'staff' && (
              <DashboardScreen name={user.name} onOpenPos={() => setPage('pos')} />
            )}
            {page === 'pos' && (
              <PosScreen
                user={user}
                checkoutSignal={checkoutSignal}
                barcodeSignal={barcodeSignal}
                clearSignal={clearSignal}
              />
            )}
            {page === 'products' && user.role !== 'staff' && <ProductsScreen />}
            {page === 'inventory' && user.role !== 'staff' && <InventoryScreen />}
            {page === 'billing' && user.role !== 'staff' && <BillingScreen user={user} />}
            {page === 'categories' && user.role !== 'staff' && (
              <ResourceTable
                title="Categories"
                path="/v1/user/category"
                columns={[
                  { key: ['name'], label: 'Name' },
                  { key: ['description'], label: 'Description' },
                ]}
              />
            )}
            {page === 'vendors' && user.role !== 'staff' && (
              <ResourceTable
                title="Vendors"
                path="/v1/user/vendor"
                columns={[
                  { key: ['name'], label: 'Name' },
                  { key: ['phone', 'mobileNumber'], label: 'Phone' },
                  { key: ['email'], label: 'Email' },
                ]}
              />
            )}
            {page === 'purchases' && user.role !== 'staff' && (
              <ResourceTable
                title="Purchases"
                path="/v1/user/purchase"
                columns={[
                  { key: ['invoiceNumber', 'reference'], label: 'Reference' },
                  { key: ['vendorName'], label: 'Vendor' },
                  { key: ['total'], label: 'Total', money: true },
                  { key: ['status'], label: 'Status' },
                ]}
              />
            )}
            {page === 'stock-transfer' && user.role !== 'staff' && (
              <ResourceTable
                title="Stock Transfer"
                path="/v1/user/stock-transfer"
                columns={[
                  { key: ['fromOutlet', 'source'], label: 'From' },
                  { key: ['toOutlet', 'destination'], label: 'To' },
                  { key: ['status'], label: 'Status' },
                ]}
              />
            )}
            {page === 'sales' && <SalesScreen />}
            {page === 'customers' && user.role !== 'staff' && (
              <ResourceTable
                title="Customers"
                path="/v1/user/customer"
                columns={[
                  { key: ['name'], label: 'Name' },
                  { key: ['phone', 'mobileNumber'], label: 'Phone' },
                  { key: ['email'], label: 'Email' },
                ]}
              />
            )}
            {page === 'outlets' && user.role !== 'staff' && (
              <ResourceTable
                title="Outlets"
                path="/v1/user/outlet"
                columns={[
                  { key: ['name'], label: 'Name' },
                  { key: ['address'], label: 'Address' },
                  { key: ['phone'], label: 'Phone' },
                ]}
              />
            )}
            {page === 'staff' && user.role !== 'staff' && (
              <ResourceTable
                title="Staff"
                path="/v1/user/staff"
                columns={[
                  { key: ['fullName', 'name'], label: 'Name' },
                  { key: ['email'], label: 'Email' },
                  { key: ['tenantStaffRole', 'role'], label: 'Role' },
                ]}
              />
            )}
            {page === 'subscription' && user.role !== 'staff' && (
              <ResourceTable
                title="Subscription"
                path="/v1/user/subscription"
                columns={[
                  { key: ['plan', 'packageName'], label: 'Plan' },
                  { key: ['status'], label: 'Status' },
                  { key: ['endDate', 'expiresAt'], label: 'Expires' },
                ]}
              />
            )}
            {page === 'store-profile' && user.role !== 'staff' && (
              <div className="space-y-4">
                <PageTitle title="Store Profile" />
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <p className="font-semibold">{user.tenantName || user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}
            {page === 'notifications' && user.role !== 'staff' && (
              <ResourceTable
                title="Notifications"
                path="/v1/user/notification"
                columns={[
                  { key: ['title'], label: 'Title' },
                  { key: ['message', 'body'], label: 'Message' },
                  { key: ['createdAt'], label: 'Date' },
                ]}
              />
            )}
            {page === 'support' && user.role !== 'staff' && (
              <ResourceTable
                title="Support"
                path="/v1/user/support-ticket"
                columns={[
                  { key: ['subject'], label: 'Subject' },
                  { key: ['status'], label: 'Status' },
                  { key: ['priority'], label: 'Priority' },
                ]}
              />
            )}
            {page === 'profile' && user.role !== 'staff' && (
              <div className="space-y-4">
                <PageTitle title="Profile" />
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="mt-2 text-xs text-muted-foreground capitalize">{user.role.replace('-', ' ')}</p>
                </div>
              </div>
            )}
            {page === 'settings' && <SettingsScreen user={user} />}
          </main>
        </div>
      </div>

      {palette ? (
        <CommandPalette role={user.role} onGo={setPage} onClose={() => setPalette(false)} />
      ) : null}
    </div>
  );
}

function PageTitle({ title }: { title: string }) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <div className="mt-3 h-px bg-border" />
    </div>
  );
}
