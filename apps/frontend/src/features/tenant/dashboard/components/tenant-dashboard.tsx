'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard, StatCardSkeleton, ChartSkeleton } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  ShoppingBag, Banknote, ClipboardList, AlertTriangle, Wallet, CreditCard,
  Smartphone, ArrowUpRight, ShoppingCart, FileText, Package, BarChart3,
  Users, Tag, Receipt, ExternalLink, RotateCcw, Copy, Share2, Link2, Gift,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useDashboardStats, useSalesReport, useSales } from '@/hooks/use-api-data';
import { npr, nprFull, getStatusBadgeClasses } from '@/lib/helpers';
import { useAuthStore } from '@/features/auth/store';
import { hrefForSection } from '@/lib/navigation/routes';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ChartConfig } from '@/components/ui/chart';
import type { LucideIcon } from 'lucide-react';

// ---------- Chart Config ----------
const salesChartConfig: ChartConfig = {
  sales: { label: 'Sales (NPR)', color: 'hsl(var(--chart-1))' },
};

// ---------- Payment Breakdown ----------
const paymentBreakdown = [
  { method: 'Cash', amount: 18750, icon: Wallet, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', count: 28 },
  { method: 'Card', amount: 8464, icon: CreditCard, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', count: 5 },
  { method: 'eSewa', amount: 4593, icon: Smartphone, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', count: 4 },
  { method: 'Khalti', amount: 3393, icon: ArrowUpRight, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', count: 2 },
];

// ---------- Period ----------
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

// ---------- Quick Actions ----------
const quickActions = [
  { label: 'New Sale', description: 'Start a new transaction', icon: ShoppingCart, section: 'pos' as const, color: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Create Invoice', description: 'Generate a new invoice', icon: FileText, section: 'billing' as const, color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
  { label: 'Add Product', description: 'Add to product catalog', icon: Package, section: 'products' as const, color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
  { label: 'View Reports', description: 'Analyze sales data', icon: BarChart3, section: 'sales-reports' as const, color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
];

// ---------- Recent Activity ----------
interface ActivityItem {
  id: string;
  icon: LucideIcon;
  description: string;
  time: string;
  color: string;
  iconBg: string;
}

const recentActivities: ActivityItem[] = [
  { id: 'a1', icon: ShoppingCart, description: 'New sale completed — NPR 2,450 via Cash', time: '5 min ago', color: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'a2', icon: AlertTriangle, description: "Stock alert: DDC Milk (1L) is low (5 units)", time: '12 min ago', color: 'text-red-600 dark:text-red-400', iconBg: 'bg-red-100 dark:bg-red-900/30' },
  { id: 'a3', icon: Users, description: 'New customer registered — Sita Thapa', time: '18 min ago', color: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'a4', icon: CreditCard, description: 'Payment received via eSewa — NPR 5,200', time: '25 min ago', color: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'a5', icon: Receipt, description: 'Invoice #INV-2025-0042 created', time: '42 min ago', color: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'a6', icon: Package, description: "Stock updated: Wai Wai Noodles (+50 units)", time: '1 hour ago', color: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'a7', icon: Tag, description: "Product 'Goldstar Shoes' price updated to NPR 2,500", time: '2 hours ago', color: 'text-orange-600 dark:text-orange-400', iconBg: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'a8', icon: Package, description: "Category 'Snacks' product count updated to 15", time: '3 hours ago', color: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
  { id: 'a9', icon: ShoppingCart, description: 'New sale completed — NPR 8,750 via Khalti', time: '3 hours ago', color: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { id: 'a10', icon: Users, description: 'New customer registered — Hari Shrestha', time: '5 hours ago', color: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
];

// ---------- Low Stock Data ----------
interface LowStockItem {
  id: string;
  name: string;
  current: number;
  min: number;
}

const lowStockItems: LowStockItem[] = [
  { id: 'ls1', name: 'DDC Milk (1L)', current: 5, min: 20 },
  { id: 'ls2', name: 'Goldstar Shoes (Size 9)', current: 3, min: 10 },
  { id: 'ls3', name: 'Surya Lights (Candle)', current: 2, min: 15 },
  { id: 'ls4', name: 'Tokla Tea (500g)', current: 8, min: 25 },
  { id: 'ls5', name: 'Amul Butter (500g)', current: 4, min: 12 },
];

// ---------- Greeting Helper ----------
function getGreeting(): { greeting: string; period: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: 'Good morning', period: 'morning' };
  if (hour < 17) return { greeting: 'Good afternoon', period: 'afternoon' };
  return { greeting: 'Good evening', period: 'evening' };
}

// ---------- Components ----------

function QuickActionsCard() {
  const router = useRouter();
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
                onClick={() => router.push(hrefForSection(action.section))}
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

function RecentActivityCard() {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
          onClick={() => toast.info('Navigating to activity logs...')}
        >
          View All
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[420px]">
          <div className="divide-y divide-border">
            {recentActivities.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <button
                  key={activity.id}
                  onClick={() => toast.info('Opening activity details...')}
                  className={cn(
                    'flex w-full items-center gap-3 px-6 py-3.5 text-left transition-colors hover:bg-muted/60',
                    idx % 2 === 1 && 'bg-muted/20',
                  )}
                >
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', activity.iconBg)}>
                    <Icon className={cn('h-4 w-4', activity.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{activity.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function LowStockAlertsCard() {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Low Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lowStockItems.map((item) => {
          const pct = Math.round((item.current / item.min) * 100);
          const isCritical = pct <= 25;
          const barColor = isCritical
            ? '[&>div]:bg-red-500'
            : '[&>div]:bg-amber-500';
          return (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate mr-2">{item.name}</span>
                <span className={cn(
                  'text-xs font-semibold shrink-0',
                  isCritical ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400',
                )}>
                  {item.current} / {item.min}
                </span>
              </div>
              <Progress value={pct} className={cn('h-2', barColor)} />
              <Button
                variant="outline"
                size="sm"
                className="w-full h-7 text-xs gap-1.5"
                onClick={() => toast.info(`Restocking ${item.name}...`)}
              >
                <RotateCcw className="h-3 w-3" />
                Restock
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ReferralCard() {
  const referralCode = 'ABCSTORE';
  const referralLink = `https://posnepal.com/ref/${referralCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = () => {
    toast.info('Share dialog coming soon!');
  };

  return (
    <Card className="border-0 bg-gradient-to-r from-emerald-10 to-teal-10">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Info */}
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <Gift className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Refer & Earn</h3>
                <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <Link2 className="h-3 w-3 mr-1" />
                  {referralCode}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Share your referral link and earn rewards for every signup.</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">2 Referrals</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">NPR 3,200 Earned</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleCopyLink}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={handleShare}
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GreetingBanner({ name }: { name: string }) {
  const { greeting } = getGreeting();
  const storeName = 'ABC Store';
  return (
    <div className="rounded-xl border bg-gradient-to-r from-muted/80 via-muted/40 to-muted/80 p-4 md:p-5">
      <h2 className="text-lg md:text-xl font-bold">
        {greeting}, {name}!
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Here&apos;s what&apos;s happening at {storeName} today.
      </p>
    </div>
  );
}

function AnimatedGradientBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-1 pb-0">
      {children}
      <div
        className="h-[2px] w-full rounded-full animate-gradient-border"
        style={{
          background: 'linear-gradient(90deg, #10b981, #f59e0b, #8b5cf6, #ef4444, #10b981)',
          backgroundSize: '200% 200%',
        }}
      />
    </div>
  );
}

// ---------- Main Component ----------
export default function TenantDashboard() {
  const mockTenantStats = useDashboardStats().data ?? { dailySales: 0, dailySalesGrowth: 0, monthlyRevenue: 0, monthlyRevenueGrowth: 0, totalOrders: 0, totalOrdersGrowth: 0, topProducts: [], lowStockAlerts: 0 };
  const mockSalesReportData = useSalesReport().data ?? [];
  const mockSales = useSales().items;

  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('7d');
  const stats = mockTenantStats;
  const recentSales = mockSales.slice(0, 5);
  const firstName = user?.name?.split(' ')[0] || 'there';
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
          <Card><CardContent className="p-6"><div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />)}</div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />)}</div></CardContent></Card>
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with animated gradient border */}
      <AnimatedGradientBorder>
        <PageHeader title="Dashboard" description={`Welcome back, ${firstName}`} />
      </AnimatedGradientBorder>

      {/* Greeting Banner */}
      <GreetingBanner name={firstName} />

      {/* Referral Card */}
      <ReferralCard />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Daily Sales"
          value={`NPR ${npr(stats.dailySales)}`}
          icon={ShoppingBag}
          trend={{ value: stats.dailySalesGrowth, label: 'from yesterday' }}
          trendColor={stats.dailySalesGrowth >= 0 ? 'positive' : 'negative'}
          borderColor="border-l-emerald-500"
          className="animate-number-pop"
        />
        <StatCard
          title="Monthly Revenue"
          value={`NPR ${npr(stats.monthlyRevenue)}`}
          icon={Banknote}
          trend={{ value: stats.monthlyRevenueGrowth, label: 'from last month' }}
          trendColor={stats.monthlyRevenueGrowth >= 0 ? 'positive' : 'negative'}
          borderColor="border-l-blue-500"
          className="animate-number-pop"
        />
        <StatCard
          title="Total Orders"
          value={npr(stats.totalOrders)}
          icon={ClipboardList}
          trend={{ value: stats.totalOrdersGrowth, label: 'from last month' }}
          trendColor={stats.totalOrdersGrowth >= 0 ? 'positive' : 'negative'}
          borderColor="border-l-purple-500"
          className="animate-number-pop"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockAlerts}
          icon={AlertTriangle}
          trend={{ value: -5, label: 'needs attention' }}
          trendColor="negative"
          borderColor="border-l-amber-500"
          iconClassName="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
          className="animate-number-pop"
        />
      </div>

      {/* Quick Actions */}
      <QuickActionsCard />

      {/* Recent Activity + Low Stock Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivityCard />
        </div>
        <div className="lg:col-span-1">
          <LowStockAlertsCard />
        </div>
      </div>

      {/* Daily Cash Register Summary */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-b from-muted/50 to-transparent">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4" />
            Today&apos;s Cash Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {paymentBreakdown.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.method} className="flex items-center gap-3 rounded-xl border p-3 transition-shadow hover:shadow-md">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', p.bg)}>
                    <Icon className={cn('h-5 w-5', p.color)} />
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
                      <span className="text-sm font-semibold">NPR {nprFull(sale.total)}</span>
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
