import { useCallback, useEffect, useState } from 'react';
import { NetworkStatus, SHORTCUTS, matchShortcutId, type ShortcutId } from '@posnepal/shared';
import { ApiError, apiRequest, asRecord, setToken, str } from './lib/api';
import type { DesktopPage, DesktopRole, DesktopUser } from './lib/types';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { PosScreen } from './screens/PosScreen';
import { InventoryScreen, ProductsScreen, SalesScreen } from './screens/Lists';
import { CommandPalette } from './screens/CommandPalette';

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

  const login = async (email: string, password: string, _role: DesktopRole) => {
    setBusy(true);
    setError('');
    try {
      const tokens = await apiRequest<{ accessToken: string }>('/v1/user/auth/login', {
        method: 'POST',
        body: { email, password },
        auth: false,
      });
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
    return <LoginScreen onSubmit={(e, p, r) => void login(e, p, r)} error={error} busy={busy} />;
  }

  const nav = user.role === 'staff'
    ? ([['pos', 'POS'], ['sales', 'Sales']] as const)
    : ([['dashboard', 'Dashboard'], ['pos', 'POS'], ['products', 'Products'], ['inventory', 'Inventory'], ['sales', 'Sales']] as const);

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
        <div className="grow" />
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
          {page === 'sales' && <SalesScreen />}
        </main>
      </div>
      {palette && <CommandPalette role={user.role} onGo={setPage} onClose={() => setPalette(false)} />}
    </div>
  );
}
