'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Pie, PieChart, Legend, Area, AreaChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, ShoppingCart, Calendar, Download, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import {
  mockSalesReportData,
  mockInventoryReportData,
  mockVATReportData,
} from '@/lib/mock-data';
import { npr } from '@/lib/helpers';
import type { ChartConfig } from '@/components/ui/chart';

const salesChartConfig: ChartConfig = {
  sales: { label: 'Sales (NPR)', color: 'hsl(var(--chart-1))' },
};

const inventoryChartConfig: ChartConfig = {
  totalValue: { label: 'Stock Value (NPR)', color: 'hsl(var(--chart-2))' },
};

const vatChartConfig: ChartConfig = {
  vatCollected: { label: 'VAT Collected', color: 'hsl(var(--chart-1))' },
  vatPaid: { label: 'VAT Paid', color: 'hsl(var(--chart-3))' },
};

const topCategoriesChartConfig: ChartConfig = {
  revenue: { label: 'Revenue (NPR)', color: 'hsl(var(--chart-1))' },
  units: { label: 'Units Sold', color: 'hsl(var(--chart-2))' },
};

const vatTrendChartConfig: ChartConfig = {
  collected: { label: 'VAT Collected', color: 'hsl(var(--chart-1))' },
  paid: { label: 'VAT Paid', color: 'hsl(var(--chart-3))' },
};

const topCategoriesData = [
  { category: 'Dairy & Eggs', revenue: 89000, units: 340 },
  { category: 'Snacks & Chips', revenue: 72400, units: 520 },
  { category: 'Beverages', revenue: 65800, units: 410 },
  { category: 'Rice & Grains', revenue: 58200, units: 89 },
  { category: 'Personal Care', revenue: 44500, units: 64 },
  { category: 'Cooking Essentials', revenue: 38700, units: 102 },
  { category: 'Cleaning Products', revenue: 28300, units: 87 },
  { category: 'Frozen Foods', revenue: 22100, units: 45 },
];

const vatTrendData = [
  { month: 'Jan', collected: 42000, paid: 18000 },
  { month: 'Feb', collected: 38500, paid: 16500 },
  { month: 'Mar', collected: 51200, paid: 22000 },
  { month: 'Apr', collected: 46800, paid: 20100 },
  { month: 'May', collected: 55300, paid: 23800 },
  { month: 'Jun', collected: 49200, paid: 21200 },
];

