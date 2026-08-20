import { useEffect, useState } from 'react';
import { formatNpr } from '@posnepal/shared';
import { ShoppingCart, Package, AlertTriangle, Receipt } from 'lucide-react';
import { apiRequest, num } from '@/lib/api';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function DashboardScreen({
  name,
  onOpenPos,
}: {
  name: string;
  onOpenPos: () => void;
}) {
  const [stats, setStats] = useState({
    dailySales: 0,
    monthlyRevenue: 0,
    lowStock: 0,
    pendingOrders: 0,
  });

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

  const cards = [
    { label: "Today's sales", value: formatNpr(stats.dailySales), icon: Receipt },
    { label: 'This month', value: formatNpr(stats.monthlyRevenue), icon: ShoppingCart },
    { label: 'Low stock', value: String(stats.lowStock), icon: AlertTriangle },
    { label: 'Orders', value: String(stats.pendingOrders), icon: Package },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${name}`}
        description="Desktop workspace — same data and design language as the web app."
      >
        <Button onClick={onOpenPos} className="gap-2">
          <ShoppingCart className="size-4" />
          New sale
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="gap-3 py-4">
              <CardContent className="flex items-start justify-between px-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight">{card.value}</p>
                </div>
                <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                  <Icon className="size-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
