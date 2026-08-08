'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard, StatCardSkeleton, ChartSkeleton } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ShoppingBag, Banknote, ClipboardList, AlertTriangle, Wallet, CreditCard, Smartphone, ArrowUpRight, ShoppingCart, FileText, Package, BarChart3 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { mockTenantStats, mockSalesReportData, mockSales } from '@/lib/mock-data';
import { npr, getStatusBadgeClasses } from '@/lib/helpers';
import { useAuthStore, useNavStore } from '@/features/auth/store';
import { cn } from '@/lib/utils';
import type { ChartConfig } from '@/components/ui/chart';

const salesChartConfig: ChartConfig = {
  sales: { label: 'Sales (NPR)', color: 'hsl(var(--chart-1))' },
};

// Cash register payment breakdown
const paymentBreakdown = [
  { method: 'Cash', amount: 18750, icon: Wallet, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', count: 28 },
  { method: 'Card', amount: 8464, icon: CreditCard, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', count: 5 },
  { method: 'eSewa', amount: 4593, icon: Smartphone, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', count: 4 },
  { method: 'Khalti', amount: 3393, icon: ArrowUpRight, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', count: 2 },
];

const periodOptions = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
] as const;

type Period = (typeof periodOptions)[number]['value'];

const periodSlice: Record<Period, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

const quickActions = [
  { label: 'New Sale', description: 'Start a new transaction', icon: ShoppingCart, section: 'pos' as const, color: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Create Invoice', description: 'Generate a new invoice', icon: FileText, section: 'billing' as const, color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
  { label: 'Add Product', description: 'Add to product catalog', icon: Package, section: 'products' as const, color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
  { label: 'View Reports', description: 'Analyze sales data', icon: BarChart3, section: 'reports' as const, color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
];

function QuickActionsCard() {
  const setCurrentSection = useNavStore((s) => s.setCurrentSection);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.section}
                onClick={() => setCurrentSection(action.section)}
                className="group flex flex-col items-center gap-2.5 rounded-xl border p-4 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110', action.color)}>
                  <Icon className={cn('h-5 w-5', action.iconColor)} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TenantDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('7d');
  const stats = mockTenantStats;
  const recentSales = mockSales.slice(0, 5);
  const chartData = useMemo(
    () =>
      mockSalesReportData
        .slice(-periodSlice[period])
        .map((d) => ({
          date: d.date.slice(5),
          sales: d.sales,
        })),
    [period],
  );

  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Loading..." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card><CardContent className="p-6"><div className="space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />)}</div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />)}</div></CardContent></Card>
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}`} />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Daily Sales"
          value={`NPR ${npr(stats.dailySales)}`}
          icon={ShoppingBag}
          trend={{ value: stats.dailySalesGrowth, label: 'from yesterday' }}
          className="border-l-4 border-l-emerald-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={`NPR ${npr(stats.monthlyRevenue)}`}
          icon={Banknote}
          trend={{ value: stats.monthlyRevenueGrowth, label: 'from last month' }}
          className="border-l-4 border-l-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={npr(stats.totalOrders)}
          icon={ClipboardList}
          trend={{ value: stats.totalOrdersGrowth, label: 'from last month' }}
          className="border-l-4 border-l-purple-500"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockAlerts}
          icon={AlertTriangle}
          trend={{ value: -5, label: 'needs attention' }}
          iconClassName="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
          className="border-l-4 border-l-amber-500"
        />
      </div>

      {/* Quick Actions */}
      <QuickActionsCard />

      {/* Daily Cash Register Summary */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-b from-muted/50 to-transparent">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4" />
            Today's Cash Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {paymentBreakdown.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.method} className="flex items-center gap-3 rounded-xl border p-3 transition-shadow hover:shadow-md">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${p.bg}`}>
                    <Icon className={`h-5 w-5 ${p.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-muted-foreground">{p.method}</p>
                    <p className="text-sm font-bold">NPR {npr(p.amount)}</p>
                    <p className="text-[10px] text-muted-foreground">{p.count} transactions</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5">
            <span className="text-sm font-medium">Total Collected Today</span>
            <span className="text-lg font-bold">NPR {npr(paymentBreakdown.reduce((s, p) => s + p.amount, 0))}</span>
          </div>
        </CardContent>
      </Card>

      {/* Two Column: Top Products + Recent Sales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Products */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProducts.map((product, idx) => {
                const topRevenue = stats.topProducts[0].revenue;
                const pct = Math.round((product.revenue / topRevenue) * 100);
                return (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                          idx === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          idx === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' :
                          idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-primary/10 text-primary'
                        )}>
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">NPR {npr(product.revenue)}</div>
                        <div className="text-xs text-muted-foreground">{product.sold} units</div>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          idx === 0 ? 'bg-amber-500' :
                          idx === 1 ? 'bg-gray-400' :
                          idx === 2 ? 'bg-orange-400' :
                          'bg-primary/60'
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-80">
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50',
                      sale.paymentMethod === 'Cash' && 'border-l-4 border-l-emerald-500',
                      sale.paymentMethod === 'Card' && 'border-l-4 border-l-blue-500',
                      sale.paymentMethod === 'eSewa' && 'border-l-4 border-l-green-500',
                      sale.paymentMethod === 'Khalti' && 'border-l-4 border-l-purple-500',
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{sale.invoiceNumber}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {sale.customerName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {sale.paymentMethod}
                      </Badge>
                      <Badge
                        className={getStatusBadgeClasses(sale.status)}
                        variant="secondary"
                      >
                        {sale.status}
                      </Badge>
                      <span className="text-sm font-semibold">NPR {npr(sale.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend Chart */}
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-dashed">
          <CardTitle>Sales Trend</CardTitle>
          <div className="ml-auto flex items-center gap-0.5 rounded-md border p-0.5">
            {periodOptions.map((p) => (
              <Button
                key={p.value}
                variant={period === p.value ? 'default' : 'outline'}
                size="sm"
                className="h-7 px-2.5 text-xs rounded-sm shadow-none"
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => `NPR ${(v / 1000).toFixed(0)}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="salesGradientTenant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="sales"
                stroke="var(--color-sales)"
                fill="url(#salesGradientTenant)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
