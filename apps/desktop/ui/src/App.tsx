import { useCallback, useEffect, useState } from 'react';
import { NetworkStatus, SHORTCUTS, matchShortcutId, type ShortcutId } from '@posnepal/shared';
import { ApiError, apiRequest, asRecord, setToken, str } from './lib/api';
import type { DesktopPage, DesktopRole, DesktopUser } from './lib/types';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { PosScreen } from './screens/PosScreen';
import { InventoryScreen, ProductsScreen, SalesScreen } from './screens/Lists';
import { BillingScreen, ResourceTable, SettingsScreen } from './screens/Modules';
import { CommandPalette } from './screens/CommandPalette';

const ADMIN_NAV: Array<[DesktopPage, string]> = [
  ['dashboard', 'Dashboard'],
  ['pos', 'POS'],
  ['billing', 'Billing'],
  ['products', 'Products'],
  ['inventory', 'Inventory'],
  ['categories', 'Categories'],
  ['vendors', 'Vendors'],
  ['purchases', 'Purchases'],
  ['stock-transfer', 'Stock transfer'],
  ['sales', 'Sales'],
  ['customers', 'Customers'],
  ['outlets', 'Outlets'],
  ['staff', 'Staff'],
  ['subscription', 'Subscription'],
  ['store-profile', 'Store'],
  ['notifications', 'Notifications'],
  ['support', 'Support'],
  ['profile', 'Profile'],
  ['settings', 'Settings'],
];

const STAFF_NAV: Array<[DesktopPage, string]> = [
  ['pos', 'POS'],
  ['sales', 'Sales'],
  ['settings', 'Settings'],
];

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
        {
          method: 'POST',
          body: { email, password },
          auth: false,
        },
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
    return <div className="login"><p className="sub">Loading…</p></div>;
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

  const nav = user.role === 'staff' ? STAFF_NAV : ADMIN_NAV;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">P</div>
          <div>
            <strong>POS Nepal</strong>
            <div className="sub" style={{ margin: 0 }}>Desktop</div>
          </div>
        </div>
        <nav className="nav">
          {nav.map(([id, label]) => (
            <button key={id} className={page === id ? 'on' : ''} onClick={() => setPage(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="userbox">{user.name}<br />{user.tenantName || user.email}</div>
        <button className="ghost" onClick={logout}>Sign out</button>
      </aside>
      <div className="main">
        {!online && <div className="offline-banner">You are offline. Reconnect to sync sales.</div>}
        <header className="topbar">
          <strong>{nav.find(([id]) => id === page)?.[1]}</strong>
          <div className="hint">
            <span><kbd>{SHORTCUTS.commandPalette.keysLabel}</kbd></span>
            <span className={`pill ${online ? 'on' : 'off'}`}>{online ? 'Online' : 'Offline'}</span>
          </div>
        </header>
        <main className="content">
          {page === 'dashboard' && user.role !== 'staff' && <DashboardScreen name={user.name} onOpenPos={() => setPage('pos')} />}
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
            <ResourceTable title="Categories" path="/v1/user/category" columns={[{ key: ['name'], label: 'Name' }, { key: ['description'], label: 'Description' }]} />
          )}
          {page === 'vendors' && user.role !== 'staff' && (
            <ResourceTable title="Vendors" path="/v1/user/vendor" columns={[{ key: ['name'], label: 'Name' }, { key: ['phone', 'mobileNumber'], label: 'Phone' }, { key: ['email'], label: 'Email' }]} />
          )}
          {page === 'purchases' && user.role !== 'staff' && (
            <ResourceTable title="Purchases" path="/v1/user/purchase" columns={[{ key: ['invoiceNumber', 'reference'], label: 'Reference' }, { key: ['vendorName'], label: 'Vendor' }, { key: ['total'], label: 'Total', money: true }, { key: ['status'], label: 'Status' }]} />
          )}
          {page === 'stock-transfer' && user.role !== 'staff' && (
            <ResourceTable title="Stock transfer" path="/v1/user/stock-transfer" columns={[{ key: ['fromOutlet', 'source'], label: 'From' }, { key: ['toOutlet', 'destination'], label: 'To' }, { key: ['status'], label: 'Status' }]} />
          )}
          {page === 'sales' && <SalesScreen />}
          {page === 'customers' && user.role !== 'staff' && (
            <ResourceTable title="Customers" path="/v1/user/customer" columns={[{ key: ['name'], label: 'Name' }, { key: ['phone', 'mobileNumber'], label: 'Phone' }, { key: ['email'], label: 'Email' }]} />
          )}
          {page === 'outlets' && user.role !== 'staff' && (
            <ResourceTable title="Outlets" path="/v1/user/outlet" columns={[{ key: ['name'], label: 'Name' }, { key: ['address'], label: 'Address' }, { key: ['phone'], label: 'Phone' }]} />
          )}
          {page === 'staff' && user.role !== 'staff' && (
            <ResourceTable title="Staff" path="/v1/user/staff" columns={[{ key: ['fullName', 'name'], label: 'Name' }, { key: ['email'], label: 'Email' }, { key: ['tenantStaffRole', 'role'], label: 'Role' }]} />
          )}
          {page === 'subscription' && user.role !== 'staff' && (
            <ResourceTable title="Subscription" path="/v1/user/subscription" columns={[{ key: ['plan', 'packageName'], label: 'Plan' }, { key: ['status'], label: 'Status' }, { key: ['endDate', 'expiresAt'], label: 'Expires' }]} />
          )}
          {page === 'store-profile' && user.role !== 'staff' && (
            <div className="card"><h3>Store profile</h3><p>{user.tenantName || user.name}</p><p className="sub">{user.email}</p></div>
          )}
          {page === 'notifications' && user.role !== 'staff' && (
            <ResourceTable title="Notifications" path="/v1/user/notification" columns={[{ key: ['title'], label: 'Title' }, { key: ['message', 'body'], label: 'Message' }, { key: ['createdAt'], label: 'Date' }]} />
          )}
          {page === 'support' && user.role !== 'staff' && (
            <ResourceTable title="Support" path="/v1/user/support-ticket" columns={[{ key: ['subject'], label: 'Subject' }, { key: ['status'], label: 'Status' }, { key: ['priority'], label: 'Priority' }]} />
          )}
          {page === 'profile' && user.role !== 'staff' && (
            <div className="card"><h3>Profile</h3><p>{user.name}</p><p className="sub">{user.email}</p></div>
          )}
          {page === 'settings' && <SettingsScreen user={user} />}
        </main>
      </div>
      {palette && <CommandPalette role={user.role} onGo={setPage} onClose={() => setPalette(false)} />}
    </div>
  );
}
