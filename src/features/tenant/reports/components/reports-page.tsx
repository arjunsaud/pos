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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell, Pie, PieChart, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, ShoppingCart, Calendar, Download, PieChart as PieChartIcon } from 'lucide-react';
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

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label className="mb-1.5">From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5">To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
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
      </Tabs>
    </div>
  );
}
