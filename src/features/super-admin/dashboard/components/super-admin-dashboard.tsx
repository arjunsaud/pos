'use client';

import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Building2, CreditCard, TrendingUp, IndianRupee } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { mockSuperAdminStats, mockSalesReportData } from '@/lib/mock-data';
import type { ActivityLog } from '@/lib/types';
import type { ChartConfig } from '@/components/ui/chart';
import { cn } from '@/lib/utils';

const nprFormatter = new Intl.NumberFormat('en-NP');

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

const dotColorMap: Record<string, string> = {
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

const chartConfig = {
  sales: {
    label: 'Sales (NPR)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const last7DaysData = mockSalesReportData.slice(-7).map((d) => ({
  ...d,
  date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
}));

export default function SuperAdminDashboard() {
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
        />
        <StatCard
          title="Total Revenue"
          value={`NPR ${nprFormatter.format(mockSuperAdminStats.totalRevenue)}`}
          icon={IndianRupee}
          description="Monthly recurring"
        />
        <StatCard
          title="Revenue Growth"
          value={`${mockSuperAdminStats.revenueGrowth}%`}
          icon={TrendingUp}
          description="Compared to last month"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-80">
              <div className="space-y-4 pr-4">
                {mockSuperAdminStats.recentActivity.map((activity: ActivityLog) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1.5 flex-shrink-0">
                      <span
                        className={cn(
                          'inline-block h-2.5 w-2.5 rounded-full',
                          dotColorMap[activity.type]
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{activity.action}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">
                        {activity.details}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
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
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={last7DaysData}>
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
    </div>
  );
}
