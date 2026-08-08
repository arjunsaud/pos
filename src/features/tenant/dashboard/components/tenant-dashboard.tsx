'use client';

import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ShoppingBag, Banknote, ClipboardList, AlertTriangle } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { mockTenantStats, mockSalesReportData, mockSales } from '@/lib/mock-data';
import type { ChartConfig } from '@/components/ui/chart';

const npr = (n: number) => new Intl.NumberFormat('en-NP').format(n);

const salesChartConfig: ChartConfig = {
  sales: { label: 'Sales (NPR)', color: 'hsl(var(--chart-1))' },
};

export default function TenantDashboard() {
  const stats = mockTenantStats;
  const recentSales = mockSales.slice(0, 5);
  const chartData = mockSalesReportData.slice(-7).map((d) => ({
    date: d.date.slice(5),
    sales: d.sales,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Welcome back, Rajesh" />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Daily Sales"
          value={`NPR ${npr(stats.dailySales)}`}
          icon={ShoppingBag}
          trend={{ value: stats.dailySalesGrowth, label: 'from yesterday' }}
        />
        <StatCard
          title="Monthly Revenue"
          value={`NPR ${npr(stats.monthlyRevenue)}`}
          icon={Banknote}
          trend={{ value: stats.monthlyRevenueGrowth, label: 'from last month' }}
        />
        <StatCard
          title="Total Orders"
          value={npr(stats.totalOrders)}
          icon={ClipboardList}
          trend={{ value: stats.totalOrdersGrowth, label: 'from last month' }}
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockAlerts}
          icon={AlertTriangle}
          trend={{ value: -5, label: 'needs attention' }}
          iconClassName="bg-amber-100"
        />
      </div>

      {/* Two Column: Top Products + Recent Sales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProducts.map((product, idx) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">NPR {npr(product.revenue)}</div>
                    <div className="text-xs text-muted-foreground">{product.sold} units</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-80">
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between rounded-lg border p-3"
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
                        className={`
                          ${sale.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                          ${sale.status === 'refunded' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                          ${sale.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                        `}
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
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
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
              <Area
                type="monotone"
                dataKey="sales"
                stroke="var(--color-sales)"
                fill="var(--color-sales)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
