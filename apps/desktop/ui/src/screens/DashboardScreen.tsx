import { formatNpr } from '@posnepal/shared';
import { useEffect, useState } from 'react';
import { apiRequest, num } from '../lib/api';

export function DashboardScreen({
  name,
  onOpenPos,
}: {
  name: string;
  onOpenPos: () => void;
}) {
  const [stats, setStats] = useState({ dailySales: 0, monthlyRevenue: 0, lowStock: 0, pendingOrders: 0 });

  useEffect(() => {
    void apiRequest<Record<string, unknown>>('/v1/user/dashboard/total')
      .then((row) => {
        setStats({
          dailySales: num(row, 'dailySales', 'todaySales'),
          monthlyRevenue: num(row, 'monthlyRevenue', 'monthSales'),
          lowStock: num(row, 'lowStockItems', 'lowStock'),
          pendingOrders: num(row, 'pendingOrders', 'ordersToday'),
        });
      })
      .catch(() => undefined);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="grid">
      <h2 style={{ margin: '0 0 4px' }}>{greeting}, {name}</h2>
      <p style={{ margin: 0, color: 'var(--muted)' }}>Desktop workspace — same data as the web app.</p>
      <div className="grid stats">
        <div className="card"><div className="stat-label">Today's sales</div><div className="stat-val">{formatNpr(stats.dailySales)}</div></div>
        <div className="card"><div className="stat-label">This month</div><div className="stat-val">{formatNpr(stats.monthlyRevenue)}</div></div>
        <div className="card"><div className="stat-label">Low stock</div><div className="stat-val">{stats.lowStock}</div></div>
        <div className="card"><div className="stat-label">Orders</div><div className="stat-val">{stats.pendingOrders}</div></div>
      </div>
      <div className="card">
        <h3>Quick actions</h3>
        <button className="primary" style={{ width: 'auto', paddingInline: 18 }} onClick={onOpenPos}>
          New sale (⌘2)
        </button>
      </div>
    </div>
  );
}