const pieChartConfig = {
  cash: { label: 'Cash', color: 'hsl(var(--chart-1))' },
  card: { label: 'Card', color: 'hsl(var(--chart-2))' },
  esewa: { label: 'eSewa', color: 'hsl(var(--chart-3))' },
  khalti: { label: 'Khalti', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

const paymentPieData = [
  { name: 'cash', value: 18750, fill: 'var(--color-cash)' },
  { name: 'card', value: 8464, fill: 'var(--color-card)' },
  { name: 'esewa', value: 4593, fill: 'var(--color-esewa)' },
  { name: 'khalti', value: 3393, fill: 'var(--color-khalti)' },
];

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const datePresets = [
  { label: 'Today', key: 'today' },
  { label: 'Last 7 Days', key: '7d' },
  { label: 'Last 30 Days', key: '30d' },
  { label: 'This Month', key: 'month' },
] as const;

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [datePreset, setDatePreset] = useState('');
  const [categoriesView, setCategoriesView] = useState<'revenue' | 'units'>('revenue');

  const applyPreset = (key: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let from: Date;
    let to: Date = new Date(today);

    switch (key) {
      case 'today':
        from = new Date(today);
        break;
      case '7d': {
        from = new Date(today);
        from.setDate(from.getDate() - 6);
        break;
      }
      case '30d': {
        from = new Date(today);
        from.setDate(from.getDate() - 29);
        break;
      }
      case 'month': {
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      }
      default:
        return;
    }

    setDateFrom(formatDate(from));
    setDateTo(formatDate(to));
    setDatePreset(key);
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    setDatePreset('');
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    setDatePreset('');
  };

  // Filter sales report data by date range (mock filter - slice)
  const filteredSalesData = useMemo(() => {
    if (!dateFrom && !dateTo) return mockSalesReportData;
    const sorted = [...mockSalesReportData].sort((a, b) => a.date.localeCompare(b.date));
    const fromIdx = dateFrom ? sorted.findIndex((d) => d.date >= dateFrom) : 0;
    const toIdx = dateTo ? sorted.findLastIndex((d) => d.date <= dateTo) : sorted.length - 1;
    if (fromIdx < 0 || toIdx < 0 || fromIdx > toIdx) return [];
    return sorted.slice(fromIdx, toIdx + 1);
  }, [dateFrom, dateTo]);

  const exportCSV = (headers: string[], rows: string[][], filename: string) => {
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} exported`);
  };

  const exportSalesCSV = () => {
    const headers = ['Date', 'Sales (NPR)', 'Orders'];
    const rows = filteredSalesData.map((d) => [d.date, String(d.sales), String(d.orders)]);
    exportCSV(headers, rows, 'sales-report.csv');
  };

  const exportInventoryCSV = () => {
    const headers = ['Category', 'Total Products', 'Total Value (NPR)', 'Low Stock'];
    const rows = mockInventoryReportData.map((d) => [d.category, String(d.totalProducts), String(d.totalValue), String(d.lowStock)]);
    exportCSV(headers, rows, 'inventory-report.csv');
  };

  const exportVATCSV = () => {
    const headers = ['Month', 'Taxable Amount', 'VAT Collected', 'VAT Paid'];
    const rows = mockVATReportData.map((d) => [d.month, String(d.taxableAmount), String(d.vatCollected), String(d.vatPaid)]);
    exportCSV(headers, rows, 'vat-report.csv');
  };

  // Sales Report calculations
  const salesData = filteredSalesData.map((d) => ({
    date: d.date.slice(5),
    sales: d.sales,
  }));
  const totalRevenue = filteredSalesData.reduce((sum, d) => sum + d.sales, 0);
  const avgDailySales = filteredSalesData.length > 0 ? Math.round(totalRevenue / filteredSalesData.length) : 0;
  const totalOrders = filteredSalesData.reduce((sum, d) => sum + d.orders, 0);
  const bestDay = filteredSalesData.reduce(
    (best, d) => (d.sales > best.sales ? d : best),
    { date: '—', sales: 0, orders: 0 }
  );

  // VAT Report calculations
  const vatTableData = mockVATReportData.map((d) => ({
    ...d,
    netVAT: d.vatCollected - d.vatPaid,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" />

      {/* Date Range Filter */}
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap gap-2">
            {datePresets.map((preset) => (
              <Button
                key={preset.key}
                variant={datePreset === preset.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => applyPreset(preset.key)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label className="mb-1.5">From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => handleDateFromChange(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5">To</Label>
              <Input type="date" value={dateTo} onChange={(e) => handleDateToChange(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="payment">Payment Breakdown</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
          <TabsTrigger value="vat">VAT Report</TabsTrigger>
          <TabsTrigger value="categories" className="gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            Top Categories
          </TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-6">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={exportSalesCSV}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
          {/* Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Revenue" value={`NPR ${npr(totalRevenue)}`} icon={DollarSign} />
            <StatCard title="Avg Daily Sales" value={`NPR ${npr(avgDailySales)}`} icon={TrendingUp} />
            <StatCard title="Total Orders" value={npr(totalOrders)} icon={ShoppingCart} />
            <StatCard
              title="Best Day"
              value={`NPR ${npr(bestDay.sales)}`}
              icon={Calendar}
              description={bestDay.date}
            />
          </div>

          {/* Data Summary Strip */}
          <div className="flex items-center justify-center gap-6 bg-muted/30 rounded-lg px-4 py-2 text-sm text-muted-foreground">
            <span>Total: <strong className="text-foreground">NPR {npr(totalRevenue)}</strong></span>
            <span>Orders: <strong className="text-foreground">{totalOrders}</strong></span>
            <span>Avg: <strong className="text-foreground">NPR {npr(avgDailySales)}</strong></span>
          </div>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Daily Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Breakdown (NEW) */}
        <TabsContent value="payment" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Payment Method Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={paymentPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {paymentPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentPieData.map((p) => {
                    const total = paymentPieData.reduce((s, d) => s + d.value, 0);
                    const pct = Math.round((p.value / total) * 100);
                    const labels: Record<string, { label: string; color: string }> = {
                      cash: { label: 'Cash', color: 'bg-[hsl(var(--chart-1))]' },
                      card: { label: 'Card', color: 'bg-[hsl(var(--chart-2))]' },
                      esewa: { label: 'eSewa', color: 'bg-[hsl(var(--chart-3))]' },
                      khalti: { label: 'Khalti', color: 'bg-[hsl(var(--chart-4))]' },
                    };
                    const info = labels[p.name];
                    return (
                      <div key={p.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full ${info.color}`} />
                            <span className="font-medium">{info.label}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">NPR {npr(p.value)}</span>
                            <span className="ml-2 text-muted-foreground">({pct}%)</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${info.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                    <span className="text-sm font-medium">Total Today</span>
                    <span className="text-lg font-bold">NPR {npr(paymentPieData.reduce((s, d) => s + d.value, 0))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Report */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={exportInventoryCSV}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>Inventory Value by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={inventoryChartConfig} className="h-[300px] w-full">
                <BarChart data={mockInventoryReportData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalValue" fill="var(--color-totalValue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Products</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className="text-center">Low Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInventoryReportData.map((row) => (
                    <TableRow key={row.category} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">{row.category}</TableCell>
                      <TableCell className="text-center">{row.totalProducts}</TableCell>
                      <TableCell className="text-right">NPR {npr(row.totalValue)}</TableCell>
                      <TableCell className="text-center">
                        {row.lowStock > 0 ? (
                          <span className="text-amber-600 font-medium">{row.lowStock}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VAT Report */}
        <TabsContent value="vat" className="space-y-6">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={exportVATCSV}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>VAT Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={vatTrendChartConfig} className="h-[200px] w-full">
                <AreaChart data={vatTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `NPR ${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="collected" stroke="var(--color-collected)" fill="var(--color-collected)" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="paid" stroke="var(--color-paid)" fill="var(--color-paid)" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle>VAT Collected vs VAT Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={vatChartConfig} className="h-[300px] w-full">
                <BarChart data={mockVATReportData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="vatCollected" fill="var(--color-vatCollected)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vatPaid" fill="var(--color-vatPaid)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Taxable Amount</TableHead>
                    <TableHead className="text-right">VAT Collected</TableHead>
                    <TableHead className="text-right">VAT Paid</TableHead>
                    <TableHead className="text-right">Net VAT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vatTableData.map((row) => (
                    <TableRow key={row.month} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell className="text-right">NPR {npr(row.taxableAmount)}</TableCell>
                      <TableCell className="text-right">NPR {npr(row.vatCollected)}</TableCell>
                      <TableCell className="text-right">NPR {npr(row.vatPaid)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        NPR {npr(row.netVAT)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Categories */}
        <TabsContent value="categories" className="space-y-6">
          {/* Summary Stats */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-lg border bg-muted/50 px-4 py-2.5">
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-lg font-bold">NPR {npr(topCategoriesData.reduce((s, d) => s + d.revenue, 0))}</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2.5">
              <p className="text-xs text-muted-foreground">Top Category</p>
              <Badge variant="default" className="ml-1">{topCategoriesData[0].category}</Badge>
            </div>
            <div className="ml-auto">
              <div className="inline-flex rounded-lg border p-0.5">
                <button
                  onClick={() => setCategoriesView('revenue')}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    categoriesView === 'revenue'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setCategoriesView('units')}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    categoriesView === 'units'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Units Sold
                </button>
              </div>
            </div>
          </div>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Top Categories by {categoriesView === 'revenue' ? 'Revenue' : 'Units Sold'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={topCategoriesChartConfig} className="h-[350px] w-full">
                <BarChart
                  data={topCategoriesData}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={categoriesView === 'revenue'
                      ? (v) => `NPR ${(v / 1000).toFixed(0)}k`
                      : (v) => String(v)
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey={categoriesView}
                    fill={categoriesView === 'revenue' ? 'var(--color-revenue)' : 'var(--color-units)'}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
