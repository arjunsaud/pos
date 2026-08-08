'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard, StatCardSkeleton, ChartSkeleton } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Building2, CreditCard, TrendingUp, IndianRupee, Store, Activity, Settings } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import { mockSuperAdminStats, mockSalesReportData } from '@/lib/mock-data';
import { formatRelativeTime, getLogDotColor, npr } from '@/lib/helpers';
import { useNavStore } from '@/features/auth/store';
import { cn } from '@/lib/utils';
import type { ActivityLog, NavSection } from '@/lib/types';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  sales: {
    label: 'Sales (NPR)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const planRevenueData = [
  { plan: 'Basic', revenue: 110000, tenants: 2 },
  { plan: 'Pro', revenue: 203000, tenants: 1 },
  { plan: 'Enterprise', revenue: 2346000, tenants: 2 },
];

const planChartConfig = {
  revenue: {
    label: 'Revenue (NPR)',
    color: 'hsl(38 92% 50%)',
  },
} satisfies ChartConfig;

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
  { label: 'Add Tenant', description: 'Register a new tenant', icon: Store, section: 'tenants' as NavSection, color: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'View Logs', description: 'Audit & activity logs', icon: Activity, section: 'activity-logs' as NavSection, color: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
  { label: 'Manage Plans', description: 'Subscription management', icon: CreditCard, section: 'super-admin-subscriptions' as NavSection, color: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
  { label: 'System Settings', description: 'Platform configuration', icon: Settings, section: 'super-admin-settings' as NavSection, color: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
];

function QuickActionsCard() {
  const setCurrentSection = useNavStore((s) => s.setCurrentSection);
  return (
    <Card className="transition-shadow hover:shadow-md">
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

const activityBorderColor: Record<string, string> = {
  success: 'border-l-emerald-500',
  info: 'border-l-blue-500',
  warning: 'border-l-amber-500',
  error: 'border-l-red-500',
};

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('7d');

  const chartData = useMemo(
    () =>
      mockSalesReportData.slice(-periodSlice[period]).map((d) => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })),
    [period],
  );

  const totalRevenue = useMemo(
    () => chartData.reduce((sum, d) => sum + d.sales, 0),
    [chartData],
  );

  const avgDaily = useMemo(
    () => (totalRevenue / (chartData.length || 1)),
    [totalRevenue, chartData.length],
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Loading..." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card><CardContent className="p-6"><div className="space-y-4">{Array.from({length:5}).map((_,i)=><div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)}</div></CardContent></Card>
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Platform overview and key metrics" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tenants"
          value={mockSuperAdminStats.totalTenants}
          icon={Building2}
          description="Registered tenants"
        />
        <StatCard
          title="Active Subscriptions"
          value={mockSuperAdminStats.activeSubscriptions}
          icon={CreditCard}
          description="Currently active"
          iconClassName="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Total Revenue"
          value={`NPR ${npr(mockSuperAdminStats.totalRevenue)}`}
          icon={IndianRupee}
          description="Monthly recurring"
          iconClassName="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-600 dark:text-amber-400"
          borderColor="border-l-amber-500"
        />
        <StatCard
          title="Revenue Growth"
          value={`${mockSuperAdminStats.revenueGrowth}%`}
          icon={TrendingUp}
          description="Compared to last month"
          iconClassName="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Quick Actions */}
      <QuickActionsCard />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-80">
              <div className="space-y-2 pr-4">
                {mockSuperAdminStats.recentActivity.map((activity: ActivityLog) => (
                  <div
                    key={activity.id}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border border-l-4 p-3 transition-colors hover:bg-muted/50',
                      activityBorderColor[activity.type] || 'border-l-gray-400',
                    )}
                  >
                    <div className="mt-1 shrink-0">
                      <span
                        className={cn(
                          'inline-block h-2.5 w-2.5 rounded-full',
                          getLogDotColor(activity.type),
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight">{activity.action}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">
                        {activity.details}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Revenue Overview Chart */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Revenue Overview</CardTitle>
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
            {/* Summary stats above chart */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5">
                <span className="text-xs text-muted-foreground">Total Revenue</span>
                <span className="text-sm font-semibold">NPR {npr(totalRevenue)}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5">
                <span className="text-xs text-muted-foreground">Avg Daily</span>
                <span className="text-sm font-semibold">NPR {npr(avgDaily)}</span>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--color-sales)"
                  fill="url(#salesGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Plan */}
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>Revenue by Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={planChartConfig} className="h-[200px] w-full">
            <BarChart data={planRevenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="plan" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {planRevenueData.map((_, index) => {
                  const colors = ['hsl(38 92% 50%)', 'hsl(160 84% 39%)', 'hsl(217 91% 60%)'];
                  return <Cell key={index} fill={colors[index]} />;
                })}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
